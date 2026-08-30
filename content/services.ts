import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    id: "landing-pages",
    index: "01",
    title: "Landing Pages",
    promise: "One page that has to do one job well.",
    description:
      "A campaign, a launch, a product with a single argument to make. We build the page around the decision you want a visitor to make, then remove everything that competes with it. Fast to load, clear to read, easy to measure.",
    deliverables: [
      "Messaging and page structure",
      "Custom design and motion",
      "Analytics and conversion tracking",
      "Deployed and ready to iterate",
    ],
  },
  {
    id: "websites",
    index: "02",
    title: "Business Websites",
    promise: "The site your business is judged by.",
    description:
      "Multi-page sites for companies whose credibility depends on how they present online. Structured for search, built to be edited without a developer, and designed so the tenth page looks as considered as the homepage.",
    deliverables: [
      "Information architecture",
      "Design system and page templates",
      "CMS integration if you need one",
      "SEO and performance baseline",
    ],
  },
  {
    id: "applications",
    index: "03",
    title: "Application Software",
    promise: "Software your team actually wants to use.",
    description:
      "Dashboards, internal tools, booking systems, client portals — products with real state, real users and real consequences when they break. We handle the interface and the logic behind it, and we design for the person using it forty times a day.",
    deliverables: [
      "Product and interface design",
      "Frontend and backend development",
      "Authentication and data modelling",
      "Deployment and handover",
    ],
  },
];
