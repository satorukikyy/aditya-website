import HeroSection from '@/components/sections/HeroSection'
import Link from 'next/link'
import { personalInfo, services, vaptClients, grcCategories, secEngCategories } from '@/lib/data'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'
import CountUp from '@/components/ui/CountUp'

const allGRCClients = grcCategories.flatMap(c => c.clients)
const allSecEngClients = secEngCategories.flatMap(c => c.clients)

const stats = [
  { target: 24, suffix: '+', label: 'engagements',      color: 'bg-c-yellow' },
  { target: 3,  suffix: '',  label: 'iso lead auditor', color: 'bg-c-pink' },
  { target: 2,  suffix: '+', label: 'years active',     color: 'bg-c-cyan' },
]

const typeChip: Record<string, string> = {
  vapt: 'bg-c-pink',
  grc:  'bg-c-yellow',
  sec:  'bg-c-cyan',
}

// newest first: reverse so recently added entries win year ties (sort is stable)
const latest = <T extends { year: number }>(clients: T[], n: number) =>
  [...clients].reverse().sort((a, b) => b.year - a.year).slice(0, n)

const projectPreview = [
  ...latest(vaptClients, 3).map(c => ({ ...c, type: 'vapt' })),
  ...latest(allGRCClients, 3).map(c => ({ ...c, type: 'grc' })),
  ...latest(allSecEngClients, 3).map(c => ({ ...c, type: 'sec' })),
]

export default function HomePage() {
  return (
    <div className="max-w-[760px] mx-auto px-6">
      <HeroSection />

      {/* About */}
      <FadeIn>
        <section className="border-t-[3px] border-c-text pt-14 pb-14">
          <p className="nb-label mb-8">About</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`${stat.color} border-2 border-c-text shadow-brutal p-5`}
              >
                <p className="font-display text-[36px] text-c-text leading-none">
                  <CountUp target={stat.target} suffix={stat.suffix} />
                </p>
                <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-c-text mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="font-body text-[15px] text-c-muted leading-[1.75] mb-6">
            {personalInfo.bio}
          </p>
          <Link href="/about" className="nb-btn">
            More about me →
          </Link>
        </section>
      </FadeIn>

      {/* Services */}
      <FadeIn delay={0.05}>
        <section className="border-t-[3px] border-c-text pt-14 pb-14">
          <p className="nb-label mb-8">Services</p>
          <StaggerContainer className="space-y-4">
            {services.map((s, i) => (
              <StaggerItem key={s.id}>
                <Link
                  href="/services"
                  className="nb-card flex items-center gap-4 p-4 transition-all duration-100 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                >
                  <span className="bg-c-text text-c-bg font-display text-[15px] w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-body font-bold text-[15px] text-c-text">
                    {s.title}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </FadeIn>

      {/* Projects */}
      <FadeIn delay={0.05}>
        <section className="border-t-[3px] border-c-text pt-14 pb-14">
          <div className="flex items-center justify-between mb-8">
            <p className="nb-label">Projects</p>
            <Link href="/projects" className="nb-chip hover:bg-c-yellow transition-colors">
              view all →
            </Link>
          </div>
          <StaggerContainer>
            <div className="nb-card divide-y-2 divide-c-text">
              {projectPreview.map((client) => (
                <StaggerItem key={`${client.type}-${client.name}`}>
                  <div className="flex items-center gap-4 px-4 py-3 hover:bg-c-purple-light transition-colors">
                    <span className={`${typeChip[client.type]} font-mono text-[10px] font-bold uppercase border-2 border-c-text px-1.5 py-0.5 w-14 text-center flex-shrink-0`}>
                      {client.type}
                    </span>
                    <span className="font-body text-[14px] font-medium text-c-text flex-1">{client.name}</span>
                    <span className="font-mono text-[12px] font-bold text-c-subtle">{client.year}</span>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>
      </FadeIn>
    </div>
  )
}
