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
      console.log("Sign up success:", response);
      localStorage.setItem("token", response.token);
      toast.success("Sign up successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error: any) {
      console.error("Sign up error:", error);
      if (error.response && error.response.status === 411) {
        setErrorMsg("Email already Taken");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center p-4">
      <SEO
        title="Get Started Free — WebMind"
        description="Create your free WebMind account and start building your AI-powered personal knowledge base today."
        url="https://webmind.buzz/signup"
      />
      {/* Background - Minimalist Grid or darker elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Navigation to home */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main content */}
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Brain className="h-7 w-7 text-black" />
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="bg-red-950/50 border border-red-900 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
            {errorMsg}
          </div>
        )}

        <div className="text-black dark:text-white">
          <AuthForm type="signup" onSubmit={handleSignUp} />
        </div>

        {/* Additional information */}
        <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-white hover:underline underline-offset-4"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
