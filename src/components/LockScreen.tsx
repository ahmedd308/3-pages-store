import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { unlockApp } from "../store/slices/lock.slice";
import {
  authenticateWithBiometrics,
  checkBiometricSupport,
} from "../utils/biometric";

export function LockScreen() {
  const dispatch = useDispatch();
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      const supported = await checkBiometricSupport();

      if (supported) {
        const success = await authenticateWithBiometrics();
        if (success) {
          dispatch(unlockApp());
        } else {
          Alert.alert("Authentication Failed", "Please try again");
        }
      } else {
        // If biometrics not supported, unlock anyway (or implement PIN)
        dispatch(unlockApp());
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.title}>App Locked</Text>
          <Text style={styles.subtitle}>Authenticate to continue</Text>

          {isUnlocking ? (
            <ActivityIndicator
              size="large"
              color="#007AFF"
              style={styles.loader}
            />
          ) : (
            <TouchableOpacity
              style={styles.unlockButton}
              onPress={handleUnlock}
            >
              <Text style={styles.unlockButtonText}>Unlock</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  lockIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  unlockButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },
  unlockButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loader: {
    marginTop: 20,
  },
});
