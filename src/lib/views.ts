import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { SITE_DATA } from "@/data/site";

const VALID_JOURNAL_SLUGS = new Set(SITE_DATA.journal.map((post) => post.slug));
const ALL_JOURNAL_SLUGS = SITE_DATA.journal.map((post) => post.slug);
const SAFE_SLUG_RE = /^[a-z0-9-]{1,128}$/;

const VIEW_KEY_PREFIX = "journal:views:";
const DEDUP_KEY_PREFIX = "journal:dedup:";
const DEDUP_TTL_SECONDS = 60 * 60 * 24; // 24 hours per visitor per post
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute sliding window
const RATE_LIMIT_MAX_REQUESTS = 30;
const REDIS_TIMEOUT_MS = 3000;

const LOCAL_DATA_DIR = path.join(process.cwd(), ".data");
const LOCAL_VIEWS_FILE = path.join(LOCAL_DATA_DIR, "journal-views.json");

const BOT_USER_AGENT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|twitterbot|linkedinbot|discordbot|slackbot|lighthouse|headless|phantomjs|puppeteer|playwright|curl|wget|python-requests|httpx|axios|go-http-client|java\/|node-fetch|undici|uptime|monitor|pingdom|statuscake|ahrefs|semrush|bytespider|gptbot|chatgpt|claudebot|anthropic|perplexity|ccbot/i;

interface RedisConfig {
  url: string;
  token: string;
}

function getRedisConfig(): RedisConfig | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

