import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/** One motion language — durations and eases live here, not in components. */
export const MOTION = {
  fast: 0.32,
  base: 0.8,
  slow: 1.2,
  ease: "power3.out",
  easeInOut: "power2.inOut",
  stagger: 0.08,
} as const;

/** Standard entrance: a mask-clipped rise. Used by every reveal on the site. */
export const REVEAL_FROM = {
  yPercent: 110,
  opacity: 0,
} as const;

let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: MOTION.ease, duration: MOTION.base });
  registered = true;
}

export { gsap, ScrollTrigger, useGSAP };
