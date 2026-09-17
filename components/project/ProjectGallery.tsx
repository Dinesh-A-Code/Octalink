import { Reveal } from "@/components/primitives/Reveal";
import { ProjectPreview } from "@/components/sections/ProjectPreview";
import type { ProjectMedia } from "@/types/content";

/**
 * Screenshots and/or a video walkthrough. Renders nothing until real media
 * exists — no placeholder shots are ever generated here.
 */
export function ProjectGallery({
  screenshots,
  video,
}: {
  screenshots: ProjectMedia[];
  video: ProjectMedia | null;
}) {
  if (screenshots.length === 0 && !video) return null;

  return (
    <div className="border-t border-line py-14 md:py-16">
      <h2 className="text-h3">Visual showcase</h2>
      {/* `stagger` animates its direct children, so the grid itself is the
          Reveal root rather than this whole section. */}
      <Reveal stagger className="mt-8 grid gap-6 sm:grid-cols-2">
        {video ? (
          <figure className="sm:col-span-2">
            <ProjectPreview
              source={{
                kind: "video",
                src: video.src,
                poster: null,
                alt: video.alt,
              }}
            />
            {video.caption ? (
              <figcaption className="mt-3 text-sm text-muted">
                {video.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        {screenshots.map((shot) => (
          <figure key={shot.src}>
            <ProjectPreview source={{ kind: "image", src: shot.src, alt: shot.alt }} />
            {shot.caption ? (
              <figcaption className="mt-3 text-sm text-muted">
                {shot.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </Reveal>
    </div>
  );
}
