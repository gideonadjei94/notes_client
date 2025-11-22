import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User, AuthResponse } from "../types/index";
import { apiService } from "../utils/api";
import {
  sessionStorage,
  localStorage,
  clearAllStorage,
} from "../utils/storage";
import { useToast } from "../context/toast-context";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const saveAuthData = useCallback((authResponse: AuthResponse) => {
    const { userId, username, email, token, refresh_token } = authResponse;
    setUser({ userId, username, email, token });
    sessionStorage.setUser({ userId, username, email, token });
    sessionStorage.setAccessToken(refresh_token);
    localStorage.setRefreshToken(refresh_token);
  }, []);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const refreshToken = localStorage.getRefreshToken();

      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      const cachedUser = sessionStorage.getUser();
      const accessToken = sessionStorage.getAccessToken();

      if (cachedUser && accessToken) {
        setUser(cachedUser);
        setIsLoading(false);
        return;
      }

      try {
        const authResponse = await apiService.refreshToken(refreshToken);
        saveAuthData(authResponse);
      } catch (error) {
        clearAllStorage();
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      clearAllStorage();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [saveAuthData]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    try {
      const authResponse = await apiService.login(email, password);
      saveAuthData(authResponse);
      showToast("Login successful!", "success");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      showToast(message, "error");
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const authResponse = await apiService.signup(username, email, password);
      saveAuthData(authResponse);
      showToast("Account created successfully!", "success");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";
      showToast(message, "error");
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAllStorage();
      setUser(null);
      showToast("Logged out successfully", "info");
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      sessionStorage.setUser(userData);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
