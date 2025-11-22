import React, { useState } from "react";
import { useAuth } from "../../context/auth-context";
import { NotesProvider } from "../../context/notes-context";
import DashboardHeader from "../../components/dashboard/dashboard-header";
import NotesFilters from "../../components/dashboard/notes-filters";
import NotesList from "../../components/dashboard/notes-list";
import NoteModal from "../../components/dashboard/note-modal";
import { Plus } from "lucide-react";
import clsx from "clsx";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <NotesProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <DashboardHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-gray-600">
              Manage your notes and stay organized
            </p>
          </div>

          {/* Filters Section */}
          <NotesFilters />

          {/* Notes List */}
          <NotesList />

          {/* Floating Action Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className={clsx(
              "fixed bottom-8 right-8 z-40",
              "w-14 h-14 rounded-full",
              "bg-gradient-to-r from-blue-600 to-purple-600",
              "text-white shadow-lg hover:shadow-xl",
              "flex items-center justify-center",
              "transition-all duration-200 hover:scale-110",
              "focus:outline-none focus:ring-4 focus:ring-blue-300"
            )}
          >
            <Plus className="w-6 h-6" />
          </button>
        </main>

        {/* Create/Edit Note Modal */}
        <NoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </NotesProvider>
  );
};

export default Dashboard;
