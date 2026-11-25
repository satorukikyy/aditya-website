import type { Metadata } from "next";
import {
  PROJECT_DOMAINS,
  SITE_DATA,
  SITE_URL,
  getDomainInfo,
  type FaqItem,
  type JournalPost,
  type ProjectItem,
} from "@/data/site";

const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630 };

export const DEFAULT_TITLE = `${SITE_DATA.profile.name} | ${SITE_DATA.profile.role}`;

/** Newest date anywhere in the content (YYYY-MM-DD). Drives sitemap lastmod and llms "last updated". */
export const LAST_UPDATED = [
  ...SITE_DATA.projects.map((p) => p.date),
  ...SITE_DATA.journal.map((j) => j.updatedAt),
]
  .sort()
  .at(-1) as string;

const absolute = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords = [],
}: {
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}): Metadata {
  const canonicalUrl = absolute(path);
  const fullTitle = title ? `${title} | ${SITE_DATA.profile.name}` : DEFAULT_TITLE;

  return {
    // Omit the key entirely when there is no page title, so the layout's default title applies.
    ...(title ? { title } : {}),
    description,
    keywords: [
      "Rizky Aditya",
      "satorukikyy",
      "onerrorkx",
      "IT GRC Consultant",
      "Penetration Tester",
      "Bug Hunter",
      "VAPT Indonesia",
      "ISO 27001 Lead Auditor",
      "UU PDP",
      ...keywords,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_DATA.profile.name,
      locale: "en_US",
      type,
      images: [{ ...OG_IMAGE, alt: fullTitle }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: SITE_DATA.profile.handle,
      images: [OG_IMAGE.url],
    },
  };
}

/**
 * Root Schema.org graph: the Person entity (credentials, expertise, services) plus the WebSite.
 * Everything is built from SITE_DATA, so editing data keeps structured data in sync.
 */
export function buildRootJsonLd() {
  const personId = `${SITE_URL}/#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: SITE_DATA.profile.name,
        alternateName: [SITE_DATA.profile.handle, "satorukikyy", "onerrorkx", "kxs3c"],
        url: SITE_URL,
        mainEntityOfPage: `${SITE_URL}/about`,
        jobTitle: SITE_DATA.profile.role,
        description: SITE_DATA.profile.tagline,
        email: `mailto:${SITE_DATA.profile.email}`,
        knowsLanguage: ["id", "en"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "South Jakarta",
          addressRegion: "DKI Jakarta",
          addressCountry: "ID",
        },
        worksFor: {
          "@type": "Organization",
          name: "Whitesec (ID, AU, UK, CA)",
        },
        hasCredential: SITE_DATA.about.certifications.map((c) => ({
          "@type": "EducationalOccupationalCredential",
          name: c.name,
          credentialCategory: "certification",
          recognizedBy: { "@type": "Organization", name: c.issuer },
        })),
        knowsAbout: [
          "IT Governance, Risk, and Compliance (IT GRC)",
          "ISO/IEC 27001:2022",
          "ISO/IEC 27701:2025",
          "ISO/IEC 42001:2023",
          "ISO 9001:2015",
          "UU PDP Compliance",
          "SOC Type 2 & Essential Eight",
          "Information Security Management System (ISMS)",
          "Penetration Testing (Web, Mobile, API VAPT)",
          "OWASP WSTG & PTES",
          "Bug Bounty & Security Research",
          "Incident Management & Root Cause Analysis",
          "Security Operations Center (SOC)",
          "Wazuh SIEM & Elastic Stack (ELK)",
          "pfSense Network Security",
        ],
        makesOffer: PROJECT_DOMAINS.filter((d) => d.id !== "bug-bounty").map((d) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: d.label,
            description: d.description,
            provider: { "@id": personId },
            areaServed: ["ID", "AU", "GB", "CA"],
          },
        })),
        sameAs: SITE_DATA.profile.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_DATA.profile.name,
        description: SITE_DATA.profile.tagline,
        inLanguage: "en",
        publisher: { "@id": personId },
        author: { "@id": personId },
      },
    ],
  };
}

export function buildProfilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about#profile`,
    url: `${SITE_URL}/about`,
    name: `About ${SITE_DATA.profile.name}`,
    inLanguage: "en",
    dateModified: LAST_UPDATED,
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

/** Listing pages (/project, /journal) as a CollectionPage with an ItemList of detail URLs. */
export function buildItemListJsonLd({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absolute(path)}#collection`,
    url: absolute(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        url: absolute(item.path),
      })),
    },
  };
}

export function buildFaqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildProjectJsonLd(project: ProjectItem) {
  const domain = getDomainInfo(project.domain);
  const url = absolute(`/project/${project.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.title,
    description: project.summary,
    datePublished: project.date,
    dateModified: project.date,
    url,
    mainEntityOfPage: url,
    articleSection: domain.label,
    about: domain.label,
    keywords: [...project.frameworks, ...project.stack].join(", "),
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "en",
  };
}

export function buildJournalJsonLd(post: JournalPost) {
  const url = absolute(`/journal/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    abstract: post.tldr,
    datePublished: post.date,
    dateModified: post.updatedAt,
    url,
    mainEntityOfPage: url,
    articleSection: post.category,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "en",
  };
}
