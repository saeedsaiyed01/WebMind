import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "sonner"; // Import the Toaster from Sonner
import "./App.css";
import { ChatPage } from "./pages/ChatPage";
import { Dashboard } from "./pages/dashboard";
import LandingPage from "./pages/landingPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PricingPage from "./pages/PricingPage";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

import { useStore } from "@/store/useStore";
import axios from "axios";

function AppContent() {
  const navigate = useNavigate();
  const { setUser, setCredits, setToken } = useStore();

  useEffect(() => {
    // Check for token in URL params (from Google OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/dashboard');
    }
  }, [navigate, setToken]);

  // Fetch user data (credits, etc) on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      try {
        const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const res = await axios.get(`${API_BASE}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data) {
           setUser(res.data);
           if (res.data.credits !== undefined) {
             setCredits(res.data.credits);
           }
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        // Optional: logout if token invalid
      }
    };
    
    fetchUser();
  }, [setUser, setCredits]);

  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/setting" element={<Dashboard />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/payment-cancel" element={<PaymentCancelPage />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
