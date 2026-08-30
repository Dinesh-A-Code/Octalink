# Octalink

Marketing site for Octalink — an independent digital studio run by Dinesh and
David, building landing pages, business websites and web applications.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Three.js / React Three Fiber · GSAP + ScrollTrigger · Lenis

## Running locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` before a production build. Neither variable
is required for local development.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, `sitemap.xml` and `robots.txt`. No domain is chosen yet. |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Where the contact form POSTs. Unset renders the form in a visibly disabled state rather than failing silently. |

## Replacing the placeholder content

Everything a visitor reads lives in `content/`, typed by `types/content.ts`.
Components render whatever is in these files — no copy is hardcoded in JSX.

| File | Contains |
| --- | --- |
| `content/site.ts` | Studio name, nav, social links, endpoints |
| `content/projects.ts` | Case studies. Placeholders are labelled "Concept" in the UI via `placeholder: true` — set it to `false` once a project is real |
| `content/services.ts` | The three services |
| `content/principles.ts` | "Why Octalink" |
| `content/process.ts` | The six process stages |
| `content/team.ts` | Dinesh and David — bios are placeholders |
| `content/technologies.ts` | Technology list |
| `content/testimonials.ts` | **Empty on purpose.** The section renders an empty state until real, attributable quotes exist. Adding objects here swaps it automatically |
| `content/faq.ts` | FAQ entries |

## Connecting the contact form

`components/forms/ContactForm.tsx` POSTs a JSON body to a single endpoint and
is deliberately provider-agnostic. Set `NEXT_PUBLIC_CONTACT_ENDPOINT` to:

- a **Formspree** form URL — works as-is
- a **Cloudflare Worker** or Next.js route handler that relays to **Resend**

The handler is written against the Web `fetch`/`Request`/`Response` APIs, so a
relay can move to the edge without a rewrite. A honeypot field is included.

## Architecture notes

- **Theme** — `lib/theme/themeSignal.ts` is the source of truth, held outside
  React. The UI subscribes via `useSyncExternalStore`; the WebGL scene
  subscribes directly, so switching themes updates shader uniforms without
  re-rendering the tree. An inline script in `app/layout.tsx` sets
  `data-theme` before first paint, so there is no flash.
- **3D** — `three/` is loaded with `next/dynamic({ ssr: false })`, so Three.js
  sits in its own client chunk. Pointer and scroll values live in a vanilla
  zustand store (`lib/scene/pointerStore.ts`) read inside `useFrame`; they
  never touch React state. `lib/device/detectTier.ts` picks a quality tier
  from device hints and downgrades geometry detail, DPR and shader octaves.
- **Motion** — durations and easings live in `lib/gsap/gsapConfig.ts`.
  `SmoothScrollProvider` drives Lenis from GSAP's ticker so smooth scroll and
  ScrollTrigger share one RAF loop.
- **Reduced motion** — respected throughout. Lenis is skipped, entrances are
  disabled, and the hero renders an SVG instead of WebGL, so Three.js is never
  downloaded. The same fallback covers browsers without WebGL.

## Deploying

The site builds to fully static output — every route is prerendered.

```bash
npm run build
```

Intended target is GitHub + Cloudflare Pages. Set the two environment
variables in the Cloudflare project settings before the first deploy.

## Still to do

- Replace placeholder projects with real case studies
- Replace placeholder bios in `content/team.ts`
- Add real testimonials when available
- Add social profile URLs in `content/site.ts`
- Choose a domain and set `NEXT_PUBLIC_SITE_URL`
- Replace the generated monogram favicon (`app/icon.tsx`) with a real mark
