export const runtime = 'edge'

import { vaptClients, grcCategories, secEngCategories, personalInfo, writings } from '@/lib/data'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onerrorkx.pages.dev'

// Indonesian labels for bilingual item descriptions
const categoryID: Record<string, string> = {
  'Penetration Testing': 'Pengujian Penetrasi',
  'ISO 27001 Implementation': 'Implementasi ISO 27001',
  'Surveillance Audit': 'Audit Surveillance',
  'Compliance Assessment': 'Asesmen Kepatuhan',
  'Security Awareness': 'Program Kesadaran Keamanan',
  'SOC Monitoring': 'Monitoring SOC',
  'Incident Management': 'Manajemen Insiden',
}

function escape(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET() {
  const writingItems = writings
    .filter(p => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => `
    <item>
      <title>${escape(post.title)}</title>
      <description>${escape(post.excerpt)}</description>
      <link>${BASE}/writings/${post.slug}</link>
      <guid isPermaLink="true">${BASE}/writings/${post.slug}</guid>
      <author>${escape(personalInfo.email)} (${escape(personalInfo.name)})</author>
      ${post.tags.map(t => `<category>${escape(t)}</category>`).join('\n      ')}
      <pubDate>${new Date(`${post.date}-01T00:00:00Z`).toUTCString()}</pubDate>
    </item>`)
    .join('')

  const allGRC     = grcCategories.flatMap(c => c.clients.map(cl => ({ ...cl, type: 'grc', category: c.shortLabel })))
  const allSecEng  = secEngCategories.flatMap(c => c.clients.map(cl => ({ ...cl, type: 'sec-eng', category: c.shortLabel })))
  const allVAPT    = vaptClients.map(cl => ({ ...cl, type: 'vapt', category: 'Penetration Testing' }))

  const engagementItems = [...allVAPT, ...allGRC, ...allSecEng]
    .sort((a, b) => b.year - a.year)
    .map((item) => `
    <item>
      <title>${escape(item.name)}</title>
      <description>${escape(item.category)} engagement — ${item.year}. Proyek ${escape(categoryID[item.category] ?? item.category)} — ${item.year}.</description>
      <link>${BASE}/projects/${item.type}</link>
      <guid isPermaLink="false">${escape(item.name)}-${item.year}-${item.type}</guid>
      <author>${escape(personalInfo.email)} (${escape(personalInfo.name)})</author>
      <category>${escape(item.type.toUpperCase())}</category>
      <pubDate>${new Date(Date.UTC(item.year, 0, 1)).toUTCString()}</pubDate>
    </item>`)
    .join('')

  const descEN = `Writings and security engagements by ${personalInfo.name} — GRC consulting, penetration testing, and security operations.`
  const descID = `Tulisan dan proyek keamanan siber oleh ${personalInfo.name} — konsultasi GRC, uji penetrasi, dan security operations.`

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(personalInfo.name)} — Cybersecurity Portfolio</title>
    <link>${BASE}</link>
    <description>${escape(descEN)} ${escape(descID)}</description>
    <language>en</language>
    <copyright>© ${new Date().getFullYear()} ${escape(personalInfo.name)}</copyright>
    <managingEditor>${escape(personalInfo.email)} (${escape(personalInfo.name)})</managingEditor>
    <webMaster>${escape(personalInfo.email)} (${escape(personalInfo.name)})</webMaster>
    <ttl>60</ttl>
    <image>
      <url>${BASE}/apple-icon.png</url>
      <title>${escape(personalInfo.name)} — Cybersecurity Portfolio</title>
      <link>${BASE}</link>
    </image>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${writingItems}
    ${engagementItems}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
