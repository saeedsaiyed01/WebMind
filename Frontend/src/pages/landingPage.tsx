import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { FeatureCard } from "../components/ui/FeatureCard";
import { GlowOrb, OrbitRings, Reveal, Stagger, StaggerItem, TextReveal } from "../components/ui/motion";
import NewNavbar from "../components/ui/NewNavbar";
import { PageSection } from "../components/ui/PageSection";
import { SectionBadge } from "../components/ui/SectionBadge";
import { SiteFooter } from "../components/ui/SiteFooter";
import { howItWorksSteps, landingFeatures } from "../data/landingFeatures";

const EASE = [0.22, 1, 0.36, 1] as const;

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

const testimonials = [
  {
    quote:
      "WebMind replaced three apps for me. I dump tweets, PDFs, and random notes in, and the answers come back grounded in my own stuff.",
    name: "Aarav Mehta",
    title: "Indie Maker",
    initials: "AM",
  },
  {
    quote:
      "It feels like having a second brain that actually remembers. The AI organization is shockingly good.",
    name: "Sofia Lin",
    title: "Product Researcher",
    initials: "SL",
  },
  {
    quote:
      "I stopped losing links. Asking my own library a question is the feature I didn't know I needed.",
    name: "Daniel Okafor",
    title: "Founder",
    initials: "DO",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const goPrimary = () => navigate(isLoggedIn ? "/dashboard" : "/signup");
  const scrollToFeatures = () =>
    document.getElementById("features")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });

  return (
    <div className="relative w-full overflow-x-hidden bg-background text-foreground scroll-smooth font-sans">
      <SEO
        title="WebMind — All Your Digital Memory Unleashed"
        description="Store tweets, notes, PDFs, and more into an AI-searchable personal knowledge base. Recall anything instantly with AI."
        url="https://webmind.space"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
      <NewNavbar variant="landing" />

      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative isolate overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
        {/* background layers */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-overlay grid-overlay-fade opacity-[0.4] dark:opacity-30" />
          <div className="absolute inset-0 grain opacity-[0.04] dark:opacity-[0.06]" />
          <GlowOrb className="left-1/2 top-[-6rem] -translate-x-1/2" size={620} intensity={0.45} />
          <GlowOrb className="right-[-8rem] top-40" size={360} intensity={0.22} />
          <OrbitRings className="left-1/2 top-32" rings={2} base={420} step={140} />
        </div>

        <div className="wm-container flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="wm-badge">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Your second brain, now searchable
            </span>
          </motion.div>

          <h1 className="mt-7 max-w-4xl text-display-hero text-balance">
            <TextReveal text="All Your Digital" delay={0.05} />
            <br className="hidden sm:block" />
            <span className="text-gradient-gold">
              <TextReveal text="Memory Unleashed" delay={0.25} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55, ease: EASE }}
            className="mt-6 max-w-prose text-body-lg text-balance"
          >
            WebMind stores every tweet, note, and document — transforming scattered content
            into a powerful, queryable personal knowledge base.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.5, ease: EASE }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <button type="button" onClick={goPrimary} className="wm-btn-gold group">
              {isLoggedIn ? "Go to Dashboard" : "Try Now — it's free"}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <button type="button" onClick={scrollToFeatures} className="wm-btn-secondary">
              Learn More
            </button>
          </motion.div>

          {/* product preview */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.74, duration: 0.7, ease: EASE }}
            className="relative z-20 mt-16 w-full md:mt-20"
          >
            <div
              aria-hidden
              className="absolute -inset-3 rounded-3xl opacity-60 blur-2xl"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 0%, hsl(var(--gold) / 0.25), transparent 70%)",
              }}
            />
            <div className="relative overflow-hidden rounded-2xl border border-border glass-strong shadow-lift">
              <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-3 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                <span className="ml-3 flex-1 truncate text-left font-mono text-[0.75rem] text-muted-foreground">
                  webmind.space/dashboard
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[0.6875rem] text-muted-foreground">
                  <Star className="h-3 w-3 text-gold" /> Live preview
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                <img
                  src="/newheropage.png"
                  alt="WebMind dashboard preview"
                  className="h-auto w-full object-cover"
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
            transition={{ delay: 1, duration: 0.4 }}
            onClick={scrollToFeatures}
            className="mt-10 inline-flex items-center gap-1.5 text-caption text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll to features"
          >
            Scroll to explore
            <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
          </motion.button>
        </div>
      </section>

      {/* ───────────────────────── FEATURES ───────────────────────── */}
      <PageSection id="features" containerClassName="pt-4 md:pt-8 max-w-6xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <Reveal>
            <SectionBadge icon={Sparkles} label="Features" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display mx-auto max-w-3xl text-balance text-gradient-soft">
              Built for the way you actually work
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-body-muted text-balance">
              Stop losing ideas across tabs and apps. WebMind centralizes what you save
              and turns it into answers you can trust.
            </p>
          </Reveal>
        </div>

        <Stagger
          stagger={0.08}
          className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-16"
        >
          {landingFeatures.map((feature, idx) => (
            <StaggerItem key={feature.title} className="h-full">
              <FeatureCard feature={feature} index={idx} />
            </StaggerItem>
          ))}
        </Stagger>
      </PageSection>

      {/* ───────────────────────── HOW IT WORKS ───────────────────────── */}
      <PageSection id="how-it-works" withDivider>
        <div className="mb-14 flex flex-col items-center gap-4 text-center">
          <Reveal>
            <span className="text-overline">Simple workflow</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-gradient-soft">Three steps to clarity</h2>
          </Reveal>
        </div>
        <Stagger stagger={0.12} className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {howItWorksSteps.map((item) => (
            <StaggerItem key={item.step}>
              <li className="card-aurum relative h-full list-none p-8 text-left">
                <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-mono text-sm text-gold">
                  {item.step}
                </span>
                <h3 className="text-heading mb-2">{item.title}</h3>
                <p className="text-body-muted">{item.description}</p>
              </li>
            </StaggerItem>
          ))}
        </Stagger>
      </PageSection>

      {/* ───────────────────────── TESTIMONIALS ───────────────────────── */}
      <PageSection withDivider>
        <div className="mb-14 flex flex-col items-center gap-4 text-center">
          <Reveal>
            <SectionBadge icon={Star} label="Loved by curious minds" />
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display mx-auto max-w-3xl text-gradient-soft text-balance">
              Trusted by people reaching new heights
            </h2>
          </Reveal>
        </div>
        <Stagger stagger={0.1} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name} className="h-full">
              <figure className="card-aurum flex h-full flex-col gap-6 p-7">
                <blockquote className="text-body leading-relaxed text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-gold-soft to-gold text-sm font-semibold text-gold-foreground">
                    {t.initials}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{t.name}</span>
                    <span className="text-caption text-muted-foreground">{t.title}</span>
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </PageSection>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <PageSection containerClassName="py-8">
        <Reveal className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border px-8 py-14 text-center sm:px-12">
          <div aria-hidden className="absolute inset-0 -z-10">
            <GlowOrb className="left-1/2 top-[-8rem] -translate-x-1/2" size={420} intensity={0.4} />
            <div className="absolute inset-0 grid-overlay grid-overlay-fade opacity-30" />
          </div>
          <h2 className="text-display text-gradient-soft text-balance">
            Ready to remember everything?
          </h2>
          <p className="mt-4 text-body-lg text-balance">Start free. No credit card required.</p>
          <button type="button" onClick={goPrimary} className="wm-btn-gold mt-8 group">
            {isLoggedIn ? "Open Dashboard" : "Get Started Free"}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </Reveal>
      </PageSection>

      <SiteFooter />
    </div>
  );
}
