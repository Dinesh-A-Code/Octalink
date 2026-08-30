"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { SignalMaterial } from "./materials/signalMaterial";
import { pointerStore } from "@/lib/scene/pointerStore";
import { sceneRevealBegun } from "@/lib/motion/heroCues";
import {
  subscribeTheme,
  resolveSceneStyle,
  type SceneStyle,
} from "@/lib/theme/themeSignal";
import type { TierConfig } from "@/lib/device/detectTier";

extend({ SignalMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    signalMaterial: ThreeElement<typeof SignalMaterial>;
  }
}

type SignalMaterialImpl = THREE.ShaderMaterial & {
  uTime: number;
  uScrollVel: number;
  uSpeed: number;
  uIntro: number;
  uOpacity: number;
  uPointer: THREE.Vector2;
  uColorA: THREE.Color;
  uColorB: THREE.Color;
};

const CORE_RADIUS = 0.92;
const FIELD_RADIUS = 1.72;

interface SceneState {
  px: number;
  py: number;
  speed: number;
  intro: number;
  targetA: THREE.Color;
  targetB: THREE.Color;
  weight: { core: number; edge: number; field: number };
}

/**
 * Six struts running from the core's vertices out to the lattice shell —
 * the "link" made literal. Normals point along each strut so the shared
 * shader lights and displaces them consistently with everything else.
 */
