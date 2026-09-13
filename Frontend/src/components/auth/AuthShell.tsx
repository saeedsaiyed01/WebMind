import { Button } from "@/components/ui/Button";
import { GlowOrb, PageTransition } from "@/components/ui/motion";
import { ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6 font-sans text-foreground">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-overlay grid-overlay-fade opacity-30 dark:opacity-20" />
        <div className="absolute inset-0 grain opacity-[0.04] dark:opacity-[0.06]" />
        <GlowOrb className="left-1/2 top-[-6rem] -translate-x-1/2" size={520} intensity={0.4} />
      </div>

      <div className="absolute left-6 top-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <PageTransition className="w-full max-w-md">
        <div className="wm-auth-card">
          <div className="mb-8 flex flex-col items-center gap-4 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-md">
              <Brain className="h-6 w-6 text-black" />
            </span>
            <div>
              <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          {children}
        </div>
      </PageTransition>
    </div>
  );
}
