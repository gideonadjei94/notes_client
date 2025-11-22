import React, { useState } from "react";
import Login from "../../components/auth/login";
import Signup from "../../components/auth/signup";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-white"
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
          <h1 className="text-3xl font-bold text-gray-900">NotesApp</h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        <div className="rounded-2xl p-5">
          {isLogin ? <Login /> : <Signup />}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <span className="underline cursor-pointer">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span className="underline cursor-pointer">Log in</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
