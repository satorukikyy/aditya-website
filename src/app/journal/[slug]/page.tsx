import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_DATA, getJournalBySlug } from "@/data/site";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildJournalJsonLd,
  buildPageMetadata,
} from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return SITE_DATA.journal.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalBySlug(slug);
  if (!post) return {};

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/journal/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updatedAt,
    keywords: [post.category, "Cybersecurity Journal"],
  });
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalBySlug(slug);
  if (!post) notFound();

  const idx = SITE_DATA.journal.findIndex((j) => j.slug === slug);
  const olderPost = SITE_DATA.journal[idx + 1] ?? null;
  const newerPost = SITE_DATA.journal[idx - 1] ?? null;

  return (
    <article>
      <JsonLd data={buildJournalJsonLd(post)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
          { name: post.title, path: `/journal/${post.slug}` },
        ])}
      />
      {post.faqs.length > 0 ? <JsonLd data={buildFaqJsonLd(post.faqs)} /> : null}

      <Link
        href="/journal"
        className="mb-4 inline-flex items-center gap-1.5 py-2 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
      >
        ← Back to Journal
      </Link>

      <header className="mb-8">
        <h1 className="font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] text-[var(--text)] sm:text-[32px]">
          {post.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
          <span>{SITE_DATA.profile.name}</span>
          <span className="text-[var(--text-faint)]">&middot;</span>
          <time dateTime={post.date} className="font-mono tabular-nums">
            {post.displayDate}
          </time>
          <span className="text-[var(--text-faint)]">&middot;</span>
          <span>{post.readTime}</span>
        </div>
      </header>

      {/* Direct-Answer Summary Box (AEO & GEO Optimized) */}
      <aside
        aria-label="Summary"
        className="mb-8 rounded-md border border-[var(--border)] bg-[var(--hover-bg)]/50 p-4"
      >
        <p className="text-xs font-medium text-[var(--text-muted)]">In short</p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text)]">
          {post.tldr}
        </p>
        {post.keyTakeaways.length > 0 ? (
          <ul className="mt-3 list-disc space-y-1 pl-4 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
            {post.keyTakeaways.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        ) : null}
      </aside>

      {/* Main Article Prose */}
      <div className="space-y-6 text-[15px] leading-[1.78] text-[var(--text-secondary)]">
        {post.sections.map((section, idxSec) => (
          <section key={idxSec} className="space-y-4">
            {section.heading ? (
              <h2 className="pt-2 text-base font-semibold tracking-[-0.015em] text-[var(--text)]">
                {section.heading}
              </h2>
            ) : null}

            {section.paragraphs?.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            {section.bullets ? (
              <ul className="list-disc space-y-2 pl-5">
                {section.bullets.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : null}

            {section.code ? (
              <pre>
                <code>{section.code.content}</code>
              </pre>
            ) : null}

            {section.quote ? (
              <blockquote className="border-l-2 border-[var(--border-strong)] pl-4 italic text-[var(--text-muted)]">
                {section.quote}
              </blockquote>
            ) : null}
          </section>
        ))}
      </div>

      {/* Article FAQs for Answer Engines */}
      {post.faqs.length > 0 ? (
        <section
          aria-labelledby="article-faq-heading"
          className="mt-10 border-t border-[var(--border)] pt-6"
        >
          <h2
            id="article-faq-heading"
            className="mb-3 text-xs font-medium text-[var(--text-muted)]"
          >
            Quick Q&amp;A
          </h2>
          <dl className="space-y-4">
            {post.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="text-sm font-medium text-[var(--text)]">
                  {faq.question}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {/* Prev / Next Navigation */}
      <nav
        aria-label="Journal navigation"
        className="mt-12 flex flex-col gap-0 border-t border-[var(--border)] pt-4 text-xs sm:flex-row sm:items-center sm:justify-between"
      >
        {olderPost ? (
          <Link
            href={`/journal/${olderPost.slug}`}
            className="py-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)] sm:max-w-[48%]"
          >
            ← {olderPost.title}
          </Link>
        ) : (
          <span />
        )}

        {newerPost ? (
          <Link
            href={`/journal/${newerPost.slug}`}
            className="py-2 text-[var(--text-muted)] transition-colors hover:text-[var(--text)] sm:max-w-[48%] sm:text-right"
          >
            {newerPost.title} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
