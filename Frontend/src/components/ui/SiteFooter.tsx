import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    setTimeout(() => {
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const productLinks = [
    { label: "Features", onClick: scrollToFeatures },
    { label: "Pricing", onClick: () => navigate("/pricing") },
    { label: "Sign in", onClick: () => navigate("/signin") },
    { label: "Get started", onClick: () => navigate("/signup") },
  ];

  return (
    <footer
      className={cn(
        "relative mt-8 border-t border-zinc-800 bg-zinc-950",
        className
      )}
    >
      {/* Brand watermark — visible but decorative */}
      <div
        className="relative overflow-hidden py-10 sm:py-14 select-none pointer-events-none"
        aria-hidden
      >
        <p
          className="font-display text-center font-bold tracking-[-0.04em] text-[clamp(3.5rem,14vw,11rem)] leading-none"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.35)",
          }}
        >
          WEBMIND
        </p>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950" />
      </div>

      <div className="relative z-10 wm-container pb-10 sm:pb-12 -mt-4 sm:-mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pt-8 border-t border-zinc-800/80">
          {/* Brand */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2.5 w-fit text-left group"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/15 group-hover:bg-white/15 transition-colors">
                <Brain className="h-5 w-5 text-white" />
              </span>
              <span className="font-display text-lg font-bold text-white tracking-tight">
                WebMind
              </span>
            </button>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-sm">
              Your personal knowledge base—store tweets, notes, and documents,
              then ask AI questions grounded in your own content.
            </p>
          </div>

          {/* Product */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
              Product
            </h3>
            <ul className="flex flex-col gap-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={link.onClick}
                    className="text-sm text-zinc-300 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
              Connect
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://x.com/saeedsaiyedtwt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-300 hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  @saeedsaiyedtwt
                  <span className="text-zinc-500" aria-hidden>
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://webmind.buzz"
                  className="text-sm text-zinc-300 hover:text-white transition-colors"
                >
                  webmind.buzz
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400 text-center sm:text-left">
            © {year} WebMind. All rights reserved.
          </p>
          <p className="text-sm text-zinc-400 text-center sm:text-right">
            Built by{" "}
            <a
              href="https://x.com/saeedsaiyedtwt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-200 hover:text-white font-medium transition-colors underline decoration-zinc-600 underline-offset-4 hover:decoration-zinc-400"
            >
              Saeed Saiyed
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
