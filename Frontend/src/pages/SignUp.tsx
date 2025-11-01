import { Brain, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
      toast.success(
        <div className="flex items-center">
          <Check size={16} className="mr-2 text-green-500" />
          Sign up successful!
        </div>
      );
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
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-black dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* Background gradient elements */}
      {/* Background gradient elements matching landing page style */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      {/* Main content container */}
      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-2xl w-full max-w-md transition-colors duration-300">
          {/* Header */}
          <div className="flex flex-col items-center space-y-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-purple-300 flex items-center justify-center ">
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="bg-red-900/30 border border-red-700/50 text-white px-4 py-3 rounded-lg text-sm mb-6">
              {errorMsg}
            </div>
          )}
          <div className=" text-black dark:text-white">
            {/* Auth form */}
            <AuthForm type="signup" onSubmit={handleSignUp} />
          </div>

          {/* Additional information */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-purple-400 hover:text-purple-300"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation to home */}
      {/* <div className="absolute top-6 left-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <Brain className="h-6 w-6 text-[#FF4500]" />
          <span className="font-bold">WebMind</span>
        </button>
      </div> */}
    </div>
  );
}
