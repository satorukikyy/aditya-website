export const runtime = 'edge'

import type { MetadataRoute } from 'next'

// AI/generative engine crawlers explicitly allowed (GEO — generative engine optimization)
const aiCrawlers = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'PerplexityBot',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onerrorkx.pages.dev'
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...aiCrawlers.map(userAgent => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
