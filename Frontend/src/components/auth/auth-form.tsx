import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  

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

    if (type === "signup" && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

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
        <h2 className="text-3xl font-bold  ">
          {type === "signin" ? "Welcome back" : "Create your account"}
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
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <InputBox
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="Enter your email"
              className="bg-gray-800 text-white"
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
                className="bg-gray-800 text-white pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {type === "signup" && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <InputBox
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                className="bg-gray-800 text-white"
              />
            </div>
          )}
        </div>

        {type === "signin" && (
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" className="rounded border-white/10 bg-white/5" />
              <span className="text-sm">Remember me</span>
            </label>
            {/* <Link to="/forgot-password" className="text-sm text-[#FF4500] hover:text-[#FF4500]/90">
              Forgot password?
            </Link> */}
          </div>
        )}

        <div className="space-y-4">
          <Button
           btnType="submit"
            variant="orange"
            size="lg"
            text={type === "signin" ? "Sign in" : "Create account"}
            loading={isLoading}
            disabled={isLoading} 
            icon={isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
            fullWidth
          />

          <div className="relative">
           
          </div>

        
        </div>
      </form>
    </div>
  );
}
