"use client";

import { useRef } from "react";
import { processSteps } from "@/content/process";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap/gsapConfig";
import { prefersReducedMotion } from "@/lib/utils/motion";

export function Process() {
  const root = useRef<HTMLDivElement>(null);

  // The rule draws itself as you scroll the section — the one place on the
  // page where motion carries meaning rather than decoration.
  useGSAP(
    () => {
      registerGsap();
      if (prefersReducedMotion() || !root.current) return;

      gsap.fromTo(
        "[data-rule]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 65%",
            end: "bottom 85%",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <Section id="process" labelledBy="process-title" className="hairline-t">
      <SectionHeader
        eyebrow="Process"
        id="process-title"
        title="How a project actually runs."
        intro="Six stages, in order. You always know which one we are in and what happens next."
      />

      <div ref={root} className="relative mt-16 md:mt-20">
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 hidden h-full w-px bg-line md:block"
        >
          <span
            data-rule
            className="absolute inset-0 block origin-top bg-accent"
          />
        </div>

        <ol className="flex flex-col md:pl-12 lg:pl-20">
          {processSteps.map((step) => (
            <Reveal
              key={step.id}
              as="li"
              className="grid gap-3 border-t border-line py-8 last:border-b md:grid-cols-[6rem_1fr] md:gap-10 md:py-10"
            >
              <span className="font-mono text-xs tracking-[0.16em] text-faint">
                {step.index}
              </span>
              <div className="grid gap-3 lg:grid-cols-[16rem_1fr] lg:gap-10">
                <h3 className="text-h3">{step.title}</h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
