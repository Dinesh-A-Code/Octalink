import { technologies } from "@/content/technologies";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";

export function Technologies() {
  return (
    <Section id="technologies" labelledBy="tech-title" className="hairline-t">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end lg:gap-20">
        <div>
          <span className="eyebrow block">Technology</span>
          <h2 id="tech-title" className="mt-5 text-h3">
            Chosen for the job, not the CV.
          </h2>
        </div>

        <Reveal stagger className="flex flex-wrap gap-x-8 gap-y-4">
          {technologies.map((tech) => (
            <span
              key={tech.name}
              className="font-display text-lg text-muted transition-colors duration-300 hover:text-fg md:text-xl"
            >
              {tech.name}
            </span>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
