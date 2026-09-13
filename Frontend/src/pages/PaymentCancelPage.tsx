import { GlowOrb, PageTransition } from "@/components/ui/motion";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-overlay grid-overlay-fade opacity-30 dark:opacity-20" />
        <GlowOrb className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={480} intensity={0.25} />
      </div>
      <PageTransition className="w-full max-w-md space-y-6 text-center">
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-destructive/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-destructive bg-destructive/10">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <h1 className="font-display text-3xl tracking-tight text-foreground">Payment Cancelled</h1>
        <p className="text-muted-foreground">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="space-y-3 pt-4">
          <button onClick={() => navigate("/pricing")} className="wm-btn-gold w-full">
            Try Again
          </button>
          <button onClick={() => navigate("/dashboard")} className="wm-btn-secondary w-full">
            Go to Dashboard
          </button>
        </div>
      </PageTransition>
    </div>
  );
}
