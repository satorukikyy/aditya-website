import { SITE_DATA, SITE_URL } from "@/data/site";

export const dynamic = "force-static";

/**
 * RFC 9116 compliant /.well-known/security.txt
 */
export function GET() {
  const body = [
    `Contact: mailto:${SITE_DATA.profile.email}`,
    `Contact: ${SITE_DATA.profile.linkedinUrl}`,
    `Expires: 2027-12-31T23:59:59.000Z`,
    `Preferred-Languages: en, id`,
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    `Policy: ${SITE_URL}/contact`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
