import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { publishedProjects, hasMeaningfulDetail } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  // A project stays out of the sitemap until its detail page has more than
  // a hero to show — no thin pages listed just because `published` is true.
  const projectUrls: MetadataRoute.Sitemap = publishedProjects
    .filter(hasMeaningfulDetail)
    .map((project) => ({
      url: `${SITE_URL}/work/${project.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectUrls,
  ];
}
