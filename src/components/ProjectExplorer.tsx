"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import {
  DOMAIN_COLOR,
  PROJECT_DOMAINS,
  type ProjectDomainId,
  type ProjectItem,
} from "@/data/site";

interface ProjectExplorerProps {
  projects: ProjectItem[];
}

// Static export has no request-time searchParams, so ?domain= is read from the URL in the browser.
const subscribeToUrl = (notify: () => void) => {
  window.addEventListener("popstate", notify);
  return () => window.removeEventListener("popstate", notify);
};
const readDomainFromUrl = (): ProjectDomainId | "all" => {
  const domain = new URLSearchParams(window.location.search).get("domain");
  return PROJECT_DOMAINS.find((d) => d.id === domain)?.id ?? "all";
};

export function ProjectExplorer({ projects }: ProjectExplorerProps) {
  const urlDomain = useSyncExternalStore(subscribeToUrl, readDomainFromUrl, () => "all" as const);
  // null until the visitor picks a tab themselves; until then the URL decides.
  const [picked, setPicked] = useState<ProjectDomainId | "all" | null>(null);
  const selected = picked ?? urlDomain;
  const [query, setQuery] = useState("");

  const selectDomain = (next: ProjectDomainId | "all") => {
    setPicked(next);
    try {
      const nextUrl = next === "all" ? "/project" : `/project?domain=${next}`;
      window.history.replaceState(null, "", nextUrl);
    } catch {
      // Ignore history API errors in restricted contexts
    }
  };

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: projects.length };
    for (const d of PROJECT_DOMAINS) {
      map[d.id] = projects.filter((p) => p.domain === d.id).length;
    }
    return map;
  }, [projects]);

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    document
      .querySelector('[role="tab"][aria-selected="true"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [selected]);

  const filterTabs: {
    id: ProjectDomainId | "all";
    label: string;
    count: number;
  }[] = useMemo(
    () => [
      { id: "all", label: "All", count: counts.all },
      ...PROJECT_DOMAINS.map((d) => ({
        id: d.id,
        label: d.tabLabel,
        count: counts[d.id] ?? 0,
      })),
    ],
    [counts]
  );

  const visibleSections = useMemo(() => {
    const domains =
      selected === "all"
        ? PROJECT_DOMAINS
        : PROJECT_DOMAINS.filter((d) => d.id === selected);

    return domains
      .map((domain) => {
        const domainProjects = projects.filter((p) => {
          if (p.domain !== domain.id) return false;
          if (!normalizedQuery) return true;
          const haystack = `${p.title} ${p.organization} ${p.period} ${p.summary} ${p.impact}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });
        return { domain, items: domainProjects };
      })
      .filter((section) => section.items.length > 0);
  }, [projects, selected, normalizedQuery]);

  const totalMatches = useMemo(
    () => visibleSections.reduce((sum, sec) => sum + sec.items.length, 0),
    [visibleSections]
  );

  return (
    <div className="space-y-8">
      {/* Controls: Balanced 2x3 Track Selector + Minimal Search */}
      <div className="space-y-2.5">
        <MotionConfig reducedMotion="user">
          <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <div
              role="tablist"
              aria-label="Filter projects by track"
              className="flex min-w-max gap-0.5 border-b border-[var(--border)]"
            >
              {filterTabs.map((tab) => {
                const active = selected === tab.id;
                const color = tab.id === "all" ? "var(--text)" : DOMAIN_COLOR[tab.id];
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => selectDomain(tab.id)}
                    className={`relative flex cursor-pointer items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${
                      active
                        ? "font-medium text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {tab.id !== "all" ? (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ) : null}
                    {tab.label}
                    <span className="font-mono text-[11px] tabular-nums text-[var(--text-muted)]">
                      {tab.count}
                    </span>
                    {active ? (
                      <motion.span
                        layoutId="track-underline"
                        aria-hidden="true"
                        className="absolute inset-x-1.5 -bottom-px h-0.5 rounded-full"
                        style={{ backgroundColor: color }}
                        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </MotionConfig>

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            maxLength={80}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client, bug, or year"
            aria-label="Search projects"
            className="w-full rounded-md border border-[var(--border)] bg-transparent py-1.5 pr-8 pl-8 text-[13px] text-[var(--text)] placeholder:text-[var(--text-faint)] transition-colors focus:border-[var(--purple)] focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 inline-flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          ) : null}
        </div>

        {normalizedQuery ? (
          <p className="font-mono text-[11.5px] text-[var(--text-muted)]">
            Showing {totalMatches} {totalMatches === 1 ? "match" : "matches"}
            {selected !== "all"
              ? ` in ${PROJECT_DOMAINS.find((d) => d.id === selected)?.label ??
              selected
              }`
              : ""}
          </p>
        ) : null}
      </div>

      {/* Grouped Domain Sections */}
      {visibleSections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border-strong)] px-5 py-10 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            No projects matched{" "}
            <span className="font-mono text-[var(--text)]">
              &ldquo;{query.trim()}&rdquo;
            </span>
            .
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              selectDomain("all");
            }}
            className="mt-3 inline-flex cursor-pointer items-center rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:bg-[var(--hover-bg)]"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <MotionConfig reducedMotion="user">
        <motion.div
          key={selected}
          className="space-y-11"
          initial={picked !== null ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {visibleSections.map(({ domain, items }) => {
            const showImpactLine =
              domain.id === "bug-bounty" || domain.id === "incident-management";

            let lastYear: string | null = null;

            return (
              <section key={domain.id} aria-labelledby={`domain-${domain.id}`}>
                <div
                  className={`mb-1 border-b border-[var(--border-strong)]/70 ${
                    selected === "all" ? "pb-2.5" : "pb-3.5"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h2
                      id={`domain-${domain.id}`}
                      className="flex items-baseline gap-2.5 text-[15px] font-semibold tracking-[-0.015em] text-[var(--text)]"
                    >
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 translate-y-[-1px] self-center rounded-full"
                        style={{ backgroundColor: DOMAIN_COLOR[domain.id] }}
                      />
                      <span>{domain.label}</span>
                    </h2>
                    <span className="shrink-0 font-mono text-[11.5px] tabular-nums text-[var(--text-muted)]">
                      {items.length}{" "}
                      {items.length === 1 ? "project" : "projects"}
                    </span>
                  </div>

                  {selected !== "all" ? (
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-muted)]">
                    {domain.description}
                  </p>
                  ) : null}
                </div>

                <ul className="divide-y divide-[var(--border)]">
                  {items.map((item) => {
                    const showYear = item.year !== lastYear;
                    lastYear = item.year;

                    const hasDetailedPeriod = item.period !== item.year;

                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/project/${item.slug}`}
                          className="group -mx-2.5 flex items-baseline gap-3 rounded-md px-2.5 py-2.5 transition-colors hover:bg-[var(--hover-bg)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--text)]"
                        >
                          <span className="w-11 shrink-0 font-mono text-xs tabular-nums text-[var(--text-muted)] transition-colors group-hover:text-[var(--text)] sm:w-12">
                            {showYear ? item.year : ""}
                          </span>

                          <div className="min-w-0 flex-1">
                            <span className="block text-[14px] font-medium leading-snug text-[var(--text)] sm:text-[14.5px]">
                              {item.title}
                            </span>

                            {showImpactLine ? (
                              <span className="mt-0.5 line-clamp-1 block text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                                {hasDetailedPeriod ? `${item.period} · ` : ""}
                                {item.impact}
                              </span>
                            ) : hasDetailedPeriod ? (
                              <span className="mt-0.5 block font-mono text-[11.5px] tabular-nums text-[var(--text-muted)]">
                                {item.period}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex shrink-0 items-center pl-1">
                            <ArrowUpRight
                              className="h-3.5 w-3.5 text-[var(--text-faint)] transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text)]"
                              strokeWidth={1.8}
                            />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </motion.div>
        </MotionConfig>
      )}
    </div>
  );
}
