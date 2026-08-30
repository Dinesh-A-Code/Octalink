import type { Person } from "@/types/content";

/** Placeholder bios — written to be replaced with real ones. */
export const team: Person[] = [
  {
    id: "dinesh",
    name: "Dinesh",
    role: "Design & Development",
    bio: "Works across interface design and frontend engineering, which means the visual decisions and the technical ones get made in the same conversation. Spends most of the time on the part of a product people actually touch.",
    focus: ["Interface design", "Frontend", "Motion"],
  },
  {
    id: "david",
    name: "David",
    role: "Development & Systems",
    bio: "Handles the parts that have to keep working — application logic, data, deployment and everything behind the interface. Prefers boring, dependable architecture and reserves the clever solutions for where they earn their keep.",
    focus: ["Application development", "Backend", "Infrastructure"],
  },
];
