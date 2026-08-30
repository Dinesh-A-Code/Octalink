/**
 * Shown when WebGL is unavailable or motion is reduced. It draws the same
 * octahedral mark as the WebGL scene — a projected octahedron inside a
 * suggestion of the field — so the brand reads identically without ever
 * fetching Three.js.
 */

const C = { x: 200, y: 190 };

// Octahedron vertices (±1 on each axis) under a fixed 30°/20° rotation,
// projected to 2D once here rather than computed at runtime.
const V = {
  right: { x: 312.6, y: 167.8 },
  left: { x: 87.4, y: 212.2 },
  top: { x: 200, y: 67.8 },
  bottom: { x: 200, y: 312.2 },
  front: { x: 265, y: 228.5 },
  back: { x: 135, y: 151.5 },
} as const;

type VertexName = keyof typeof V;

/** Every pair except the three opposite pairs — the solid's twelve edges. */
const EDGES: [VertexName, VertexName][] = [
  ["top", "right"],
  ["top", "left"],
  ["top", "front"],
  ["top", "back"],
  ["bottom", "right"],
  ["bottom", "left"],
  ["bottom", "front"],
  ["bottom", "back"],
  ["right", "front"],
  ["right", "back"],
  ["left", "front"],
  ["left", "back"],
];

export function StaticVisual({ animated }: { animated: boolean }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className="h-full w-full">
      <defs>
        <radialGradient id="oct-core-glow" cx="50%" cy="48%" r="52%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="65%" stopColor="var(--accent)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={C.x} cy={C.y} r="155" fill="url(#oct-core-glow)" />

      {/* Field — the outer shell, drifting slowly if motion is allowed. */}
      <g
        fill="none"
        stroke="var(--fg)"
        strokeOpacity="0.16"
        strokeWidth="0.7"
        style={
          animated
            ? {
                transformOrigin: `${C.x}px ${C.y}px`,
                animation: "oct-field 68s linear infinite",
              }
            : undefined
        }
      >
        {[150, 118, 86].map((r, i) => (
          <ellipse
            key={r}
            cx={C.x}
            cy={C.y}
            rx={r}
            ry={r * 0.5}
            transform={`rotate(${i * 60} ${C.x} ${C.y})`}
          />
        ))}
      </g>

      {/* Core — the eight-faced mark itself. */}
      <g
        style={
          animated
            ? {
                transformOrigin: `${C.x}px ${C.y}px`,
                animation: "oct-core 44s linear infinite",
              }
            : undefined
        }
      >
        <polygon
          points={`${V.top.x},${V.top.y} ${V.right.x},${V.right.y} ${V.bottom.x},${V.bottom.y} ${V.left.x},${V.left.y}`}
          fill="var(--accent)"
          fillOpacity="0.1"
        />
        {EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={V[a].x}
            y1={V[a].y}
            x2={V[b].x}
            y2={V[b].y}
            stroke="var(--fg)"
            strokeOpacity="0.42"
            strokeWidth="0.9"
          />
        ))}
      </g>

      <style>{`
        @keyframes oct-field { to { transform: rotate(-360deg); } }
        @keyframes oct-core  { to { transform: rotate(360deg); } }
      `}</style>
    </svg>
  );
}
