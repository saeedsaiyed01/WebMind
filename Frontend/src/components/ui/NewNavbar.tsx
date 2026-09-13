import { Brain, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type NavbarVariant = "landing" | "dashboard";

interface NewNavbarProps {
  variant: NavbarVariant;
  onSearch?: (query: string) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const NewNavbar: React.FC<NewNavbarProps> = ({ variant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const goToPrimary = () => navigate(isLoggedIn ? "/dashboard" : "/signup");

  const goFeatures = () => {
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      return;
    }
    navigate("/");
    setTimeout(
      () => document.getElementById("features")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }),
      120
    );
  };

  const navLinks: { label: string; onClick: () => void }[] = [
    { label: "Pricing", onClick: () => navigate("/pricing") },
    { label: "Features", onClick: goFeatures },
  ];

  if (variant === "dashboard") {
    return null;
  }

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-3xl",
        "transition-all duration-500",
        scrolled ? "top-3" : "top-5"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 rounded-full p-2 pl-4 pr-2 transition-all duration-500",
          "bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-2xl"
        )}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex shrink-0 items-center gap-2.5 pr-3"
          aria-label="WebMind home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black shadow-sm">
            <Brain className="h-4 w-4 text-black" />
          </span>
          <span className="font-sans text-[1.05rem] font-bold leading-none tracking-tight text-white">
            WebMind
          </span>
        </button>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className="px-4 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white hover:bg-white/10 rounded-full"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={goToPrimary}
            className="inline-flex h-9 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black shadow-md transition-all duration-200 hover:bg-zinc-200 active:scale-95"
          >
            {isLoggedIn ? "Dashboard" : "Get Started"}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="md:hidden absolute left-0 right-0 top-[calc(100%+0.5rem)] bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-3 shadow-2xl"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.onClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NewNavbar;
