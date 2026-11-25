import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  DOMAIN_COLOR,
  PROJECT_DOMAINS,
  SITE_DATA,
  getDomainInfo,
  type ProjectItem,
} from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";
import { JournalTable } from "@/components/JournalTable";
import { LogStream } from "@/components/LogStream";

export const metadata = buildPageMetadata({
  description: SITE_DATA.profile.tagline,
  path: "/",
});

// One highlight per track. Edit slugs here when a newer project should take the spot.
const SELECTED_SLUGS = [
  "vapt-pt-shinhan-sekuritas-indonesia",
  "google-vrp-gemini-cli-ssrf",
  "iso-27001-2022-implementation-pt-berlian-sistem-informasi",
  "incident-management-response-pt-javan-cipta-solusi",
] as const;

export default function HomePage() {
  const featuredProjects: ProjectItem[] = SELECTED_SLUGS.map((slug) =>
    SITE_DATA.projects.find((p) => p.slug === slug)
  ).filter((item): item is ProjectItem => Boolean(item));

  return (
    <div className="space-y-14">
      <section aria-label="Introduction">
        <h1 className="sr-only">
          {SITE_DATA.profile.name}, {SITE_DATA.profile.role}
        </h1>

        <div className="space-y-3 text-[15px] leading-[1.72] text-[var(--text-secondary)]">
          <p>
            Hi, I&rsquo;m{" "}
            <strong className="font-semibold text-[var(--text)]">
              {SITE_DATA.profile.name}
            </strong>
            . I work in cybersecurity from South Jakarta, across IT GRC and
            offensive security.
          </p>
          <p>
            I like seeing security from both sides: how to build it right and
            how to break it. One week that&rsquo;s ISO audits and policies, the
            next it&rsquo;s pentests and bug bounty reports.
          </p>
          <p>
            Right now I&rsquo;m building a cybersecurity startup, and consulting
            and testing with{" "}
            <span className="text-[var(--text)]">Whitesec ID, AU, CA, and UK</span>
            .
          </p>
        </div>

        <LogStream />

        <dl className="mt-7 grid grid-cols-3 gap-2 border-y border-[var(--border)] py-3">
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
      </section>

      <section aria-labelledby="tracks-heading">
        <h2
          id="tracks-heading"
          className="mb-1 text-xs font-medium text-[var(--text-muted)]"
        >
          What I work on
        </h2>
        <ul className="divide-y divide-[var(--border)] border-b border-[var(--border)]">
          {PROJECT_DOMAINS.map((domain) => {
            const count = SITE_DATA.projects.filter(
              (p) => p.domain === domain.id
            ).length;
            return (
              <li key={domain.id}>
                <Link
                  href={`/project?domain=${domain.id}`}
                  className="group -mx-2.5 flex items-start gap-3 rounded-md px-2.5 py-3.5 transition-colors hover:bg-[var(--hover-bg)] focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-[14.5px] font-medium leading-snug text-[var(--text)] transition-transform duration-200 ease-out group-hover:translate-x-1">
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: DOMAIN_COLOR[domain.id] }}
                      />
                      {domain.label}
                    </span>
                    <span className="mt-1 block text-[13px] leading-snug text-[var(--text-muted)]">
                      {domain.description}
                    </span>
                  </span>
                  <span className="mt-0.5 shrink-0 font-mono text-[11.5px] tabular-nums text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent-ink)]">
                    {count}
                  </span>
                  <ArrowUpRight
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-faint)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-ink)]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="selected-projects-heading">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h2
            id="selected-projects-heading"
            className="text-xs font-medium text-[var(--text-muted)]"
          >
            Selected projects
          </h2>
          <Link
            href="/project"
            className="-my-2 py-2 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            See all {SITE_DATA.projects.length} projects
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
                  className="group -mx-2.5 flex items-baseline gap-2 rounded-md px-2.5 py-2.5 transition-colors hover:bg-[var(--hover-bg)] focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
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
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--text-faint)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-ink)]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

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
            className="-my-2 py-2 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            Read all posts
          </Link>
        </div>

        <JournalTable posts={SITE_DATA.journal} sortable />
      </section>
    </div>
  );
}
