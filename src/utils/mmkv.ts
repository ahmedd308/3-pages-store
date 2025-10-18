import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const getStorageString = (key: string): string | null => {
  try {
    return storage.getString(key) || null;
  } catch {
    return null;
  }
};

export const setStorageString = (key: string, value: string) => {
  storage.set(key, value);
};

export const removeStorageKey = (key: string) => {
  storage.delete(key);
};
