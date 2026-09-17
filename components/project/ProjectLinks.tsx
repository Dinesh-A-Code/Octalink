import { getExternalProjectLinks } from "@/lib/projectLinks";
import type { Project } from "@/types/content";

/**
 * The external destinations for a project (live site, case study, repo).
 * Shared between the hero CTA row and the closing links section so the two
 * never list different things. Renders nothing if none exist.
 */
export function ProjectLinks({ project }: { project: Project }) {
  const links = getExternalProjectLinks(project);
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-7 gap-y-3">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="group/cta inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-accent"
        >
          {link.label}
          <span
            aria-hidden="true"
            className="text-xs transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-1"
          >
            &rarr;
          </span>
        </a>
      ))}
    </div>
  );
}
