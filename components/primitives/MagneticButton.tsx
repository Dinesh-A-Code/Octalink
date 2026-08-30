"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap/gsapConfig";
import { prefersReducedMotion } from "@/lib/utils/motion";
import { cn } from "@/lib/utils/cn";

type Variant = "solid" | "outline" | "ghost";

const VARIANTS: Record<Variant, string> = {
  solid: "bg-fg text-bg hover:bg-accent hover:text-accent-fg",
  outline: "border border-line-strong text-fg hover:border-accent",
  ghost: "text-fg",
};

/**
 * CTA primitive. Magnetic pull is imperative (quickTo) — no state, no
 * re-renders, and it switches off entirely for coarse pointers and
 * reduced-motion users.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "solid",
  className,
  type = "button",
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const wrap = wrapRef.current;
      const inner = innerRef.current;
      if (!wrap || !inner) return;
      if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches)
        return;

      const xTo = gsap.quickTo(wrap, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(wrap, "y", { duration: 0.5, ease: "power3.out" });
      const ixTo = gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" });
      const iyTo = gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.28);
        yTo(dy * 0.4);
        ixTo(dx * 0.12);
        iyTo(dy * 0.16);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
        ixTo(0);
        iyTo(0);
      };

      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
      return () => {
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: wrapRef },
  );

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-3",
    "px-7 py-4 text-[0.8125rem] font-medium uppercase tracking-[0.14em]",
    "rounded-sharp transition-colors duration-300",
    "disabled:pointer-events-none disabled:opacity-40",
    VARIANTS[variant],
    className,
  );

  const content = <span ref={innerRef} className="inline-block">{children}</span>;

  return (
    <div ref={wrapRef} className="inline-block will-change-transform">
      {href ? (
        <a href={href} className={classes} aria-label={ariaLabel}>
          {content}
        </a>
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={classes}
          aria-label={ariaLabel}
        >
          {content}
        </button>
      )}
    </div>
  );
}
