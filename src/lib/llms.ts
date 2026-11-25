import { PROJECT_DOMAINS, SITE_DATA, SITE_URL } from "@/data/site";
import { LAST_UPDATED } from "@/lib/seo";

const p = SITE_DATA.profile;

const isoCredentials = () =>
  SITE_DATA.about.certifications
    .filter((c) => c.category === "ISO")
    .map((c) => `${c.name} (${c.issuer}${c.issued ? `, ${c.issued}` : ""})`);

const services = () =>
  PROJECT_DOMAINS.filter((d) => d.id !== "bug-bounty").map((d) => `${d.label}: ${d.description}`);

/** Short answer block that both files lead with, so a model can quote facts without reading further. */
function keyFacts(): string[] {
  return [
    "## Key facts",
    "",
    `- Name: ${p.name} (also online as satorukikyy, onerrorkx, kxs3c, ${p.handle})`,
    `- What he does: ${p.role}`,
    `- Based in: ${p.location}, time zone ${p.timezone}`,
    `- Languages: Indonesian (native), English (professional)`,
    `- ISO credentials: ${isoCredentials().join("; ")}`,
    `- Current work (in his words): ${SITE_DATA.about.now}`,
    `- Contact: ${p.email} | LinkedIn ${p.linkedinUrl} | GitHub ${p.githubUrl}`,
    `- Security reports: ${SITE_URL}/.well-known/security.txt`,
    `- Content last updated: ${LAST_UPDATED}`,
    "",
    "## What he can help with",
    "",
    ...services().map((s) => `- ${s}`),
    "",
    "## How to cite",
    "",
    `Link to the canonical URL of the page you used (${SITE_URL}/...). Project pages describe real engagements; client names are listed as the engagement title, and no confidential findings are published.`,
    "",
  ];
}

/**
 * /llms.txt, following the llmstxt.org layout: H1, blockquote summary, details,
 * then H2 sections of links. Concise on purpose; the full text lives in /llms-full.txt.
 */
