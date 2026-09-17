import type { Project, ProjectStatus } from "@/types/content";

/**
 * Single source of truth for how a project's status reads as a badge.
 * Shared by the homepage row and the project detail page so the two never
 * drift out of sync.
 */
export const STATUS_LABEL: Record<ProjectStatus, string | null> = {
  live: null, // a live URL already says this
  "in-development": "In development",
  "landing-live": "Landing page live · In development",
  "case-study-soon": "Case study coming soon",
  "coming-soon": "Coming soon",
  prototype: "Prototype",
  archived: "Archived",
};

/**
 * What the primary link is called, keyed by status so the label matches what
 * a visitor will actually find — a project still "in development" gets a
 * preview, not a finished site.
 */
export const LIVE_LINK_LABEL: Record<ProjectStatus, string> = {
  live: "Visit site",
  "in-development": "Live preview",
  "landing-live": "Visit site",
  "case-study-soon": "Visit site",
  "coming-soon": "Visit site",
  prototype: "Visit site",
  archived: "Visit site",
};

export function getStatusLabel(status: ProjectStatus): string | null {
  return STATUS_LABEL[status];
}

export interface ProjectLink {
  label: string;
  href: string;
}

/**
 * The external destinations for a project — live site, case study, repo.
 * Never renders a link for a URL that doesn't exist. Explicit destinations
 * rather than one row-wide link: a project can have a live site, a case
 * study and a repo, and those are not interchangeable.
 */
export function getExternalProjectLinks(project: Project): ProjectLink[] {
  return [
    project.liveUrl
      ? { label: LIVE_LINK_LABEL[project.status], href: project.liveUrl }
      : null,
    project.caseStudyUrl
      ? { label: "Read case study", href: project.caseStudyUrl }
      : null,
    project.repoUrl ? { label: "GitHub", href: project.repoUrl } : null,
  ].filter((link): link is ProjectLink => link !== null);
}

/**
 * One honest sentence stating what a project's status actually means —
 * status is never conveyed by badge/color alone. Derived only from `status`,
 * `name` and whether a live link exists, so it never drifts from what the
 * data already says.
 */
export function getStatusNote(project: Project): string {
  switch (project.status) {
    case "live":
      return `${project.name} is live.`;
    case "in-development":
      return project.liveUrl
        ? `${project.name} is in development. What's linked above is a live preview, not a finished product.`
        : `${project.name} is in development and doesn't have a public deployment yet.`;
    case "landing-live":
      return `${project.name}'s landing page is live. The product it describes hasn't launched yet.`;
    case "case-study-soon":
      return `${project.name} is complete on our side; a full case study is coming soon.`;
    case "coming-soon":
      return `${project.name} is coming soon.`;
    case "prototype":
      return `${project.name} is an early prototype, not yet a public project.`;
    case "archived":
      return `${project.name} is archived.`;
  }
}
