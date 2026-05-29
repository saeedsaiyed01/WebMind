import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  withDivider?: boolean;
};

export function PageSection({
  id,
  children,
  className,
  containerClassName,
  withDivider = true,
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn("wm-section relative z-20 bg-black overflow-hidden scroll-mt-24", className)}
    >
      {withDivider && <div className="wm-section-divider" aria-hidden />}
      <div className={cn("wm-container relative z-10", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
