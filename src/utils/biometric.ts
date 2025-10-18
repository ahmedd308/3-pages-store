import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

export const checkBiometricSupport = async (): Promise<boolean> => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    return false;
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
};

export const authenticateWithBiometrics = async (): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access your account",
      disableDeviceFallback: false,
    });

    return result.success;
  } catch {
    Alert.alert("Authentication Error", "Unable to authenticate");
    return false;
  }
};
