import Image from "next/image";
import type { ProjectPreviewSource } from "@/types/content";
import { cn } from "@/lib/utils/cn";

/**
 * The preview slot on a project row. A real screenshot is the primary case;
 * everything else is fallback. Swapping a project's `preview` field from
 * null to `{ kind: "image", ... }` is the whole migration — no markup here
 * or in the row changes.
 *
 * Nothing fabricates a screenshot: with no source, it draws the Octalink
 * octahedron as brand artwork rather than pretending to be a missing image.
 */
export function ProjectPreview({
  source,
  className,
}: {
  source: ProjectPreviewSource | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden border border-line bg-surface",
        className,
      )}
    >
      {/* Scaled slightly past the frame so the crop has somewhere to move
          on hover, and so a screenshot never sits flush against the border. */}
      <div data-media className="absolute inset-0 scale-[1.03]">
        {source === null || source.kind === "webgl" ? (
          <PlaceholderMark />
        ) : source.kind === "image" ? (
          <Image
            src={source.src}
            alt={source.alt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 640px, (min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
        ) : (
          <video
            src={source.src}
            poster={source.poster ?? undefined}
            aria-label={source.alt}
            // preload="none" keeps the video off the critical path entirely;
            // it only fetches once someone actually plays it.
            preload="none"
            muted
            loop
            playsInline
            controls
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}

/**
 * The hero's octahedron reduced to line work — brand artwork sized to hold
 * a large frame on its own, not a spinner standing in for a missing file.
 */
function PlaceholderMark() {
  return (
    <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <svg
        viewBox="0 0 200 200"
        className="relative h-[62%] w-auto"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      >
        {/* Outer shell — the lattice the hero's core sits inside */}
        <path d="M100 8 L192 100 L100 192 L8 100 Z" strokeOpacity="0.14" />
        <path d="M100 8 L100 192 M8 100 L192 100" strokeOpacity="0.09" />

        {/* Core octahedron, in projection */}
        <path d="M100 42 L158 100 L100 158 L42 100 Z" strokeOpacity="0.4" />
        <path d="M100 42 L70 112 L100 158 L130 88 Z" strokeOpacity="0.26" />
        <path d="M42 100 L70 112 M158 100 L130 88" strokeOpacity="0.2" />

        {/* Six struts, linking core vertices out to the shell */}
        <g strokeOpacity="0.13">
          <path d="M100 42 L100 8 M100 158 L100 192" />
          <path d="M42 100 L8 100 M158 100 L192 100" />
          <path d="M70 112 L38 138 M130 88 L162 62" />
        </g>
      </svg>
    </div>
  );
}
