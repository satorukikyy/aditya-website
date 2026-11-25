"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { JournalPost } from "@/data/site";

interface JournalTableProps {
  posts: JournalPost[];
  sortable?: boolean;
}

type SortKey = "date" | "views";
type SortDir = "desc" | "asc";

export function JournalTable({ posts, sortable = true }: JournalTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [viewsMap, setViewsMap] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadViews() {
      try {
        const res = await fetch("/api/views", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as { views?: Record<string, number> };
        if (data.views) {
          setViewsMap(data.views);
        }
      } catch {
        // Ignore abort or transient network errors
      }
    }

    loadViews();

    return () => {
      controller.abort();
    };
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedPosts = useMemo(() => {
    const withViews = posts.map((post) => ({
      ...post,
      totalViews: viewsMap ? (viewsMap[post.slug] ?? 0) : null,
    }));

    withViews.sort((a, b) => {
      if (sortKey === "views") {
        const av = a.totalViews ?? 0;
        const bv = b.totalViews ?? 0;
        return sortDir === "desc" ? bv - av : av - bv;
      }
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortDir === "desc" ? diff : -diff;
    });

    return withViews;
  }, [posts, viewsMap, sortKey, sortDir]);

  const arrow = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "desc" ? "↓" : "↑";
  };

  let lastYear: string | null = null;

  return (
    <div>
      <div className="flex items-center border-b border-[var(--border)] pb-2 text-xs text-[var(--text-muted)] select-none">
        <div className="w-12 shrink-0 sm:w-14">
          {sortable ? (
            <button
              type="button"
              onClick={() => toggleSort("date")}
              className={`inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-[var(--text)] ${
                sortKey === "date" ? "text-[var(--text)]" : ""
              }`}
            >
              date <span>{arrow("date")}</span>
            </button>
          ) : (
            <span>date</span>
          )}
        </div>

        <div className="min-w-0 flex-1">title</div>

        <div className="shrink-0 pl-3 text-right">
          {sortable ? (
            <button
              type="button"
              onClick={() => toggleSort("views")}
              className={`inline-flex cursor-pointer items-center gap-1 transition-colors hover:text-[var(--text)] ${
                sortKey === "views" ? "text-[var(--text)]" : ""
              }`}
            >
              views <span>{arrow("views")}</span>
            </button>
          ) : (
            <span>views</span>
          )}
        </div>
      </div>

      <ul className="divide-y divide-[var(--border)]">
        {sortedPosts.map((post) => {
          const showYear = sortKey !== "date" || post.year !== lastYear;
          lastYear = post.year;

          return (
            <li key={post.slug}>
              <Link
                href={`/journal/${post.slug}`}
                className="-mx-2.5 flex items-baseline gap-2 rounded-md px-2.5 py-2.5 transition-colors hover:bg-[var(--hover-bg)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--text)]"
              >
                <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-[var(--text-muted)] sm:w-14">
                  {showYear ? post.year : ""}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-medium leading-snug text-[var(--text)]">
                    {post.title}
                  </span>
                </span>

                <span className="shrink-0 pl-2 text-right font-mono text-xs tabular-nums text-[var(--text-muted)]">
                  {post.totalViews === null
                    ? "—"
                    : new Intl.NumberFormat("en-US").format(post.totalViews)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
