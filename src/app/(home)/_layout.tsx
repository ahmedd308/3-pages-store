import { HapticTab } from "@/src/components/HapticTab";
import { logout } from "@/src/store/slices/auth.slice";
import Feather from "@expo/vector-icons/Feather";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { router, Tabs } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

export default function TabLayout() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/(auth)/login");
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
      }}
      tabBar={(props) => (
        <View style={styles.tabBarContainer}>
          <BottomTabBar {...props} />
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            accessibilityLabel="Logout"
          >
            <Feather name="log-out" size={20} color="#fff" />
          </Pressable>
        </View>
      )}
    >
      <Tabs.Screen
        name="product"
        options={{
          title: "Products",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "relative",
  },
  logoutButton: {
    position: "absolute",
    right: 24,
    bottom: "40%",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  logoutButtonPressed: {
    opacity: 0.85,
  },
});
