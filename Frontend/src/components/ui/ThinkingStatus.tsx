import { cn } from "@/lib/utils";
import type { ChatPhase } from "@/lib/chatStream";
import { ThinkingOrb, type OrbState } from "thinking-orbs";

const PHASES: Record<ChatPhase, { state: OrbState; label: string }> = {
  working: { state: "working", label: "Working…" },
  searching: { state: "searching", label: "Searching…" },
  solving: { state: "solving", label: "Planning…" },
};

export type ThinkingStatusSize = 20 | 32 | 64;

const SIZE_CLASS: Record<ThinkingStatusSize, string> = {
  20: "h-7 gap-1.5 py-0 pl-0.5 pr-3",
  32: "h-9 gap-1.5 py-0 pl-0.5 pr-3.5",
  64: "h-16 gap-2 py-0 pl-1 pr-5",
};

interface ThinkingStatusProps {
  phase: ChatPhase;
  /** Vertical size of the pill. 20 inline, 32 compact, 64 chat-avatar. */
  size?: ThinkingStatusSize;
  label?: string;
  className?: string;
}

export function ThinkingStatus({ phase, size = 32, label, className }: ThinkingStatusProps) {
  const config = PHASES[phase];
  const text = label ?? config.label;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "glass inline-flex items-center rounded-full",
        SIZE_CLASS[size],
        className,
      )}
    >
      <ThinkingOrb state={config.state} size={size} theme="auto" aria-hidden="true" />
      <span className={cn("font-medium leading-none text-muted-foreground", size === 64 ? "text-sm" : "text-xs")}>
        {text}
      </span>
    </div>
  );
}