async function redisCommand<T>(
  config: RedisConfig,
  command: (string | number)[]
): Promise<T> {
  const res = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Redis REST error: ${res.status}`);
  }

  const data = (await res.json()) as { result: T; error?: string };
  if (data.error) {
    throw new Error(`Redis command error: ${data.error}`);
  }
  return data.result;
}

// In-process fallback & local file serialization for dev / self-hosted Node
let writeQueue: Promise<void> = Promise.resolve();
let memoryStore: Record<string, number> | null = null;
let initReadPromise: Promise<Record<string, number>> | null = null;
const memoryDedup = new Map<string, number>();
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(headers: Headers): boolean {
  const now = Date.now();
  if (rateLimitBuckets.size > 2000) {
    for (const [key, bucket] of rateLimitBuckets) {
      if (bucket.resetAt <= now) rateLimitBuckets.delete(key);
    }
  }

  const fingerprint = getVisitorFingerprint(headers);
  const existing = rateLimitBuckets.get(fingerprint);
  if (!existing || existing.resetAt <= now) {
    rateLimitBuckets.set(fingerprint, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  existing.count += 1;
  return existing.count > RATE_LIMIT_MAX_REQUESTS;
}

async function readLocalViews(): Promise<Record<string, number>> {
  if (memoryStore) return memoryStore;
  if (initReadPromise) return initReadPromise;

  initReadPromise = (async () => {
    try {
      const raw = await fs.readFile(LOCAL_VIEWS_FILE, "utf8");
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const clean: Record<string, number> = {};
      for (const slug of ALL_JOURNAL_SLUGS) {
        const val = parsed[slug];
        clean[slug] =
          typeof val === "number" && Number.isFinite(val) && val >= 0
            ? Math.floor(val)
            : 0;
      }
      memoryStore = clean;
      return clean;
    } catch {
      const empty: Record<string, number> = {};
      for (const slug of ALL_JOURNAL_SLUGS) empty[slug] = 0;
      memoryStore = empty;
      return empty;
    }
  })();

  return initReadPromise;
}

async function persistLocalViews(store: Record<string, number>): Promise<void> {
  const task = writeQueue.then(async () => {
    try {
      await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
      const tmpPath = `${LOCAL_VIEWS_FILE}.tmp`;
      await fs.writeFile(tmpPath, JSON.stringify(store, null, 2) + "\n", "utf8");
      await fs.rename(tmpPath, LOCAL_VIEWS_FILE);
    } catch {
      // Read-only filesystem (e.g., serverless without Redis configured):
      // keep in-memory counts cleanly without throwing 500s.
    }
  });
  writeQueue = task.catch(() => {});
  await task;
}

function pruneMemoryDedup(now: number) {
  if (memoryDedup.size < 1000) return;
  for (const [key, expiresAt] of memoryDedup) {
    if (expiresAt <= now) memoryDedup.delete(key);
  }
}

export function isValidJournalSlug(slug: string): boolean {
  return SAFE_SLUG_RE.test(slug) && VALID_JOURNAL_SLUGS.has(slug);
}

export function isBotOrPrefetch(headers: Headers): boolean {
  const ua = headers.get("user-agent") || "";
  if (!ua || BOT_USER_AGENT_RE.test(ua)) return true;

  const purpose =
    headers.get("sec-purpose") ||
    headers.get("purpose") ||
    headers.get("x-purpose") ||
    "";
  if (purpose.toLowerCase().includes("prefetch")) return true;

  if (headers.get("next-router-prefetch") === "1") return true;

  return false;
}

export function getVisitorFingerprint(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    headers.get("cf-connecting-ip")?.trim() ||
    "local";
  const ua = headers.get("user-agent") || "unknown";
  const salt = process.env.VIEWS_HASH_SALT || "ra-journal-views";

  return crypto
    .createHash("sha256")
    .update(`${salt}:${ip}:${ua}`)
    .digest("hex")
    .slice(0, 16);
}

export async function getAllJournalViews(): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  for (const slug of ALL_JOURNAL_SLUGS) result[slug] = 0;

  if (ALL_JOURNAL_SLUGS.length === 0) return result;

  const redis = getRedisConfig();
  if (redis) {
    try {
      const keys = ALL_JOURNAL_SLUGS.map((slug) => `${VIEW_KEY_PREFIX}${slug}`);
      const values = await redisCommand<(string | number | null)[]>(redis, [
        "MGET",
        ...keys,
      ]);
      ALL_JOURNAL_SLUGS.forEach((slug, idx) => {
        const parsed = Number(values?.[idx] ?? 0);
        result[slug] = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
      });
      return result;
    } catch {
      // Fall through to local store if Redis is unreachable
    }
  }

  const local = await readLocalViews();
  for (const slug of ALL_JOURNAL_SLUGS) {
    result[slug] = local[slug] ?? 0;
  }
  return result;
}

export async function getJournalViews(slug: string): Promise<number> {
  if (!isValidJournalSlug(slug)) return 0;

  const redis = getRedisConfig();
  if (redis) {
    try {
      const val = await redisCommand<string | number | null>(redis, [
        "GET",
        `${VIEW_KEY_PREFIX}${slug}`,
      ]);
      const parsed = Number(val ?? 0);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    } catch {
      // Fall through to local store
    }
  }

  const local = await readLocalViews();
  return local[slug] ?? 0;
}

export async function recordJournalView(
  slug: string,
  headers: Headers
): Promise<{ views: number; counted: boolean }> {
  if (!isValidJournalSlug(slug)) {
    return { views: 0, counted: false };
  }

  if (isBotOrPrefetch(headers)) {
    const views = await getJournalViews(slug);
    return { views, counted: false };
  }

  const fingerprint = getVisitorFingerprint(headers);
  const dedupKey = `${DEDUP_KEY_PREFIX}${slug}:${fingerprint}`;
  const viewKey = `${VIEW_KEY_PREFIX}${slug}`;

  const redis = getRedisConfig();
  if (redis) {
    try {
      const lock = await redisCommand<string | null>(redis, [
        "SET",
        dedupKey,
        "1",
        "EX",
        DEDUP_TTL_SECONDS,
        "NX",
      ]);

      if (lock === "OK") {
        const nextCount = await redisCommand<number>(redis, ["INCR", viewKey]);
        return { views: Number(nextCount) || 0, counted: true };
      }

      const current = await redisCommand<string | number | null>(redis, [
        "GET",
        viewKey,
      ]);
      return { views: Number(current ?? 0) || 0, counted: false };
    } catch {
      // Fall through to local store
    }
  }

  const local = await readLocalViews();
  const now = Date.now();
  pruneMemoryDedup(now);

  const existingExpiry = memoryDedup.get(dedupKey);
  if (existingExpiry && existingExpiry > now) {
    return { views: local[slug] ?? 0, counted: false };
  }

  memoryDedup.set(dedupKey, now + DEDUP_TTL_SECONDS * 1000);
  const nextCount = (local[slug] ?? 0) + 1;
  local[slug] = nextCount;
  await persistLocalViews(local);

  return { views: nextCount, counted: true };
}
