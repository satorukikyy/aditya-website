import type { Metadata } from 'next'
import { grcCategories } from '@/lib/data'
import { pageOpenGraph } from '@/lib/seo'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

export const metadata: Metadata = {
  title: 'GRC Projects',
  description:
    'Governance, Risk & Compliance engagements — ISO 27001, surveillance audit, compliance assessment. Proyek Governance, Risk & Compliance — implementasi ISO 27001, audit surveillance, dan asesmen kepatuhan.',
  alternates: { canonical: '/projects/grc' },
  openGraph: pageOpenGraph(
    'GRC Projects',
    'Governance, Risk & Compliance engagements — ISO 27001, surveillance audit, compliance assessment.',
    '/projects/grc',
  ),
}

export default function GrcPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 pt-32 pb-24">
      <FadeIn>
        <p className="nb-label bg-c-yellow !text-c-text mb-6">GRC</p>
        <h1 className="font-display text-[34px] md:text-[44px] uppercase leading-[1.05] text-c-text mb-10">
          GRC & Compliance.
        </h1>
        <p className="font-body text-[15px] text-c-muted leading-[1.75] mb-4">
          GRC engagements spanning ISO/IEC 27001, ISO/IEC 27701, and ISO/IEC 42001 consulting — from
          initial gap analysis through to certification readiness and post-certification surveillance.
          Work includes control mapping to annex A, risk register development, Statement of Applicability
          preparation, and security policy authoring aligned to UU PDP requirements.
        </p>
        <p className="font-body text-[15px] text-c-muted leading-[1.75] mb-12">
          Clients are primarily organizations in regulated industries — financial services, healthcare,
          technology, and government — seeking audit-ready ISMS programs with measurable risk reduction.
        </p>
      </FadeIn>
      <div className="space-y-10">
        {grcCategories.map((cat) => (
          <FadeIn key={cat.id}>
            <div>
              <p className="font-mono text-[12px] font-bold uppercase text-c-purple mb-4">{cat.label}</p>
              <StaggerContainer>
                <div className="nb-card divide-y-2 divide-c-text">
                  {cat.clients.map((client) => (
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
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
