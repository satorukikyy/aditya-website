# Rizky Aditya — Minimalist Cybersecurity Portfolio

Minimal, typography-first personal portfolio & journal inspired by [rauchg.com](https://rauchg.com/), built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, and **Menlo / IBM Plex Mono** typography.

## Highlights

- **Custom Geometric "A" Logo & Adaptive Favicon** (`src/components/LogoA.tsx`, `src/app/icon.svg`, `src/app/apple-icon.tsx`, `src/app/opengraph-image.tsx`)
- **5 Dedicated Security Project Tracks** (`/project`):
  1. `VAPT`
  2. `Bug Bounty`
  3. `Governance, Risk & Compliance` (GRC)
  4. `Incident Management`
  5. `SOC`
- **Experience-First Profile** (`/about`, `/experience`, `/journal`, `/contact`)
- **SEO, AEO & GEO Ready**:
  - Dynamic per-page metadata, canonicals, and auto-generated OpenGraph/Twitter cards
  - Schema.org JSON-LD (`Person`, `WebSite`, `BreadcrumbList`, `TechArticle`, `BlogPosting`, `FAQPage`)
  - `/llms.txt` & `/llms-full.txt` auto-synced from `src/data/site.ts`
  - `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/manifest.webmanifest`, `/humans.txt`
- **Security Hardening**:
  - RFC 9116 `/.well-known/security.txt`
  - Strict HTTP Security Headers in `public/_headers` (`CSP`, `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `COOP`, `CORP`)
- **Responsive Mobile & Desktop** + Light/Dark mode (toggle icon or press `T`)

## Run Locally

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Production Build & Deploy

Static export (`output: "export"`), deployed to **Cloudflare Pages**:

```bash
pnpm build   # outputs ./out
```

- Cloudflare Pages build command: `pnpm build`, output directory: `out`
- HTTP security headers are defined in `public/_headers` (not `next.config.ts`).
- Optional env: `NEXT_PUBLIC_SITE_URL` (canonical URL, see `.env.example`).

## Edit Content

All site content lives in a single file: `src/data/site.ts`.
