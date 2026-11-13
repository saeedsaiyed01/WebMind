"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthForm } from "../components/auth/auth-form";
import { AuthShell } from "../components/auth/AuthShell";
import { signIn } from "../services/authSerivces";
import { useState } from "react";

export default function SignInPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const navigate = router.push;

  const handleSignIn = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success("Sign in successful!");
      const destination = new URLSearchParams(window.location.search).get("next");
      navigate(destination?.startsWith("/") && !destination.startsWith("//") && !destination.includes("\\") ? destination : "/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { status: number } };
      if (err.response?.status === 403) {
        toast.error("Incorrect credentials");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to access your knowledge base">
      {errorMsg && (
        <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}
      <AuthForm type="signin" onSubmit={handleSignIn} isLoading={isLoading} />
      <div className="mt-8 border-t border-border pt-6 text-center">
        <p className="text-caption text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="font-medium text-foreground hover:text-gold transition-colors underline decoration-border underline-offset-4 hover:decoration-gold/60"
          >
            Sign up
          </button>
        </p>
      </div>
    </AuthShell>
  );
}
