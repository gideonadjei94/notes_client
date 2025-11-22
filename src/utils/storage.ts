import type { User } from "../types/index";
import { encryptToken, decryptToken } from "./crypto";

const STORAGE_KEYS = {
  USER: "notes_user",
  ACCESS_TOKEN: "notes_access_token",
  REFRESH_TOKEN: "notes_refresh_token",
} as const;

export const sessionStorage = {
  setUser: (user: User) => {
    window.sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const user = window.sessionStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  setAccessToken: (token: string) => {
    window.sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  getAccessToken: (): string | null => {
    return window.sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  clear: () => {
    window.sessionStorage.removeItem(STORAGE_KEYS.USER);
    window.sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
};

export const localStorage = {
  setRefreshToken: (token: string) => {
    const encrypted = encryptToken(token);
    window.localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, encrypted);
  },

  getRefreshToken: (): string | null => {
    const encrypted = window.localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    return encrypted ? decryptToken(encrypted) : null;
  },

  clearRefreshToken: () => {
    window.localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

export const clearAllStorage = () => {
  sessionStorage.clear();
  localStorage.clearRefreshToken();
};
