"use client";

import { useEffect, useState } from "react";

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function trackView() {
      try {
        const res = await fetch(`/api/views/${encodeURIComponent(slug)}`, {
          method: "POST",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as { views?: number };
        if (typeof data.views === "number") {
          setViews(data.views);
        }
      } catch {
        // Ignore abort or transient network errors
      }
    }

    trackView();

    return () => {
      controller.abort();
    };
  }, [slug]);

  if (views === null) {
    return (
      <span className="font-mono tabular-nums" aria-label="Loading views">
        — views
      </span>
    );
  }

  return (
    <span className="font-mono tabular-nums">
      {new Intl.NumberFormat("en-US").format(views)}{" "}
      {views === 1 ? "view" : "views"}
    </span>
  );
}
