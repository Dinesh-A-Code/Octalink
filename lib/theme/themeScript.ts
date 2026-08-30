import { THEME_STORAGE_KEY } from "./themeSignal";

/**
 * Runs before paint in <head> so the correct theme is on <html> before the
 * first frame — no flash, and no client-side mount check needed.
 */
export const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`.trim();
