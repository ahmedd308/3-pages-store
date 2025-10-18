import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";
import { storage } from "./mmkv";

/**
 * Creates a Persister for React Query that uses MMKV storage
 */
export function createMMKVPersister(): Persister {
  const STORAGE_KEY = "REACT_QUERY_OFFLINE_CACHE";

  return {
    persistClient: async (client: PersistedClient) => {
      try {
        storage.set(STORAGE_KEY, JSON.stringify(client));
      } catch (error) {
        console.error("Failed to persist query client:", error);
      }
    },
    restoreClient: async () => {
      try {
        const cached = storage.getString(STORAGE_KEY);
        if (cached) {
          return JSON.parse(cached) as PersistedClient;
        }
        return undefined;
      } catch (error) {
        console.error("Failed to restore query client:", error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        storage.delete(STORAGE_KEY);
      } catch (error) {
        console.error("Failed to remove persisted client:", error);
      }
    },
  };
}
