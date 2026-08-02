import type { Metadata } from 'next'
import Link from 'next/link'
import { writings } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Writings',
  description:
    'Notes and articles on GRC, penetration testing, security operations, and the craft of building security programs. Catatan dan artikel tentang GRC, uji penetrasi, security operations, dan membangun program keamanan.',
  alternates: { canonical: '/writings' },
  openGraph: {
    title: 'Writings',
    description: 'Notes and articles on GRC, penetration testing, security operations, and the craft of building security programs.',
    url: '/writings',
  },
}

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split('-').map(Number)
  return new Date(year, month - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

export default function WritingsPage() {
  const published = writings.filter(p => !p.draft)
  const byYear = published.reduce<Record<number, typeof published>>((acc, post) => {
    const year = new Date(post.date).getFullYear()
    acc[year] = acc[year] ? [...acc[year], post] : [post]
    return acc
  }, {})
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  return (
    <div className="max-w-[760px] mx-auto px-6 pt-32 pb-24">
      <h1 className="font-display text-[34px] md:text-[44px] uppercase leading-[1.05] text-c-text mb-6">
        Wri
        <span className="inline-block bg-c-yellow border-2 border-c-text shadow-brutal px-3 rotate-1">
          tings.
        </span>
      </h1>
      <p className="font-body text-[15px] text-c-muted leading-[1.75] mb-16 max-w-[520px]">
        Notes on security programs, compliance frameworks, and lessons from the field.
      </p>

      {years.length === 0 ? (
        <p className="nb-chip">No writings yet.</p>
      ) : (
        <div className="space-y-14">
          {years.map((year) => (
            <div key={year}>
              <p className="nb-label mb-6">{year}</p>
              <div className="space-y-6">
                {byYear[year].map((post) => (
                  <article key={post.slug}>
                    <Link
                      href={`/writings/${post.slug}`}
                      className="nb-card block p-5 transition-all duration-100 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                    >
                      <h2 className="font-body font-bold text-[17px] text-c-text mb-2 leading-snug">
                        {post.title}
                      </h2>
                      <p className="font-body text-[14px] text-c-muted leading-[1.7] mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[11px] font-bold uppercase text-c-subtle">{formatDate(post.date)}</span>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map(tag => (
                            <span key={tag} className="font-mono text-[10px] font-bold uppercase border-2 border-c-text px-1.5 py-0.5 bg-c-bg">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
