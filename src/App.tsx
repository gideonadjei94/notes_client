import { Route, Routes } from "react-router-dom";
import { ToastProvider } from "./context/toast-context";
import { AuthProvider } from "./context/auth-context";
import Index from "./pages";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/routes/protected-routes";
import PublicRoute from "./components/routes/public-routes";
import { NotesProvider } from "./context/notes-context";

function App() {
  return (
    <ToastProvider>
      <NotesProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/auth"
              element={
                <PublicRoute restricted>
                  <Auth />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </NotesProvider>
    </ToastProvider>
  );
}

export default App;
