"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import {
  getTier,
  getVisualMode,
  subscribeCapabilities,
  type Tier,
  type VisualMode,
} from "@/lib/device/detectTier";
import { StaticVisual } from "@/three/fallback/StaticVisual";

const Scene = dynamic(() => import("@/three/Scene"), {
  ssr: false,
  loading: () => null,
});

const MASK =
  "radial-gradient(closest-side, #000 42%, rgba(0,0,0,0.55) 72%, transparent 100%)";

/**
 * Decides once whether the WebGL bundle is worth loading at all. Reduced
 * motion and missing WebGL both fall back to SVG, and Three.js is never
 * fetched for those visitors.
 *
 * The mark is composed differently per breakpoint rather than scaled: on
 * phones it sits high and right, out of the way of the bottom-anchored
 * headline; from lg it moves into the empty right half at full weight.
 */
export function HeroVisual() {
  const mode = useSyncExternalStore<VisualMode | "pending">(
    subscribeCapabilities,
    getVisualMode,
    () => "pending",
  );
  const tier = useSyncExternalStore<Tier>(
    subscribeCapabilities,
    getTier,
    () => "mid",
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Three compositions, not one scaled three ways:
          phone  — a corner mark, clear of the bottom-anchored text
          tablet — larger and higher, filling the empty upper band
          desktop— centred in the empty right half at full weight */}
      <div
        className="absolute right-[-12%] top-[1%] h-[50vw] w-[50vw] opacity-70
                   sm:right-[-8%] sm:top-[2%] sm:h-[46vw] sm:w-[46vw] sm:opacity-80
                   md:right-[-10%] md:top-[6%] md:h-[52vw] md:w-[52vw] md:opacity-90
                   lg:right-[-4%] lg:top-1/2 lg:h-[min(74vh,720px)] lg:w-[min(74vh,720px)]
                   lg:-translate-y-[54%] lg:opacity-100"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}
      >
        {mode === "webgl" ? <Scene tier={tier} /> : null}
        {mode === "static" ? <StaticVisual animated /> : null}
      </div>
    </div>
  );
}
