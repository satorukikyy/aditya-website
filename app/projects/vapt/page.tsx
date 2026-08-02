import type { Metadata } from 'next'
import { vaptClients } from '@/lib/data'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

export const metadata: Metadata = {
  title: 'VAPT Projects',
  description:
    'Vulnerability Assessment & Penetration Testing engagements for web, mobile, and API. Proyek Vulnerability Assessment & Penetration Testing untuk aplikasi web, mobile, dan API.',
  alternates: { canonical: '/projects/vapt' },
  openGraph: {
    title: 'VAPT Projects',
    description: 'Vulnerability Assessment & Penetration Testing engagements for web, mobile, and API.',
    url: '/projects/vapt',
  },
}

export default function VaptPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 pt-32 pb-24">
      <FadeIn>
        <p className="nb-label bg-c-pink !text-c-text mb-6">VAPT</p>
        <h1 className="font-display text-[34px] md:text-[44px] uppercase leading-[1.05] text-c-text mb-10">
          Penetration Testing.
        </h1>
        <p className="font-body text-[15px] text-c-muted leading-[1.75] mb-4">
          Vulnerability assessments and penetration tests covering web applications, mobile apps, and APIs.
          Each engagement follows a structured attack lifecycle — reconnaissance, enumeration, exploitation,
          and post-exploitation — aligned to OWASP Testing Guide and PTES standards.
        </p>
        <p className="font-body text-[15px] text-c-muted leading-[1.75] mb-12">
          Deliverables include a detailed technical report with CVSS-rated findings, reproduction steps,
          and remediation guidance tailored to the client&apos;s stack and team maturity.
          Clients span technology, fintech, healthcare, and critical infrastructure sectors.
        </p>
      </FadeIn>
      <StaggerContainer>
        <div className="nb-card divide-y-2 divide-c-text">
          {vaptClients.map((client) => (
            <StaggerItem key={client.name}>
              <div className="flex items-center gap-4 px-4 py-2.5 hover:bg-c-purple-light transition-colors">
                <span className="font-mono text-[11px] font-bold text-c-text bg-c-bg border-2 border-c-text px-1.5 py-0.5 flex-shrink-0">
                  {client.year}
                </span>
                <span className="font-body text-[14px] font-medium text-c-text">{client.name}</span>
              </div>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </div>
  )
}
