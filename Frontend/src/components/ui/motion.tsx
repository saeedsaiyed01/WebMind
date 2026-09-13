import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Reveal — fade up on scroll into view                                */
/* ------------------------------------------------------------------ */
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
  once = true,
}: RevealProps) {
  const MotionTag = motion(as as ElementType);
  const reduce = useReducedMotion();
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger container + item                                           */
/* ------------------------------------------------------------------ */
export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
}) {
  const MotionTag = motion(as as ElementType);
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  y = 20,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: ElementType;
}) {
  const MotionTag = motion(as as ElementType);
  const reduce = useReducedMotion();
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* TextReveal — word-by-word fade up                                  */
/* ------------------------------------------------------------------ */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <motion.span
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: reduce ? 0 : "0.5em" },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Floating — gentle continuous float                                 */
/* ------------------------------------------------------------------ */
export function Floating({
  children,
  className,
  duration = 6,
  y = -10,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      animate={{ y: [0, y, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* GlowOrb — radial gold glow blob                                    */
/* ------------------------------------------------------------------ */
export function GlowOrb({
  className,
  size = 480,
  intensity = 0.5,
}: {
  className?: string;
  size?: number;
  intensity?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, hsl(var(--gold) / ${intensity}) 0%, transparent 70%)`,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* OrbitRings — decorative concentric dashed rings with node dots     */
/* ------------------------------------------------------------------ */
export function OrbitRings({
  className,
  rings = 3,
  base = 180,
  step = 90,
}: {
  className?: string;
  rings?: number;
  base?: number;
  step?: number;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)}>
      {Array.from({ length: rings }).map((_, i) => {
        const size = base + i * step;
        return (
          <div
            key={i}
            className={cn(
              "absolute rounded-full border border-dashed",
              i % 2 === 0 ? "animate-spin-slow" : "animate-spin-reverse-slow"
            )}
            style={{
              width: size,
              height: size,
              left: -size / 2,
              top: -size / 2,
              borderColor: "hsl(var(--gold) / 0.18)",
            }}
          >
            <span
              className="absolute h-1.5 w-1.5 rounded-full bg-gold"
              style={{ top: -3, left: size / 2 - 3 }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MagneticButton — pointer-following magnetic hover                 */
/* ------------------------------------------------------------------ */
export function MagneticButton({
  children,
  className,
  strength = 0.25,
  ...props
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart">) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: reduce ? 0 : sx, y: reduce ? 0 : sy }}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* PageTransition — wraps page content for route transitions          */
/* ------------------------------------------------------------------ */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* InView helper (returns boolean)                                    */
/* ------------------------------------------------------------------ */
export function useIsInView(ref: React.RefObject<Element>) {
  return useInView(ref, { once: true, margin: "-80px" });
}
