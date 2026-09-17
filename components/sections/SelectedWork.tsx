"use client";

import { useRef } from "react";
import { publishedProjects } from "@/content/projects";
import type { Project, ProjectStatus } from "@/types/content";
import { Section } from "@/components/primitives/Section";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { ProjectPreview } from "@/components/sections/ProjectPreview";
import { gsap, useGSAP, MOTION, registerGsap } from "@/lib/gsap/gsapConfig";
import { getMotionTier, motionFor, TOGGLE } from "@/lib/motion/tier";

const STATUS_LABEL: Record<ProjectStatus, string | null> = {
  live: null, // a live URL already says this
  "in-development": "In development",
  "landing-live": "Landing page live · In development",
  "case-study-soon": "Case study coming soon",
  "coming-soon": "Coming soon",
  prototype: "Prototype",
  archived: "Archived",
};

/**
 * What the primary link is called, keyed by status so the label matches what
 * a visitor will actually find — a project still "in development" gets a
 * preview, not a finished site.
 */
const LIVE_LINK_LABEL: Record<ProjectStatus, string> = {
  live: "Visit site",
  "in-development": "Live preview",
  "landing-live": "Visit site",
  "case-study-soon": "Visit site",
  "coming-soon": "Visit site",
  prototype: "Visit site",
  archived: "Visit site",
};

/** Shared entry point so every trigger in the section fires on the same line. */
const ENTER = "top 84%";

/** Desktop-only interactions are gated on a real pointer, not on width. */
function hasFinePointer(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}

export function SelectedWork() {
  return (
    <Section id="work" labelledBy="work-title" className="hairline-t">
      <div>
        {/* Eyebrow and intro are choreographed by the shared SectionMotion
            wrapper; only the heading needs the richer line-mask treatment. */}
        <div className="max-w-3xl">
          <span data-motion="eyebrow" className="eyebrow block">
            Selected work
          </span>

          <SplitReveal as="h2" id="work-title" delay={0.12} className="mt-5 text-h2">
            Projects, and the thinking behind them.
          </SplitReveal>

          <p
            data-motion="intro"
            className="mt-6 max-w-xl text-lead leading-relaxed text-muted"
          >
            A selection of products, experiments, and digital experiences
            we&apos;ve built.
          </p>
        </div>

        {/* One list in priority order. What each project *is* rides on the row
            itself, so a short portfolio reads as a running order rather than
            as categories with gaps in them. */}
        <ul className="mt-16 border-b border-line md:mt-20">
          {publishedProjects.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={String(i + 1).padStart(2, "0")}
              showDivider={i > 0}
            />
          ))}
        </ul>
      </div>
    </Section>
  );
}

