"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import {
  PROJECT_DOMAINS,
  type ProjectDomainId,
  type ProjectItem,
} from "@/data/site";

interface ProjectExplorerProps {
  projects: ProjectItem[];
  initialDomain?: ProjectDomainId | "all";
}

export function ProjectExplorer({
  projects,
  initialDomain = "all",
}: ProjectExplorerProps) {
  const [selected, setSelected] = useState<ProjectDomainId | "all">(
    initialDomain
  );
  const [query, setQuery] = useState("");

  const selectDomain = (next: ProjectDomainId | "all") => {
    setSelected(next);
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

  const filterTabs: {
    id: ProjectDomainId | "all";
    label: string;
    count: number;
  }[] = useMemo(
    () => [
      { id: "all", label: "All Projects", count: counts.all },
      ...PROJECT_DOMAINS.map((d) => ({
        id: d.id,
        label: d.label,
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
      <div className="space-y-3">
        <div
          role="tablist"
          aria-label="Filter cybersecurity project domains"
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {filterTabs.map((tab) => {
            const active = selected === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectDomain(tab.id)}
                className={`group flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)] ${
                  active
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                    : "border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                <span className="text-[13px] font-medium leading-snug tracking-[-0.01em]">
                  {tab.label}
                </span>
                <span
                  className={`shrink-0 font-mono text-xs tabular-nums ${
                    active ? "opacity-80" : "text-[var(--text-muted)]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Minimal Search Input */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]"
            strokeWidth={1.8}
          />
          <input
            type="search"
            value={query}
            maxLength={80}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by client, company, vulnerability, or year..."
            aria-label="Filter projects"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] py-2 pr-9 pl-8 text-[13px] text-[var(--text)] placeholder:text-[var(--text-faint)] transition-colors focus:border-[var(--border-strong)] focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 inline-flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text)]"
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
        <div className="space-y-11">
          {visibleSections.map(({ domain, items }) => {
            const indexNum = String(
              PROJECT_DOMAINS.findIndex((d) => d.id === domain.id) + 1
            ).padStart(2, "0");

            const showImpactLine =
              domain.id === "bug-bounty" || domain.id === "incident-management";

            let lastYear: string | null = null;

            return (
              <section key={domain.id} aria-labelledby={`domain-${domain.id}`}>
                <div className="mb-1 border-b border-[var(--border-strong)]/70 pb-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2
                      id={`domain-${domain.id}`}
                      className="flex items-baseline gap-2.5 text-[15px] font-semibold tracking-[-0.015em] text-[var(--text)]"
                    >
                      <span className="font-mono text-[11.5px] font-normal tabular-nums text-[var(--text-muted)]">
                        {indexNum}
                      </span>
                      <span>{domain.label}</span>
                    </h2>
                    <span className="shrink-0 font-mono text-[11.5px] tabular-nums text-[var(--text-muted)]">
                      {items.length}{" "}
                      {items.length === 1 ? "project" : "projects"}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-muted)]">
                    {domain.description}
                  </p>
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
        </div>
      )}
    </div>
  );
}
