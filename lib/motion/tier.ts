import { prefersReducedMotion } from "@/lib/utils/motion";

/**
 * One decision about how much motion this device should get, made in one
 * place so every section scales the same way instead of each component
 * inventing its own breakpoints.
 */
export type MotionTier = "none" | "minimal" | "reduced" | "full";

export interface TierMotion {
  /** Travel in px for an entrance. */
  distance: number;
  duration: number;
  stagger: number;
  /** The section settle — off on phones, where it costs more than it adds. */
  settle: boolean;
  /** Scroll-linked effects (parallax, scrubs). Desktop only. */
  parallax: boolean;
  /** Pointer-following. Never on touch. */
  pointer: boolean;
}

const TIERS: Record<MotionTier, TierMotion> = {
  none: {
    distance: 0,
    duration: 0,
    stagger: 0,
    settle: false,
    parallax: false,
    pointer: false,
  },
  minimal: {
    distance: 16,
    duration: 0.55,
    stagger: 0.05,
    settle: false,
    parallax: false,
    pointer: false,
  },
  reduced: {
    distance: 26,
    duration: 0.72,
    stagger: 0.06,
    settle: true,
    parallax: false,
    pointer: false,
  },
  full: {
    distance: 38,
    duration: 0.9,
    stagger: 0.08,
    settle: true,
    parallax: true,
    pointer: true,
  },
};

/**
 * Deliberately uncached: a tablet rotating into desktop width should get the
 * desktop treatment on the next mount. The two media queries are cheap.
 */
export function getMotionTier(): MotionTier {
  if (typeof window === "undefined") return "full";
  if (prefersReducedMotion()) return "none";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse || window.innerWidth < 768) return "minimal";
  if (window.innerWidth < 1280) return "reduced";
  return "full";
}

export function motionFor(tier: MotionTier = getMotionTier()): TierMotion {
  return TIERS[tier];
}

/**
 * Entrances play on the way down and reverse on the way back up, so the page
 * behaves the same however it is traversed — no one-shot state to get stuck in.
 */
export const TOGGLE = "play none none reverse" as const;

/** Entrances begin before a section is fully on screen, not after. */
export const START = "top 88%" as const;
