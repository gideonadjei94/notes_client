export interface User {
  userId: number;
  username: string;
  email: string;
  token: string;
}

export interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  token: string;
  refresh_token: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface NotesResponse {
  notes: Note[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
  tags: string[];
}

export interface NotesFilters {
  search?: string;
  tag?: string;
  page?: number;
  size?: number;
  sortBy?: "createdAt" | "updatedAt" | "title";
}
