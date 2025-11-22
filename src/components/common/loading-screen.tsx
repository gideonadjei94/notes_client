import React from "react";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div
              className="absolute inset-0 w-24 h-24 rounded-full border-4 border-blue-200"
              style={{
                animation: "spin 3s linear infinite",
              }}
            ></div>

            <div
              className="absolute inset-3 w-18 h-18 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
              style={{
                animation: "pulse 2s ease-in-out infinite",
              }}
            ></div>

            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">NotesApp</h2>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-gray-600">{message}</span>
            <div className="flex space-x-1">
              <span
                className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                style={{
                  animation: "bounce 1.4s infinite ease-in-out both",
                  animationDelay: "0s",
                }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                style={{
                  animation: "bounce 1.4s infinite ease-in-out both",
                  animationDelay: "0.2s",
                }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                style={{
                  animation: "bounce 1.4s infinite ease-in-out both",
                  animationDelay: "0.4s",
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
