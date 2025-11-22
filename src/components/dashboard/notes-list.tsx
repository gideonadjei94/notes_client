import React, { useState } from "react";
import { useNotes } from "../../context/notes-context";
import NoteCard from "../dashboard/note-card";
import NoteModal from "../dashboard/note-modal";
import LoadingSpinner from "../../components/common/load-spinner";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import clsx from "clsx";
import type { Note } from "../../types/index";

const NotesList: React.FC = () => {
  const { notes, isLoading, pagination, filters, setFilters } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
    setIsModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notes found
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first note
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {notes.map((note: Note) => (
          <NoteCard key={note.id} note={note} onEdit={handleEditNote} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {pagination.page * pagination.size + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  (pagination.page + 1) * pagination.size,
                  pagination.totalElements
                )}
              </span>{" "}
              of <span className="font-medium">{pagination.totalElements}</span>{" "}
              results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                className={clsx(
                  "p-2 rounded-lg transition-colors",
                  pagination.page === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={clsx(
                      "w-10 h-10 rounded-lg font-medium transition-colors",
                      pagination.page === i
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.last}
                className={clsx(
                  "p-2 rounded-lg transition-colors",
                  pagination.last
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        note={selectedNote}
      />
    </>
  );
};

export default NotesList;
