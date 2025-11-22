import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { localStorage, sessionStorage } from "../utils/storage";
import LoadingScreen from "../components/common/loading-screen";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [loadingMessage, setLoadingMessage] = useState("Initializing");

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        setLoadingMessage("Checking authentication");
        await delay(800);

        const refreshToken = localStorage.getRefreshToken();
        const cachedUser = sessionStorage.getUser();
        const accessToken = sessionStorage.getAccessToken();

        if (!refreshToken) {
          setLoadingMessage("Redirecting to login");
          await delay(500);
          navigate("/auth", { replace: true });
          return;
        }

        if (cachedUser && accessToken) {
          setLoadingMessage("Welcome back!");
          await delay(600);
          navigate("/dashboard", { replace: true });
          return;
        }

        setLoadingMessage("Restoring session");
        await delay(3000);
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Navigation error:", error);
        setLoadingMessage("Something went wrong");
        await delay(500);
        navigate("/auth", { replace: true });
      }
    };

    checkAuthAndNavigate();
  }, [navigate]);

  return <LoadingScreen message={loadingMessage} />;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default Index;
