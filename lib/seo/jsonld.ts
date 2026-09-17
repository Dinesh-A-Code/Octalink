import { SITE_URL, site, socialLinks } from "@/content/site";
import { services } from "@/content/services";
import { faqs } from "@/content/faq";
import { team } from "@/content/team";
import type { Project } from "@/types/content";

/**
 * ProfessionalService describes a studio selling services more precisely
 * than Organization. No aggregateRating/review — there is no real review
 * data, and inventing it would be both false and a schema violation.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: site.name,
    url: SITE_URL,
    description: site.description,
    founder: team.map((person) => ({
      "@type": "Person",
      name: person.name,
      jobTitle: person.role,
    })),
    areaServed: { "@type": "Place", name: "Worldwide" },
    sameAs: socialLinks.filter((l) => l.href).map((l) => l.href),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.promise,
        },
      })),
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * CreativeWork rather than SoftwareApplication: not every project here can
 * back up an "application" claim yet, and CreativeWork makes no such claim.
 * Only fields backed by real project data are included — no ratings,
 * reviews, download counts, or invented application categories.
 */
export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/work/${project.id}#project`,
    name: project.name,
    ...(project.summary ? { description: project.summary } : {}),
    ...(project.liveUrl ? { url: project.liveUrl } : {}),
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
    ...(project.technologies.length > 0
      ? { keywords: project.technologies.join(", ") }
      : {}),
    creator: { "@type": "Organization", name: site.name, url: SITE_URL },
    isPartOf: { "@id": `${SITE_URL}/#organization` },
  };
}
