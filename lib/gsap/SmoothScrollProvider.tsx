"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap/gsapConfig";
import { setPointer, setScroll } from "@/lib/scene/pointerStore";
import { prefersReducedMotion } from "@/lib/utils/motion";

/**
 * Owns the single RAF loop for the whole site: Lenis is driven by GSAP's
 * ticker so smooth scroll and ScrollTrigger never desync, and pointer/scroll
 * values are pushed into the vanilla store the WebGL scene reads from.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerGsap();

    const reduced = prefersReducedMotion();
    let lenis: Lenis | null = null;
    let rafHandler: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({
        // Short enough that the page still feels directly controlled — the
        // wheel leads, the easing only takes the edge off it.
        duration: 0.95,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        // Touch stays native. Smoothing a finger drag fights the gesture and
        // is the main thing that makes smooth-scroll sites feel broken.
        syncTouch: false,
      });

      lenis.on("scroll", (e: { scroll: number; velocity: number }) => {
        ScrollTrigger.update();
        setScroll(e.scroll, e.velocity);
      });

      rafHandler = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(rafHandler);
      gsap.ticker.lagSmoothing(0);
    } else {
      const onScroll = () => setScroll(window.scrollY, 0);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    // Triggers created before the webfonts land measure a shorter document
    // and fire early, so re-measure once the layout is final.
    // ScrollTrigger.refresh() re-measures every trigger, so it is debounced
    // rather than run once per resize callback.
    let refreshTimer = 0;
    const refresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    if (document.fonts) document.fonts.ready.then(refresh);
    else refresh();
    window.addEventListener("load", refresh);

    // Images and lazily-mounted media change the document height after the
    // initial measure, which would otherwise leave every trigger below them
    // firing at the wrong point.
    const observer = new ResizeObserver(refresh);
    observer.observe(document.body);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
      if (rafHandler) gsap.ticker.remove(rafHandler);
      lenis?.destroy();
      // Individual triggers are owned by the components that created them and
      // reverted by useGSAP; killing them from here would tear down triggers
      // belonging to still-mounted children on a StrictMode remount.
    };
  }, []);

  // Pointer tracking is RAF-coalesced and writes straight to the store.
  useEffect(() => {
    let frame = 0;
    let nx = 0;
    let ny = 0;

    const flush = () => {
      frame = 0;
      setPointer(nx, ny);
    };

    const onMove = (e: PointerEvent) => {
      nx = (e.clientX / window.innerWidth) * 2 - 1;
      ny = -((e.clientY / window.innerHeight) * 2 - 1);
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <>{children}</>;
}
