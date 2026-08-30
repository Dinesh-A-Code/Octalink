/**
 * Hand-offs between the three things that have to agree on timing in the
 * hero — the preloader, the DOM timeline and the WebGL mark — without any
 * of them sharing React state.
 *
 *   preloader  →  signalPreloaderDone()  →  hero timeline starts
 *   hero       →  beginSceneReveal()     →  mark forms mid-headline
 */

let revealBegun = false;
let preloaderDone = false;
let waiting: (() => void)[] = [];

/** Cued from inside the hero timeline, once the headline is underway. */
export function beginSceneReveal(): void {
  revealBegun = true;
}

/** Polled once per frame by the scene — cheaper than a subscription. */
export function sceneRevealBegun(): boolean {
  return revealBegun;
}

export function signalPreloaderDone(): void {
  if (preloaderDone) return;
  preloaderDone = true;
  const queued = waiting;
  waiting = [];
  queued.forEach((fn) => fn());
}

/** Fires immediately if the preloader has already finished. */
export function onPreloaderDone(callback: () => void): () => void {
  if (preloaderDone) {
    callback();
    return () => {};
  }
  waiting.push(callback);
  return () => {
    waiting = waiting.filter((fn) => fn !== callback);
  };
}
