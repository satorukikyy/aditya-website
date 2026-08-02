'use client'

import { useState } from 'react'
import { personalInfo } from '@/lib/data'

const serviceOptions = [
  { value: 'vapt',    label: 'VAPT — Web / Mobile Penetration Testing' },
  { value: 'grc',     label: 'GRC Consulting — ISO/IEC 27001 / 27701 / 42001' },
  { value: 'seceng',  label: 'Security Operations — SOC / Incident Management' },
  { value: 'bugbounty', label: 'Bug Bounty Collaboration' },
  { value: 'other',   label: 'Other / General Inquiry' },
]

const serviceLabels: Record<string, string> = {
  vapt:      'VAPT / Penetration Testing',
  grc:       'GRC Consulting (ISO/IEC 27001 / 27701 / 42001)',
  seceng:    'Security Operations / Blue Team',
  bugbounty: 'Bug Bounty Collaboration',
  other:     'General Inquiry',
}

const socials = [
  { label: 'Email',     href: `mailto:${personalInfo.email}`,  value: personalInfo.email },
  { label: 'LinkedIn',  href: personalInfo.socials.linkedin,   value: 'onerrorkx' },
  { label: 'GitHub',    href: personalInfo.socials.github,     value: 'satorukikyy' },
  { label: 'Instagram', href: personalInfo.socials.instagram,  value: '@kxs3c' },
]

export default function ContactPage() {
  const [name,    setName]    = useState('')
  const [org,     setOrg]     = useState('')
  const [service, setService] = useState('vapt')
  const [message, setMessage] = useState('')

  const waMessage = [
    `Hello, I'm ${name}${org ? ` from ${org}` : ''}.`,
    '',
    `Service: ${serviceLabels[service] ?? service}`,
    '',
    message,
  ].join('\n')

  const waUrl = `https://wa.me/${personalInfo.whatsappNumber}?text=${encodeURIComponent(waMessage)}`
  const canSubmit = name.trim() !== '' && message.trim() !== ''

  const inputClass = "w-full border-2 border-c-text bg-c-surface px-3 py-2.5 font-body text-[14px] text-c-text placeholder:text-c-subtle focus:outline-none focus:shadow-brutal-sm transition-shadow"

  return (
    <div className="max-w-[760px] mx-auto px-6 pt-32 pb-24">

      <h1 className="font-display text-[32px] md:text-[42px] uppercase leading-[1.05] text-c-text mb-6">
        Let&apos;s work{' '}
        <span className="inline-block bg-c-cyan border-2 border-c-text shadow-brutal px-3 -rotate-1">
          together.
        </span>
      </h1>
      <p className="font-body text-[15px] text-c-muted mb-12">
        Have a project in mind? Fill in the form or reach out directly.
      </p>

      {/* Contact table */}
      <section className="mb-16">
        <p className="nb-label mb-8">Contact</p>
        <div className="nb-card divide-y-2 divide-c-text">
          {socials.map((s) => (
            <div key={s.label} className="flex items-center gap-6 px-4 py-3">
              <span className="font-mono text-[11px] font-bold uppercase text-c-subtle w-24 flex-shrink-0">{s.label}</span>
              <a
                href={s.href}
                target={s.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="font-body text-[14px] font-bold text-c-purple hover:underline decoration-2 underline-offset-4"
              >
                {s.value}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="border-t-[3px] border-c-text pt-14">
        <p className="nb-label mb-8">Send a message</p>
        <div className="space-y-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="font-mono text-[11px] font-bold uppercase tracking-wide text-c-text block mb-2">
                Name <span className="text-c-purple">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="font-mono text-[11px] font-bold uppercase tracking-wide text-c-text block mb-2">
                Organization
              </label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Company or institution"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] font-bold uppercase tracking-wide text-c-text block mb-2">
              Service
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              {serviceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[11px] font-bold uppercase tracking-wide text-c-text block mb-2">
              Message <span className="text-c-purple">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your project, goals, or questions…"
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            {canSubmit ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nb-btn !bg-c-purple !text-white"
              >
                Send via WhatsApp →
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 font-mono text-[12px] font-bold uppercase tracking-wide px-4 py-2.5 border-2 border-dashed border-c-subtle text-c-subtle cursor-not-allowed">
                Send via WhatsApp →
              </span>
            )}
            {!canSubmit && (
              <p className="font-mono text-[12px] text-c-subtle mt-3">
                Fill in name and message to continue.
              </p>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
