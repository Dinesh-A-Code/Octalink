import { SplitReveal } from "@/components/primitives/SplitReveal";
import { ProjectPreview } from "@/components/sections/ProjectPreview";
import { ProjectLinks } from "@/components/project/ProjectLinks";
import { getStatusLabel } from "@/lib/projectLinks";
import type { Project } from "@/types/content";

export function ProjectHero({ project }: { project: Project }) {
  const statusLabel = getStatusLabel(project.status);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
      <div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          {project.kind ? <span className="eyebrow">{project.kind}</span> : null}
          {statusLabel ? (
            <span className="rounded-sharp border border-line px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-faint">
              {statusLabel}
            </span>
          ) : null}
        </div>

        <SplitReveal as="h1" trigger={false} className="mt-5 text-h1">
          {project.name}
        </SplitReveal>

        {project.summary ? (
          <p className="mt-6 max-w-xl text-lead leading-relaxed text-muted">
            {project.summary}
          </p>
        ) : null}

        {project.technologies.length > 0 ? (
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8">
          <ProjectLinks project={project} />
        </div>
      </div>

      <ProjectPreview source={project.preview} />
    </div>
  );
}
