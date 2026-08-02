import type { Metadata } from 'next'
import { services } from '@/lib/data'
import { pageOpenGraph } from '@/lib/seo'
import Link from 'next/link'
import { personalInfo } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'ISO/IEC 27001 GRC consulting and Vulnerability Assessment & Penetration Testing services. Jasa konsultasi GRC ISO/IEC 27001 serta layanan Vulnerability Assessment & Penetration Testing.',
  alternates: { canonical: '/services' },
  openGraph: pageOpenGraph(
    'Services',
    'ISO/IEC 27001 GRC consulting and Vulnerability Assessment & Penetration Testing services.',
    '/services',
  ),
}

const serviceColor: Record<string, string> = {
  vapt:      'bg-c-pink',
  grc:       'bg-c-yellow',
  seceng:    'bg-c-cyan',
  bugbounty: 'bg-c-lime',
}

export default function ServicesPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 pt-32 pb-24">

      <h1 className="font-display text-[34px] md:text-[44px] uppercase leading-[1.05] text-c-text mb-12">
        Ser
        <span className="inline-block bg-c-lime border-2 border-c-text shadow-brutal px-3 -rotate-1">
          vices.
        </span>
      </h1>

      <div className="space-y-8">
        {services.map((service, i) => (
          <div key={service.id} className="nb-card p-5 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-c-text text-c-bg font-display text-[15px] w-10 h-10 flex items-center justify-center flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`nb-chip ${serviceColor[service.id] ?? 'bg-c-surface'}`}>
                {service.id}
              </span>
            </div>
            <h2 className="font-body font-bold text-[19px] text-c-text tracking-tight mb-3">
              {service.title}
            </h2>
            <p className="font-body text-[14px] text-c-muted leading-[1.75] mb-5">
              {service.description}
            </p>
            <ul className="space-y-2">
              {service.items.map((item) => (
                <li key={item} className="font-body text-[14px] font-medium text-c-text flex gap-2.5">
                  <span className="text-c-purple font-bold flex-shrink-0">▪</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t-[3px] border-c-text mt-14 pt-14">
        <p className="font-body text-[15px] font-medium text-c-text mb-6">
          Ready to start? Reach out and I&apos;ll respond within 24 hours.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${personalInfo.email}`} className="nb-btn !bg-c-purple !text-white normal-case">
            {personalInfo.email}
          </a>
          <Link href="/contact" className="nb-btn">
            Contact form →
          </Link>
        </div>
      </div>

    </div>
  )
}
