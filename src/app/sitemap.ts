import type { MetadataRoute } from "next";
import { SITE_DATA, SITE_URL } from "@/data/site";
import { LAST_UPDATED } from "@/lib/seo";

// Canonical, indexable pages only (every URL here returns 200 and is not noindex).
// lastModified comes from content dates, so it only changes when content does.
export default function sitemap(): MetadataRoute.Sitemap {
  const site = new Date(LAST_UPDATED);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: site, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: site, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/experience`, lastModified: site, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/project`, lastModified: site, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/journal`, lastModified: site, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: site, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = SITE_DATA.projects.map((project) => ({
    url: `${SITE_URL}/project/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const journalRoutes: MetadataRoute.Sitemap = SITE_DATA.journal.map((post) => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...journalRoutes, ...projectRoutes];
}

export const dynamic = "force-static";
