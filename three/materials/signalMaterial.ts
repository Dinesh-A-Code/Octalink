import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

/**
 * Shared surface for every pass of the Octalink mark. Layered simplex noise
 * displaces vertices along their normals, modulated by time, scroll velocity
 * and pointer parallax; the fragment side is a fresnel-weighted two-tone mix.
 * No textures and no lights, so each pass is a single cheap draw call —
 * the crisp core just runs it with the amplitude turned almost to zero.
 */
export const SignalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color("#3452ff"),
    uColorB: new THREE.Color("#0a0a0b"),
    uAmplitude: 0.28,
    uFrequency: 1.15,
    uScrollVel: 0,
    uPointer: new THREE.Vector2(0, 0),
    uOctaves: 3,
    uOpacity: 1,
    uAccentMix: 1,
    /** 0 → 1 entrance ramp, cued by the hero timeline. */
    uIntro: 1,
    /** Pointer speed, 0..1. Tightens the surface when the cursor moves fast. */
    uSpeed: 0,
    /** Key direction for facet shading. Not a light — just a dot product. */
    uLightDir: new THREE.Vector3(0.45, 0.7, 0.55),
    /** How strongly facet shading reads. 0 for the lattice, high for the core. */
    uFacet: 0,
  },
  /* glsl vertex */ `
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uScrollVel;
  uniform vec2  uPointer;
  uniform int   uOctaves;
  uniform float uSpeed;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vDisp;

  // Ashima simplex noise (3D) — public domain.
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p, int octaves){
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      if (i >= octaves) break;
      value += amp * snoise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return value;
  }

  void main(){
    vec3 pos = position;

    // Pointer tilts the noise field rather than moving the mesh — reads as
    // the surface reacting to you, not as a cursor-follower.
    vec3 field = pos * uFrequency + vec3(uPointer * 0.35, uTime * 0.16);
    float noise = fbm(field, uOctaves);

    // Moving the pointer quickly draws the surface in slightly — the form
    // tenses rather than wobbles, which reads as response, not decoration.
    float ripple = uScrollVel * 0.35;
    float displacement = noise * (uAmplitude * (1.0 - uSpeed * 0.28) + ripple);

    vec3 displaced = pos + normal * displacement;
    vDisp = displacement;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vNormalW = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);

    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  /* glsl fragment */ `
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uOpacity;
  uniform float uAccentMix;
  uniform float uIntro;
  uniform float uFacet;
  uniform vec3  uLightDir;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying float vDisp;

  void main(){
    vec3 N = normalize(vNormalW);
    float fresnel = pow(1.0 - clamp(dot(N, normalize(vViewDir)), 0.0, 1.0), 2.2);
    float depth = smoothstep(-0.35, 0.45, vDisp);

    // Each of the eight faces has a constant normal, so this single dot
    // product is what separates them — the core reads as a cut solid rather
    // than a flat silhouette. The lattice passes set uFacet to 0 and stay
    // fresnel-driven, where a rim is the only thing worth drawing.
    float facet = clamp(dot(N, normalize(uLightDir)) * 0.5 + 0.5, 0.0, 1.0);

    // Mostly the neutral colour; the accent only surfaces on the rim and
    // on the crests of the displacement, so it never reads as a colour field.
    float accent = clamp((fresnel * 0.9 + depth * 0.2) * uAccentMix, 0.0, 1.0);
    vec3 color = mix(uColorB, uColorA, accent);

    float body = mix(0.16 + fresnel * 0.84, 0.34 + facet * 0.66, uFacet);
    float alpha = uOpacity * body * uIntro;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
  `,
);
