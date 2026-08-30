"use client";

import { Canvas } from "@react-three/fiber";
import { OctaForm } from "./OctaForm";
import { TIER_CONFIG, type Tier } from "@/lib/device/detectTier";

export default function Scene({ tier }: { tier: Tier }) {
  const config = TIER_CONFIG[tier];

  return (
    <Canvas
      dpr={config.dpr}
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      gl={{
        antialias: config.antialias,
        powerPreference: "high-performance",
        alpha: true,
      }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <OctaForm config={config} />
    </Canvas>
  );
}
