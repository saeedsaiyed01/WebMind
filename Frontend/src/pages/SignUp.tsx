import { Button } from "@/components/ui/Button";
import { ArrowLeft, Brain } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SEO from "../components/SEO";
import { AuthForm } from "../components/auth/auth-form";
import { signUp } from "../services/authSerivces";

export default function SignUpPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (data: { email: string; password: string }) => {
    try {
      const response = await signUp(data.email, data.password);
      localStorage.setItem("token", response.token);
      toast.success("Sign up successful!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error: unknown) {
      const err = error as { response?: { status: number } };
      if (err.response?.status === 411) {
        setErrorMsg("Email already taken");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center p-6 font-sans">
      <SEO
        title="Get Started Free — WebMind"
        description="Create your free WebMind account and start building your AI-powered personal knowledge base."
        url="https://webmind.buzz/signup"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
        aria-hidden
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,32rem)] h-48 bg-zinc-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="wm-auth-card">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Brain className="h-7 w-7 text-black" />
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-950/50 border border-red-900/80 text-red-200 px-4 py-3 rounded-lg text-caption mb-6">
            {errorMsg}
          </div>
        )}

        <AuthForm type="signup" onSubmit={handleSignUp} />

        <div className="mt-8 pt-6 border-t border-zinc-800/80 text-center">
          <p className="text-caption">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="text-white font-medium hover:underline underline-offset-4"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
