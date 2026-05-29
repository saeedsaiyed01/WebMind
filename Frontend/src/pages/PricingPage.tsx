import { Check, CreditCard, Flame, Globe, MessageSquare } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SEO from "../components/SEO";
import NewNavbar from "../components/ui/NewNavbar";
import { PageSection } from "../components/ui/PageSection";
import { SectionBadge } from "../components/ui/SectionBadge";
import { SiteFooter } from "../components/ui/SiteFooter";

const handlePayment = async (plan: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const API_BASE =
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_BACKEND_URL ||
      "http://localhost:8000";
    const response = await fetch(`${API_BASE}/api/v1/create-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        plan: plan.toLowerCase(),
      }),
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
  description:
    "AI-searchable personal knowledge base. Store tweets, notes, PDFs, and more.",
  url: "https://webmind.buzz",
  offers: [
    {
      "@type": "Offer",
      name: "Free Plan",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      name: "Pro Plan",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  ],
};

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-zinc-800 overflow-x-hidden">
      <SEO
        title="Pricing — WebMind"
        description="Simple, transparent pricing for WebMind. Start free and upgrade when you're ready."
        url="https://webmind.buzz/pricing"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <NewNavbar variant="landing" />

      <PageSection
        className="pt-28 md:pt-32"
        containerClassName="max-w-6xl"
        withDivider={false}
      >
        <div className="text-center max-w-prose mx-auto mb-16 flex flex-col items-center gap-5">
          <SectionBadge
            icon={CreditCard}
            label="Pricing"
            iconClassName="text-zinc-400"
          />
          <h1 className="text-display">
            Choose the plan that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              fits your workflow
            </span>
          </h1>
          <p className="text-body-muted">
            Start free and upgrade when you need more documents, credits, and
            AI power.
          </p>

          <div className="flex items-center justify-center mt-2">
            <div className="p-1 rounded-full bg-zinc-900 border border-zinc-800 inline-flex">
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-zinc-800 text-white text-caption font-medium shadow-sm"
              >
                Monthly
              </button>
              <button
                type="button"
                className="px-6 py-2 rounded-full text-zinc-500 text-caption font-medium hover:text-zinc-300 transition-colors"
              >
                Annually
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <PricingCard
            icon={Flame}
            title="Free"
            subtitle="Best for personal use"
            price="FREE"
            features={[
              "Up to 100 documents",
              "Basic AI insights",
              "Community support",
              "Standard search",
              "20 AI credits",
            ]}
            ctaLabel="Get Started"
            onCta={() => navigate("/signup")}
            muted
          />

          <PricingCard
            icon={MessageSquare}
            title="Pro"
            subtitle="Most popular"
            price="$8"
            priceSuffix="/ month"
            features={[
              "Unlimited documents",
              "Advanced AI insights",
              "Priority support",
              "Advanced search & filters",
              "Custom integrations",
            ]}
            ctaLabel="Upgrade to Pro"
            onCta={() => handlePayment("Pro")}
            highlighted
          />

          <PricingCard
            icon={Globe}
            title="Premium"
            subtitle="For power users"
            price="$16"
            priceSuffix="/ month"
            features={[
              "Everything in Pro",
              "Real-time collaboration",
              "API access",
              "White-label options",
              "Dedicated account manager",
            ]}
            ctaLabel="Go Premium"
            onCta={() => handlePayment("Premium")}
            muted
          />
        </div>
      </PageSection>

      <SiteFooter />
    </div>
  );
};

type PricingCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  ctaLabel: string;
  onCta: () => void;
  highlighted?: boolean;
  muted?: boolean;
};

function PricingCard({
  icon: Icon,
  title,
  subtitle,
  price,
  priceSuffix,
  features,
  ctaLabel,
  onCta,
  highlighted,
  muted,
}: PricingCardProps) {
  return (
    <div
      className={
        highlighted
          ? "relative p-8 rounded-3xl wm-card border-zinc-600/60 flex flex-col h-full shadow-[0_0_40px_rgba(0,0,0,0.4)] md:scale-[1.02] z-10"
          : "relative p-8 rounded-3xl wm-card flex flex-col h-full hover:border-zinc-600/50 transition-colors"
      }
    >
      <div className="w-12 h-12 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-6">
        <Icon
          className={`w-6 h-6 ${highlighted ? "text-white" : "text-zinc-400"}`}
        />
      </div>
      <h3 className="text-heading text-xl font-medium mb-1">{title}</h3>
      <p className="text-caption text-zinc-500 mb-6">{subtitle}</p>

      <div className="flex items-baseline gap-1 mb-8">
        <span className="font-display text-4xl font-bold text-white">
          {price}
        </span>
        {priceSuffix && (
          <span className="text-caption text-zinc-500">{priceSuffix}</span>
        )}
      </div>
      <div className="h-px w-full bg-zinc-800/80 mb-8" />

      <div className="flex-grow">
        <p className="text-caption font-medium text-zinc-400 mb-4">
          What you get
        </p>
        <ul className="space-y-3">
          {features.map((item) => (
            <li
              key={item}
              className={`flex items-center gap-3 text-caption ${
                highlighted ? "text-zinc-300" : "text-zinc-500"
              }`}
            >
              <Check
                className={`w-4 h-4 shrink-0 ${
                  highlighted ? "text-white" : "text-zinc-600"
                }`}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onCta}
        className={
          highlighted
            ? "w-full mt-8 py-3 rounded-full bg-white text-black font-semibold text-caption hover:bg-zinc-200 transition-all"
            : `w-full mt-8 py-3 rounded-full border border-zinc-800 text-zinc-300 font-medium text-caption hover:bg-zinc-900 hover:text-white transition-all ${muted ? "" : ""}`
        }
      >
        {ctaLabel}
      </button>
    </div>
  );
}

export default PricingPage;
