import type { Metadata } from 'next'
import { certifications } from '@/lib/data'

export const metadata: Metadata = {
  title: 'About',
  description:
    'GRC Consultant & Security Engineer based in Indonesia — ISO 27001, ISO 27701, penetration testing. Konsultan GRC & Security Engineer di Indonesia — ISO 27001, ISO 27701, dan uji penetrasi.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About',
    description: 'GRC Consultant & Security Engineer based in Indonesia — ISO 27001, ISO 27701, penetration testing.',
    url: '/about',
  },
}

const grcAreas = [
  'ISO/IEC 27001:2022 Implementation & Certification',
  'ISO/IEC 27701 Privacy Information Management',
  'ISO/IEC 42001 AI Management System',
  'Gap Analysis & Readiness Assessment',
  'Risk Assessment & Risk Treatment Plan',
  'Statement of Applicability (SoA) Development',
  'Security Policy & Procedure Development',
  'Internal Audit Support & Evidence Preparation',
  'Incident Management & Response Planning',
  'Business Continuity & Disaster Recovery Planning',
  'Third-Party & Supplier Risk Management',
  'Data Protection Impact Assessment (DPIA)',
  'UU PDP Compliance Advisory',
  'Security Awareness Program Development',
  'Asset Management & Information Classification',
  'Compliance Monitoring & Continuous Improvement',
]

const offensiveAreas = [
  'Web Application Penetration Testing',
  'Mobile Application Security',
  'API Security Testing',
  'Vulnerability Assessment',
  'OWASP Top 10 Assessment',
  'Attack Surface Analysis',
]

const secEngAreas = [
  'SIEM Deployment & Configuration (Wazuh / ELK)',
  'Threat Detection Rule Development',
  'Log Analysis & Alert Triage',
  'Security Event Monitoring',
  'Endpoint Telemetry Analysis',
  'Incident Response Support',
  'Linux Security Hardening',
  'SOC Operations Support',
]

const expertiseGroups = [
  { id: 'grc',     chip: 'bg-c-yellow', areas: grcAreas },
  { id: 'vapt',    chip: 'bg-c-pink',   areas: offensiveAreas },
  { id: 'sec-eng', chip: 'bg-c-cyan',   areas: secEngAreas },
]

const certChip: Record<string, string> = {
  iso:      'bg-c-yellow',
  security: 'bg-c-pink',
  cloud:    'bg-c-cyan',
}

export default function AboutPage() {
  return (
    <div className="max-w-[760px] mx-auto px-6 pt-32 pb-24">

      <h1 className="font-display text-[34px] md:text-[44px] uppercase leading-[1.05] text-c-text mb-12">
        About{' '}
        <span className="inline-block bg-c-yellow border-2 border-c-text shadow-brutal px-3 -rotate-1">
          Me.
        </span>
      </h1>

      {/* Bio */}
      <section className="mb-16">
        <p className="nb-label mb-8">Introduction</p>
        <div className="space-y-4 font-body text-[15px] text-c-muted leading-[1.75]">
          <p>
            I&apos;m Rizky Aditya, a cybersecurity professional based in South Jakarta, Indonesia,
            working across{' '}
            <span className="text-c-text font-bold bg-c-yellow px-1">Governance, Risk &amp; Compliance (GRC)</span>,{' '}
            <span className="text-c-text font-bold bg-c-pink px-1">Offensive Security</span>, and{' '}
            <span className="text-c-text font-bold bg-c-cyan px-1">Security Operations</span>.
            I help organizations build security programs that hold up under audit and under attack.
          </p>
          <p>
            On the governance side, I deliver ISO/IEC 27001, 27701, and 42001 consulting — from gap
            analysis through certification — alongside risk assessments, SoA development, and UU PDP
            compliance advisory. On the offensive side, I conduct web application, mobile, and API
            penetration tests following OWASP and PTES methodology. On the blue team side, I have
            hands-on experience deploying and operating SIEM environments, building detection rules,
            and coordinating incident response for clients in banking, healthcare, and critical infrastructure.
          </p>
          <p>
            I hold Lead Auditor certifications in ISO 27001, 27701, and 42001 from Mastermind Assurance,
            alongside ISC2 Certified in Cybersecurity and several other professional credentials.
            Currently contributing to 24+ engagements at Whitesec ID.
          </p>
        </div>
      </section>

      {/* Skills */}
      <section className="border-t-[3px] border-c-text pt-14 mb-16">
        <p className="nb-label mb-8">Expertise</p>
        <div className="space-y-8">
          {expertiseGroups.map((group) => (
            <div key={group.id} className="nb-card p-5">
              <span className={`nb-chip ${group.chip} mb-4`}>{group.id}</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                {group.areas.map((item) => (
                  <li key={item} className="font-body text-[14px] text-c-muted leading-snug flex gap-2">
                    <span className="text-c-purple font-bold flex-shrink-0">▪</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="border-t-[3px] border-c-text pt-14">
        <p className="nb-label mb-8">Certifications</p>
        <div className="nb-card divide-y-2 divide-c-text">
          {certifications.map((cert) => (
            <div key={cert.name} className="flex items-center gap-4 px-4 py-3">
              <span className={`${certChip[cert.category]} font-mono text-[10px] font-bold uppercase border-2 border-c-text px-1.5 py-0.5 w-20 text-center flex-shrink-0`}>
                {cert.category}
              </span>
              <span className="font-body text-[14px] font-medium text-c-text flex-1">{cert.name}</span>
              <span className="font-mono text-[11px] font-bold text-c-subtle hidden sm:block">{cert.issuer}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
