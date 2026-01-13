import { Button } from "@/components/ui/Button";
import { ArrowLeft, Brain } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthForm } from "../components/auth/auth-form";
import { signIn } from "../services/authSerivces";

export default function SignInPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      const response = await signIn(data.email, data.password);
      console.log("Sign in success:", response);

      localStorage.setItem("token", response.token);

      toast.success("Sign in successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } catch (error: any) {
      console.error("Sign in error:", error);
      if (error.response && error.response.status === 403) {
        toast.error("Incorrect credentials");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center p-4">
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
          {/* Title is handled in AuthForm now */}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="bg-red-950/50 border border-red-900 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
            {errorMsg}
          </div>
        )}

        <AuthForm type="signin" onSubmit={handleSignIn} />

        <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
          <p className="text-sm text-zinc-500">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-white hover:underline underline-offset-4"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
