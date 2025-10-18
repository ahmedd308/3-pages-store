import { api } from "@/src/services/api";
import { setCredentials, setIsSuperAdmin } from "@/src/store/slices/auth.slice";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";

interface ILoginRequest {
  username: string;
  password: string;
}

async function loginUser(payload: ILoginRequest) {
  const response = await api.post("/auth/login", {
    ...payload,
    expiresInMins: 15,
  });
  return response.data;
}

export const useLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      dispatch(
        setCredentials({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          user: {
            id: data.id,
            username: data.username,
            email: data.email,
          },
        })
      );

      try {
        const userResponse = await api.get("/auth/me");
        const userData = userResponse.data;

        dispatch(setIsSuperAdmin(userData.role === "admin"));
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }

      router.replace("/(home)/product");
    },
    onError: (error: any) => {
      Alert.alert(
        "Login failed",
        error?.response?.data?.message || "Try again"
      );
    },
  });
};
