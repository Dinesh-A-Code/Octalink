"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap/gsapConfig";
import { prefersReducedMotion } from "@/lib/utils/motion";
import { signalPreloaderDone } from "@/lib/motion/heroCues";
import { site } from "@/content/site";

const MIN_VISIBLE_MS = 650;
const MAX_VISIBLE_MS = 2400;

/**
 * Overlays content that is already server-rendered underneath — it never
 * gates hydration. Exits on fonts-ready, floored by a minimum so it doesn't
 * flash and capped by a timeout so a slow font can't strand the page.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = root.current;
      if (!el) return;

      const reduced = prefersReducedMotion();
      let handover = 0;

      const finish = () => {
        el.style.pointerEvents = "none";
        if (reduced) {
          el.style.display = "none";
          signalPreloaderDone();
          return;
        }

        // Hand over while the curtain is still moving, so the hero's first
        // beat lands as the last of the preloader leaves. Timed rather than
        // hung off a tween callback so the hand-off cannot be lost.
        handover = window.setTimeout(signalPreloaderDone, 760);

        gsap
          .timeline()
          .to(bar.current, { scaleX: 1, duration: 0.3, ease: "power2.out" })
          .to("[data-mark]", { yPercent: -110, duration: 0.6, ease: "power3.inOut" }, "-=0.05")
          .to(el, {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.9,
            ease: "power3.inOut",
            onComplete: () => {
              el.style.display = "none";
            },
          }, "-=0.35");
      };

      const start = performance.now();
      const ready = document.fonts?.ready ?? Promise.resolve();
      let done = false;

      const settle = () => {
        if (done) return;
        done = true;
        const elapsed = performance.now() - start;
        window.setTimeout(finish, Math.max(0, MIN_VISIBLE_MS - elapsed));
      };

      ready.then(settle);
      const guard = window.setTimeout(settle, MAX_VISIBLE_MS);

      if (!reduced && bar.current) {
        gsap.to(bar.current, {
          scaleX: 0.85,
          duration: 1.4,
          ease: "power2.out",
        });
      }

      return () => {
        window.clearTimeout(guard);
        window.clearTimeout(handover);
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[90] flex flex-col justify-end bg-bg"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="container-x pb-[max(2rem,6vh)]">
        <div className="overflow-hidden">
          <span
            data-mark
            className="block font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold uppercase leading-none tracking-[0.06em]"
          >
            {site.name}
          </span>
        </div>

        <div className="mt-8 h-px w-full bg-line">
          <span
            ref={bar}
            className="block h-full origin-left scale-x-0 bg-accent"
          />
        </div>
      </div>
    </div>
  );
}
