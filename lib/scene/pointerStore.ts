import { createStore } from "zustand/vanilla";

interface PointerState {
  /** Normalised −1..1, origin at viewport centre. */
  x: number;
  y: number;
  /** Normalised units per second — how hard the pointer is being moved. */
  vx: number;
  vy: number;
  /** Magnitude of the above, 0..1, already clamped for shader use. */
  speed: number;
  scrollY: number;
  /** Lenis scroll velocity, damped in the frame loop. */
  scrollVelocity: number;
}

/**
 * Vanilla store on purpose: written by RAF-throttled listeners, read with
 * getState() inside useFrame. Nothing here ever subscribes React, so pointer
 * and scroll motion never trigger a render.
 */
export const pointerStore = createStore<PointerState>(() => ({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  speed: 0,
  scrollY: 0,
  scrollVelocity: 0,
}));

let lastX = 0;
let lastY = 0;
let lastT = 0;

export function setPointer(x: number, y: number): void {
  const now = performance.now();
  const dt = lastT ? Math.min((now - lastT) / 1000, 0.1) : 0;

  let vx = 0;
  let vy = 0;
  if (dt > 0) {
    vx = (x - lastX) / dt;
    vy = (y - lastY) / dt;
  }

  lastX = x;
  lastY = y;
  lastT = now;

  // ~4 normalised units/sec is a brisk flick; anything past that saturates.
  const speed = Math.min(Math.hypot(vx, vy) / 4, 1);

  pointerStore.setState({ x, y, vx, vy, speed });
}

export function setScroll(scrollY: number, scrollVelocity: number): void {
  pointerStore.setState({ scrollY, scrollVelocity });
}
