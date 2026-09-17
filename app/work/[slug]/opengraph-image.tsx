import { ImageResponse } from "next/og";
import { publishedProjects } from "@/content/projects";
import { site } from "@/content/site";
import { getStatusLabel } from "@/lib/projectLinks";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Octalink project overview";

export function generateStaticParams() {
  return publishedProjects.map((project) => ({ slug: project.id }));
}

export default async function ProjectOpengraphImage(
  props: PageProps<"/work/[slug]">,
) {
  const { slug } = await props.params;
  const project = publishedProjects.find((p) => p.id === slug);

  const name = project?.name ?? site.name;
  const summary = project?.summary ?? site.description;
  const statusLabel = project ? getStatusLabel(project.status) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          color: "#f5f4f0",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.24em",
            fontWeight: 600,
          }}
        >
          {site.name.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 960,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#8a8a8f",
              maxWidth: 820,
            }}
          >
            {summary}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#8a8a8f",
            letterSpacing: "0.1em",
          }}
        >
          {(statusLabel ?? "LIVE").toUpperCase()}
        </div>
      </div>
    ),
    size,
  );
}
