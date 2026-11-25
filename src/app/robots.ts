import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

/**
 * robots.txt optimized for SEO, AEO, and GEO:
 * - Welcomes traditional search engines & modern AI answer/search bots
 * - Protects private/internal paths (/api/, /_next/static chunks not needed for indexing)
 * - Advertises canonical sitemap & host
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt", "/llms-full.txt", "/.well-known/security.txt"],
        disallow: ["/api/", "/private/", "/admin/"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "Bingbot",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/private/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

export const dynamic = "force-static";
