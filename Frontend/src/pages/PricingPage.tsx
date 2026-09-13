import { Check, CreditCard, Flame, Globe, MessageSquare, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SEO from "../components/SEO";
import NewNavbar from "../components/ui/NewNavbar";
import { PageSection } from "../components/ui/PageSection";
import { SectionBadge } from "../components/ui/SectionBadge";
import { SiteFooter } from "../components/ui/SiteFooter";
import { GlowOrb, Reveal, Stagger, StaggerItem } from "../components/ui/motion";
import { cn } from "@/lib/utils";

const handlePayment = async (plan: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }
    const API_BASE =
      import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const response = await fetch(`${API_BASE}/api/v1/create-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ plan: plan.toLowerCase() }),
    });
    const data = await response.json();
    if (response.ok) {
      window.location.href = data.checkout_url;
    } else {
      console.error("Payment creation failed:", data.error);
      toast.error("Failed to create payment session. Please try again.");
    }
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("An error occurred. Please try again.");
  }
};

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "WebMind",
  description: "AI-searchable personal knowledge base. Store tweets, notes, PDFs, and more.",
  url: "https://webmind.space",
  offers: [
    { "@type": "Offer", name: "Free Plan", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    { "@type": "Offer", name: "Pro Plan", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  ],
};

type Plan = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  monthly: string;
  annually: string;
  suffix?: string;
  features: string[];
  ctaLabel: string;
  onCta: () => void;
  highlighted?: boolean;
};

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);

  const plans: Plan[] = [
    {
      icon: Flame,
      title: "Free",
      subtitle: "Best for personal use",
      monthly: "$0",
      annually: "$0",
      features: ["Up to 100 documents", "Basic AI insights", "Community support", "Standard search", "20 AI credits"],
      ctaLabel: "Get Started",
      onCta: () => navigate("/signup"),
    },
    {
      icon: MessageSquare,
      title: "Pro",
      subtitle: "Most popular",
      monthly: "$8",
      annually: "$6",
      suffix: "/ month",
      features: ["Unlimited documents", "Advanced AI insights", "Priority support", "Advanced search & filters", "Custom integrations"],
      ctaLabel: "Upgrade to Pro",
      onCta: () => handlePayment("Pro"),
      highlighted: true,
    },
    {
      icon: Globe,
      title: "Premium",
      subtitle: "For power users",
      monthly: "$16",
      annually: "$13",
      suffix: "/ month",
      features: ["Everything in Pro", "Real-time collaboration", "API access", "White-label options", "Dedicated account manager"],
      ctaLabel: "Go Premium",
      onCta: () => handlePayment("Premium"),
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
      <SEO
        title="Pricing — WebMind"
        description="Simple, transparent pricing for WebMind. Start free and upgrade when you're ready."
        url="https://webmind.space/pricing"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }} />
      <NewNavbar variant="landing" />

      <section className="relative isolate overflow-hidden pt-36 pb-20 md:pt-44">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 grid-overlay grid-overlay-fade opacity-30 dark:opacity-20" />
          <GlowOrb className="left-1/2 top-[-6rem] -translate-x-1/2" size={560} intensity={0.35} />
        </div>
        <div className="wm-container flex flex-col items-center gap-5 text-center">
          <Reveal>
            <SectionBadge icon={CreditCard} label="Pricing" />
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-display mx-auto max-w-3xl text-gradient-soft text-balance">
              Choose the plan that fits your workflow
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-body-muted text-balance">
              Start free and upgrade when you need more documents, credits, and AI power.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-border bg-background/60 p-1 backdrop-blur">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={cn(
                  "rounded-full px-5 py-2 text-caption font-medium transition-all",
                  !annual ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2 text-caption font-medium transition-all",
                  annual ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Annually
                <span className={cn("rounded-full px-1.5 py-0.5 text-[0.625rem]", annual ? "bg-background/20" : "bg-gold/15 text-gold")}>
                  -25%
                </span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <PageSection className="pt-0" containerClassName="max-w-6xl" withDivider={false}>
        <Stagger stagger={0.1} className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <StaggerItem key={plan.title} className="h-full">
              <PricingCard plan={plan} annual={annual} />
            </StaggerItem>
          ))}
        </Stagger>
      </PageSection>

      <SiteFooter />
    </div>
  );
};

function PricingCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const Icon = plan.icon;
  const price = annual ? plan.annually : plan.monthly;
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300",
        plan.highlighted
          ? "border-gold/40 bg-card shadow-lift md:-translate-y-2"
          : "card-aurum"
      )}
    >
      {plan.highlighted && (
        <div aria-hidden className="absolute -top-px left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-b-full bg-gradient-to-b from-gold-soft to-gold px-3 py-1 text-[0.6875rem] font-semibold text-gold-foreground shadow-[0_4px_14px_-4px_hsl(var(--gold)/0.7)]">
            <Sparkles className="h-3 w-3" /> Most popular
          </span>
        </div>
      )}
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/60">
        <Icon className={cn("h-6 w-6", plan.highlighted ? "text-gold" : "text-muted-foreground")} />
      </div>
      <h3 className="text-heading mb-1">{plan.title}</h3>
      <p className="text-caption text-muted-foreground mb-6">{plan.subtitle}</p>

      <div className="mb-8 flex items-baseline gap-1">
        <span className="font-display text-5xl tracking-tight text-foreground">{price}</span>
        {plan.suffix && <span className="text-caption text-muted-foreground">{plan.suffix}</span>}
      </div>
      <div className="wm-divider mb-8" />

      <div className="flex-grow">
        <p className="text-overline mb-4">What you get</p>
        <ul className="space-y-3">
          {plan.features.map((item) => (
            <li key={item} className="flex items-center gap-3 text-caption text-muted-foreground">
              <Check className={cn("h-4 w-4 shrink-0", plan.highlighted ? "text-gold" : "text-foreground/70")} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={plan.onCta}
        className={cn(
          "mt-8 w-full rounded-full py-3 text-caption font-semibold transition-all duration-200 active:scale-95",
          plan.highlighted
            ? "bg-gradient-to-b from-gold-soft to-gold text-gold-foreground shadow-[0_8px_24px_-8px_hsl(var(--gold)/0.7)] hover:-translate-y-0.5"
            : "border border-border bg-background/60 text-foreground hover:border-gold/40 hover:-translate-y-0.5"
        )}
      >
        {plan.ctaLabel}
      </button>
    </div>
  );
}

export default PricingPage;
