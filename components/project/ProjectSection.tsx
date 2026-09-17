import { Reveal } from "@/components/primitives/Reveal";

/**
 * One heading + prose block, reused for overview/problem/approach/
 * implementation rather than four near-identical components. Renders
 * nothing when there's no body yet, so an unfinished project's page still
 * looks intentional rather than showing empty sections.
 */
export function ProjectSection({
  title,
  body,
}: {
  title: string;
  body: string | null;
}) {
  if (!body) return null;

  return (
    <Reveal className="border-t border-line py-14 md:py-16">
      <h2 className="text-h3">{title}</h2>
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
        {body}
      </p>
    </Reveal>
  );
}
