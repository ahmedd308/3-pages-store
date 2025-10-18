import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getStorageString,
  removeStorageKey,
  setStorageString,
} from "../../utils/mmkv";

interface IUser {
  id: number;
  username: string;
  email: string;
  role?: string;
}

interface IAuthState {
  token: string | null;
  refreshToken?: string | null;
  user: IUser | null;
  isSuperAdmin?: boolean;
}

const initialState: IAuthState = {
  token: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreAuth: (state) => {
      const token = getStorageString("token");
      const refreshToken = getStorageString("refreshToken");
      const userString = getStorageString("user");
      const isSuperAdmin = getStorageString("isSuperAdmin");

      if (token && userString) {
        state.token = token;
        state.refreshToken = refreshToken;
        state.user = JSON.parse(userString);
        state.isSuperAdmin = isSuperAdmin === "true";
      } else {
        state.token = null;
        state.user = null;
        state.isSuperAdmin = false;
      }
    },
    setCredentials: (state, action: PayloadAction<IAuthState>) => {
      const { token, refreshToken, user, isSuperAdmin } = action.payload as any;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isSuperAdmin = isSuperAdmin;

      if (token) setStorageString("token", token);
      if (refreshToken) setStorageString("refreshToken", refreshToken);
      if (user) setStorageString("user", JSON.stringify(user));
      if (isSuperAdmin) setStorageString("isSuperAdmin", isSuperAdmin);
    },
    setIsSuperAdmin: (state, action: PayloadAction<boolean>) => {
      state.isSuperAdmin = action.payload;
      setStorageString("isSuperAdmin", action.payload.toString());
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.isSuperAdmin = false;
      removeStorageKey("token");
      removeStorageKey("refreshToken");
      removeStorageKey("user");
      removeStorageKey("isSuperAdmin");
    },
  },
});

export const { setCredentials, setIsSuperAdmin, logout, restoreAuth } =
  authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: IAuthState }) =>
  state.auth.user;
export const selectCurrentToken = (state: { auth: IAuthState }) =>
  state.auth.token;
export const selectIsSuperAdmin = (state: { auth: IAuthState }) =>
  state.auth.isSuperAdmin;
