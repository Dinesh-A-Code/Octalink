import { testimonials } from "@/content/testimonials";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";

/**
 * Renders the empty state until `content/testimonials.ts` has real,
 * attributable quotes. TestimonialCard is ready for that day.
 */
export function Testimonials() {
  const hasTestimonials = testimonials.length > 0;

  return (
    <Section id="testimonials" labelledBy="testimonials-title" className="hairline-t">
      <SectionHeader
        eyebrow="Client words"
        id="testimonials-title"
        title={
          hasTestimonials
            ? "What clients say."
            : "We would rather show you nothing than something invented."
        }
      />

      {hasTestimonials ? (
        <ul className="mt-16 grid gap-px border border-line bg-line md:mt-20 md:grid-cols-2">
          {testimonials.map((item) => (
            <Reveal key={item.id} as="li" className="bg-bg p-8 lg:p-10">
              <blockquote className="font-display text-xl leading-snug">
                “{item.quote}”
              </blockquote>
              <footer className="mt-6 text-sm text-muted">
                <span className="text-fg">{item.author}</span> — {item.role},{" "}
                {item.company}
              </footer>
            </Reveal>
          ))}
        </ul>
      ) : (
        <Reveal className="mt-12 max-w-2xl border border-line p-8 md:mt-16 md:p-12">
          <p className="text-lead leading-relaxed text-muted">
            Octalink is new. Rather than fill this space with invented quotes,
            we have left it empty until there are real ones to put here — with
            names, roles and companies attached.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            If you would like to talk to someone we have worked with before
            committing, ask us during the first call and we will arrange it.
          </p>
        </Reveal>
      )}
    </Section>
  );
}
