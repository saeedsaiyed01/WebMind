import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { signInWithGoogle } from "../../services/authSerivces";

interface AuthFormProps {
  type: "signin" | "signup";
  onSubmit: (data: { email: string; password: string }) => void;
  isLoading?: boolean;
}

export function AuthForm({ type, onSubmit, isLoading }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-white">
          {type === "signin" ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-body-muted text-sm mt-2">
          {type === "signin"
            ? "Sign in to access your knowledge base"
            : "Start building your personal knowledge base"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-caption font-medium text-zinc-300">
             Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className={cn("bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-white", errors.email && "border-red-500 focus-visible:ring-red-500")}
          />
          {errors.email && <p className="text-sm font-medium text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-caption font-medium text-zinc-300">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={cn("bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 pr-10 focus-visible:ring-white", errors.password && "border-red-500 focus-visible:ring-red-500")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm font-medium text-red-500">{errors.password}</p>}
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-full bg-white text-black font-semibold hover:bg-zinc-200"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {type === "signin" ? "Sign In" : "Create Account"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-2 text-caption text-zinc-500">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 rounded-full bg-transparent border-zinc-800 text-white hover:bg-zinc-900 hover:text-white"
          onClick={handleGoogleSignIn}
        >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
          Google
        </Button>
      </form>
    </div>
  );
}
