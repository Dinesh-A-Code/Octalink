export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "octalink-theme";

type Listener = (theme: Theme) => void;

const listeners = new Set<Listener>();
let current: Theme = "dark";
let initialised = false;

/**
 * The single source of truth for the active theme. React subscribes to it
 * via useSyncExternalStore; the WebGL scene subscribes directly, so a theme
 * change updates shader uniforms without re-rendering the tree.
 */
export function getTheme(): Theme {
  if (!initialised && typeof document !== "undefined") {
    // The inline no-flash script has already resolved this onto <html>.
    current =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";
    initialised = true;
  }
  return current;
}

/** Matches the server-rendered markup, which is always emitted as dark. */
export function getServerTheme(): Theme {
  return "dark";
}

export function subscribeTheme(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function applyTheme(theme: Theme): void {
  current = theme;
  initialised = true;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode / storage disabled — the attribute still applies.
  }
  listeners.forEach((listener) => listener(theme));
}

export interface SceneStyle {
  a: string;
  b: string;
  core: number;
  edge: number;
  field: number;
}

/**
 * The WebGL mark's per-theme treatment lives in the same token file as the
 * rest of the palette, so the two can't drift. Light and dark weight the
 * fill, edges and lattice differently rather than inverting one another.
 */
export function resolveSceneStyle(): SceneStyle {
  const styles = getComputedStyle(document.documentElement);
  const num = (name: string, fallback: number) => {
    const value = parseFloat(styles.getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };

  return {
    a: styles.getPropertyValue("--scene-a").trim(),
    b: styles.getPropertyValue("--scene-b").trim(),
    core: num("--scene-core", 0.12),
    edge: num("--scene-edge", 0.9),
    field: num("--scene-field", 0.4),
  };
}
