import type { Metadata } from 'next'
import { JetBrains_Mono, Archivo_Black, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { personalInfo } from '@/lib/data'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onerrorkx.pages.dev'

const siteTitle  = `${personalInfo.name} — GRC Consultant · Penetration Tester · Security Engineer`
const siteDescEN = 'ISO 27001 · 27701 · 42001 Lead Auditor, Penetration Tester, and Security Engineer based in Indonesia.'
const siteDescID = 'Lead Auditor ISO 27001 · 27701 · 42001, Penetration Tester, dan Security Engineer berbasis di Indonesia.'
const siteDesc   = `${siteDescEN} ${siteDescID}`

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: { default: siteTitle, template: `%s | ${personalInfo.name}` },
  description: siteDesc,
  keywords: [
    // English
    'GRC', 'GRC Consultant', 'ISO 27001', 'ISO 27701', 'ISO 42001', 'Lead Auditor',
    'Penetration Testing', 'Penetration Tester', 'VAPT', 'SOC', 'Security Operations',
    'Blue Team', 'Cybersecurity', 'Information Security', 'Indonesia',
    // Bahasa Indonesia
    'Konsultan GRC', 'Keamanan Siber', 'Keamanan Informasi', 'Uji Penetrasi',
    'Audit ISO 27001', 'Konsultan Keamanan Siber Indonesia', 'Tata Kelola Keamanan Informasi',
    'Manajemen Risiko', 'Kepatuhan', 'Pengujian Keamanan Aplikasi',
  ],
  authors: [{ name: personalInfo.name, url: BASE }],
  creator: personalInfo.name,
  publisher: personalInfo.name,
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: siteTitle,
    description: siteDesc,
    type: 'website',
    url: '/',
    siteName: `${personalInfo.name} — Cybersecurity Portfolio`,
    locale: 'en_US',
    alternateLocale: ['id_ID'],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescEN,
    creator: '@kxgapapa',
  },
  verification: {
    google: '1fdaEy6NrpYoRX6trGc1HBc96cNqE3XYvenerhSibpI',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: `${personalInfo.name} — RSS Feed` }],
    },
  },
  other: {
    'geo.region': 'ID',
    'geo.placename': 'Indonesia',
    'geo.position': '-6.200000;106.816666',
    'ICBM': '-6.200000, 106.816666',
    'content-language': 'en, id',
  },
}

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#7C3AED' }

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${BASE}/#person`,
      name: personalInfo.name,
      alternateName: personalInfo.nickname,
      jobTitle: ['GRC Consultant', 'Penetration Tester', 'Security Engineer'],
      description: siteDescEN,
      email: `mailto:${personalInfo.email}`,
      url: BASE,
      worksFor: { '@type': 'Organization', name: 'Whitesec ID (PT Topi Putih Siberindo)' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Telkom University Bandung' },
      address: { '@type': 'PostalAddress', addressCountry: 'ID' },
      knowsLanguage: ['id', 'en'],
      knowsAbout: [
        'ISO/IEC 27001', 'ISO/IEC 27701', 'ISO/IEC 42001', 'Governance Risk & Compliance',
        'Penetration Testing', 'Vulnerability Assessment', 'Security Operations Center',
        'Incident Response', 'SIEM', 'OWASP',
      ],
      sameAs: [
        personalInfo.socials.linkedin,
        personalInfo.socials.github,
        personalInfo.socials.instagram,
        personalInfo.socials.twitter,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: siteTitle,
      description: siteDescEN,
      inLanguage: ['en', 'id'],
      publisher: { '@id': `${BASE}/#person` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${archivoBlack.variable} ${spaceGrotesk.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        {process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token":"${process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN}"}`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
