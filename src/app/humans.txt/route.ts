import { SITE_DATA, SITE_URL } from "@/data/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    "/* TEAM */",
    `Owner: ${SITE_DATA.profile.name}`,
    `Role: ${SITE_DATA.profile.role}`,
    `Location: ${SITE_DATA.profile.location}`,
    `Site: ${SITE_URL}`,
    "",
    "/* SITE */",
    "Standards: HTML5, CSS3, TypeScript, RFC 9116, Schema.org, llmstxt.org",
    "Stack: Next.js App Router, Tailwind CSS, Menlo / IBM Plex Mono Typography",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
