export const runtime = 'edge'

import type { MetadataRoute } from 'next'
import { personalInfo } from '@/lib/data'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${personalInfo.name} — Cybersecurity Portfolio`,
    short_name: personalInfo.nickname,
    description:
      'GRC Consultant, Penetration Tester & Security Engineer based in Indonesia. Konsultan GRC, Penetration Tester & Security Engineer berbasis di Indonesia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#7C3AED',
    lang: 'en',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
