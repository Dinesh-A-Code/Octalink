import type { FaqItem } from "@/types/content";

export const faqs: FaqItem[] = [
  {
    id: "start",
    question: "How does a project start?",
    answer:
      "You send us a short description of what you need through the form below. We reply with questions, then set up a call to work out whether the project is a fit. If it is, you get a written proposal covering scope, sequence and timeline before anything is committed.",
  },
  {
    id: "timeline",
    question: "How long does a website take?",
    answer:
      "It depends on scope, and we give you a specific timeline in the proposal rather than a generic estimate. As a rough shape: a focused landing page is measured in weeks, a multi-page business site takes longer, and an application depends almost entirely on how much it has to do.",
  },
  {
    id: "applications",
    question: "Can you build custom web applications?",
    answer:
      "Yes. Dashboards, internal tools, booking and scheduling systems, client portals — products with accounts, data and logic behind them. We handle both the interface and the backend, and we will tell you early if something is outside what we can do well.",
  },
  {
    id: "redesign",
    question: "Can you redesign an existing website?",
    answer:
      "Yes, and it is often the better option. We start by looking at what your current site does well and where it loses people, then decide with you whether that means a redesign, a rebuild, or a smaller set of targeted changes.",
  },
  {
    id: "maintenance",
    question: "Do you provide maintenance after launch?",
    answer:
      "Yes. We can stay on for updates, changes and monitoring after launch, arranged either as an ongoing agreement or ad hoc. If you would rather maintain it yourself, we hand over documented code and walk your team through it.",
  },
  {
    id: "branding",
    question: "Can you work with our existing branding?",
    answer:
      "Yes. If you have brand guidelines, we design within them. If your identity is partial or dated, we can extend it for the web — typography, colour, layout and motion — without redoing your brand from scratch.",
  },
  {
    id: "pricing",
    question: "How do you price projects?",
    answer:
      "Per project, quoted after we understand the scope, so you are not paying against an open-ended hourly clock. The proposal states what is included and what would count as a change in scope. We do not publish a price list because the number would be meaningless without the brief.",
  },
  {
    id: "involvement",
    question: "How much of our time will this take?",
    answer:
      "Most of it is front-loaded: the discovery conversation and the design review. During the build we work in visible increments, so reviewing progress is usually a short call and a look in your browser rather than a long meeting.",
  },
];
