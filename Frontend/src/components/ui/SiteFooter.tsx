import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Reveal } from "./motion";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const scrollToFeatures = () => {
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigate("/");
    setTimeout(() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const productLinks = [
    { label: "Features", onClick: scrollToFeatures },
    { label: "Pricing", onClick: () => navigate("/pricing") },
    { label: "Sign in", onClick: () => navigate("/signin") },
    { label: "Get started", onClick: () => navigate("/signup") },
  ];

  return (
    <footer className={cn("relative mt-8 overflow-hidden border-t border-border", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden />

      {/* Brand watermark */}
      <div className="relative overflow-hidden py-10 sm:py-14 select-none pointer-events-none" aria-hidden>
        <p
          className="font-display text-center font-normal tracking-[-0.04em] text-[clamp(3.5rem,14vw,11rem)] leading-none"
          style={{ color: "transparent", WebkitTextStroke: "1px hsl(var(--foreground) / 0.18)" }}
        >
          WebMind
        </p>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <div className="relative z-10 wm-container pb-10 sm:pb-12 -mt-4 sm:-mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pt-8 border-t border-border">
          <Reveal className="lg:col-span-5 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2.5 w-fit text-left group"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-gold-soft to-gold text-gold-foreground shadow-[0_4px_14px_-4px_hsl(var(--gold)/0.6)]">
                <Brain className="h-5 w-5" />
              </span>
              <span className="font-display text-lg tracking-tight text-foreground">WebMind</span>
            </button>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              Your personal knowledge base — store tweets, notes, and documents, then ask AI
              questions grounded in your own content.
            </p>
          </Reveal>

          <Reveal delay={0.05} className="lg:col-span-3">
            <h3 className="text-overline mb-4">Product</h3>
            <ul className="flex flex-col gap-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={link.onClick}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <h3 className="text-overline mb-4">Connect</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://x.com/saeedsaiyedtwt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  @saeedsaiyedtwt
                  <span className="text-muted-foreground/60" aria-hidden>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://webmind.space"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  webmind.space
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {year} WebMind. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground text-center sm:text-right">
            Built by{" "}
            <a
              href="https://x.com/saeedsaiyedtwt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-gold font-medium transition-colors underline decoration-border underline-offset-4 hover:decoration-gold/60"
            >
              Saeed Saiyed
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
