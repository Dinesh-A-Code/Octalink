import type { NavLink } from "@/types/content";

/**
 * Domain is not chosen yet. Set NEXT_PUBLIC_SITE_URL at build time on
 * Cloudflare; the placeholder only affects absolute URLs in metadata.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://octalink.example";

/** Set to a Formspree / Resend relay / Worker endpoint to activate the form. */
export const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

export const site = {
  name: "Octalink",
  tagline: "Digital studio",
  description:
    "Octalink is an independent digital studio building landing pages, business websites and web applications for ambitious companies.",
  founded: "2025",
  operators: ["Dinesh", "David"],
} as const;

export const navLinks: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

/** Empty href renders as a non-interactive label until real profiles exist. */
export const socialLinks: NavLink[] = [
  { label: "GitHub", href: "" },
  { label: "LinkedIn", href: "" },
  { label: "Dribbble", href: "" },
  { label: "X", href: "" },
];
