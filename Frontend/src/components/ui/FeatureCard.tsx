import { cn } from "@/lib/utils";
import type { LandingFeature } from "@/data/landingFeatures";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  feature: LandingFeature;
  index: number;
};

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon as LucideIcon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "group relative flex flex-col items-center text-center",
        "min-h-[280px] sm:min-h-[300px] p-6 sm:p-8 rounded-2xl wm-card",
        "hover:border-zinc-600/70 transition-all duration-300 overflow-hidden",
        "shadow-xl hover:shadow-2xl hover:shadow-zinc-900/50 hover:-translate-y-1"
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent opacity-60" />

      <div className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 pointer-events-none">
        <div className="absolute inset-0 rounded-full border-t border-l border-r border-b-0 border-zinc-700/40 scale-[0.5]" />
        <div className="absolute inset-0 rounded-full border-t border-l border-r border-b-0 border-zinc-700/30 scale-[0.7]" />
        <div className="absolute inset-0 rounded-full border-t border-l border-r border-b-0 border-zinc-700/20 scale-[0.9]" />
      </div>

      <div className="relative z-10 flex flex-col items-center flex-1 w-full gap-5 pt-2">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center shadow-inner group-hover:border-zinc-500/60 group-hover:bg-zinc-800/90 transition-all duration-300">
          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-400 group-hover:text-white transition-colors duration-300" />
        </div>

        <div className="flex flex-col gap-2 mt-auto w-full">
          <h3 className="text-heading text-base sm:text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors">
            {feature.title}
          </h3>
          <p className="text-caption text-zinc-500 group-hover:text-zinc-400 transition-colors max-w-[14rem] mx-auto">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
