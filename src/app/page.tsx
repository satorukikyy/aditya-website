import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  PROJECT_DOMAINS,
  SITE_DATA,
  getDomainInfo,
  type ProjectItem,
} from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";
import { JournalTable } from "@/components/JournalTable";

export const metadata = buildPageMetadata({
  description: SITE_DATA.profile.tagline,
  path: "/",
});

const SELECTED_2026_SLUGS = [
  "vapt-pt-shinhan-sekuritas-indonesia",
  "google-vrp-gemini-cli-ssrf",
  "iso-27001-2022-implementation-pt-berlian-sistem-informasi",
  "incident-management-response-pt-javan-cipta-solusi",
] as const;

export default function HomePage() {
  // Fresh 2026 highlights — strictly 1 per track
  const featuredProjects: ProjectItem[] = SELECTED_2026_SLUGS.map((slug) =>
    SITE_DATA.projects.find((p) => p.slug === slug && p.year === "2026")
  ).filter((item): item is ProjectItem => Boolean(item));

  return (
    <div className="space-y-12">
      {/* Casual Gen-Z minimalist intro */}
      <section aria-label="Introduction">
        <h1 className="sr-only">
          {SITE_DATA.profile.name} — {SITE_DATA.profile.role}
        </h1>
        <div className="space-y-3 text-[15px] leading-[1.72] text-[var(--text-secondary)]">
          <p>
            Hey, I&rsquo;m{" "}
            <strong className="font-semibold text-[var(--text)]">
              {SITE_DATA.profile.name}
            </strong>
            , a cybersecurity enthusiast based in South Jakarta, working across
            IT GRC, offensive security, and everything in between.
          </p>
          <p>
            I spend my days building things, breaking things, and making sure
            they&rsquo;re built right. From security governance and compliance
            to penetration testing and vulnerability research, I enjoy looking
            at security from both sides: how to build it and how to break it.
          </p>
          <p>
            Currently building at a stealth cybersecurity startup while working
            on security consulting and offensive security projects across{" "}
            <span className="text-[var(--text)]">Whitesec ID</span>,{" "}
            <span className="text-[var(--text)]">Whitesec AU</span>,{" "}
            <span className="text-[var(--text)]">Whitesec CA</span>, and{" "}
            <span className="text-[var(--text)]">Whitesec UK</span>.
          </p>
        </div>

        <p className="mt-4 border-l-2 border-[var(--border-strong)] pl-3.5 text-[13.5px] italic leading-relaxed text-[var(--text-muted)]">
          “{SITE_DATA.profile.motto}”
        </p>

        {/* Minimal inline metrics strip */}
        <dl className="mt-6 grid grid-cols-3 gap-2 border-y border-[var(--border)] py-3">
          {SITE_DATA.profile.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="order-2 mt-0.5 text-[11.5px] text-[var(--text-muted)]">
                {stat.label}
              </dt>
              <dd className="order-1 font-mono text-base font-semibold tabular-nums tracking-tight text-[var(--text)]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* 5 Core Security Tracks — Balanced Grid (2 + 2 + 1 full-width on sm+) */}
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PROJECT_DOMAINS.map((domain, idx) => {
            const count = SITE_DATA.projects.filter(
              (p) => p.domain === domain.id
            ).length;
            const isLastOdd =
              PROJECT_DOMAINS.length % 2 === 1 &&
              idx === PROJECT_DOMAINS.length - 1;
            return (
              <Link
                key={domain.id}
                href={`/project?domain=${domain.id}`}
                className={`group flex flex-col justify-between rounded-md border border-[var(--border)] px-3.5 py-3 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--hover-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)] ${
                  isLastOdd ? "sm:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex items-baseline gap-2 text-[13.5px] font-medium leading-snug text-[var(--text)]">
                    <span className="shrink-0 font-mono text-[11px] font-normal tabular-nums text-[var(--text-muted)]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{domain.label}</span>
                  </span>
                  <ArrowUpRight
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text)]"
                    strokeWidth={1.8}
                  />
                </div>
                <span className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">
                  {count} {count === 1 ? "project" : "projects"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Selected Projects (1 highlight per domain) */}
      <section aria-labelledby="selected-projects-heading">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h2
            id="selected-projects-heading"
            className="text-xs font-medium text-[var(--text-muted)]"
          >
            Selected Projects
          </h2>
          <Link
            href="/project"
            className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            All {SITE_DATA.projects.length} projects →
          </Link>
        </div>

        <div className="flex items-center border-b border-[var(--border)] pb-2 text-xs text-[var(--text-muted)]">
          <div className="w-12 shrink-0 sm:w-14">year</div>
          <div className="min-w-0 flex-1">project</div>
        </div>

        <ul className="divide-y divide-[var(--border)]">
          {featuredProjects.map((project) => {
            const domain = getDomainInfo(project.domain);
            return (
              <li key={project.slug}>
                <Link
                  href={`/project/${project.slug}`}
                  className="group -mx-2.5 flex items-baseline gap-2 rounded-md px-2.5 py-2.5 transition-colors hover:bg-[var(--hover-bg)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--text)]"
                >
                  <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-[var(--text-muted)] sm:w-14">
                    {project.year}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-medium leading-snug text-[var(--text)]">
                      {project.title}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11.5px] text-[var(--text-muted)]">
                      {domain.label}
                      {project.period !== project.year
                        ? ` · ${project.period}`
                        : ""}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-[var(--text-muted)]">
                      {project.impact}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--text-faint)] transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text)]"
                    strokeWidth={1.8}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Journal (Signature rauchg.com Sortable Index) */}
      <section aria-labelledby="journal-heading">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h2
            id="journal-heading"
            className="text-xs font-medium text-[var(--text-muted)]"
          >
            Journal
          </h2>
          <Link
            href="/journal"
            className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            All posts →
          </Link>
        </div>

        <JournalTable posts={SITE_DATA.journal} sortable />
      </section>
    </div>
  );
}
