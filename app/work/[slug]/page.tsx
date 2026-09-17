import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publishedProjects, hasMeaningfulDetail } from "@/content/projects";
import { SITE_URL, site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/primitives/Container";
import { ProjectBackLink } from "@/components/project/ProjectBackLink";
import { ProjectHero } from "@/components/project/ProjectHero";
import { ProjectSection } from "@/components/project/ProjectSection";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectStatusNote } from "@/components/project/ProjectStatusNote";
import { ProjectLinks } from "@/components/project/ProjectLinks";
import { projectJsonLd } from "@/lib/seo/jsonld";
import { getExternalProjectLinks } from "@/lib/projectLinks";
import type { Project } from "@/types/content";

function findProject(slug: string): Project | null {
  return publishedProjects.find((project) => project.id === slug) ?? null;
}

export function generateStaticParams() {
  return publishedProjects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = findProject(slug);
  if (!project) return {};

  const description = project.summary ?? `${project.name} — a project by ${site.name}.`;
  const url = `${SITE_URL}/work/${project.id}`;
  const title = project.name;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${title} · ${site.name}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${site.name}`,
      description,
    },
    // A project without any written detail yet is a thin page — worth
    // reaching by direct link, not worth a search result until there's more
    // to find there.
    robots: hasMeaningfulDetail(project)
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

export default async function ProjectDetailPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = findProject(slug);
  if (!project) notFound();

  const detail = project.detail;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />
      <Header />
      <main id="main">
        <Container className="pb-20 pt-28 md:pt-32">
          <ProjectBackLink />

          <div className="mt-10 md:mt-14">
            <ProjectHero project={project} />
          </div>

          <ProjectSection title="Overview" body={detail?.overview ?? null} />
          <ProjectSection title="The problem" body={detail?.problem ?? null} />
          <ProjectSection title="Our approach" body={detail?.approach ?? null} />
          <ProjectSection title="Implementation" body={detail?.implementation ?? null} />

          <ProjectGallery
            screenshots={detail?.screenshots ?? []}
            video={detail?.video ?? null}
          />

          {project.technologies.length > 0 ? (
            <div className="border-t border-line py-14 md:py-16">
              <h2 className="text-h3">Technology</h2>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="font-mono text-xs uppercase tracking-[0.14em] text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <ProjectStatusNote project={project} />

          {getExternalProjectLinks(project).length > 0 ? (
            <div className="border-t border-line py-14 md:py-16">
              <h2 className="text-h3">Links</h2>
              <div className="mt-6">
                <ProjectLinks project={project} />
              </div>
            </div>
          ) : null}

          <div className="border-t border-line pt-10">
            <ProjectBackLink />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
