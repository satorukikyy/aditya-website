import type { Metadata } from 'next'
import { secEngCategories } from '@/lib/data'
import { pageOpenGraph } from '@/lib/seo'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

export const metadata: Metadata = {
  title: 'Security Engineering Projects',
  description:
    'Blue team engagements — SOC monitoring and incident management across regulated industries. Proyek blue team — monitoring SOC dan manajemen insiden di industri teregulasi.',
  alternates: { canonical: '/projects/sec-eng' },
  openGraph: pageOpenGraph(
    'Security Engineering Projects',
    'Blue team engagements — SOC monitoring and incident management across regulated industries.',
    '/projects/sec-eng',
  ),
}

export default function SecEngPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 pt-32 pb-24">
      <FadeIn>
        <p className="nb-label bg-c-cyan !text-c-text mb-6">SEC-ENG</p>
        <h1 className="font-display text-[34px] md:text-[44px] uppercase leading-[1.05] text-c-text mb-10">
          Security Engineering.
        </h1>
        <p className="font-body text-[15px] text-c-muted leading-[1.75] mb-4">
          Blue team engagements covering security operations center (SOC) monitoring and
          incident management. Work involved deploying and operating SIEM environments,
          building detection rules, triaging alerts, and coordinating response activities
          across client organizations.
        </p>
        <p className="font-body text-[15px] text-c-muted leading-[1.75] mb-12">
          Clients span healthcare, banking, and critical infrastructure — industries with
          strict regulatory requirements around security monitoring and incident reporting.
        </p>
      </FadeIn>
      <div className="space-y-10">
        {secEngCategories.map((cat) => (
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
