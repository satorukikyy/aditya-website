import { SITE_DATA } from "@/data/site";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildPageMetadata,
} from "@/lib/seo";
import { LogoA } from "@/components/LogoA";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildPageMetadata({
  title: "About",
  description: SITE_DATA.about.summary,
  path: "/about",
  type: "profile",
});

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <JsonLd data={buildFaqJsonLd(SITE_DATA.about.faqs)} />

      {/* Identity Block */}
      <header className="flex items-center gap-4">
        <LogoA size={48} variant="badge" className="shrink-0" />
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.025em] text-[var(--text)]">
            {SITE_DATA.profile.name}
          </h1>
          <p className="mt-0.5 text-sm text-[var(--text-muted)]">
            {SITE_DATA.profile.role} &middot; {SITE_DATA.profile.location}
          </p>
        </div>
      </header>

      {/* Bio Prose */}
      <article className="space-y-4 text-[15px] leading-[1.78] text-[var(--text-secondary)]">
        {SITE_DATA.about.paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}

        <div className="pt-2">
          <h2 className="mb-2 text-[15px] font-semibold tracking-[-0.015em] text-[var(--text)]">
            What I’m up to right now
          </h2>
          <p>{SITE_DATA.about.now}</p>
        </div>
      </article>

      {/* Licenses & Certifications */}
      <section aria-labelledby="certifications-heading">
        <div className="mb-2 flex items-baseline justify-between">
          <h2
            id="certifications-heading"
            className="text-xs font-medium text-[var(--text-muted)]"
          >
            Licenses &amp; certifications
          </h2>
          <span className="font-mono text-[11.5px] tabular-nums text-[var(--text-muted)]">
            {SITE_DATA.about.certifications.length} total
          </span>
        </div>
        <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {SITE_DATA.about.certifications.map((cert) => (
            <li
              key={`${cert.name}-${cert.issuer}-${cert.issued ?? "n/a"}`}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--text)]">
                  {cert.name}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  {cert.issuer}
                  {cert.credentialId ? (
                    <span className="font-mono">
                      {" "}
                      &middot; ID: {cert.credentialId}
                    </span>
                  ) : null}
                </p>
              </div>
              {cert.issued ? (
                <span className="shrink-0 font-mono text-xs tabular-nums text-[var(--text-muted)]">
                  {cert.issued}
                  {cert.expires ? ` – ${cert.expires}` : ""}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ Section (AEO & GEO Structured Answers) */}
      <section aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="mb-3 text-xs font-medium text-[var(--text-muted)]"
        >
          Quick Q&amp;A
        </h2>
        <dl className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {SITE_DATA.about.faqs.map((faq) => (
            <div key={faq.question} className="py-4">
              <dt className="text-[14.5px] font-medium text-[var(--text)]">
                {faq.question}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
