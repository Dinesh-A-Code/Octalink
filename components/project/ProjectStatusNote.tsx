import { Reveal } from "@/components/primitives/Reveal";
import { getStatusLabel, getStatusNote } from "@/lib/projectLinks";
import type { Project } from "@/types/content";

/**
 * States what the status badge means in a full sentence — status is never
 * conveyed by the badge/color alone.
 */
export function ProjectStatusNote({ project }: { project: Project }) {
  const label = getStatusLabel(project.status);

  return (
    <Reveal className="border-t border-line py-14 md:py-16">
      <h2 className="text-h3">Current status</h2>
      {label ? (
        <span className="mt-4 inline-block rounded-sharp border border-line px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-faint">
          {label}
        </span>
      ) : null}
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
        {getStatusNote(project)}
      </p>
    </Reveal>
  );
}
