"use client";

import { useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap, useGSAP, MOTION, registerGsap } from "@/lib/gsap/gsapConfig";
import { prefersReducedMotion } from "@/lib/utils/motion";
import { cn } from "@/lib/utils/cn";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

/**
 * Line-by-line masked rise for editorial headlines. Text is real DOM text
 * server-side — the split only happens on the client, so it stays crawlable
 * and selectable if JS never runs.
 */
export function SplitReveal({
  children,
  as: Component = "h2",
  className,
  id,
  delay = 0,
  trigger = true,
  duration = MOTION.slow,
  waitFor,
}: {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
  id?: string;
  delay?: number;
  /** false = play on mount (hero), true = play when scrolled into view. */
  trigger?: boolean;
  duration?: number;
  /**
   * Defers the reveal until some external cue fires — the hero uses it to
   * hold the headline until the preloader has cleared. Returns an
   * unsubscribe so a cue that never fires can still be cleaned up.
   */
  waitFor?: (start: () => void) => () => void;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      let split: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;
      let cued = !waitFor;

      // Splitting before the webfont settles measures the fallback metrics
      // and produces the wrong line breaks; autoSplit re-runs on resize.
      const build = () => {
        split = SplitText.create(el, {
          type: "lines",
          linesClass: "split-line",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            // Built here rather than in the cue callback: a tween created
            // outside this hook's context does not reliably tick, so it is
            // created up front and simply held paused until cued.
            tween = gsap.fromTo(
              self.lines,
              { yPercent: 115 },
              {
                yPercent: 0,
                duration,
                ease: MOTION.ease,
                stagger: 0.09,
                delay,
                paused: !cued,
                scrollTrigger: trigger
                  ? { trigger: el, start: "top 85%", once: true }
                  : undefined,
              },
            );
            return tween;
          },
        });
      };

      if (document.fonts?.status === "loaded") build();
      else document.fonts.ready.then(build);

      const unsubscribe = waitFor?.(() => {
        cued = true;
        tween?.play(0);
      });

      return () => {
        unsubscribe?.();
        split?.revert();
      };
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <Component
      ref={ref as never}
      id={id}
      className={cn(className)}
      // `text-wrap: balance` re-flows once SplitText wraps words in spans,
      // collapsing the headline to one word per line.
      style={{ textWrap: "wrap" }}
    >
      {children}
    </Component>
  );
}
