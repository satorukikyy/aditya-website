import type { Metadata } from 'next'
import { experience, education } from '@/lib/data'
import { pageOpenGraph } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Background',
  description:
    'Work experience and education — GRC consulting, security engineering, and penetration testing. Pengalaman kerja dan pendidikan — konsultasi GRC, security engineering, dan uji penetrasi.',
  alternates: { canonical: '/background' },
  openGraph: pageOpenGraph(
    'Background',
    'Work experience and education — GRC consulting, security engineering, and penetration testing.',
    '/background',
  ),
}

export default function BackgroundPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 pt-32 pb-24">

      <h1 className="font-display text-[34px] md:text-[44px] uppercase leading-[1.05] text-c-text mb-12">
        Back
        <span className="inline-block bg-c-cyan border-2 border-c-text shadow-brutal px-3 rotate-1">
          ground.
        </span>
      </h1>

      {/* Experience */}
      <section className="mb-16">
        <p className="nb-label mb-8">Experience</p>
        <div className="space-y-8">
          {experience.map((exp) => (
            <div key={exp.role} className="nb-card p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h2 className="font-body font-bold text-[17px] text-c-text leading-snug">{exp.role}</h2>
                <span className="nb-chip bg-c-yellow flex-shrink-0">
                  {exp.startYear} – {exp.endYear ?? 'now'}
                </span>
              </div>
              <p className="font-mono text-[13px] font-bold text-c-purple mb-3">{exp.company}</p>
              <p className="font-body text-[14px] text-c-muted leading-[1.75] mb-4">{exp.description}</p>
              {exp.highlights && (
                <ul className="space-y-2 mb-4">
                  {exp.highlights.map((h) => (
                    <li key={h} className="font-body text-[13px] text-c-muted leading-relaxed flex gap-2.5">
                      <span className="text-c-purple font-bold flex-shrink-0">▪</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[10px] font-bold uppercase border-2 border-c-text px-1.5 py-0.5 bg-c-bg">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="border-t-[3px] border-c-text pt-14">
        <p className="nb-label mb-8">Education</p>
        <div className="space-y-8">
          {education.map((edu) => (
            <div key={edu.institution} className="nb-card p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h2 className="font-body font-bold text-[17px] text-c-text leading-snug">{edu.institution}</h2>
                <span className="nb-chip bg-c-pink flex-shrink-0">
                  {edu.startYear} – {edu.endYear ?? 'now'}
                </span>
              </div>
              <p className="font-mono text-[13px] font-bold text-c-purple mb-1">{edu.degree}</p>
              <p className="font-body text-[14px] text-c-muted mb-3">{edu.field}</p>
              {edu.description && (
                <p className="font-body text-[14px] text-c-muted leading-[1.75] mb-3">{edu.description}</p>
              )}
              {edu.achievement && (
                <p className="inline-block font-mono text-[12px] font-bold text-c-text bg-c-lime border-2 border-c-text px-2 py-1 mt-1">
                  {edu.achievement.replace(/^🥇\s*/, '')}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
