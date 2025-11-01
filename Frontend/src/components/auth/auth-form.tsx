import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { signInWithGoogle } from "../../services/authSerivces";
import { Button } from "../ui/Button";
import { InputBox } from "../ui/InputBox";


interface AuthFormProps {
  type: "signin" | "signup";
  onSubmit: (data: { email: string; password: string }) => void;
  isLoading?: boolean;
}

export function AuthForm({ type, onSubmit, isLoading }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGoogleSignIn = () => {
    try {
      signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };
  

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Removed confirm password validation for signup

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ email, password });
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="text-center">
        <h2 className="text-4xl font-normal ">
          {type === "signin" ? "Welcome back" : "Create account"}
        </h2>
       
        {/* <p className="mt-2 text-gray-400">
          {type === "signin" ? "Don't have an account? " : "Already have an account? "}
          <Link
            to={type === "signin" ? "/sign-up" : "/sign-in"}
            className="text-[#FF4500] hover:text-[#FF4500]/90"
          >
            {type === "signin" ? "Sign up" : "Sign in"}
          </Link>
        </p> */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-black dark:text-white text-sm font-medium mb-1">
              Email
            </label>
            <InputBox
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="Enter your email"
              className="bg-gray-100 dark:bg-[#171717] text-black dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <InputBox
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Enter your password"
                className="bg-[#171717] text-black dark:text-white pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-black"
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-black dark:text-white" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Removed confirm password field for signup */}
        </div>

        {type === "signin" && (
          <div className="flex items-center justify-between">
           
            {/* <Link to="/forgot-password" className="text-sm text-[#FF4500] hover:text-[#FF4500]/90">
              Forgot password?
            </Link> */}
          </div>
        )}

        <div className="space-y-4">
          <Button
           btnType="submit"
            variant="purple"
            size="lg"
            text={type === "signin" ? "Sign in" : "Create account"}
            loading={isLoading}
            disabled={isLoading}
            icon={isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
            fullWidth
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#0A0A0B] text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            variant="google"
            size="lg"
            text="Continue with Google"
            onClick={handleGoogleSignIn}
            fullWidth
            startIcon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }
          />


        </div>
      </form>
    </div>
  );
}
