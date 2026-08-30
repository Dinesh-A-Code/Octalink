import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";
import { SectionMotion } from "./SectionMotion";

export function Section({
  id,
  children,
  className,
  bare = false,
  labelledBy,
  /** Opt out of the shared entrance — the hero owns its own choreography. */
  motion = true,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Skip the container when the section manages its own full-bleed layout. */
  bare?: boolean;
  labelledBy?: string;
  motion?: boolean;
}) {
  const content = bare ? children : <Container>{children}</Container>;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative py-section", className)}
    >
      {motion ? <SectionMotion>{content}</SectionMotion> : content}
    </section>
  );
}

/**
 * Eyebrow + heading pair used at the top of every section. The `data-motion`
 * hooks let the section's client wrapper choreograph these without this
 * component needing to be a client component itself.
 */
export function SectionHeader({
  eyebrow,
  title,
  id,
  intro,
  className,
}: {
  eyebrow: string;
  title: string;
  id?: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <span data-motion="eyebrow" className="eyebrow block">
        {eyebrow}
      </span>
      <h2 data-motion="heading" id={id} className="mt-5 text-h2">
        {title}
      </h2>
      {intro ? (
        <p
          data-motion="intro"
          className="mt-6 max-w-xl text-lead leading-relaxed text-muted"
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
