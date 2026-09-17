export type ProjectCategory = "live" | "independent" | "experiment";

/**
 * How far along a project is. Rendered as a plain label so a work-in-progress
 * is never dressed up as a shipped product — and equally so that something
 * real but undocumented reads as pending, not absent.
 */
export type ProjectStatus =
  | "live"
  | "in-development"
  | "landing-live"
  | "case-study-soon"
  | "coming-soon"
  | "prototype"
  | "archived";

export interface ProjectMedia {
  src: string;
  /** Required for screenshots — these are content, not decoration. */
  alt: string;
  caption: string | null;
}

/**
 * What a project row shows in its preview slot. `null` on a Project renders
 * the branded placeholder, so a project without assets still looks designed
 * rather than broken. Adding a real screenshot is a one-line content change.
 */
export type ProjectPreviewSource =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster: string | null; alt: string }
  /** Reserved: a lightweight per-project WebGL study. Not built yet. */
  | { kind: "webgl"; alt: string };

/**
 * Detail-page content. Every field is nullable and the page renders only
 * what is present, so a partly-documented project is still publishable
 * without anything being filled in speculatively.
 */
export interface ProjectDetail {
  problem: string | null;
  approach: string | null;
  implementation: string | null;
  screenshots: ProjectMedia[];
  /** Video walkthrough — a file under /public or an embed URL. */
  video: ProjectMedia | null;
}

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** What the thing is ("Web application"), never a client sector. */
  kind: string | null;
  /** Null until a real date is known — no placeholder years. */
  year: string | null;
  /** One line for the index row. Null keeps the project unpublished. */
  summary: string | null;
  technologies: string[];
  /** Public deployment, when there genuinely is one. */
  liveUrl: string | null;
  /** Written case study, once one exists. */
  caseStudyUrl: string | null;
  repoUrl: string | null;
  /** Row preview. Null renders the branded placeholder. */
  preview: ProjectPreviewSource | null;
  detail: ProjectDetail | null;
  /**
   * Gate for the rendered list. Anything still missing confirmed content
   * stays false, so the site never shows a half-written entry.
   */
  published: boolean;
  /** Notes to us on what is still outstanding. Never rendered. */
  needs: string[];
}

export interface Service {
  id: string;
  index: string;
  title: string;
  promise: string;
  description: string;
  deliverables: string[];
}

export interface Principle {
  id: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  index: string;
  title: string;
  description: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  bio: string;
  focus: string[];
}

export interface Technology {
  name: string;
  category: "Frontend" | "Backend" | "Creative" | "Platform";
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface NavLink {
  label: string;
  href: string;
}
