import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { FeatureCard } from "../components/ui/FeatureCard";
import { LampContainer } from "../components/ui/lamp.tsx";
import NewNavbar from "../components/ui/NewNavbar.tsx";
import { PageSection } from "../components/ui/PageSection";
import { SectionBadge } from "../components/ui/SectionBadge";
import { SiteFooter } from "../components/ui/SiteFooter";
import { howItWorksSteps, landingFeatures } from "../data/landingFeatures";

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WebMind",
  url: "https://webmind.buzz",
  description:
    "Store tweets, notes, PDFs, and more into an AI-searchable personal knowledge base.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

function scrollToFeatures() {
  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const goPrimary = () =>
    isLoggedIn ? navigate("/dashboard") : navigate("/signup");

  return (
    <div className="relative w-full overflow-x-hidden bg-black dark scroll-smooth font-sans">
      <SEO
        title="WebMind — All Your Digital Memory Unleashed"
        description="Store tweets, notes, PDFs, and more into an AI-searchable personal knowledge base. Recall anything instantly with AI."
        url="https://webmind.buzz"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <NewNavbar variant="landing" />

      <LampContainer>
        <div className="wm-container flex flex-col items-center text-center pt-4 md:pt-0">
          <motion.h1
            initial={{ opacity: 0.5, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-0 md:mt-[-4rem] text-display-hero max-w-4xl"
          >
            All Your Digital <br className="hidden sm:block" />
            Memory Unleashed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.5, ease: "easeOut" }}
            className="mt-5 text-body-lg max-w-prose mx-auto"
          >
            WebMind stores every tweet, note, and document—transforming your
            content into a powerful, queryable personal knowledge base.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5, ease: "easeOut" }}
            className="mt-10 flex gap-4 items-center flex-col sm:flex-row"
          >
            <button type="button" onClick={goPrimary} className="wm-btn-primary">
              {isLoggedIn ? "Go to Dashboard" : "Try Now"}
            </button>
            <button
              type="button"
              onClick={scrollToFeatures}
              className="wm-btn-secondary"
            >
              Learn More
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 64, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.42, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 md:mt-20 w-full relative z-20"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-zinc-700/30 via-zinc-600/20 to-zinc-700/30 rounded-2xl blur-xl opacity-50" />
            <div className="relative rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl ring-1 ring-white/5">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/80">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                <span className="ml-3 flex-1 text-caption text-zinc-500 text-left truncate">
                  webmind.buzz/dashboard
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10" />
                <img
                  src="/newheropage.png"
                  alt="WebMind dashboard preview"
                  className="w-full h-auto object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            onClick={scrollToFeatures}
            className="mt-10 text-caption text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Scroll to features"
          >
            Scroll to explore ↓
          </motion.button>
        </div>
      </LampContainer>

      <PageSection id="features" containerClassName="pt-8 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-prose mx-auto flex flex-col items-center gap-5"
        >
          <SectionBadge icon={Sparkles} label="How WebMind works" />
          <h2 className="text-display max-w-3xl">
            Your knowledge base, powered by AI
          </h2>
          <p className="text-body-muted max-w-xl">
            Import what you save online, organize it automatically, and ask
            questions that pull answers from your own content—not the open web.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 mt-14 md:mt-16 max-w-6xl mx-auto">
          {landingFeatures.map((feature, idx) => (
            <FeatureCard key={feature.title} feature={feature} index={idx} />
          ))}
        </div>
      </PageSection>

      <PageSection id="how-it-works" withDivider>
        <div className="text-center max-w-prose mx-auto mb-14">
          <p className="text-overline mb-3">Simple workflow</p>
          <h2 className="text-display text-3xl sm:text-4xl">Three steps to clarity</h2>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {howItWorksSteps.map((item) => (
            <li
              key={item.step}
              className="relative p-8 rounded-2xl border border-zinc-800/60 bg-zinc-950/80 text-left"
            >
              <span className="text-overline text-zinc-600 block mb-4">
                {item.step}
              </span>
              <h3 className="text-heading text-xl mb-2">{item.title}</h3>
              <p className="text-body-muted text-sm">{item.description}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection containerClassName="py-8">
        <div className="max-w-2xl mx-auto text-center rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/80 to-zinc-950 px-8 py-14 sm:px-12">
          <h2 className="text-display text-3xl sm:text-4xl mb-4">
            Ready to remember everything?
          </h2>
          <p className="text-body-muted mb-8">
            Start free. No credit card required.
          </p>
          <button type="button" onClick={goPrimary} className="wm-btn-primary">
            {isLoggedIn ? "Open Dashboard" : "Get Started Free"}
          </button>
        </div>
      </PageSection>

      <SiteFooter />
    </div>
  );
}
