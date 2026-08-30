import type { ProcessStep } from "@/types/content";

export const processSteps: ProcessStep[] = [
  {
    id: "discover",
    index: "01",
    title: "Discover",
    description:
      "We start with the business, not the brief. What the project has to achieve, who it is for, what already works and what is in the way.",
  },
  {
    id: "plan",
    index: "02",
    title: "Plan",
    description:
      "Scope, structure and sequence. You get a clear picture of what is being built, in what order, and what we need from you along the way.",
  },
  {
    id: "design",
    index: "03",
    title: "Design",
    description:
      "Layout, typography, motion and the details in between — designed in full, reviewed with you, and settled before a line of production code is written.",
  },
  {
    id: "build",
    index: "04",
    title: "Build",
    description:
      "Development in visible increments. You can open the work in a browser as it progresses, so feedback happens while it is still cheap to act on.",
  },
  {
    id: "test",
    index: "05",
    title: "Test",
    description:
      "Real devices, real browsers, keyboard and screen reader, slow connections. Performance and accessibility are verified, not assumed.",
  },
  {
    id: "launch",
    index: "06",
    title: "Launch",
    description:
      "Deployment, search setup, analytics and a handover you can act on. Then we stay reachable for whatever the first weeks surface.",
  },
];
