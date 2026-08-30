"use client";

import { useId, useState } from "react";
import { faqs } from "@/content/faq";
import type { FaqItem } from "@/types/content";
import { Section, SectionHeader } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { cn } from "@/lib/utils/cn";

export function Faq() {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <Section id="faq" labelledBy="faq-title" className="hairline-t">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <SectionHeader
          eyebrow="FAQ"
          id="faq-title"
          title="Questions we get asked first."
        />

        <ul>
          {faqs.map((faq) => (
            <Reveal key={faq.id} as="li">
              <AccordionItem
                faq={faq}
                open={open === faq.id}
                onToggle={() => setOpen(open === faq.id ? null : faq.id)}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function AccordionItem({
  faq,
  open,
  onToggle,
}: {
  faq: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <div className="border-t border-line last:border-b">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-accent"
        >
          <span className="text-base font-medium leading-snug md:text-lg">
            {faq.question}
          </span>
          <span
            aria-hidden="true"
            className="relative mt-2 block h-3 w-3 shrink-0"
          >
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
            <span
              className={cn(
                "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-[400ms] ease-out-expo",
                open ? "scale-y-0" : "scale-y-100",
              )}
            />
          </span>
        </button>
      </h3>

      {/* grid-rows trick animates height without measuring or JS. */}
      <div
        id={panelId}
        role="region"
        hidden={!open}
        className="grid grid-rows-[1fr] pb-7"
      >
        <p className="max-w-2xl overflow-hidden text-sm leading-relaxed text-muted">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}
