import { Section } from "@/components/primitives/Section";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { Reveal } from "@/components/primitives/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-title" className="hairline-t">
      <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div>
          <span className="eyebrow block">Contact</span>
          <SplitReveal
            as="h2"
            id="contact-title"
            className="mt-6 max-w-[15ch] text-h1"
          >
            Let&rsquo;s build something worth remembering.
          </SplitReveal>

          <Reveal className="mt-10 max-w-md">
            <p className="text-lead leading-relaxed text-muted">
              Tell us what you are working on. If it is a fit we will come back
              with questions, a timeline and a price. If it is not, we will say
              so and point you somewhere better.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
