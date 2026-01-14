import { useStore } from "@/store/useStore";
import axios from "axios";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCredits, setUser } = useStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [countdown, setCountdown] = useState(5);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyAndRedirect = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        
        // Refresh user data to get updated credits
        const res = await axios.get(`${API_BASE}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data) {
          setUser(res.data);
          if (res.data.credits !== undefined) {
            setCredits(res.data.credits);
          }
        }
        
        setStatus("success");
      } catch (error) {
        console.error("Failed to verify payment", error);
        setStatus("success"); // Still show success, webhook handles the actual credit addition
      }
    };

    verifyAndRedirect();
  }, [sessionId, setCredits, setUser]);

  // Countdown and redirect
  useEffect(() => {
    if (status !== "success") return;
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" ? (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-white mx-auto" />
            <h1 className="text-2xl font-bold text-white">Processing Payment...</h1>
            <p className="text-zinc-400">Please wait while we confirm your payment.</p>
          </>
        ) : (
          <>
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 bg-green-500/10 rounded-full border-2 border-green-500 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white">Payment Successful! 🎉</h1>
            <p className="text-zinc-400">
              Thank you for your purchase! Your credits have been added to your account.
            </p>
            
            <div className="pt-4">
              <p className="text-zinc-500 text-sm">
                Redirecting to dashboard in <span className="text-white font-bold">{countdown}</span> seconds...
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-4 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all"
              >
                Go to Dashboard Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
