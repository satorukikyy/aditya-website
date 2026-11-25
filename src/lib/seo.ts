import type { Metadata } from "next";
import {
  SITE_DATA,
  SITE_URL,
  getDomainInfo,
  type FaqItem,
  type JournalPost,
  type ProjectItem,
} from "@/data/site";

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
  const canonicalUrl = `${SITE_URL}${path === "/" ? "" : path}`;
  const fullTitle = title
    ? `${title} — ${SITE_DATA.profile.name}`
    : `${SITE_DATA.profile.name} — ${SITE_DATA.profile.role}`;

  return {
    title,
    description,
    keywords: [
      "Rizky Aditya",
      "onerrorkx",
      "Cybersecurity Portfolio",
      "VAPT",
      "Penetration Testing",
      "Bug Bounty",
      "Bug Hunter",
      "IT GRC",
      "Governance Risk and Compliance",
      "ISO 27001:2022",
      "Incident Management",
      "SOC",
      "Wazuh",
      "Elastic Stack",
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
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: SITE_DATA.profile.handle,
    },
  };
}

/**
 * Root Schema.org Graph (SEO + AEO + GEO Entity Identity)
 */
export function buildRootJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_DATA.profile.name,
        alternateName: SITE_DATA.profile.handle,
        url: SITE_URL,
        jobTitle: SITE_DATA.profile.role,
        description: SITE_DATA.profile.tagline,
        email: `mailto:${SITE_DATA.profile.email}`,
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
        sameAs: SITE_DATA.profile.sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_DATA.profile.name,
        description: SITE_DATA.profile.tagline,
        inLanguage: "en-US",
        publisher: { "@id": `${SITE_URL}/#person` },
        author: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
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
  const url = `${SITE_URL}/project/${project.slug}`;

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
    keywords: [...project.frameworks, ...project.stack].join(", "),
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-US",
  };
}

export function buildJournalJsonLd(post: JournalPost) {
  const url = `${SITE_URL}/journal/${post.slug}`;

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
    inLanguage: "en-US",
  };
}
