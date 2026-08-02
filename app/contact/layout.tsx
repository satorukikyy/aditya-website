import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch for VAPT, GRC consulting, security operations, or bug bounty collaboration. Hubungi saya untuk VAPT, konsultasi GRC, security operations, atau kolaborasi bug bounty.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact',
    description: 'Get in touch for VAPT, GRC consulting, security operations, or bug bounty collaboration.',
    url: '/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
