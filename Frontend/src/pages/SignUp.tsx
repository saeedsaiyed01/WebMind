import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SEO from "../components/SEO";
import { AuthForm } from "../components/auth/auth-form";
import { AuthShell } from "../components/auth/AuthShell";
import { signUp } from "../services/authSerivces";
import { useState } from "react";

export default function SignUpPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await signUp(data.email, data.password);
      localStorage.setItem("token", response.token);
      toast.success("Account created!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error: unknown) {
      const err = error as { response?: { status: number } };
      if (err.response?.status === 411) {
        setErrorMsg("Email already taken");
        toast.error("Email already taken");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Create account" subtitle="Start building your personal knowledge base">
      <SEO
        title="Get Started Free — WebMind"
        description="Create your free WebMind account and start building your AI-powered personal knowledge base."
        url="https://webmind.space/signup"
      />
      {errorMsg && (
        <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}
      <AuthForm type="signup" onSubmit={handleSignUp} isLoading={isLoading} />
      <div className="mt-8 border-t border-border pt-6 text-center">
        <p className="text-caption text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="font-medium text-foreground hover:text-gold transition-colors underline decoration-border underline-offset-4 hover:decoration-gold/60"
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
