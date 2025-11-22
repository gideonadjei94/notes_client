import React, { useState } from "react";
import { useNotes } from "../../context/notes-context";
import type { Note } from "../../types/index";
import { Calendar, Tag, Trash2, RotateCcw, Edit } from "lucide-react";
import clsx from "clsx";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit }) => {
  const { deleteNote, restoreNote } = useNotes();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      setIsDeleting(true);
      try {
        await deleteNote(note.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleRestore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRestoring(true);
    try {
      await restoreNote(note.id);
    } finally {
      setIsRestoring(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isDeleted = !!note.deletedAt;

  return (
    <div
      className={clsx(
        "bg-white rounded-xl  border border-slate-300 transition-all duration-200",
        "hover:shadow-md hover:-translate-y-1",
        isDeleted ? "border-red-200 opacity-60" : "border-gray-200"
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {note.title}
          </h3>
          {isDeleted && (
            <span className="ml-2 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded">
              Deleted
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {note.content}
        </p>

        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(note.updatedAt)}
          </div>

          <div className="flex items-center space-x-2">
            {isDeleted ? (
              <button
                onClick={handleRestore}
                disabled={isRestoring}
                className={clsx(
                  "p-2 rounded-lg transition-colors cursor-pointer",
                  "text-green-600 hover:bg-green-50",
                  "focus:outline-none focus:ring-2 focus:ring-green-500",
                  isRestoring && "opacity-50 cursor-not-allowed"
                )}
                title="Restore note"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onEdit(note)}
                  className={clsx(
                    "p-2 rounded-lg transition-colors cursor-pointer",
                    "text-blue-600 hover:bg-blue-50",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                  title="Edit note"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={clsx(
                    "p-2 rounded-lg transition-colors cursor-pointer",
                    "text-red-600 hover:bg-red-50",
                    "focus:outline-none focus:ring-2 focus:ring-red-500",
                    isDeleting && "opacity-50 cursor-not-allowed"
                  )}
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
