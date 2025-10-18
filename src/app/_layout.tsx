import { store } from "@/src/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import { View } from "react-native";
import { Provider } from "react-redux";
import { LockScreen } from "../components/LockScreen";
import { OfflineBanner } from "../components/OfflineBanner";
import { useAutoLock } from "../hooks/useAutoLock";
import { createMMKVPersister } from "../utils/queryPersister";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

const persister = createMMKVPersister();

// Persist query client for offline support
persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});

function AppContent() {
  const { isLocked, handleActivity } = useAutoLock();

  return (
    <View
      style={{ flex: 1 }}
      pointerEvents="box-none"
      onStartShouldSetResponderCapture={() => {
        handleActivity();
        return false;
      }}
    >
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }} />
      {isLocked && <LockScreen />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}
