import Link from "next/link";
import { SITE_DATA } from "@/data/site";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { JournalTable } from "@/components/JournalTable";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildPageMetadata({
  title: "Journal",
  description:
    "Chill, no-jargon notes by Rizky Aditya covering IT GRC, VAPT, and bug bounty.",
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

      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-[var(--text)]">
            Journal
          </h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
            Chill, no-jargon notes on IT GRC, VAPT, and bug bounty — plain
            English, zero fluff.
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
