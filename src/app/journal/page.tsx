import Link from "next/link";
import { SITE_DATA } from "@/data/site";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildPageMetadata,
} from "@/lib/seo";
import { JournalTable } from "@/components/JournalTable";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildPageMetadata({
  title: "Journal",
  description:
    "Plain-English notes by Rizky Aditya on IT GRC, VAPT, and bug bounty. No jargon, no fluff.",
  path: "/journal",
});

export default function JournalPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
        ])}
      />

      <JsonLd
        data={buildItemListJsonLd({
          name: "Journal",
          description:
            "Plain-English notes on IT GRC, VAPT, and bug bounty by Rizky Aditya.",
          path: "/journal",
          items: SITE_DATA.journal.map((post) => ({
            name: post.title,
            path: `/journal/${post.slug}`,
          })),
        })}
      />

      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text)]">
            Journal
          </h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
            Plain-English notes on IT GRC, VAPT, and bug bounty. No jargon, no
            fluff.
          </p>
        </div>

        <Link
          href="/feed.xml"
          className="shrink-0 font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
        >
          RSS Feed ↗
        </Link>
      </header>

      <JournalTable posts={SITE_DATA.journal} sortable />
    </div>
  );
}
