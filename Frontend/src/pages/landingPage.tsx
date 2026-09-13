import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { FeatureCard } from "../components/ui/FeatureCard";
import { LampContainer } from "../components/ui/lamp";
import NewNavbar from "../components/ui/NewNavbar";
import { SiteFooter } from "../components/ui/SiteFooter";
import { howItWorksSteps, landingFeatures } from "../data/landingFeatures";

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WebMind",
  url: "https://webmind.space",
  description:
    "Store tweets, notes, PDFs, and more into an AI-searchable personal knowledge base.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const goPrimary = () => navigate(isLoggedIn ? "/dashboard" : "/signup");
  const scrollToFeatures = () =>
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative w-full overflow-x-hidden bg-black text-white scroll-smooth font-sans">
      <SEO
        title="WebMind — All Your Digital Memory Unleashed"
        description="Store tweets, notes, PDFs, and more into an AI-searchable personal knowledge base. Recall anything instantly with AI."
        url="https://webmind.space"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <NewNavbar variant="landing" />

      {/* ───────────────────────── HERO ───────────────────────── */}
      <LampContainer>
        <div className="flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0.5, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-0 md:mt-[-70px] bg-gradient-to-br from-white via-zinc-200 to-zinc-500 py-4 bg-clip-text text-center text-4xl sm:text-5xl font-bold tracking-tight text-transparent md:text-7xl leading-[1.1] font-sans"
          >
            All Your Digital <br /> Memory Unleashed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
            className="mt-6 sm:mt-8 text-center text-zinc-400 max-w-xl mx-auto text-base sm:text-lg md:text-xl font-normal leading-relaxed tracking-tight"
          >
            WebMind stores every tweet, note, and document—transforming your content into a powerful, queryable personal knowledge base.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
            className="mt-10 sm:mt-12 flex gap-4 sm:gap-5 items-center flex-col sm:flex-row"
          >
            <button
              type="button"
              onClick={goPrimary}
              className="cursor-pointer select-none inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium h-12 px-8 bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.15)] hover:shadow-[0_0_32px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 outline-none"
            >
              {isLoggedIn ? "Go to Dashboard" : "Try Now"}
            </button>
            <button
              type="button"
              onClick={scrollToFeatures}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-zinc-900/80 border border-zinc-700/80 text-zinc-200 font-medium hover:bg-zinc-800 hover:border-zinc-600 hover:text-white active:scale-[0.98] transition-all duration-200 outline-none"
            >
              Learn More
            </button>
          </motion.div>

          {/* product preview */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 sm:mt-16 md:mt-24 w-full max-w-5xl mx-auto relative z-20 px-1"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-zinc-700/40 via-zinc-600/30 to-zinc-700/40 rounded-2xl blur-xl opacity-40" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/80 ring-1 ring-white/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
              <img
                src="/newheropage.png"
                alt="WebMind Dashboard Preview"
                className="w-full h-auto object-cover"
                loading="eager"
                // @ts-ignore
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </div>
      </LampContainer>

      {/* ───────────────────────── FEATURES ───────────────────────── */}
      <section id="features" className="relative z-20 bg-black py-24 md:py-32 overflow-hidden scroll-mt-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-xs font-mono font-medium text-zinc-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
              <span>FEATURES</span>
            </div>
            <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight font-sans">
              Built for the way you actually work
            </h2>
            <p className="mt-4 max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed text-balance">
              Stop losing ideas across tabs and apps. WebMind centralizes what you save
              and turns it into answers you can trust.
            </p>
          </div>

          <div className="mt-14 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {landingFeatures.map((feature, idx) => (
              <FeatureCard key={feature.title} feature={feature} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── SIMPLE WORKFLOW ───────────────────────── */}
      <section id="how-it-works" className="relative z-20 bg-black py-24 md:py-32 border-t border-zinc-900 overflow-hidden">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 flex flex-col items-center text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              SIMPLE WORKFLOW
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight font-sans">
              Three steps to clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {howItWorksSteps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-8 text-left transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/90"
              >
                <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/80 font-mono text-sm text-zinc-200 font-semibold">
                  {item.step}
                </span>
                <h3 className="mb-2 text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── READY TO REMEMBER (CTA) ───────────────────────── */}
      <section className="relative z-20 bg-black py-16 md:py-24 border-t border-zinc-900">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-950 px-8 py-16 text-center sm:px-12 shadow-2xl">
            {/* Subtle white radial glow */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none -z-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,255,255,0.06), transparent 70%)",
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight font-sans">
                Ready to remember everything?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-zinc-400">
                Start free. No credit card required.
              </p>
              <button
                type="button"
                onClick={goPrimary}
                className="mt-8 cursor-pointer select-none inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-bold text-sm bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.15)] hover:shadow-[0_0_32px_rgba(255,255,255,0.25)] hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {isLoggedIn ? "Open Dashboard" : "Get Started Free"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
