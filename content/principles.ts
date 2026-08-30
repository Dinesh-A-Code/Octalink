import type { Principle } from "@/types/content";

/** "Why Octalink" — capability and working-method claims only, no metrics. */
export const principles: Principle[] = [
  {
    id: "design-and-build",
    title: "Design and build, one team",
    description:
      "The people designing your site are the people writing its code. Nothing gets lost in a handoff, and nothing gets designed that can't be built well.",
  },
  {
    id: "performance",
    title: "Performance is a design decision",
    description:
      "Weight, loading order and animation cost are decided while we design, not audited afterwards. A site that looks expensive and loads slowly is just a slow site.",
  },
  {
    id: "modern-stack",
    title: "Current tools, chosen deliberately",
    description:
      "We work with a modern stack because it produces faster, more maintainable products — not for novelty. Every dependency has to earn its place.",
  },
  {
    id: "responsive",
    title: "Designed for every screen it lands on",
    description:
      "Mobile layouts are designed, not shrunk. Each breakpoint gets its own composition, because most of your visitors will only ever see one of them.",
  },
  {
    id: "communication",
    title: "Direct communication",
    description:
      "You talk to the people doing the work. Regular progress you can look at in a browser, plain answers about scope and timing, no account-management layer.",
  },
  {
    id: "business-goals",
    title: "Built around your objective",
    description:
      "We start with what the project is supposed to achieve — enquiries, sign-ups, credibility, hours saved — and design against that, not against a trend.",
  },
];
