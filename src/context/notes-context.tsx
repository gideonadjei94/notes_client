import React, { createContext, useContext, useState, useCallback } from "react";
import type {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  NotesFilters,
} from "../types/index";
import { apiService } from "../utils/api";
import { useToast } from "../context/toast-context";

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
  filters: NotesFilters;
  setFilters: (filters: NotesFilters) => void;
  fetchNotes: () => Promise<void>;
  createNote: (data: CreateNoteRequest) => Promise<Note>;
  updateNote: (
    id: number,
    data: UpdateNoteRequest,
    version?: number
  ) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  restoreNote: (id: number) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: false,
  });
  const [filters, setFiltersState] = useState<NotesFilters>({
    page: 0,
    size: 10,
    sortBy: "updatedAt",
  });
  const { showToast } = useToast();

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getNotes(filters);
      setNotes(response.notes);
      setPagination({
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        last: response.last,
      });
    } catch (error: any) {
      console.error("Failed to fetch notes:", error);
      showToast("Failed to load notes", "error");
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  const setFilters = useCallback((newFilters: NotesFilters) => {
    setFiltersState(newFilters);
  }, []);

  const createNote = async (data: CreateNoteRequest): Promise<Note> => {
    try {
      const newNote = await apiService.createNote(data);
      showToast("Note created successfully", "success");
      await fetchNotes();
      return newNote;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create note";
      showToast(message, "error");
      throw error;
    }
  };

  const updateNote = async (
    id: number,
    data: UpdateNoteRequest,
    version?: number
  ): Promise<Note> => {
    try {
      const updatedNote = await apiService.updateNote(id, data, version);
      showToast("Note updated successfully", "success");
      await fetchNotes();
      return updatedNote;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update note";
      showToast(message, "error");
      throw error;
    }
  };

  const deleteNote = async (id: number): Promise<void> => {
    try {
      await apiService.deleteNote(id);
      showToast("Note deleted successfully", "success");
      await fetchNotes();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete note";
      showToast(message, "error");
      throw error;
    }
  };

  const restoreNote = async (id: number): Promise<void> => {
    try {
      await apiService.restoreNote(id);
      showToast("Note restored successfully", "success");
      await fetchNotes();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to restore note";
      showToast(message, "error");
      throw error;
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        pagination,
        filters,
        setFilters,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        restoreNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
