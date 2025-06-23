import { Brain } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { AuthForm } from '../components/auth/auth-form';
import { signIn } from '../services/authSerivces';

export default function SignInPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      const response = await signIn(data.email, data.password);
      console.log('Sign in success:', response);

      // Store token
      localStorage.setItem("token", response.token);
      
      // Display a toast with a green tick icon on success
      toast.success(
        <div className="flex items-center">
         Sign in successful!
        </div>
      );
      
      // Navigate to the dashboard after a brief delay to let the toast show
      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } catch (error: any) {
      console.error('Sign in error:', error);
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
    <div className="min-h-screen bg-[#0A0A0B] text-white relative overflow-hidden">
    {/* Background gradient elements matching landing page style */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#FF4500]/20 via-transparent to-transparent" />
    <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4500]/5 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

    {/* Main content container */}
    <div className="relative flex items-center justify-center min-h-screen p-6">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex flex-col items-center space-y-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-[#FF4500]/20 flex items-center justify-center">
            <Brain className="h-8 w-8 text-[#FF4500]" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl  font-bold bg-gradient-to-r from-white to-[#FF4500] bg-clip-text text-transparent">
              Join WebMind
            </h1>

          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="bg-red-900/30 border border-red-700/50 text-white px-4 py-3 rounded-lg text-sm mb-6">
            {errorMsg}
          </div>
        )}


          <AuthForm
            type="signin"
            onSubmit={handleSignIn}
          />
    <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Not have an account?{" "}
              <button 
                onClick={() => navigate('/signup')}
                className="text-[#FF4500] hover:text-[#FF4500]/80 transition-colors"
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
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <Brain className="h-6 w-6 text-[#FF4500]" />
          <span className="font-bold">WebMind</span>
        </button>
      </div>
    </div>
  );
}