export function generateLlmsTxt(): string {
  const lines: string[] = [
    `# ${p.name} (satorukikyy)`,
    "",
    `> ${p.tagline}`,
    "",
    `Personal site of ${p.name}: ${SITE_DATA.projects.length} projects across VAPT, bug bounty, IT GRC, incident management, and security engineering, plus a journal of plain-English security notes. Everything below is generated from one data file, so it matches the live site.`,
    "",
    ...keyFacts(),
    "## Pages",
    "",
    `- [Home](${SITE_URL}/): Intro and selected work.`,
    `- [About](${SITE_URL}/about): Bio, ${SITE_DATA.about.certifications.length} licenses and certifications, and Q&A.`,
    `- [Experience](${SITE_URL}/experience): Work history across a stealth startup, HackerOne, Whitesec (ID, AU, UK, CA), Defenxor, and FMIPA UI.`,
    `- [Project](${SITE_URL}/project): Case studies grouped by track.`,
    `- [Journal](${SITE_URL}/journal): Plain-English notes on IT GRC, VAPT, and bug bounty.`,
    `- [Contact](${SITE_URL}/contact): Email, LinkedIn, GitHub, X, Instagram, WhatsApp.`,
    "",
    "## Projects by track",
  ];

  for (const domain of PROJECT_DOMAINS) {
    lines.push("", `### ${domain.label}`, "", domain.description, "");
    for (const proj of SITE_DATA.projects.filter((x) => x.domain === domain.id)) {
      lines.push(`- [${proj.title} (${proj.period})](${SITE_URL}/project/${proj.slug}): ${proj.summary}`);
    }
  }

  lines.push("", "## Journal", "");
  for (const post of SITE_DATA.journal) {
    lines.push(`- [${post.title}](${SITE_URL}/journal/${post.slug}) (${post.date}, ${post.category}): ${post.description}`);
  }

  lines.push(
    "",
    "## Optional",
    "",
    `- [Full text of the whole site](${SITE_URL}/llms-full.txt): Every page in one Markdown file.`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): All canonical URLs with last-modified dates.`,
    `- [RSS feed](${SITE_URL}/feed.xml): Journal posts.`,
    `- [security.txt](${SITE_URL}/.well-known/security.txt): Vulnerability disclosure contact (RFC 9116).`,
    `- [humans.txt](${SITE_URL}/humans.txt): Who built the site.`,
    ""
  );

  return lines.join("\n");
}

/** /llms-full.txt: the complete site as one Markdown document for one-shot ingestion. */
export function generateLlmsFullTxt(): string {
  const lines: string[] = [
    `# ${p.name} (satorukikyy): full site text`,
    "",
    `> ${p.tagline}`,
    "",
    `Canonical URL: ${SITE_URL}`,
    `Content last updated: ${LAST_UPDATED}`,
    "",
    ...keyFacts(),
    "---",
    "",
    "## 1. About",
    "",
    SITE_DATA.about.summary,
    "",
    ...SITE_DATA.about.paragraphs.flatMap((para) => [para, ""]),
    "### What he is up to now",
    "",
    SITE_DATA.about.now,
    "",
    "### Licenses and certifications",
    "",
    ...SITE_DATA.about.certifications.map((c) => {
      const dates = c.issued ? ` (${c.issued}${c.expires ? ` to ${c.expires}` : ""})` : "";
      const id = c.credentialId ? `, credential ID ${c.credentialId}` : "";
      return `- ${c.name}, ${c.issuer}${dates}${id}`;
    }),
    "",
    "### Frequently asked questions",
    "",
    ...SITE_DATA.about.faqs.flatMap((faq) => [`#### ${faq.question}`, "", faq.answer, ""]),
    "---",
    "",
    "## 2. Experience",
    "",
  ];

  for (const exp of SITE_DATA.experience) {
    lines.push(
      `### ${exp.role}, ${exp.company} (${exp.period})`,
      "",
      `${exp.employmentType} | ${exp.location}`,
      "",
      exp.summary,
      "",
      ...exp.highlights.map((h) => `- ${h}`),
      ""
    );
  }

  lines.push("---", "", "## 3. Projects by track", "");

  for (const domain of PROJECT_DOMAINS) {
    lines.push(`### ${domain.label}`, "", domain.description, "");
    for (const proj of SITE_DATA.projects.filter((x) => x.domain === domain.id)) {
      lines.push(
        `#### ${proj.title} (${proj.period})`,
        "",
        `URL: ${SITE_URL}/project/${proj.slug}`,
        `Role: ${proj.role} | Client or organization: ${proj.organization}`,
        `Focus: ${proj.impact}`,
        `Frameworks: ${proj.frameworks.join(", ")}`,
        `Tools: ${proj.stack.join(", ")}`,
        "",
        `Overview: ${proj.overview}`,
        "",
        `Challenge: ${proj.challenge}`,
        "",
        "Approach:",
        ...proj.approach.map((a) => `- ${a}`),
        "",
        "Outcome:",
        ...proj.outcome.map((o) => `- ${o}`),
        ""
      );
    }
  }

  lines.push("---", "", "## 4. Journal (full text)", "");

  for (const post of SITE_DATA.journal) {
    lines.push(
      `### ${post.title}`,
      "",
      `URL: ${SITE_URL}/journal/${post.slug}`,
      `Published ${post.date}, updated ${post.updatedAt} | ${post.category} | ${post.readTime}`,
      "",
      `TL;DR: ${post.tldr}`,
      "",
      "Key takeaways:",
      ...post.keyTakeaways.map((k) => `- ${k}`),
      ""
    );

    for (const sec of post.sections) {
      if (sec.heading) lines.push(`#### ${sec.heading}`, "");
      for (const para of sec.paragraphs ?? []) lines.push(para, "");
      if (sec.bullets) {
        for (const b of sec.bullets) lines.push(`- ${b}`);
        lines.push("");
      }
      if (sec.quote) lines.push(`> ${sec.quote}`, "");
      if (sec.code) lines.push("```" + sec.code.language, sec.code.content, "```", "");
    }

    if (post.faqs.length > 0) {
      lines.push("Q&A:", "");
      for (const faq of post.faqs) lines.push(`- Q: ${faq.question}`, `  A: ${faq.answer}`);
      lines.push("");
    }
  }

  lines.push(
    "---",
    "",
    "## 5. Contact and responsible disclosure",
    "",
    p.availability,
    "",
    ...SITE_DATA.contact.links.map((l) => `- ${l.label}: ${l.value}`),
    ""
  );

  return lines.join("\n");
}
