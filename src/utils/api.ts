import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import type {
  AuthResponse,
  User,
  Note,
  NotesResponse,
  CreateNoteRequest,
  UpdateNoteRequest,
  NotesFilters,
} from "../types/index";
import { sessionStorage, localStorage, clearAllStorage } from "./storage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8082/api";

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = sessionStorage.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        const isAuthEndpoint = originalRequest.url?.includes("/auth/");

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAuthEndpoint
        ) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.api(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getRefreshToken();
            if (!refreshToken) {
              throw new Error("No refresh token");
            }

            const response = await this.refreshToken(refreshToken);
            const accessToken = response.token;

            sessionStorage.setAccessToken(accessToken);
            localStorage.setRefreshToken(response.refresh_token);

            this.refreshSubscribers.forEach((callback) =>
              callback(accessToken)
            );
            this.refreshSubscribers = [];

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return this.api(originalRequest);
          } catch (refreshError) {
            clearAllStorage();
            window.location.href = "/auth";
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  }

  async signup(
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>("/auth/signup", {
      username,
      email,
      password,
    });
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post("/auth/logout");
    } finally {
      clearAllStorage();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>("/auth/me");
    return response.data;
  }

  async getNotes(filters: NotesFilters = {}): Promise<NotesResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.tag) params.append("tag", filters.tag);
    if (filters.page !== undefined)
      params.append("page", filters.page.toString());
    if (filters.size) params.append("size", filters.size.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);

    const response = await this.api.get<NotesResponse>(
      `/notes?${params.toString()}`
    );
    return response.data;
  }

  async getNoteById(id: number): Promise<Note> {
    const response = await this.api.get<Note>(`/notes/${id}`);
    return response.data;
  }

  async createNote(data: CreateNoteRequest): Promise<Note> {
    const response = await this.api.post<Note>("/notes", data);
    return response.data;
  }

  async updateNote(
    id: number,
    data: UpdateNoteRequest,
    version?: number
  ): Promise<Note> {
    const headers: Record<string, string> = {};
    if (version !== undefined) {
      headers["If-Match"] = `"${version}"`;
    }

    const response = await this.api.put<Note>(`/notes/${id}`, data, {
      headers,
    });
    return response.data;
  }

  async deleteNote(id: number): Promise<void> {
    await this.api.delete(`/notes/${id}`);
  }

  async restoreNote(id: number): Promise<Note> {
    const response = await this.api.post<Note>(`/notes/${id}/restore`);
    return response.data;
  }
}

export const apiService = new ApiService();
