import { services } from "@/content/services";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";

export function Services() {
  return (
    <Section id="services" labelledBy="services-title" className="hairline-t">
      <SectionHeader
        eyebrow="Services"
        id="services-title"
        title="Three things, done properly."
        intro="We keep the offering narrow on purpose. Everything below is work we do ourselves, end to end."
      />

      <div className="mt-16 grid gap-px border border-line bg-line md:mt-20 md:grid-cols-3">
        {services.map((service) => (
          <Reveal
            key={service.id}
            stagger
            className="flex flex-col bg-bg p-8 lg:p-10"
          >
            <span className="font-mono text-xs tracking-[0.16em] text-faint">
              {service.index}
            </span>

            <h3 className="mt-8 text-h3">{service.title}</h3>
            <p className="mt-3 text-base font-medium text-fg">
              {service.promise}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {service.description}
            </p>

            <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-6">
              {service.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-muted"
                >
                  <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-accent" />
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
