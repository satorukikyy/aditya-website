import type { MetadataRoute } from "next";
import { SITE_DATA, SITE_URL } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/experience`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/project`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/journal`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/llms-full.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = SITE_DATA.projects.map(
    (project) => ({
      url: `${SITE_URL}/project/${project.slug}`,
      lastModified: new Date(project.date),
      changeFrequency: "monthly",
      priority: 0.85,
    })
  );

  const journalRoutes: MetadataRoute.Sitemap = SITE_DATA.journal.map(
    (post) => ({
      url: `${SITE_URL}/journal/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...projectRoutes, ...journalRoutes];
}

export const dynamic = "force-static";
