import { PROJECT_DOMAINS, SITE_DATA, SITE_URL } from "@/data/site";

/**
 * Generates /llms.txt following the llmstxt.org specification.
 * Concise, structured Markdown index for AI crawlers & answer engines.
 */
export function generateLlmsTxt(): string {
  const lines: string[] = [
    `# ${SITE_DATA.profile.name}`,
    "",
    `> ${SITE_DATA.profile.role} based in ${SITE_DATA.profile.location}. ${SITE_DATA.profile.tagline}`,
    "",
    "Personal cybersecurity portfolio and journal of Rizky Aditya, covering hands-on work across Vulnerability Assessment & Penetration Testing, Bug Bounty, Governance, Risk & Compliance, Incident Management, and Security Engineering.",
    "",
    "## Main Pages",
    `- [Home](${SITE_URL}/): Intro, core security domains, selected projects, and journal index.`,
    `- [About](${SITE_URL}/about): Bio, current focus, ${SITE_DATA.about.certifications.length} licenses & certifications, and Q&A.`,
    `- [Experience](${SITE_URL}/experience): Work history across Stealth Company, HackerOne, Whitesec (ID, AU, UK, CA), Defenxor, and FMIPA UI.`,
    `- [Project](${SITE_URL}/project): Case studies organized across Vulnerability Assessment & Penetration Testing, Bug Bounty, Governance, Risk & Compliance, Incident Management, and Security Engineering.`,
    `- [Journal](${SITE_URL}/journal): Practical field notes and essays on cybersecurity.`,
    `- [Contact](${SITE_URL}/contact): Email, LinkedIn, GitHub, X, Instagram, WhatsApp, and responsible disclosure details.`,
    "",
    "## Projects by Security Domain",
  ];

  for (const domain of PROJECT_DOMAINS) {
    lines.push("", `### ${domain.label}`);
    const items = SITE_DATA.projects.filter((p) => p.domain === domain.id);
    for (const p of items) {
      lines.push(
        `- [${p.title} (${p.period})](${SITE_URL}/project/${p.slug}): ${p.summary}`
      );
    }
  }

  lines.push("", "## Journal & Technical Notes");
  for (const post of SITE_DATA.journal) {
    lines.push(
      `- [${post.title}](${SITE_URL}/journal/${post.slug}) (${post.date} · ${post.category}): ${post.description}`
    );
  }

  lines.push(
    "",
    "## Machine-Readable & Security Endpoints",
    `- [Full LLM Context](${SITE_URL}/llms-full.txt): Complete Markdown version of all site content in one file.`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): Full index of public URLs.`,
    `- [RSS Feed](${SITE_URL}/feed.xml): Journal RSS 2.0 feed.`,
    `- [Security Policy](${SITE_URL}/.well-known/security.txt): Vulnerability disclosure contact (RFC 9116).`,
    ""
  );

  return lines.join("\n");
}

/**
 * Generates /llms-full.txt containing the complete, structured Markdown corpus
 * for Generative Engine Optimization (GEO) & one-shot LLM ingestion.
 */
export function generateLlmsFullTxt(): string {
  const lines: string[] = [
    `# ${SITE_DATA.profile.name} — Full Knowledge Base`,
    "",
    `> ${SITE_DATA.profile.role} | ${SITE_DATA.profile.location} | ${SITE_URL}`,
    "",
    `Canonical URL: ${SITE_URL}`,
    `Email: ${SITE_DATA.profile.email}`,
    `LinkedIn: ${SITE_DATA.profile.linkedinUrl}`,
    `GitHub: ${SITE_DATA.profile.githubUrl}`,
    `X / Twitter: ${SITE_DATA.profile.xUrl}`,
    `Instagram: ${SITE_DATA.profile.instagramUrl}`,
    `Security Policy: ${SITE_URL}/.well-known/security.txt`,
    "",
    "---",
    "",
    "## 1. About",
    "",
    SITE_DATA.about.summary,
    "",
    ...SITE_DATA.about.paragraphs.flatMap((p) => [p, ""]),
    "### What I'm Up To",
    SITE_DATA.about.now,
    "",
    "### Licenses & Certifications",
    ...SITE_DATA.about.certifications.map((c) => {
      const dateStr = c.issued
        ? ` (${c.issued}${c.expires ? ` – ${c.expires}` : ""})`
        : "";
      const idStr = c.credentialId ? `, ID: ${c.credentialId}` : "";
      return `- **${c.name}** — ${c.issuer}${dateStr}${idStr}`;
    }),
    "",
    "### Quick Q&A",
    ...SITE_DATA.about.faqs.flatMap((faq) => [
      `#### ${faq.question}`,
      faq.answer,
      "",
    ]),
    "---",
    "",
    "## 2. Experience",
    "",
  ];

  for (const exp of SITE_DATA.experience) {
    lines.push(
      `### ${exp.role} — ${exp.company} (${exp.period})`,
      `Type: ${exp.employmentType} | Location: ${exp.location}`,
      "",
      exp.summary,
      "",
      ...exp.highlights.map((h) => `- ${h}`),
      ""
    );
  }

  lines.push("---", "", "## 3. Projects by Domain", "");

  for (const domain of PROJECT_DOMAINS) {
    lines.push(`### Domain: ${domain.label}`, domain.description, "");
    const items = SITE_DATA.projects.filter((p) => p.domain === domain.id);
    for (const p of items) {
      lines.push(
        `#### ${p.title} (${p.period})`,
        `URL: ${SITE_URL}/project/${p.slug}`,
        `Role: ${p.role} | Client/Org: ${p.organization}`,
        `Focus: ${p.impact}`,
        `Frameworks: ${p.frameworks.join(", ")}`,
        `Tools/Stack: ${p.stack.join(", ")}`,
        "",
        `**Overview:** ${p.overview}`,
        "",
        `**Challenge:** ${p.challenge}`,
        "",
        "**Approach:**",
        ...p.approach.map((a) => `- ${a}`),
        "",
        "**Outcome:**",
        ...p.outcome.map((o) => `- ${o}`),
        ""
      );
    }
  }

  lines.push("---", "", "## 4. Journal & Technical Notes (Full Text)", "");

  for (const post of SITE_DATA.journal) {
    lines.push(
      `### ${post.title}`,
      `URL: ${SITE_URL}/journal/${post.slug}`,
      `Date: ${post.date} | Category: ${post.category} | Read Time: ${post.readTime}`,
      "",
      `**TL;DR:** ${post.tldr}`,
      "",
      "**Key Takeaways:**",
      ...post.keyTakeaways.map((k) => `- ${k}`),
      ""
    );

    for (const sec of post.sections) {
      if (sec.heading) lines.push(`#### ${sec.heading}`, "");
      if (sec.paragraphs) {
        for (const p of sec.paragraphs) lines.push(p, "");
      }
      if (sec.bullets) {
        for (const b of sec.bullets) lines.push(`- ${b}`);
        lines.push("");
      }
      if (sec.quote) lines.push(`> ${sec.quote}`, "");
      if (sec.code) {
        lines.push(
          "```" + sec.code.language,
          sec.code.content,
          "```",
          ""
        );
      }
    }

    if (post.faqs.length > 0) {
      lines.push("**Q&A:**");
      for (const faq of post.faqs) {
        lines.push(`- **Q: ${faq.question}**`, `  A: ${faq.answer}`);
      }
      lines.push("");
    }
  }

  lines.push(
    "---",
    "",
    "## 5. Contact & Responsible Disclosure",
    "",
    SITE_DATA.profile.availability,
    "",
    ...SITE_DATA.contact.links.map((l) => `- **${l.label}:** ${l.value}`),
    ""
  );

  return lines.join("\n");
}
