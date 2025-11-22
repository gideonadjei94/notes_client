import React, { useState, useEffect } from "react";
import { useNotes } from "../../context/notes-context";
import { Search, Tag, SortAsc } from "lucide-react";
import clsx from "clsx";

const NotesFilters: React.FC = () => {
  const { filters, setFilters, fetchNotes } = useNotes();
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [tagsInput, setTagsInput] = useState(filters.tag || "");

  useEffect(() => {
    fetchNotes();
  }, [filters, fetchNotes]);

  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchInput || undefined,
      page: 0,
    });
  };

  const handleTagFilter = () => {
    setFilters({
      ...filters,
      tag: tagsInput || undefined,
      page: 0,
    });
  };

  const handleSortChange = (sortBy: string) => {
    setFilters({
      ...filters,
      sortBy: sortBy as "createdAt" | "updatedAt" | "title",
      page: 0,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === "Enter") {
      handler();
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setTagsInput("");
    setFilters({
      page: 0,
      size: 10,
      sortBy: "updatedAt",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-300 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Notes
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleSearch)}
              placeholder="Search by title or content..."
              className={clsx(
                "block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "transition-colors"
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Tags
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleTagFilter)}
              placeholder="work, personal, todo"
              className={clsx(
                "block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "transition-colors"
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SortAsc className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filters.sortBy || "updatedAt"}
              onChange={(e) => handleSortChange(e.target.value)}
              className={clsx(
                "block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "transition-colors appearance-none bg-white cursor-pointer"
              )}
            >
              <option value="updatedAt">Last Updated</option>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 mt-4">
        <button
          onClick={clearFilters}
          className={clsx(
            "px-4 py-2 text-sm font-medium text-gray-700",
            "bg-gray-100 hover:bg-gray-200 rounded-lg",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          )}
        >
          Clear Filters
        </button>
        <button
          onClick={() => {
            handleSearch();
            handleTagFilter();
          }}
          className={clsx(
            "px-4 py-2 text-sm font-medium text-white",
            "bg-gradient-to-r from-blue-600 to-purple-600",
            "hover:from-blue-700 hover:to-purple-700",
            "rounded-lg transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500"
          )}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default NotesFilters;
