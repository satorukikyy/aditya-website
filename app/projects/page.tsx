import type { Metadata } from 'next'
import { vaptClients, grcCategories, secEngCategories } from '@/lib/data'
import { pageOpenGraph } from '@/lib/seo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'GRC, VAPT, and blue team security engagements across technology, finance, and critical infrastructure. Proyek keamanan siber GRC, VAPT, dan blue team di sektor teknologi, keuangan, dan infrastruktur kritikal.',
  alternates: { canonical: '/projects' },
  openGraph: pageOpenGraph(
    'Projects',
    'GRC, VAPT, and blue team security engagements across technology, finance, and critical infrastructure.',
    '/projects',
  ),
}

function ClientRow({ year, name }: { year: number; name: string }) {
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 hover:bg-c-purple-light transition-colors">
      <span className="font-mono text-[11px] font-bold text-c-text bg-c-bg border-2 border-c-text px-1.5 py-0.5 flex-shrink-0">
        {year}
      </span>
      <span className="font-body text-[14px] font-medium text-c-text">{name}</span>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 pt-32 pb-24">

      <h1 className="font-display text-[34px] md:text-[44px] uppercase leading-[1.05] text-c-text mb-12">
        Pro
        <span className="inline-block bg-c-pink border-2 border-c-text shadow-brutal px-3 -rotate-1">
          jects.
        </span>
      </h1>

      {/* VAPT */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <p className="nb-label">VAPT</p>
          <Link href="/projects/vapt" className="nb-chip bg-c-pink hover:shadow-brutal-sm transition-shadow">
            view all →
          </Link>
        </div>
        <div className="nb-card divide-y-2 divide-c-text">
          {vaptClients.map((client) => (
            <ClientRow key={client.name} year={client.year} name={client.name} />
          ))}
        </div>
      </section>

      {/* GRC */}
      <section className="border-t-[3px] border-c-text pt-14 mb-14">
        <div className="flex items-center justify-between mb-6">
          <p className="nb-label">GRC</p>
          <Link href="/projects/grc" className="nb-chip bg-c-yellow hover:shadow-brutal-sm transition-shadow">
            view all →
          </Link>
        </div>
        <div className="space-y-6">
          {grcCategories.map((cat) => (
            <div key={cat.id}>
              <p className="font-mono text-[12px] font-bold uppercase text-c-muted mb-3">{cat.shortLabel}</p>
              <div className="nb-card divide-y-2 divide-c-text">
                {cat.clients.map((client) => (
                  <ClientRow key={client.name} year={client.year} name={client.name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sec-Eng / Blue Team */}
      <section className="border-t-[3px] border-c-text pt-14">
        <div className="flex items-center justify-between mb-6">
          <p className="nb-label">SEC-ENG</p>
          <Link href="/projects/sec-eng" className="nb-chip bg-c-cyan hover:shadow-brutal-sm transition-shadow">
            view all →
          </Link>
        </div>
        <div className="space-y-6">
          {secEngCategories.map((cat) => (
            <div key={cat.id}>
              <p className="font-mono text-[12px] font-bold uppercase text-c-muted mb-3">{cat.shortLabel}</p>
              <div className="nb-card divide-y-2 divide-c-text">
                {cat.clients.map((client) => (
                  <ClientRow key={client.name} year={client.year} name={client.name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
