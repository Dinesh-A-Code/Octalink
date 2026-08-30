import { principles } from "@/content/principles";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";

export function WhyOctalink() {
  return (
    <Section id="why" labelledBy="why-title" className="hairline-t">
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <SectionHeader
          eyebrow="Why Octalink"
          id="why-title"
          title="Small studio. Fewer hand-offs."
          intro="Two people who design and build the same product means fewer meetings, fewer misunderstandings, and a shorter line between the idea and the thing that ships."
        />

        <ul className="grid gap-px bg-line sm:grid-cols-2">
          {principles.map((principle) => (
            <Reveal key={principle.id} as="li" className="bg-bg p-7">
              <h3 className="text-base font-medium leading-snug text-fg">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {principle.description}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
