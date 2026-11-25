import { SITE_DATA } from "@/data/site";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildPageMetadata({
  title: "Experience",
  description:
    "Where Rizky Aditya has worked — Founder & CEO at a stealth cybersecurity startup, Bug Hunter at HackerOne, IT GRC & Pentester across Whitesec ID, AU, UK & CA, Security Engineer at Defenxor, and IT Support at FMIPA UI.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <div className="space-y-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Experience", path: "/experience" },
        ])}
      />

      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-[var(--text)]">
          Experience
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
          Where I’ve been putting in the reps — from startup building and bug
          hunting to IT GRC, VAPT, security engineering, and IT ops.
        </p>
      </header>

      {/* Work Experience Timeline Only */}
      <section aria-label="Work experience">
        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {SITE_DATA.experience.map((item) => (
            <article
              key={`${item.company}-${item.period}`}
              className="flex flex-col gap-2 py-6 sm:flex-row sm:gap-6"
            >
              <div className="shrink-0 sm:w-36">
                <p className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
                  {item.period}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                  {item.employmentType}
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-faint)]">
                  {item.location}
                </p>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-medium text-[var(--text)]">
                  {item.role}
                  <span className="font-normal text-[var(--text-muted)]">
                    {" "}
                    &middot; {item.company}
                  </span>
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {item.summary}
                </p>

                <ul className="mt-3 list-disc space-y-1.5 pl-4 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
                  {item.highlights.map((hl, idx) => (
                    <li key={idx}>{hl}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
