import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { logout, setCredentials } from "../store/slices/auth.slice";
import { store } from "../store/store";
import { getStorageString, setStorageString } from "../utils/mmkv";

export const api = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStorageString("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log("✅ Response OK:", res.status, res.config.url, res.data);
    return res;
  },
  (err) => {
    console.log(
      "❌ Response Error Interceptor Triggered:",
      err?.response?.status
    );
    return Promise.reject(err);
  }
);

// Helper axios instance without interceptors for refresh calls
export const authClient = axios.create({
  baseURL: api.defaults.baseURL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
type FailedQueueItem = {
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      if (token && p.config.headers)
        p.config.headers.Authorization = `Bearer ${token}`;
      p.resolve(api(p.config));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest || !originalRequest.headers)
      return Promise.reject(error);

    // If unauthorized, attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      const refreshToken = getStorageString("refreshToken");

      if (!refreshToken) {
        // No refresh token, force logout
        store.dispatch(logout());
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await authClient.post("/auth/refresh", {
          refreshToken,
          expiresInMins: 15,
        });

        const data = response.data;
        const newAccessToken = data.accessToken ?? data.token ?? null;
        const newRefreshToken = data.refreshToken ?? refreshToken;

        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        // Persist tokens
        setStorageString("token", newAccessToken);
        if (newRefreshToken) setStorageString("refreshToken", newRefreshToken);

        // Update redux
        store.dispatch(
          setCredentials({
            token: newAccessToken,
            refreshToken: newRefreshToken,
          } as any)
        );

        processQueue(null, newAccessToken);

        // retry original request with new token
        if (originalRequest.headers)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
