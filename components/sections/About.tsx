import { team } from "@/content/team";
import { site } from "@/content/site";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";

export function About() {
  return (
    <Section id="about" labelledBy="about-title" className="hairline-t">
      <SectionHeader
        eyebrow="About"
        id="about-title"
        title="The two people you will be working with."
        intro={`${site.name} is ${site.operators.join(" and ")}. No account managers, no rotating team — the people you brief are the people who build it.`}
      />

      <div className="mt-16 grid gap-px border border-line bg-line md:mt-20 md:grid-cols-2">
        {team.map((person) => (
          <Reveal key={person.id} className="bg-bg p-8 lg:p-12">
            <div className="flex items-baseline justify-between gap-6">
              <h3 className="text-h3">{person.name}</h3>
              <span className="eyebrow shrink-0">{person.role}</span>
            </div>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
              {person.bio}
            </p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {person.focus.map((item) => (
                <li
                  key={item}
                  className="rounded-sharp border border-line px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
