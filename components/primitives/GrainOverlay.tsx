/**
 * Procedural film grain — an inline SVG turbulence data URI, so there's no
 * texture file to download and it scales to any viewport.
 */
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
      <filter id="n">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#n)"/>
    </svg>`,
  );

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay"
      style={{
        backgroundImage: `url("${GRAIN}")`,
        backgroundSize: "180px 180px",
        opacity: "var(--grain-opacity)",
      }}
    />
  );
}
