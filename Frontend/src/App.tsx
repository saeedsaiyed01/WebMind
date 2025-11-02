import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "sonner"; // Import the Toaster from Sonner
import "./App.css";
import { Dashboard } from "./pages/dashboard";
import LandingPage from "./pages/landingPage";
import PricingPage from "./pages/PricingPage";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in URL params (from Google OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Always redirect to dashboard after Google auth
      navigate('/dashboard');
    }
  }, [navigate]);

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
        <Route path="/setting" element={<Dashboard />} />
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
