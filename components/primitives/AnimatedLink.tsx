import { cn } from "@/lib/utils/cn";

/** Underline wipes in from the left on hover/focus — CSS only, no JS cost. */
export function AnimatedLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={cn(
        "group relative inline-block text-fg transition-colors duration-300 hover:text-accent",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[400ms] ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </a>
  );
}
