import { personalInfo } from './data'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onerrorkx.pages.dev'
export const SITE_NAME = `${personalInfo.name} — Cybersecurity Portfolio`

// Per-page openGraph replaces the root layout's object wholesale (shallow merge),
// so every page must carry the full set of shared fields itself.
export function pageOpenGraph(title: string, description: string, path: string) {
  return {
    title,
    description,
    url: path,
    siteName: SITE_NAME,
    type: 'website' as const,
    locale: 'en_US',
    alternateLocale: ['id_ID'],
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  }
}
