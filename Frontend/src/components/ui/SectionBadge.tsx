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
    <div className={cn("wm-badge", className)}>
      <Icon className={cn("w-3.5 h-3.5 text-gold", iconClassName)} />
      <span>{label}</span>
    </div>
  );
}
