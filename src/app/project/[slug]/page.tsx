import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SITE_DATA,
  getDomainInfo,
  getProjectBySlug,
} from "@/data/site";
import {
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  buildProjectJsonLd,
} from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return SITE_DATA.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const domain = getDomainInfo(project.domain);
  return buildPageMetadata({
    title: project.title,
    description: `${domain.label}: ${project.summary}`,
    path: `/project/${project.slug}`,
    type: "article",
    publishedTime: project.date,
    modifiedTime: project.date,
    keywords: [domain.label, ...project.frameworks, ...project.stack],
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const domain = getDomainInfo(project.domain);
  const currentIdx = SITE_DATA.projects.findIndex((p) => p.slug === slug);
  const prevProject = SITE_DATA.projects[currentIdx - 1] ?? null;
  const nextProject = SITE_DATA.projects[currentIdx + 1] ?? null;

  return (
    <article>
      <JsonLd data={buildProjectJsonLd(project)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Project", path: "/project" },
          { name: domain.label, path: `/project?domain=${domain.id}` },
          { name: project.title, path: `/project/${project.slug}` },
        ])}
      />

      <Link
        href={`/project?domain=${domain.id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
      >
        ← Back to {domain.label}
      </Link>

      <header className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
          <span>{domain.label}</span>
          <span>&middot;</span>
          <time dateTime={project.date} className="tabular-nums">
            {project.period}
          </time>
        </div>

        <h1 className="font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] text-[var(--text)] sm:text-[32px]">
          {project.title}
        </h1>

        <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          {project.summary}
        </p>

        {/* Key Focus Highlight */}
        <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--hover-bg)]/60 px-4 py-3">
          <span className="block text-xs font-medium text-[var(--text-muted)]">
            In short
          </span>
          <p className="mt-1 text-sm font-medium text-[var(--text)]">
            {project.impact}
          </p>
        </div>
      </header>

      {/* Case Study Content */}
      <div className="space-y-8 text-[15px] leading-[1.78] text-[var(--text-secondary)]">
        <section>
          <h2 className="mb-2 text-base font-semibold tracking-[-0.015em] text-[var(--text)]">
            The gist
          </h2>
          <p>{project.overview}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold tracking-[-0.015em] text-[var(--text)]">
            {project.domain === "bug-bounty" ? "The blind spot" : "The challenge"}
          </h2>
          <p>{project.challenge}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold tracking-[-0.015em] text-[var(--text)]">
            {project.domain === "bug-bounty"
              ? "What happened & the fix"
              : "How we tackled it"}
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            {project.approach.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </section>

        {project.codeSnippet ? (
          <section>
            <h2 className="mb-2 text-xs font-medium text-[var(--text-muted)]">
              {project.codeSnippet.title}
            </h2>
            <pre>
              <code>{project.codeSnippet.code}</code>
            </pre>
          </section>
        ) : null}

        <section>
          <h2 className="mb-2 text-base font-semibold tracking-[-0.015em] text-[var(--text)]">
            {project.domain === "bug-bounty"
              ? "Impact & disclosure"
              : "How it turned out"}
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            {project.outcome.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Prev / Next Navigation */}
      <nav
        aria-label="Project navigation"
        className="mt-12 flex flex-col gap-3 border-t border-[var(--border)] pt-5 text-xs sm:flex-row sm:items-center sm:justify-between"
      >
        {prevProject ? (
          <Link
            href={`/project/${prevProject.slug}`}
            className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)] sm:max-w-[48%]"
          >
            ← {prevProject.title}
          </Link>
        ) : (
          <span />
        )}

        {nextProject ? (
          <Link
            href={`/project/${nextProject.slug}`}
            className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)] sm:max-w-[48%] sm:text-right"
          >
            {nextProject.title} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
