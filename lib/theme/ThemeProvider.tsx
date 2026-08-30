"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import {
  applyTheme,
  getServerTheme,
  getTheme,
  subscribeTheme,
  type Theme,
} from "@/lib/theme/themeSignal";
import { prefersReducedMotion } from "@/lib/utils/motion";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (origin?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const WIPE_MS = 700;
const FADE_MS = 420;

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The theme lives outside React (DOM attribute + localStorage); this just
  // subscribes to it, so there is no state to sync in an effect.
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);

  const overlayRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  const toggleTheme = useCallback(
    (origin?: { x: number; y: number }) => {
      if (animating.current) return;

      const next: Theme = theme === "dark" ? "light" : "dark";
      const overlay = overlayRef.current;
      const canWipe =
        overlay &&
        !prefersReducedMotion() &&
        typeof CSS !== "undefined" &&
        CSS.supports("clip-path", "circle(0px at 0px 0px)");

      if (!canWipe) {
        document.documentElement.classList.add("theme-crossfade");
        applyTheme(next);
        timers.current.push(
          window.setTimeout(
            () => document.documentElement.classList.remove("theme-crossfade"),
            400,
          ),
        );
        return;
      }

      animating.current = true;

      const x = origin?.x ?? window.innerWidth - 48;
      const y = origin?.y ?? 48;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      // Paint the overlay in the incoming theme's background, wipe it across,
      // swap the attribute underneath it, then fade the overlay away.
      overlay.style.background = next === "dark" ? "#0a0a0b" : "#fafaf8";
      overlay.style.transition = "none";
      overlay.style.opacity = "1";
      overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;

      // Commit the starting frame before transitioning away from it.
      void overlay.offsetWidth;

      overlay.style.transition = `clip-path ${WIPE_MS}ms cubic-bezier(0.65,0,0.35,1)`;
      overlay.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`;

      timers.current.push(
        window.setTimeout(() => {
          applyTheme(next);

          overlay.style.transition = `opacity ${FADE_MS}ms ease-out`;
          overlay.style.opacity = "0";

          timers.current.push(
            window.setTimeout(() => {
              overlay.style.transition = "none";
              overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
              animating.current = false;
            }, FADE_MS),
          );
        }, WIPE_MS),
      );
    },
    [theme],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] opacity-0"
        style={{ clipPath: "circle(0px at 50% 50%)" }}
      />
    </ThemeContext.Provider>
  );
}
