import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

type SectionHeaderProps = {
  badge?: { icon?: LucideIcon; label: string };
  title: string;
  titleClassName?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeader({
  badge,
  title,
  titleClassName,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        isCenter ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {badge && (
        <Reveal>
          <span className="wm-badge">
            {badge.icon && <badge.icon className="h-3.5 w-3.5 text-gold" />}
            {badge.label}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2
          className={cn(
            "text-display text-balance text-gradient-soft",
            isCenter && "mx-auto max-w-3xl",
            titleClassName
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "text-body-lg max-w-2xl text-balance",
              isCenter && "mx-auto"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
