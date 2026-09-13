import { useStore } from "@/store/useStore";
import { GlowOrb, PageTransition } from "@/components/ui/motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

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
        const res = await axios.get(`${API_BASE}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {
          setUser(res.data);
          if (res.data.credits !== undefined) setCredits(res.data.credits);
        }
        setStatus("success");
      } catch (error) {
        console.error("Failed to verify payment", error);
        setStatus("success");
      }
    };
    verifyAndRedirect();
  }, [sessionId, setCredits, setUser]);

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-overlay grid-overlay-fade opacity-30 dark:opacity-20" />
        <GlowOrb className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={520} intensity={0.35} />
      </div>
      <PageTransition className="w-full max-w-md space-y-6 text-center">
        {status === "loading" ? (
          <>
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-gold" />
            <h1 className="font-display text-3xl tracking-tight text-foreground">Processing Payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
          </>
        ) : (
          <>
            <div className="relative mx-auto h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl animate-pulse-glow" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-gold/10">
                <CheckCircle className="h-10 w-10 text-gold" />
              </div>
            </div>
            <h1 className="font-display text-3xl tracking-tight text-foreground">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase! Your credits have been added to your account.
            </p>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard in <span className="font-bold text-foreground">{countdown}</span> seconds...
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="wm-btn-gold mt-4"
              >
                Go to Dashboard Now
              </button>
            </div>
          </>
        )}
      </PageTransition>
    </div>
  );
}
