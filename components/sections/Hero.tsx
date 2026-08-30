"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION, registerGsap } from "@/lib/gsap/gsapConfig";
import { prefersReducedMotion } from "@/lib/utils/motion";
import { beginSceneReveal, onPreloaderDone } from "@/lib/motion/heroCues";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { Container } from "@/components/primitives/Container";
import { HeroVisual } from "@/components/sections/HeroVisual";

/** Beat sheet, in seconds from the moment the preloader clears. */
const CUE = {
  rule: 0,
  eyebrow: 0.1,
  headline: 0.28,
  mark: 0.62,
  copy: 0.9,
  cta: 1.06,
  scroll: 1.4,
} as const;

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();

      if (prefersReducedMotion()) {
        // Nothing animates, but the mark still needs its ramp resolved so it
        // renders at full weight if it is on screen at all.
        beginSceneReveal();
        return;
      }

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: MOTION.ease },
      });

      timeline
        .fromTo(
          ".hero-rule",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power2.out" },
          CUE.rule,
        )
        .fromTo(
          ".hero-eyebrow",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7 },
          CUE.eyebrow,
        )
        // The headline runs its own line-by-line reveal; this timeline just
        // leaves room for it and picks up on the other side.
        .call(beginSceneReveal, undefined, CUE.mark)
        .fromTo(
          ".hero-copy",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9 },
          CUE.copy,
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 },
          CUE.cta,
        )
        .fromTo(
          ".hero-scroll",
          { opacity: 0 },
          { opacity: 1, duration: 0.7 },
          CUE.scroll,
        );

      // Play once the preloader is out of the way, with a safety net so a
      // preloader that never reports cannot strand the hero hidden.
      const stop = onPreloaderDone(() => timeline.play());
      const fallback = window.setTimeout(() => timeline.play(), 3200);

      return () => {
        stop();
        window.clearTimeout(fallback);
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end pb-14 pt-28 md:pb-20 md:pt-32"
    >
      <HeroVisual />

      <Container className="relative z-10">
        <div className="flex items-center gap-4">
          <span className="hero-rule h-px w-10 origin-left bg-line-strong" />
          <span className="hero-eyebrow eyebrow">Independent digital studio</span>
        </div>

        <SplitReveal
          as="h1"
          trigger={false}
          delay={CUE.headline}
          waitFor={onPreloaderDone}
          className="mt-6 max-w-[13ch] text-display md:mt-8 lg:max-w-[12ch]"
        >
          We build digital experiences for ambitious businesses.
        </SplitReveal>

        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
          <p className="hero-copy max-w-sm text-lead leading-relaxed text-muted md:max-w-md">
            A two-person studio building landing pages, websites and
            application software — designed and engineered end to end.
          </p>

          {/* The entrance animates these wrappers, leaving the magnetic
              transform on the button itself free of conflict. */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <span className="hero-cta inline-block">
              <MagneticButton href="#contact">Start a project</MagneticButton>
            </span>
            <span className="hero-cta inline-block">
              <MagneticButton href="#work" variant="outline">
                View our work
              </MagneticButton>
            </span>
          </div>
        </div>
      </Container>

      <div
        aria-hidden="true"
        className="hero-scroll pointer-events-none absolute bottom-8 right-[var(--gutter)] z-10 hidden items-center gap-3 lg:flex"
      >
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-faint">
          Scroll
        </span>
        <span className="h-10 w-px bg-line-strong" />
      </div>
    </div>
  );
}