function ProjectRow({
  project,
  index,
  showDivider,
}: {
  project: Project;
  index: string;
  showDivider: boolean;
}) {
  const row = useRef<HTMLLIElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = row.current;
      const tier = getMotionTier();
      if (!el || tier === "none") return;

      const q = gsap.utils.selector(el);
      const parallax = q("[data-parallax]")[0];
      const follow = q("[data-follow]")[0];
      const frame = q("[data-frame]")[0];
      const media = q("[data-media]")[0];
      const m = motionFor(tier);

      // Entrance, in reading order: rule, number, title, description,
      // then the preview unmasks last as the payoff.
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: ENTER, toggleActions: TOGGLE },
          defaults: { ease: MOTION.ease, duration: m.duration },
        })
        .fromTo(
          q("[data-rule]"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "power2.out" },
          0,
        )
        .fromTo(q("[data-num]"), { y: m.distance * 0.45, opacity: 0 }, { y: 0, opacity: 1 }, 0.06)
        .fromTo(q("[data-head]"), { y: m.distance * 0.6, opacity: 0 }, { y: 0, opacity: 1 }, 0.15)
        .fromTo(
          q("[data-body]"),
          { y: m.distance * 0.5, opacity: 0 },
          { y: 0, opacity: 1, stagger: m.stagger },
          0.26,
        )
        .fromTo(
          frame,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "power3.out" },
          0.34,
        )
        .fromTo(
          parallax,
          { scale: 1.08 },
          { scale: 1, duration: 1.35, ease: "power3.out" },
          0.34,
        );

      if (!m.parallax || !m.pointer || !hasFinePointer()) return;

      // A small drift through the frame as the row crosses the viewport —
      // enough to feel alive, not enough to read as a parallax effect.
      gsap.to(parallax, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Preview sits back until the row is addressed, then comes forward.
      gsap.set(frame, { opacity: 0.76 });

      const xTo = gsap.quickTo(follow, "x", { duration: 0.9, ease: "power3" });
      const yTo = gsap.quickTo(follow, "y", { duration: 0.9, ease: "power3" });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        // Normalised to −1..1, then held to a few pixels: the preview
        // acknowledges the pointer, it does not chase it.
        xTo(((e.clientX - r.left) / r.width - 0.5) * 18);
        yTo(((e.clientY - r.top) / r.height - 0.5) * 14);
      };

      const enter = () => {
        gsap.to(frame, { opacity: 1, duration: 0.5, ease: "power3.out" });
        gsap.to(media, { scale: 1.07, duration: 0.9, ease: "power3.out" });
      };

      const leave = () => {
        gsap.to(frame, { opacity: 0.76, duration: 0.45, ease: "power3.out" });
        gsap.to(media, { scale: 1.03, duration: 0.9, ease: "power3.out" });
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: row },
  );

  // Explicit destinations rather than one row-wide link: a project can have
  // a live site, a case study and a repo, and those are not interchangeable.
  const links = [
    project.liveUrl
      ? { label: LIVE_LINK_LABEL[project.status], href: project.liveUrl }
      : null,
    project.caseStudyUrl
      ? { label: "Read case study", href: project.caseStudyUrl }
      : null,
    project.repoUrl ? { label: "GitHub", href: project.repoUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  const statusLabel = STATUS_LABEL[project.status];

  return (
    <li ref={row} className="group relative">
      <span
        data-rule
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-line"
      />

      {showDivider ? (
        // Octahedron in miniature, sitting on the rule between projects —
        // the hero's mark used as punctuation rather than repeated as a scene.
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 hidden h-1.5 w-1.5 -translate-y-1/2 rotate-45 border border-line-strong bg-bg md:block"
        />
      ) : null}

      <div className="relative z-10 py-12 md:py-16">
        {/* The preview now carries as much of the row as the type does. */}
        <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
          <div
            data-num
            className="flex items-baseline justify-between font-mono text-xs tracking-[0.16em] text-faint lg:block"
          >
            <span>{index}</span>
            {project.year ? (
              <span className="lg:hidden">{project.year}</span>
            ) : null}
          </div>

          <div>
            <div
              data-head
              className="flex flex-wrap items-baseline gap-x-4 gap-y-2"
            >
              <h3 className="text-h3 transition-transform duration-500 ease-out-expo md:group-hover:translate-x-2">
                {project.name}
              </h3>
              {project.kind ? (
                <span className="eyebrow">{project.kind}</span>
              ) : null}
              {statusLabel ? (
                <span className="rounded-sharp border border-line px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-faint">
                  {statusLabel}
                </span>
              ) : null}
            </div>

            {project.summary ? (
              <p
                data-body
                className="mt-4 max-w-xl text-sm leading-relaxed text-muted"
              >
                {project.summary}
              </p>
            ) : null}

            {project.technologies.length > 0 ? (
              <ul data-body className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            ) : null}

            {links.length > 0 ? (
              <div data-body className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/cta inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-accent"
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className="text-xs transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </a>
                ))}
              </div>
            ) : null}

            {project.year ? (
              <span
                data-body
                className="mt-6 hidden font-mono text-xs tracking-[0.16em] text-faint lg:block"
              >
                {project.year}
              </span>
            ) : null}
          </div>

          {/* Three nested layers keep the transforms from fighting: the
              frame masks and fades, the follow layer answers the pointer,
              the parallax layer drifts on scroll. */}
          <div data-frame className="overflow-hidden">
            <div data-follow>
              <div data-parallax>
                <ProjectPreview source={project.preview} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
