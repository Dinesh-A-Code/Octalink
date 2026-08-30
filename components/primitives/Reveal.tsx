"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION, registerGsap } from "@/lib/gsap/gsapConfig";
import { getMotionTier, motionFor, START, TOGGLE } from "@/lib/motion/tier";
import { cn } from "@/lib/utils/cn";

/**
 * Generic scroll entrance, and the smallest unit of the site's motion
 * language. Content is visible by default and only hidden once GSAP has
 * taken ownership, so a JS failure never blanks the page.
 *
 * Distance, duration and stagger all come from the device's motion tier —
 * a phone gets a shorter, quicker version of the same move, not a different
 * animation.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y,
  as: Tag = "div",
  stagger,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Override the tier's travel distance. Rarely needed. */
  y?: number;
  as?: "div" | "li" | "span";
  /** Animate direct children in sequence instead of the wrapper as a whole. */
  stagger?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const tier = getMotionTier();
      if (tier === "none" || !ref.current) return;

      const m = motionFor(tier);
      const targets = stagger
        ? Array.from(ref.current.children)
        : [ref.current];

      gsap.fromTo(
        targets,
        { y: y ?? m.distance, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: m.duration,
          ease: MOTION.ease,
          delay,
          stagger: stagger ? m.stagger : 0,
          scrollTrigger: {
            trigger: ref.current,
            start: START,
            toggleActions: TOGGLE,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={cn("will-reveal", className)}>
      {children}
    </Tag>
  );
}
