import Link from "next/link";

/**
 * The one consistent way back to the homepage's project index — used above
 * and below the detail content so it's reachable without relying on the
 * browser's back button.
 */
export function ProjectBackLink() {
  return (
    <Link
      href="/#work"
      className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors duration-300 hover:text-fg"
    >
      <span
        aria-hidden="true"
        className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1"
      >
        &larr;
      </span>
      Back to work
    </Link>
  );
}
