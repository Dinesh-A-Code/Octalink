"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION, registerGsap } from "@/lib/gsap/gsapConfig";
import { getMotionTier, motionFor, TOGGLE } from "@/lib/motion/tier";

/**
 * Section-level choreography, applied once by `Section` rather than rebuilt
 * inside each section.
 *
 * It does two things:
 *
 *  1. Header sequence — eyebrow, heading, then intro, driven off one
 *     ScrollTrigger. Sections opt in by tagging elements `data-motion`;
 *     those attributes are plain markup, so the sections themselves stay
 *     server components.
 *
 *  2. The settle — as the section reaches reading position it comes up the
 *     last one-and-a-half percent and to full opacity. It is an arrival,
 *     not a bounce, and it deliberately does not reverse: once a section is
 *     established it stays established.
 */
export function SectionMotion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      const tier = getMotionTier();
      if (!el || tier === "none") return;

      const m = motionFor(tier);
      const q = gsap.utils.selector(el);

      const eyebrow = q('[data-motion="eyebrow"]');
      const heading = q('[data-motion="heading"]');
      const intro = q('[data-motion="intro"]');

      if (eyebrow.length || heading.length || intro.length) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 86%", toggleActions: TOGGLE },
          defaults: { ease: MOTION.ease, duration: m.duration },
        });

        if (eyebrow.length) {
          tl.fromTo(
            eyebrow,
            { y: m.distance * 0.4, opacity: 0 },
            { y: 0, opacity: 1 },
            0,
          );
        }
        if (heading.length) {
          tl.fromTo(
            heading,
            { y: m.distance, opacity: 0 },
            { y: 0, opacity: 1 },
            0.08,
          );
        }
        if (intro.length) {
          tl.fromTo(
            intro,
            { y: m.distance * 0.6, opacity: 0 },
            { y: 0, opacity: 1 },
            0.22,
          );
        }
      }

      if (!m.settle) return;

      gsap.fromTo(
        el,
        { scale: 0.99, opacity: 0.94 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
