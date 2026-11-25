import Link from "next/link";
import { SITE_DATA } from "@/data/site";
import { LogoA } from "@/components/LogoA";
import { FooterHorizon } from "@/components/FooterHorizon";

export function Footer() {
  return (
    <footer className="mt-16 w-full pt-2 text-xs text-[var(--text-muted)]">
      {/* Aligned metadata & links strip (matches main 680px column) */}
      <div className="mx-auto w-full max-w-[680px] px-4 sm:px-6">
        <div className="border-t border-[var(--border)] pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <LogoA size={14} variant="mark" className="text-[var(--text)]" />
              <span className="font-medium text-[var(--text)]">
                {SITE_DATA.profile.name}
              </span>
              <span className="text-[var(--text-faint)]">&middot;</span>
              <span className="font-mono tabular-nums">
                {new Date().getFullYear()}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11.5px]">
              <Link
                href="/llms.txt"
                className="transition-colors hover:text-[var(--text)]"
              >
                llms.txt
              </Link>
              <Link
                href="/llms-full.txt"
                className="transition-colors hover:text-[var(--text)]"
              >
                llms-full.txt
              </Link>
              <Link
                href="/.well-known/security.txt"
                className="transition-colors hover:text-[var(--text)]"
              >
                security.txt
              </Link>
              <Link
                href="/feed.xml"
                className="transition-colors hover:text-[var(--text)]"
              >
                rss
              </Link>
              <Link
                href="/sitemap.xml"
                className="transition-colors hover:text-[var(--text)]"
              >
                sitemap
              </Link>
            </div>
          </div>

          <p className="mt-4 font-mono text-[11px] text-[var(--text-faint)]">
            South Jakarta &middot; IT GRC &middot; Pentest &middot; Bug Bounty
          </p>
        </div>
      </div>

      {/* Animated dithered dev-room artwork ("satorukikyy") */}
      <FooterHorizon />
    </footer>
  );
}
