import { personalInfo } from '@/lib/data'
import ScrambleText from '@/components/ui/ScrambleText'

const roleChips = [
  { label: 'GRC Consultant',     color: 'bg-c-yellow', tilt: '-rotate-1' },
  { label: 'Penetration Tester', color: 'bg-c-pink',   tilt: 'rotate-1' },
  { label: 'Security Engineer',  color: 'bg-c-cyan',   tilt: '-rotate-1' },
]

export default function HeroSection() {
  return (
    <section className="pt-36 pb-16">
      <p className="nb-label -rotate-1 mb-8">GRC · VAPT · SECOPS</p>

      <h1 className="font-display text-[40px] md:text-[58px] leading-[1.02] uppercase text-c-text mb-6">
        <ScrambleText text={personalInfo.name} delay={200} duration={1100} />
      </h1>

      <div className="flex flex-wrap gap-3 mb-5">
        {roleChips.map((chip) => (
          <span
            key={chip.label}
            className={`${chip.color} ${chip.tilt} font-mono text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 border-2 border-c-text shadow-brutal-sm`}
          >
            {chip.label}
          </span>
        ))}
      </div>

      <p className="font-mono text-[13px] text-c-subtle mb-8">
        Whitesec ID · South Jakarta, Indonesia
        <span className="scramble-cursor ml-1">|</span>
      </p>

      <div className="nb-card border-l-[10px] border-l-c-purple p-5 max-w-[560px] mb-10">
        <p className="font-body text-[16px] font-medium text-c-text leading-[1.6]">
          i build security programs that hold up — on paper and when someone&apos;s
          actually trying.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${personalInfo.email}`}
          className="nb-btn !bg-c-purple !text-white normal-case"
        >
          {personalInfo.email}
        </a>
        <a
          href={personalInfo.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="nb-btn"
        >
          GitHub
        </a>
        <a
          href={personalInfo.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="nb-btn"
        >
          LinkedIn
        </a>
        <a
          href={`https://wa.me/${personalInfo.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="nb-btn"
        >
          WhatsApp
        </a>
      </div>
    </section>
  )
}
