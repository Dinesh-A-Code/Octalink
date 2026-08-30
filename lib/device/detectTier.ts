export type Tier = "low" | "mid" | "high";

export interface TierConfig {
  detail: number;
  dpr: [number, number];
  octaves: number;
  antialias: boolean;
}

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  low: { detail: 12, dpr: [1, 1], octaves: 1, antialias: false },
  mid: { detail: 24, dpr: [1, 1.5], octaves: 2, antialias: true },
  high: { detail: 48, dpr: [1, 2], octaves: 3, antialias: true },
};

export type VisualMode = "webgl" | "static";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

/** Synchronous heuristic — no async benchmarking. Resolved once, then cached. */
function computeTier(): Tier {
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const smallViewport = window.innerWidth < 768;

  if (coarse || smallViewport || memory <= 4 || cores <= 4) return "low";
  if (memory <= 8 || cores <= 8) return "mid";
  return "high";
}

let cachedTier: Tier | null = null;
let cachedMode: VisualMode | null = null;

/**
 * Device capability never changes within a session, so both values are
 * resolved once and returned as stable snapshots — safe to read straight
 * from useSyncExternalStore.
 */
export function getTier(): Tier {
  cachedTier ??= computeTier();
  return cachedTier;
}

export function getVisualMode(): VisualMode {
  if (cachedMode === null) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cachedMode = reduced || !hasWebGL() ? "static" : "webgl";
  }
  return cachedMode;
}

/** Capabilities are fixed for the session, so there is nothing to notify. */
export function subscribeCapabilities(): () => void {
  return () => {};
}