function createStrutGeometry(): THREE.BufferGeometry {
  const axes = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];

  const positions: number[] = [];
  const normals: number[] = [];

  for (const [x, y, z] of axes) {
    positions.push(
      x * CORE_RADIUS,
      y * CORE_RADIUS,
      z * CORE_RADIUS,
      x * FIELD_RADIUS,
      y * FIELD_RADIUS,
      z * FIELD_RADIUS,
    );
    normals.push(x, y, z, x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  return geometry;
}

/**
 * The Octalink mark, in four passes over three octahedral geometries:
 *
 *   core   — an eight-faced octahedron, near-rigid, facet-shaded
 *   edges  — the same solid in wireframe, drawing its twelve edges
 *   struts — six lines linking core vertices to the lattice
 *   field  — a subdivided octahedron, noise-displaced, counter-rotating
 *
 * Subdividing an octahedron rather than an icosahedron gives the lattice
 * four-fold symmetry, which reads as engineered rather than organic and
 * keeps it clear of the usual icosphere.
 */
export function OctaForm({ config }: { config: TierConfig }) {
  const core = useRef<THREE.Group>(null);
  const field = useRef<THREE.Group>(null);

  const coreFill = useRef<SignalMaterialImpl>(null);
  const coreEdge = useRef<SignalMaterialImpl>(null);
  const strutMat = useRef<SignalMaterialImpl>(null);
  const fieldMat = useRef<SignalMaterialImpl>(null);

  const state = useRef<SceneState>({
    px: 0,
    py: 0,
    speed: 0,
    intro: 0,
    targetA: new THREE.Color("#3452ff"),
    targetB: new THREE.Color("#0a0a0b"),
    weight: { core: 0.12, edge: 0.9, field: 0.4 },
  });

  // Detail 0 keeps the eight faces flat and legible — this is the mark.
  const coreGeometry = useMemo(
    () => new THREE.OctahedronGeometry(CORE_RADIUS, 0),
    [],
  );
  const strutGeometry = useMemo(() => createStrutGeometry(), []);
  const fieldGeometry = useMemo(
    () =>
      new THREE.OctahedronGeometry(
        FIELD_RADIUS,
        THREE.MathUtils.clamp(Math.round(config.detail / 10), 2, 4),
      ),
    [config.detail],
  );

  useEffect(() => {
    const geometries = [coreGeometry, strutGeometry, fieldGeometry];
    return () => geometries.forEach((g) => g.dispose());
  }, [coreGeometry, strutGeometry, fieldGeometry]);

  useEffect(() => {
    const scene = state.current;

    const apply = (style: SceneStyle, immediate: boolean) => {
      if (style.a) scene.targetA.set(style.a);
      if (style.b) scene.targetB.set(style.b);
      scene.weight = { core: style.core, edge: style.edge, field: style.field };

      if (!immediate) return;
      for (const ref of [coreFill, coreEdge, strutMat, fieldMat]) {
        if (!ref.current) continue;
        ref.current.uColorA.copy(scene.targetA);
        ref.current.uColorB.copy(scene.targetB);
      }
    };

    apply(resolveSceneStyle(), true);
    return subscribeTheme(() => apply(resolveSceneStyle(), false));
  }, []);

  useFrame(({ camera }, delta) => {
    const scene = state.current;
    const dt = Math.min(delta, 0.05);
    const input = pointerStore.getState();
    const ease = 1 - Math.pow(0.005, dt);

    // Entrance ramp, cued by the hero's timeline so the mark forms after
    // the headline rather than competing with it.
    if (sceneRevealBegun() && scene.intro < 1) {
      scene.intro = Math.min(1, scene.intro + dt / 1.5);
    }
    const introEased = 1 - Math.pow(1 - scene.intro, 3);

    scene.px += (input.x - scene.px) * 0.05;
    scene.py += (input.y - scene.py) * 0.05;
    scene.speed = THREE.MathUtils.damp(scene.speed, input.speed, 4, dt);

    const ripple = THREE.MathUtils.clamp(input.scrollVelocity * 0.012, -1, 1);
    const weights = [
      [coreFill, scene.weight.core],
      [coreEdge, scene.weight.edge],
      [strutMat, scene.weight.edge * 0.55],
      [fieldMat, scene.weight.field],
    ] as const;

    for (const [ref, targetOpacity] of weights) {
      const mat = ref.current;
      if (!mat) continue;
      mat.uTime += dt;
      mat.uPointer.set(scene.px, scene.py);
      mat.uScrollVel = THREE.MathUtils.damp(mat.uScrollVel, ripple, 3, dt);
      mat.uSpeed = scene.speed;
      mat.uIntro = introEased;
      mat.uOpacity = THREE.MathUtils.damp(mat.uOpacity, targetOpacity, 4, dt);
      mat.uColorA.lerp(scene.targetA, ease);
      mat.uColorB.lerp(scene.targetB, ease);
    }

    // Core and lattice turn against each other — linked, not welded. A fast
    // pointer adds a little spin, which decays as soon as it stops.
    const spin = 1 + scene.speed * 0.9;

    if (core.current) {
      core.current.rotation.y += dt * 0.14 * spin;
      core.current.rotation.x = THREE.MathUtils.damp(
        core.current.rotation.x,
        0.42 + scene.py * 0.22,
        2,
        dt,
      );
      core.current.rotation.z = THREE.MathUtils.damp(
        core.current.rotation.z,
        scene.px * -0.18,
        2,
        dt,
      );
      const s = 0.72 + introEased * 0.28;
      core.current.scale.setScalar(s);
    }

    if (field.current) {
      field.current.rotation.y -= dt * 0.045 * spin;
      field.current.rotation.x = THREE.MathUtils.damp(
        field.current.rotation.x,
        scene.py * 0.14,
        2,
        dt,
      );
      // The lattice settles inward as it appears, closing onto the core.
      field.current.scale.setScalar(1.18 - introEased * 0.18);
    }

    // Slow drift on the camera gives the form parallax against the page
    // without moving the mesh, so the composition stays where it was set.
    const t = (coreFill.current?.uTime ?? 0) * 0.12;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      Math.sin(t) * 0.16 + scene.px * 0.22,
      1.6,
      dt,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      Math.cos(t * 0.8) * 0.12 + scene.py * 0.18,
      1.6,
      dt,
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <group ref={field}>
        <mesh geometry={fieldGeometry}>
          <signalMaterial
            ref={fieldMat}
            key={`${SignalMaterial.key}-field`}
            transparent
            wireframe
            depthWrite={false}
            uOctaves={config.octaves}
            uOpacity={0}
            uAmplitude={0.34}
            uFrequency={0.82}
            uAccentMix={0.24}
            uFacet={0}
          />
        </mesh>
      </group>

      <group ref={core}>
        <mesh geometry={coreGeometry}>
          <signalMaterial
            ref={coreFill}
            key={`${SignalMaterial.key}-core`}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            uOctaves={1}
            uOpacity={0}
            uAmplitude={0.015}
            uFrequency={1.1}
            uAccentMix={0.7}
            uFacet={1}
          />
        </mesh>

        <mesh geometry={coreGeometry} scale={1.004}>
          <signalMaterial
            ref={coreEdge}
            key={`${SignalMaterial.key}-edge`}
            transparent
            wireframe
            depthWrite={false}
            uOctaves={1}
            uOpacity={0}
            uAmplitude={0.015}
            uFrequency={1.1}
            uAccentMix={0.45}
            uFacet={0}
          />
        </mesh>

        <lineSegments geometry={strutGeometry}>
          <signalMaterial
            ref={strutMat}
            key={`${SignalMaterial.key}-strut`}
            transparent
            depthWrite={false}
            uOctaves={1}
            uOpacity={0}
            uAmplitude={0.02}
            uFrequency={1.1}
            uAccentMix={0.55}
            uFacet={0}
          />
        </lineSegments>
      </group>
    </>
  );
}
