import { Brain } from "lucide-react";
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

      // Store token
      localStorage.setItem("token", response.token);

      // Display a toast with a green tick icon on success
      toast.success(
        <div className="flex items-center">Sign in successful!</div>
      );

      // Navigate to the dashboard after a brief delay to let the toast show
      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } catch (error: any) {
      console.error("Sign in error:", error);
      // Determine error message based on response status
      if (error.response && error.response.status === 403) {
        toast.error("Incorrect credentials");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-black dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* Background gradient elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      {/* Main content */}
      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-sm transition-colors duration-300">
          {/* Header */}
          <div className="flex flex-col items-center space-y-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-purple-200 dark:bg-purple-300 flex items-center justify-center">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700/50 text-red-700 dark:text-white px-4 py-3 rounded-lg text-sm mb-6">
              {errorMsg}
            </div>
          )}

          <AuthForm type="signin" onSubmit={handleSignIn} />

          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-white/10 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Not have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation to home */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
        >
          {/* You can add icon/text here if needed */}
        </button>
      </div>
    </div>
  );
}
