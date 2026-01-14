import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
          <div className="relative w-20 h-20 bg-red-500/10 rounded-full border-2 border-red-500 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white">Payment Cancelled</h1>
        <p className="text-zinc-400">
          Your payment was cancelled. No charges were made to your account.
        </p>
        
        <div className="pt-4 space-y-3">
          <button
            onClick={() => navigate("/pricing")}
            className="w-full px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full px-6 py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
