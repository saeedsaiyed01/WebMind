import { cn } from "@/lib/utils";
import type { FeatureVisual, LandingFeature } from "@/data/landingFeatures";
import { motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  Check,
  FileText,
  Sparkles,
  StickyNote,
  Twitter,
} from "lucide-react";

type FeatureCardProps = {
  feature: LandingFeature;
  index: number;
};

function FeatureVisualPanel({ visual }: { visual: FeatureVisual }) {
  if (visual === "sources") {
    return (
      <div className="relative flex h-full items-center justify-center bg-zinc-950">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="relative z-10 flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900/90 px-2.5 py-2 shadow-2xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 ring-1 ring-sky-400/30">
            <Twitter className="h-3.5 w-3.5 text-sky-400" />
          </span>
          <span className="text-[10px] text-zinc-600">→</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 ring-1 ring-amber-400/30">
            <StickyNote className="h-3.5 w-3.5 text-amber-400" />
          </span>
          <span className="text-[10px] text-zinc-600">→</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 ring-1 ring-rose-400/30">
            <FileText className="h-3.5 w-3.5 text-rose-400" />
          </span>
        </div>
      </div>
    );
  }

  if (visual === "models") {
    const models = [
      { name: "gemini-2.5-flash", active: false },
      { name: "gpt-oss-120b", active: true },
      { name: "glm-4.5-air", active: false },
    ];
    return (
      <div className="relative flex h-full items-center justify-center bg-zinc-950 px-4">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(99,102,241,0.18), transparent 70%)",
          }}
        />
        <div className="relative z-10 w-full max-w-[188px] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
            <span className="text-[10px] font-medium text-zinc-500">models</span>
          </div>
          <div className="space-y-0.5 p-1.5">
            {models.map((m) => (
              <div
                key={m.name}
                className={cn(
                  "flex items-center justify-between rounded-md px-2.5 py-1.5 font-mono text-[10px]",
                  m.active
                    ? "bg-white text-zinc-950"
                    : "text-zinc-500"
                )}
              >
                <span className="truncate">{m.name}</span>
                {m.active && <Check className="h-3 w-3 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (visual === "network") {
    return (
      <div className="relative flex h-full items-center justify-center bg-zinc-950">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06), transparent 55%)",
          }}
        />
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {["Gemini", "GPT", "GLM", "Flash", "OSS", "Air"].map((label, i) => (
            <span
              key={label}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border text-[9px] font-semibold tracking-wide",
                i === 1
                  ? "border-white/20 bg-white text-zinc-950"
                  : "border-white/10 bg-zinc-900 text-zinc-400"
              )}
            >
              {label.slice(0, 3)}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // knowledge
  return (
    <div className="relative flex h-full items-center justify-center bg-zinc-950 px-4">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(16,185,129,0.12), transparent 60%)",
        }}
      />
      <div className="relative z-10 w-full max-w-[200px] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-3 shadow-2xl">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-zinc-950">
              <Brain className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-semibold text-zinc-100">Library</span>
          </div>
          <Sparkles className="h-3 w-3 text-zinc-500" />
        </div>
        <div className="space-y-2 border-t border-white/5 pt-2.5 text-[10px]">
          <div className="flex justify-between gap-2">
            <span className="text-zinc-500">Source</span>
            <span className="font-mono text-zinc-300">DOC-07</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-zinc-500">Entry</span>
            <span className="max-w-[110px] truncate text-right text-zinc-200">
              Q3 research notes
            </span>
          </div>
          <div className="pt-0.5">
            <span className="inline-flex rounded-md bg-emerald-500/15 px-1.5 py-0.5 font-medium text-emerald-400 ring-1 ring-emerald-500/25">
              indexed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-white/10 bg-zinc-950/80",
        "transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-zinc-950"
      )}
    >
      <div className="relative h-[168px] shrink-0 border-b border-white/10">
        <FeatureVisualPanel visual={feature.visual} />
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-2 px-5 py-5">
        <h3 className="text-[15px] font-semibold tracking-tight text-zinc-50">
          {feature.title}
        </h3>
        <p className="text-[13px] leading-relaxed text-zinc-400">
          {feature.description}
        </p>
      </div>
    </motion.article>
  );
}
