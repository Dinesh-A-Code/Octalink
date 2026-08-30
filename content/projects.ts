import type { Project } from "@/types/content";

/**
 * Ordered by importance — this array is the running order on the page.
 * `category` is kept as metadata for filtering and detail pages later, but
 * the section renders one flat list rather than grouping by it.
 *
 * Only entries with `published: true` reach the site. Nothing here is
 * inferred: no invented dates, metrics, clients or outcomes. Anything still
 * outstanding is listed in `needs`, which is never rendered.
 */
export const projects: Project[] = [
  {
    id: "recordmate",
    name: "RecordMate",
    category: "independent",
    status: "in-development",
    kind: "Independent project",
    // Sourced from the project's own README — confirm before this goes live.
    summary:
      "A hyperlocal platform for students coordinating help with physical college record books. Requesters post tasks, nearby providers accept them, and the two sides chat and rate each other once the work is done.",
    year: null,
    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
    ],
    liveUrl: null,
    caseStudyUrl: null,
    repoUrl: null,
    // No real asset yet — renders the branded placeholder.
    preview: null,
    detail: null,
    published: true,
    needs: [
      "Confirm the summary and tech list (taken from the repo README)",
      "Year or date range",
      "Screenshots",
      "Video walkthrough",
      "GitHub URL, if the repo should be public",
      "Problem / approach / implementation write-up for a detail page",
    ],
  },

  {
    id: "gotax",
    name: "GoTax",
    category: "live",
    status: "case-study-soon",
    kind: "AI tax platform",
    // Deliberately no summary: the row carries the name and what it is until
    // there is a written account of our actual contribution to stand behind.
    summary: null,
    year: null,
    technologies: [],
    liveUrl: null,
    caseStudyUrl: null,
    repoUrl: null,
    // No real asset yet — renders the branded placeholder.
    preview: null,
    detail: null,
    published: true,
    needs: [
      "Exactly what Octalink built vs. what already existed",
      "Live URL",
      "One-line summary for the row",
      "Technologies actually used",
      "Year or date range",
      "Screenshots for the case study",
    ],
  },

  {
    // Placeholder row holding the category open. Replace with real entries
    // (one per experiment) rather than editing this one in place.
    id: "experiments",
    name: "Experiments",
    category: "experiment",
    status: "coming-soon",
    kind: null,
    summary:
      "Studies in WebGL, motion and interface — where technique gets tested before it reaches client work.",
    year: null,
    technologies: [],
    liveUrl: null,
    caseStudyUrl: null,
    repoUrl: null,
    // No real asset yet — renders the branded placeholder.
    preview: null,
    detail: null,
    published: true,
    needs: [
      "Write up the first experiment and replace this placeholder row",
    ],
  },

  {
    id: "phishsite",
    name: "PhishSite",
    category: "independent",
    status: "prototype",
    kind: "Independent project",
    year: null,
    summary: null,
    technologies: [],
    liveUrl: null,
    caseStudyUrl: null,
    repoUrl: null,
    // No real asset yet — renders the branded placeholder.
    preview: null,
    detail: null,
    published: false,
    needs: [
      "What it is and who it is for — one or two sentences",
      "Technologies used",
      "Year or date range",
      "Screenshots and/or video walkthrough",
      "GitHub URL, if appropriate",
      "Whether the subject matter needs framing as security research",
    ],
  },

  {
    id: "dragontap",
    name: "DragonTap",
    category: "independent",
    status: "prototype",
    kind: "Independent project",
    year: null,
    summary: null,
    technologies: [],
    liveUrl: null,
    caseStudyUrl: null,
    repoUrl: null,
    // No real asset yet — renders the branded placeholder.
    preview: null,
    detail: null,
    published: false,
    needs: [
      "What it is and who it is for — one or two sentences",
      "Technologies used",
      "Year or date range",
      "Screenshots and/or video walkthrough",
      "GitHub URL, if appropriate",
      "Live URL, if it is deployed anywhere",
    ],
  },
];

export const publishedProjects: Project[] = projects.filter((p) => p.published);
