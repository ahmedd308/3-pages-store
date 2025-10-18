import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { useAuthUser } from "../data/useAuthUser";
import { restoreAuth, selectCurrentToken } from "../store/slices/auth.slice";
import { store } from "../store/store";
import {
  authenticateWithBiometrics,
  checkBiometricSupport,
} from "../utils/biometric";

export function useAuthInit() {
  const token = useSelector(selectCurrentToken);
  const { data, isLoading, fetchStatus } = useAuthUser({ enabled: !!token });
  const userLoading = isLoading && fetchStatus !== "idle";
  const [initializing, setInitializing] = useState(true);
  const [biometricAuthenticated, setBiometricAuthenticated] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // Restore token/user from storage
      await store.dispatch(restoreAuth());

      setIsSupported(await checkBiometricSupport());

      if (token && isSupported) {
        const success = await authenticateWithBiometrics();
        if (!success) {
          Alert.alert(
            "Authentication Failed",
            "Please login manually with your credentials"
          );
          setInitializing(false);
          return;
        }
        setBiometricAuthenticated(true);
      }

      setInitializing(false);
    };

    initialize();
  }, [isSupported, token]);

  return {
    isLoading: initializing || userLoading,
    isAuthenticated:
      (data && !!token) || (biometricAuthenticated && isSupported),
  };
}
