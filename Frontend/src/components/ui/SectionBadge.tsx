import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type SectionBadgeProps = {
  icon: LucideIcon;
  label: string;
  className?: string;
  iconClassName?: string;
};

export function SectionBadge({
  icon: Icon,
  label,
  className,
  iconClassName,
}: SectionBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm shadow-lg shadow-black/20",
        className
      )}
    >
      <Icon className={cn("w-3.5 h-3.5 text-amber-400/90", iconClassName)} />
      <span className="text-overline text-zinc-300">{label}</span>
    </div>
  );
}
