"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { JournalPost } from "@/data/site";

interface JournalTableProps {
  posts: JournalPost[];
  sortable?: boolean;
}

type SortDir = "desc" | "asc";

export function JournalTable({ posts, sortable = true }: JournalTableProps) {
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = () =>
    setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));

  const sortedPosts = useMemo(() => {
    const sorted = [...posts].sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortDir === "desc" ? diff : -diff;
    });
    return sorted;
  }, [posts, sortDir]);

  const arrow = sortDir === "desc" ? "↓" : "↑";

  return (
    <div>
      <div className="flex items-center border-b border-[var(--border)] pb-2 text-xs text-[var(--text-muted)] select-none">
        <div className="w-12 shrink-0 sm:w-14">
          {sortable ? (
            <button
              type="button"
              onClick={toggleSort}
              className="-my-1.5 inline-flex cursor-pointer items-center gap-1 py-1.5 text-[var(--text)] transition-colors hover:text-[var(--text)]"
            >
              date <span>{arrow}</span>
            </button>
          ) : (
            <span>date</span>
          )}
        </div>

        <div className="min-w-0 flex-1">title</div>
      </div>

      <ul className="divide-y divide-[var(--border)]">
        {sortedPosts.map((post, i) => {
          const showYear = i === 0 || post.year !== sortedPosts[i - 1].year;

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
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
