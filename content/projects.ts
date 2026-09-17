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
    id: "notemate",
    name: "NoteMate",
    category: "independent",
    status: "in-development",
    kind: "Independent project",
    // Matches the repo's own description — confirm before this goes live.
    summary:
      "A campus platform connecting students who need help with physical college record books to nearby students willing to take on the work. Requesters post tasks, providers accept them, and the two sides chat and rate each other once it's done.",
    year: null,
    // Verified against the NoteMate repository under Dinesh-A-Code.
    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "Firebase",
    ],
    liveUrl: null,
    caseStudyUrl: null,
    repoUrl: "https://github.com/Dinesh-A-Code/NoteMate",
    // No real asset yet — renders the branded placeholder.
    preview: null,
    detail: null,
    published: true,
    needs: [
      "Year or date range",
      "Screenshots",
      "Video walkthrough",
      "Problem / approach / implementation write-up for a detail page",
    ],
  },

  {
    id: "sd-flowers",
    name: "SD Flowers",
    category: "independent",
    status: "in-development",
    kind: "E-commerce storefront",
    summary:
      "An e-commerce storefront for handmade bouquets, hair accessories and keychains. Browsing, product detail and checkout are fully designed; checkout and order handling are currently simulated rather than backed by a live payment system.",
    year: null,
    // Verified against the sd-flowers repository under Dinesh-A-Code.
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    liveUrl: "https://sdflowers.netlify.app/",
    caseStudyUrl: null,
    repoUrl: "https://github.com/Dinesh-A-Code/sd-flowers",
    // No real asset yet — renders the branded placeholder.
    preview: null,
    detail: null,
    published: true,
    needs: [
      "Wire checkout to a real payment/backend integration before calling it functional",
      "Fix missing SPA-fallback routing (deep links 404 on refresh)",
      "Year or date range",
      "Screenshots",
      "Problem / approach / implementation write-up for a detail page",
    ],
  },

  {
    id: "gotax",
    name: "GoTax",
    category: "live",
    status: "landing-live",
    kind: "AI tax platform",
    // The landing page is live; the assistant it describes is not — do not
    // upgrade this wording without a working product to point at.
    summary:
      "A plain-language income tax and GST assistant for India. The landing page is live and collecting signups; the assistant itself is still pre-launch.",
    year: null,
    // Not listed: this describes the marketing page's own stack, not
    // necessarily the eventual product's — leave empty until that's known.
    technologies: [],
    liveUrl: "https://gotax.site/",
    caseStudyUrl: null,
    repoUrl: null,
    // No real asset yet — renders the branded placeholder.
    preview: null,
    detail: null,
    published: true,
    needs: [
      "Exactly what Octalink built vs. what already existed",
      "Technologies actually used, once the product itself is built",
      "Year or date range",
      "Screenshots for the case study",
      "Update this entry's status once the assistant itself is live",
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
