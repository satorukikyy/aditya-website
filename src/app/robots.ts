import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

// Everything on this site is public on purpose, and AI search and answer engines are
// welcome: being quoted accurately is part of the goal. Crawlers are named explicitly so
// the intent is unambiguous.
const AI_AND_SEARCH_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "CCBot",
  "Amazonbot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

export const dynamic = "force-static";
