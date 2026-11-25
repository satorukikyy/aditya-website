import type { NextRequest } from "next/server";
import {
  getJournalViews,
  isRateLimited,
  isValidJournalSlug,
  recordJournalView,
} from "@/lib/views";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
};

function isSameOriginRequest(request: NextRequest): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite && secFetchSite === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const allowedHosts = new Set(
      [
        request.nextUrl.host,
        request.headers.get("host"),
        request.headers.get("x-forwarded-host")?.split(",")[0]?.trim(),
      ].filter(Boolean)
    );
    return allowedHosts.has(originHost);
  } catch {
    return false;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!isValidJournalSlug(slug)) {
    return Response.json(
      { error: "Not found" },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  const views = await getJournalViews(slug);
  return Response.json({ slug, views }, { headers: NO_STORE_HEADERS });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!isValidJournalSlug(slug)) {
    return Response.json(
      { error: "Not found" },
      { status: 404, headers: NO_STORE_HEADERS }
    );
  }

  if (!isSameOriginRequest(request)) {
    return Response.json(
      { error: "Forbidden" },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  if (isRateLimited(request.headers)) {
    return Response.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { ...NO_STORE_HEADERS, "Retry-After": "60" },
      }
    );
  }

  const { views, counted } = await recordJournalView(slug, request.headers);
  return Response.json(
    { slug, views, counted },
    { headers: NO_STORE_HEADERS }
  );
}
