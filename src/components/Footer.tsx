import Link from "next/link";
import { Bug, Lock, Radar, ShieldCheck, Terminal } from "lucide-react";
import { SITE_DATA } from "@/data/site";
import { LogoA } from "@/components/LogoA";
import { FooterHorizon } from "@/components/FooterHorizon";

const CRAFT_ICONS = [
  { Icon: ShieldCheck, label: "IT GRC & ISO Audits" },
  { Icon: Terminal, label: "Penetration Testing" },
  { Icon: Bug, label: "Bug Bounty Research" },
  { Icon: Lock, label: "Security Hardening" },
  { Icon: Radar, label: "Detection & Response" },
] as const;

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

          {/* Subtle Cyber / Tech Craft Icon Row */}
          <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-[var(--text-faint)]">
            <span className="font-mono">
              South Jakarta · IT GRC · Pentest · Bug Bounty
            </span>
            <div className="flex items-center gap-2.5" aria-label="Security domains">
              {CRAFT_ICONS.map(({ Icon, label }) => (
                <span
                  key={label}
                  title={label}
                  className="inline-flex items-center transition-colors hover:text-[var(--text)]"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.65} />
                  <span className="sr-only">{label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wide Animated Bayer-Dithered Cyber Horizon Artwork ("Rizky Aditya") */}
      <FooterHorizon />
    </footer>
  );
}
