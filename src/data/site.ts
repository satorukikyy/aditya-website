export type ProjectDomainId =
  | "vapt"
  | "bug-bounty"
  | "grc"
  | "incident-management"
  | "security-engineering";

export interface ProjectDomain {
  id: ProjectDomainId;
  label: string;
  shortLabel: string;
  /** Short name for the compact filter bar. */
  tabLabel: string;
  description: string;
  highlights: string[];
}

export interface ProjectItem {
  slug: string;
  year: string;
  period: string;
  date: string;
  title: string;
  tag: string;
  domain: ProjectDomainId;
  summary: string;
  role: string;
  organization: string;
  impact: string;
  frameworks: string[];
  stack: string[];
  deliverables: string[];
  overview: string;
  challenge: string;
  approach: string[];
  outcome: string[];
  featured?: boolean;
  codeSnippet?: {
    title: string;
    language: string;
    code: string;
  };
}

export interface JournalSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  quote?: string;
  code?: {
    language: string;
    content: string;
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface JournalPost {
  slug: string;
  date: string;
  updatedAt: string;
  displayDate: string;
  year: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  tldr: string;
  keyTakeaways: string[];
  sections: JournalSection[];
  faqs: FaqItem[];
}

export interface ExperienceItem {
  period: string;
  employmentType: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  category: "ISO" | "Security" | "Cloud" | "Other";
  issued?: string;
  expires?: string;
  credentialId?: string;
}

export interface ContactLinkItem {
  label: string;
  value: string;
  href: string;
  copyable?: boolean;
  internal?: boolean;
}

// Canonical origin used by every canonical tag, sitemap entry, JSON-LD id, and llms file.
// When a custom domain goes live, change only this fallback (or set NEXT_PUBLIC_SITE_URL at build time).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://onerrorkx.pages.dev";

// Colour key for each track (CSS variables defined in globals.css).
export const DOMAIN_COLOR: Record<ProjectDomainId, string> = {
  vapt: "var(--pink)",
  "bug-bounty": "var(--yellow)",
  grc: "var(--purple)",
  "incident-management": "var(--sky)",
  "security-engineering": "var(--purple)",
};

export const PROJECT_DOMAINS: ProjectDomain[] = [
  {
    id: "vapt",
    label: "Vulnerability Assessment & Penetration Testing",
    shortLabel: "Vulnerability Assessment & Penetration Testing",
    tabLabel: "VAPT",
    description:
      "Testing web apps, mobile apps, and APIs the way an attacker would (OWASP WSTG and PTES), so teams fix real bugs before someone else finds them.",
    highlights: ["OWASP WSTG", "PTES", "Web / Mobile / API", "CVSS Scoring"],
  },
  {
    id: "bug-bounty",
    label: "Bug Bounty",
    shortLabel: "Bug Bounty",
    tabLabel: "Bug Bounty",
    description:
      "Hunting real vulnerabilities on Google VRP, HackerOne, Bugcrowd, and GitHub Security Advisories. Clean PoCs, honest impact, responsible disclosure.",
    highlights: [
      "Google VRP & HackerOne",
      "Bugcrowd & GHSA",
      "Web, API & OSS Security",
      "Responsible Disclosure",
    ],
  },
  {
    id: "grc",
    label: "Governance, Risk & Compliance",
    shortLabel: "Governance, Risk & Compliance",
    tabLabel: "GRC",
    description:
      "Taking ISO/IEC 27001:2022, 27701, 42001, and ISO 9001:2015 from zero to audit-ready, including 2013 to 2022 migrations, surveillance audits, UU PDP, and compliance tooling.",
    highlights: [
      "ISO/IEC 27001:2022",
      "ISO/IEC 27701 & 42001",
      "ISO 9001:2015",
      "UU PDP",
    ],
  },
  {
    id: "incident-management",
    label: "Incident Management",
    shortLabel: "Incident Management",
    tabLabel: "Incident",
    description:
      "Stepping in when an alert turns real: working out what happened, rebuilding the attack timeline, finding the root cause, and locking things down.",
    highlights: [
      "Incident Response",
      "Root Cause Analysis",
      "Timeline Reconstruction",
      "Containment",
    ],
  },
  {
    id: "security-engineering",
    label: "Security Engineering",
    shortLabel: "Security Engineering",
    tabLabel: "Security Eng",
    description:
      "Building and running Wazuh and Elastic Stack (ELK) SIEM pipelines, custom Linux and Windows detection rules, firewall telemetry, and live alert triage.",
    highlights: [
      "Wazuh SIEM",
      "Elastic Stack (ELK)",
      "Detection Rules",
      "Alert Triage",
    ],
  },
];

/* --------------------------------------------------------------------------
   Helpers for clean, zero-affiliation project definitions
   -------------------------------------------------------------------------- */

function makeVaptEngagement({
  slug,
  client,
  year,
  sector,
  featured = false,
  scope = "full",
}: {
  slug: string;
  client: string;
  year: string;
  sector: string;
  featured?: boolean;
  /** "web" for web-application-only tests, "full" for web + mobile + API. */
  scope?: "full" | "web";
}): ProjectItem {
  const webOnly = scope === "web";
  const scopeText = webOnly ? "web application" : "web apps, mobile apps, and APIs";
  return {
    slug,
    year,
    period: year,
    date: `${year}-06-01`,
    title: `VAPT – ${client}`,
    tag: "VAPT",
    domain: "vapt",
    featured,
    summary: `Manual ${webOnly ? "web application" : "web, mobile, and API"} pentest for ${client} (${sector}): testing that goes past scanners, reproducible PoCs, and fixes developers can ship.`,
    role: "Penetration Tester",
    organization: client,
    impact: "Manual OWASP WSTG and PTES testing, with a CVSS-rated report and developer-friendly fixes",
    frameworks: ["OWASP WSTG", "OWASP Top 10", "PTES", "CVSS"],
    stack: webOnly
      ? ["Web App VAPT", "Attack Surface Analysis", "Business Logic Testing"]
      : ["Web App VAPT", "API Security", "Mobile Security", "Attack Surface Analysis"],
    deliverables: [
      "Technical VAPT Findings & Reproducible PoC Report",
      "CVSS-Rated Risk Prioritization",
      "Stack-Specific Remediation & Retest Support",
    ],
    overview: `Ran a vulnerability assessment and pentest on the ${scopeText} at ${client} (${sector}), going past automated scanners to the business-logic edge cases they usually miss.`,
    challenge: `Testing production-critical ${sector.toLowerCase()} systems well beyond basic scanner checks to find exploitable bugs, without disrupting live operations.`,
    approach: [
      "Followed the full attack flow (recon, mapping, controlled exploitation, impact checks) using OWASP WSTG and PTES.",
      "Tested authentication, sessions, access control (IDOR/BOLA), input handling, and business logic by hand.",
      "Documented every confirmed bug with simple repro steps, honest CVSS scores, and fixes that match the team's stack.",
    ],
    outcome: [
      `Gave ${client} a clear report so engineering could go straight to patching what mattered.`,
      "Tied technical findings back to business risk and audit readiness so leadership saw the whole picture.",
    ],
  };
}

function makeSocEngagement({
  slug,
  client,
  year,
  sector,
  featured = false,
}: {
  slug: string;
  client: string;
  year: string;
  sector: string;
  featured?: boolean;
}): ProjectItem {
  return {
    slug,
    year,
    period: year,
    date: `${year}-10-01`,
    title: `Security Engineering – ${client}`,
    tag: "Security Engineering",
    domain: "security-engineering",
    featured,
    summary: `Day-to-day SOC monitoring and SIEM operations for ${client} (${sector}) on Wazuh and Elastic Stack (ELK): custom detection rules, log tuning, and alert triage.`,
    role: "Security Engineer",
    organization: client,
    impact: "Central Wazuh/ELK visibility, custom detection rules, and live alert triage",
    frameworks: ["SOC Operations", "SIEM Correlation", "Threat Detection"],
    stack: ["Wazuh SIEM", "Elastic Stack (ELK)", "Linux/Windows Telemetry", "Log Analysis"],
    deliverables: [
      "Wazuh & ELK Monitoring Pipeline",
      "Custom Detection & Correlation Rules",
      "Alert Triage & Escalation Reporting",
    ],
    overview: `Ran ongoing SOC monitoring and SIEM operations for ${client} (${sector}) so unusual activity didn't slip through.`,
    challenge: `Cutting through noisy ${sector.toLowerCase()} endpoint, server, and network logs to catch real threats fast without alert fatigue.`,
    approach: [
      "Kept Wazuh SIEM and Elastic Stack (ELK) ingestion healthy across Linux and Windows telemetry.",
      "Wrote and tuned custom detection and correlation rules so suspicious behavior surfaced early.",
      "Triaged alerts daily, dug into suspicious events, and escalated cleanly to internal IT teams.",
    ],
    outcome: [
      `Gave ${client} a sharper day-to-day view of what was actually happening across their infrastructure.`,
      "Cleaned up noisy logs and sped up alert triage so the team could focus on real signals.",
    ],
  };
}

/* --------------------------------------------------------------------------
   All projects, grouped by track. Add new work to the matching array below;
   counts, sitemap, llms files, and JSON-LD all update from here.
   -------------------------------------------------------------------------- */

const VAPT_PROJECTS: ProjectItem[] = [
  makeVaptEngagement({
    slug: "vapt-pt-shinhan-sekuritas-indonesia",
    client: "PT Shinhan Sekuritas Indonesia",
    year: "2026",
    sector: "Securities & Capital Markets",
    featured: true,
  }),
  makeVaptEngagement({
    slug: "vapt-pt-bri-danareksa-sekuritas-2026",
    client: "PT BRI Danareksa Sekuritas",
    year: "2026",
    sector: "Securities & Capital Markets",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-sonicwave-nusantara-teknologi",
    client: "PT Sonicwave Nusantara Teknologi",
    year: "2026",
    sector: "Technology",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-lestari-banten-energy",
    client: "PT Lestari Banten Energy",
    year: "2026",
    sector: "Energy & Critical Infrastructure",
    featured: true,
  }),
  makeVaptEngagement({
    slug: "vapt-pt-inspiro",
    client: "PT Inspiro",
    year: "2026",
    sector: "Technology",
    featured: true,
  }),
  makeVaptEngagement({
    slug: "vapt-pt-hutama-karya-infrastruktur",
    client: "PT Hutama Karya Infrastruktur",
    year: "2026",
    sector: "Critical Infrastructure",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-asuransi-jiwa-reliance-indonesia",
    client: "PT Asuransi Jiwa Reliance Indonesia",
    year: "2026",
    sector: "Insurance & Financial Services",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-mahardika-teknotama-integrasi",
    client: "PT Mahardika Teknotama Integrasi",
    year: "2026",
    sector: "Technology Integration",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-pupuk-iskandar-muda",
    client: "PT Pupuk Iskandar Muda",
    year: "2026",
    sector: "Industrial & Critical Infrastructure",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-arta-mediatek-transformasi",
    client: "PT Arta MediaTek Transformasi",
    year: "2026",
    sector: "Technology",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-inovasi-digital-untuk-transformasi",
    client: "PT Inovasi Digital Untuk Transformasi",
    year: "2026",
    sector: "Digital Transformation",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-prime-analytics-indonesia",
    client: "PT Prime Analytics Indonesia",
    year: "2026",
    sector: "Data & Analytics",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-good-doctor-technology-indonesia",
    client: "PT Good Doctor Technology Indonesia",
    year: "2026",
    sector: "Healthcare Technology",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-prima-sistem-informasi",
    client: "PT Prima Sistem Informasi",
    year: "2026",
    sector: "Enterprise IT",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-bri-danareksa-sekuritas-2025",
    client: "PT BRI Danareksa Sekuritas",
    year: "2025",
    sector: "Securities & Capital Markets",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-crif-lembaga-informasi-keuangan",
    client: "PT CRIF Lembaga Informasi Keuangan",
    year: "2025",
    sector: "Financial Credit Information Services",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-kb-valbury-sekuritas",
    client: "PT KB Valbury Sekuritas",
    year: "2025",
    sector: "Securities & Capital Markets",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-manpro-teknologi-indonesia",
    client: "PT Manpro Teknologi Indonesia",
    year: "2025",
    sector: "Technology",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-asuransi-bina-dana-arta-tbk",
    client: "PT Asuransi Bina Dana Arta Tbk",
    year: "2025",
    sector: "Insurance",
    scope: "web",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-asuransi-tugu-pratama-indonesia-tbk",
    client: "PT Asuransi Tugu Pratama Indonesia Tbk",
    year: "2025",
    sector: "Insurance",
    scope: "web",
  }),
  makeVaptEngagement({
    slug: "vapt-pt-semesta-indovest-sekuritas",
    client: "PT Semesta Indovest Sekuritas",
    year: "2025",
    sector: "Securities & Capital Markets",
    scope: "web",
  }),
];

const BUG_BOUNTY_PROJECTS: ProjectItem[] = [
  {
    slug: "google-vrp-gemini-cli-ssrf",
    year: "2026",
    period: "2026",
    date: "2026-11-01",
    title: "Google VRP – gemini-cli SSRF Filter Bypass via Indirect Prompt Injection",
    tag: "Google VRP",
    domain: "bug-bounty",
    featured: true,
    summary:
      "An SSRF filter bypass in google-gemini/gemini-cli's web fetch tool reachable through indirect prompt injection in a repo README, filed with Google OSS VRP.",
    role: "Security Researcher",
    organization: "Google VRP (OSS VRP) · google-gemini/gemini-cli",
    impact: "SSRF filter bypass via indirect prompt injection in gemini-cli · reported to Google VRP",
    frameworks: ["SSRF", "Indirect Prompt Injection", "AI Tooling Security", "Google OSS VRP"],
    stack: ["google-gemini/gemini-cli", "Web Fetch Guard", "DNS & Redirect Validation"],
    deliverables: [
      "Google VRP Security Report",
      "High-Level Threat Model & Multi-Layer Fix Guidance",
    ],
    overview:
      "Reported a high-level SSRF filter bypass in google-gemini/gemini-cli to Google's OSS VRP. When a developer runs the agent inside a cloned repo with crafted setup steps in a README, workspace text is treated as trusted instructions and can push the web fetch tool toward internal or local targets.",
    challenge:
      "The fetch guard judged hostnames as plain text instead of resolving where they actually point, and redirect destinations weren't re-checked, plus if one fetch tool hit a block, the agent could pivot to another tool to finish the task.",
    approach: [
      "Traced how the fetch guard checked whether a hostname looked like a private address, a normal domain resolving to loopback or private IPs still slipped through, and redirect hops bypassed re-validation.",
      "Demonstrated how ordinary-looking setup instructions planted in a repository README could act as indirect prompt injection once a developer asked the agent to follow setup.",
      "Recommended four layered guards instead of relying on the model alone: resolve DNS first then check the IP, re-validate every redirect hop, treat workspace file text as untrusted, and never route around a blocked fetch with a shell tool.",
    ],
    outcome: [
      "Filed with Google VRP (OSS VRP) targeting google-gemini/gemini-cli; full technical exploit details remain intentionally withheld.",
      "Highlighted what sits in range when an AI coding agent hits SSRF: local dev services, DB/API secrets, cloud metadata endpoints, and internal networks on laptops or CI runners.",
    ],
  },
  {
    slug: "twilio-segment-settings-ssrf",
    year: "2026",
    period: "Oct 2026",
    date: "2026-10-19",
    title: "Twilio Segment – Settings-Injection SSRF & Credential Exfiltration",
    tag: "Critical 9.6",
    domain: "bug-bounty",
    featured: true,
    summary:
      "Critical (9.6) settings-injection SSRF with silent credential and customer event exfiltration in Segment Action destinations, reported to Twilio via HackerOne.",
    role: "Security Researcher",
    organization: "Twilio (HackerOne) · Segment Action Destinations",
    impact: "Critical (9.6) SSRF & credential exfiltration · verified safely on prod with a harmless sentinel",
    frameworks: ["SSRF", "Credential Exfiltration", "Host Allowlisting", "HackerOne"],
    stack: ["Segment Actions", "Destination Settings", "Outbound HTTP Validation"],
    deliverables: [
      "Critical (9.6) HackerOne Vulnerability Report",
      "Repo-Wide Destination Hardening Checklist",
    ],
    overview:
      "Reported a Critical (9.6) settings-injection SSRF class in Twilio Segment Action destinations via HackerOne. Because a destination setting directly shaped the outbound request host without strict host validation, stored secrets and live customer event data could be routed straight to an attacker-controlled host.",
    challenge:
      "A single unvalidated host setting meant stored destination API keys, OAuth client secrets, and every forwarded customer event (user IDs, IPs, user agents, page URLs, properties) rode along silently, and responses could still look like normal successful deliveries.",
    approach: [
      "Identified the unvalidated host-shaping pattern where no host allowlist or legitimate-endpoint verification ran when enabling the destination.",
      "Verified the behavior safely on production using only a harmless sentinel value inside a throwaway workspace (requiring destination-config permissions, with zero impact to real tenants).",
      "Recommended a clean four-step sweep: enforce strict host allowlists, reject URL separators and control characters, verify the legitimate vendor endpoint on enable, and audit every destination in the repo together instead of patching one by one.",
    ],
    outcome: [
      "Reported to Twilio through HackerOne on Oct 19 (rated Critical 9.6); specific technical exploit details remain intentionally withheld.",
      "Flagged the pattern as a repository-wide class worth sweeping across all Action destinations in one pass.",
    ],
  },
  {
    slug: "privy-react-auth-postmessage-origin",
    year: "2026",
    period: "Sep 2026",
    date: "2026-09-11",
    title: "Privy (@privy-io/react-auth) – Cross-App postMessage Origin Validation Bypass",
    tag: "High 8.4",
    domain: "bug-bounty",
    summary:
      "High (8.4) missing postMessage origin, source, and nonce validation in @privy-io/react-auth 3.42.0's 120-second cross-app signing listener, reported to Privy via HackerOne.",
    role: "Security Researcher",
    organization: "Privy Bounty (HackerOne) · @privy-io/react-auth 3.42.0",
    impact: "High (8.4) · CWE-346 / CWE-345 cross-app signing channel integrity break",
    frameworks: ["CWE-346", "CWE-345", "CWE-598", "postMessage Security", "HackerOne"],
    stack: ["@privy-io/react-auth", "Browser postMessage", "Cross-App Wallet Signing"],
    deliverables: [
      "High (8.4) HackerOne Report",
      "Node & Cross-Origin Browser PoC",
    ],
    overview:
      "Found a High (8.4) origin validation gap in @privy-io/react-auth 3.42.0 and reported it to Privy via HackerOne. Every time sendCrossAppRequest ran, it registered a top-level window message listener that stayed open for ~120 seconds without checking who sent the message.",
    challenge:
      "While other parts of the same SDK strictly pinned origins (embedded wallet iframe and Apple's CloudKit branch), the cross-app handler checked no origin, no event.source, and no nonce, letting any third-party iframe, script, or window reference spoof four control commands from any origin.",
    approach: [
      "Audited sendCrossAppRequest and confirmed four unauthenticated commands accepted from any origin: token.action = 'set' (overwrite provider token), token.action = 'clear' (wipe token), PRIVY_CROSS_APP_ACTION_RESPONSE (resolve signing with forged data), and PRIVY_CROSS_APP_ACTION_ERROR (force failure).",
      "Built both a Node test and a live cross-origin browser PoC proving token poisoning and forged signing resolution.",
      "Also flagged a separate CWE-598 hardening item where the outbound request carried the provider token in a URL query string (exposing it to browser history, logs, and referrers).",
    ],
    outcome: [
      "Reported to Privy Bounty via HackerOne on Sep 11 (High 8.4, CWE-346 & CWE-345).",
      "Scoped impact honestly: breaks cross-app signing channel integrity (misdirected future wallet ops or forged dApp outcomes) without exposing embedded wallet private keys or forging provider-side signatures.",
    ],
  },
  {
    slug: "redos-conventional-commits-parser",
    year: "2026",
    period: "Sep 2026",
    date: "2026-09-02",
    title: "conventional-commits-parser (GHSA-53jp-mg8h-xjfh) – Cubic ReDoS in Reference Parsing",
    tag: "GHSA",
    domain: "bug-bounty",
    summary:
      "A cubic ReDoS in conventional-commits-parser (<= 7.1.2) where 4,000 spaces on a commit body line stall Node for ~103 seconds, filed as GHSA-53jp-mg8h-xjfh.",
    role: "Security Researcher",
    organization: "GitHub Security Advisories · conventional-commits-parser",
    impact: "GHSA-53jp-mg8h-xjfh (Moderate) · 4,000 spaces -> 103.5s stall, fix drops 20,000 spaces to ~0.1ms",
    frameworks: ["ReDoS", "CWE-1333", "GitHub Security Advisory", "npm Security"],
    stack: ["conventional-commits-parser", "Node.js 24", "Regex Backtracking Analysis"],
    deliverables: [
      "GitHub Security Advisory (GHSA-53jp-mg8h-xjfh)",
      "Cubic Benchmark & Minimal Regex Patch",
    ],
    overview:
      "Discovered and filed GHSA-53jp-mg8h-xjfh for a regular expression denial of service (ReDoS) in conventional-commits-parser (<= 7.1.2). Feeding a single commit body line of plain spaces with no '#' triggers catastrophic backtracking and locks up the Node event loop.",
    challenge:
      "CommitParser.parseReferences() runs on every commit message line; when no reference keyword is present, fallback /()(.+)/gi hands the entire line to referenceParts.exec(line), where three overlapping matchers ((?:.*?)??, \\s*, and ([\\w-.\\/]*)??) fight over the exact same characters.",
    approach: [
      "Benchmarked default options on Node 24: 500 spaces took 210 ms, 1,000 took 1,671 ms, 2,000 took 13,051 ms, 3,000 took 43,468 ms, and 4,000 spaces stalled for 103,493 ms (roughly cubic growth, double the input, ~8x the wait).",
      "Tested a targeted fix dropping the leading catch-all and doubled lazy/optional quantifiers so backtracking disappears.",
      "Verified locally that 20,000 spaces finished in ~0.1 ms while real commit references like angular/angular#456 still parsed cleanly.",
    ],
    codeSnippet: {
      title: "Suggested non-backtracking reference pattern",
      language: "javascript",
      code: `/([\\w.\\/-]*?)(#)([\\w-]+)(?=\\s|$|[,;.)\\]])/gi`,
    },
    outcome: [
      "Filed through GitHub Security Advisories on Sep 2 as GHSA-53jp-mg8h-xjfh (Moderate severity, affecting <= 7.1.2).",
      "Kept impact transparent: CPU exhaustion and event-loop DoS on apps parsing attacker-influenced commit messages (availability only, no code execution, no data leak).",
    ],
  },
  {
    slug: "vercel-serve-handler-file-read",
    year: "2026",
    period: "Sep 2026",
    date: "2026-09-01",
    title: "Vercel (serve-handler) – Unauthenticated Arbitrary File Read via Mid-Path Symlink",
    tag: "High 8.6",
    domain: "bug-bounty",
    summary:
      "Unauthenticated arbitrary file read in serve-handler 6.1.7 (used by serve 14.2.6 / npx serve) where default symlinks: false still follows mid-path symlinks, reported to Vercel via HackerOne.",
    role: "Security Researcher",
    organization: "Vercel Open Source (HackerOne) · serve-handler 6.1.7",
    impact: "CVSS 3.1: 8.6 High / 6.8 Medium · CWE-59 & CWE-22 symlink boundary bypass",
    frameworks: ["CWE-59", "CWE-22", "Path Traversal", "HackerOne"],
    stack: ["serve-handler 6.1.7", "serve 14.2.6", "Node.js fs / realpath"],
    deliverables: [
      "Vercel Open Source HackerOne Report",
      "Boundary Validation & realpath Fix Recommendation",
    ],
    overview:
      "Reported an unauthenticated arbitrary file read in Vercel's serve-handler 6.1.7 (pinned by serve 14.2.6, meaning default npx serve ran affected) via HackerOne. Even with symlinks: false enabled by default, a symlink placed in the middle of a directory path bypassed the server's path checks completely.",
    challenge:
      "serve-handler checked lexical ../ traversal up front (returning 400) and ran lstat only on the final path component (returning 404 for a direct symlink file), leaving a blind spot for intermediate directory symlinks, so createReadStream happily followed the mid-path link and streamed files from outside the root.",
    approach: [
      "Verified the behavior matrix under default symlinks: false: /../etc/passwd -> 400, /%2e%2e/etc/passwd -> 400, /assets/abs-file (final-component symlink) -> 404, but /assets/backup/etc/passwd (mid-path symlink) -> 200 OK serving the file.",
      "Confirmed downstream impact on serve 14.2.6, where symlinks stays unset and defaults straight into the vulnerable mode.",
      "Proposed resolving realpath for both target and root before checking isPathInside(real, root) in both symlink modes, plus handling missing paths, symlink loops, and TOCTOU races on the opened file descriptor.",
    ],
    codeSnippet: {
      title: "Simplified realpath boundary check",
      language: "javascript",
      code: `const real = await realpath(absolutePath)\nconst root = await realpath(current)\nif (!isPathInside(real, root)) return 404`,
    },
    outcome: [
      "Reported to Vercel Open Source via HackerOne on Sep 1 (CWE-59 & CWE-22; CVSS 8.6 High when symlinks can arrive via archives/uploads/untrusted repos, 6.8 Medium otherwise).",
      "Clear confidentiality impact (any source, config, credential, or token readable by the server process) with no write or integrity impact.",
    ],
  },
  {
    slug: "nba-dev-api-auth-gate-bypass",
    year: "2026",
    period: "Sep 2026",
    date: "2026-09-01",
    title: "NBA Public Bug Bounty – -dev Staging API Authentication Gate Bypass",
    tag: "High",
    domain: "bug-bounty",
    summary:
      "High severity (7.0–8.9) authentication gate bypass on a -dev staging host where page routes redirected to corporate login but /api/* responded 200 OK to anyone, reported to NBA via HackerOne.",
    role: "Security Researcher",
    organization: "NBA Public Bug Bounty (HackerOne) · -dev Staging",
    impact: "High (7.0–8.9) · unauthenticated /api/* exposure on -dev staging (host redacted)",
    frameworks: ["Broken Access Control", "Auth Gate Bypass", "API Security", "HackerOne"],
    stack: ["Staging /api/* Surface", "Edge & Origin Auth Enforcement"],
    deliverables: [
      "High Severity HackerOne Report",
      "Host-Wide Default-Deny Auth Fix Guidance",
    ],
    overview:
      "Reported a High severity (7.0–8.9) authentication gate bypass on a -dev staging host to the NBA Public Bug Bounty via HackerOne. While standard page routes properly forced corporate login, the entire /api/* surface skipped the gate and served responses to unauthenticated requests.",
    challenge:
      "Comparing the -dev host against its -qa sibling made the root cause unmistakable: on -qa, GET /api/heartbeat redirected 302 to login, whereas on -dev, GET /api/heartbeat and GET /api/content answered 200 OK with zero cookies or tokens.",
    approach: [
      "Verified the mismatch across route classes: GET / and GET /scaffolding returned 302 login redirects, while /api/* endpoints bypassed auth completely.",
      "Documented the exposed non-production surface: staging CMS posts, internal non-production hostnames, and pre-release endpoints (content, schedule, teams, players, transactions, games, search, streaming, standings). Then stopped immediately without touching any PII, credentials, or secrets.",
      "Recommended enforcing default-deny authentication at the edge or origin across the entire non-production host (including /api/*) rather than matching page routes only.",
    ],
    outcome: [
      "Submitted to NBA Public Bug Bounty via HackerOne on Sep 1 (rated High 7.0–8.9; host redacted).",
      "Kept testing strictly ethical: zero credentials, PII, or secrets accessed.",
    ],
  },
  {
    slug: "mattermost-confluence-oauth-csrf",
    year: "2026",
    period: "Aug 2026",
    date: "2026-08-24",
    title: "Mattermost Confluence Plugin – OAuth Account-Linking CSRF",
    tag: "P2",
    domain: "bug-bounty",
    summary:
      "P2 OAuth account-linking CSRF in Mattermost Confluence plugin 1.19.1 where one crafted completion link binds a victim's Mattermost account to an attacker's Confluence identity, reported via Bugcrowd.",
    role: "Security Researcher",
    organization: "Mattermost Public Bug Bounty (Bugcrowd) · Confluence Plugin 1.19.1",
    impact: "P2 (VRT) · OAuth state not bound to initiating user or burned after first use",
    frameworks: ["OAuth 2.0 Security", "CSRF", "Account Linking", "Bugcrowd"],
    stack: ["Mattermost Confluence Plugin 1.19.1", "OAuth2 State Validation"],
    deliverables: [
      "P2 Bugcrowd Vulnerability Report",
      "State-Binding & One-Time Burn Fix Spec",
    ],
    overview:
      "Found an OAuth account-linking CSRF in Mattermost's Confluence plugin (v1.19.1) and reported it via Bugcrowd. If a logged-in Mattermost user opens a single crafted completion URL, the plugin links their Mattermost account straight to the attacker's Confluence Cloud identity.",
    challenge:
      "The completion endpoint (GET /plugins/com.mattermost.confluence/api/v1/oauth2/complete.html) checked whether the OAuth state existed in its store, but never checked if that state belonged to the logged-in Mattermost user, and left the state reusable until expiry.",
    approach: [
      "Started the OAuth flow using an attacker-controlled Mattermost and Confluence Cloud test account to obtain a valid authorization code and state.",
      "Visited the completion URL from a logged-in victim session in a redacted test tenant and verified /confluence connect immediately showed the victim linked to the attacker's Confluence identity.",
      "Recommended two straightforward fixes: strictly verify that the stored OAuth state matches the currently authenticated Mattermost user on completion, and delete the state immediately on first use.",
    ],
    outcome: [
      "Reported to Mattermost Public Bug Bounty via Bugcrowd on Aug 24 (P2 suggested by VRT; test tenant redacted).",
      "Clearly scoped impact: unauthorized account linking allowing attacker-controlled Confluence content to surface through the victim's integration (does not expose the victim's Atlassian credentials).",
    ],
  },
];

const GRC_PROJECTS: ProjectItem[] = [
  {
    slug: "grc-pt-shinhan-sekuritas-indonesia",
    year: "2026",
    period: "2026",
    date: "2026-09-15",
    title: "IT GRC & Security Compliance – PT Shinhan Sekuritas Indonesia",
    tag: "GRC",
    domain: "grc",
    featured: true,
    summary:
      "Hands-on IT GRC and security compliance work for a securities & capital markets environment: tightening governance, risk tracking, and audit readiness.",
    role: "IT GRC Consultant",
    organization: "PT Shinhan Sekuritas Indonesia",
    impact: "Capital-markets security governance, risk alignment & compliance readiness",
    frameworks: ["ISO/IEC 27001:2022", "IT GRC", "Risk Management"],
    stack: ["Governance Review", "Risk Assessment", "Control Alignment", "Audit Readiness"],
    deliverables: [
      "Security Governance & Policy Alignment",
      "Risk Assessment & Control Gap Review",
      "Compliance & Audit Readiness Support",
    ],
    overview:
      "Worked with PT Shinhan Sekuritas Indonesia on IT GRC and security compliance across their securities and capital markets operations.",
    challenge:
      "Keeping governance, risk registers, and technical security controls dialed in for a tightly regulated financial services environment without drowning teams in busywork.",
    approach: [
      "Reviewed existing security policies, risk workflows, and operational controls against ISO/IEC 27001:2022 and regulatory expectations.",
      "Mapped real gaps and built clear, prioritized action items for both IT and compliance stakeholders.",
      "Backed audit readiness with clean control evidence and practical day-to-day governance habits.",
    ],
    outcome: [
      "Sharpened overall security governance and compliance readiness across capital-markets ops.",
      "Aligned technical and compliance teams on clear risk priorities and audit-ready evidence.",
    ],
  },
  {
    slug: "iso-27001-2022-implementation-pt-berlian-sistem-informasi",
    year: "2026",
    period: "Sep 2026 – Present",
    date: "2026-09-01",
    title: "ISO/IEC 27001:2022 Implementation – PT Berlian Sistem Informasi",
    tag: "Implementation",
    domain: "grc",
    featured: true,
    summary:
      "Building out info-sec governance and an ISO/IEC 27001:2022 ISMS: practical policies, real risk checks, control reviews, and audit readiness.",
    role: "IT GRC Consultant",
    organization: "PT Berlian Sistem Informasi",
    impact: "ISMS governance, risk checks & ISO/IEC 27001:2022 rollout",
    frameworks: ["ISO/IEC 27001:2022", "ISMS", "Annex A Controls"],
    stack: ["Risk Assessment", "Policy Design", "Control Evaluation", "Compliance"],
    deliverables: [
      "Information Security Governance & Policy Suite",
      "Risk Assessment & Treatment Plan",
      "Security Control Evaluation & Compliance Mapping",
    ],
    overview:
      "Helping build out information security governance and an ISO/IEC 27001:2022 ISMS at PT Berlian Sistem Informasi.",
    challenge:
      "Setting up real security governance and mapping policies, risk registers, and Annex A controls into daily work without slowing the team down.",
    approach: [
      "Put together lean info-sec policies and ISMS governance docs people can actually read.",
      "Ran risk checks to spot the biggest threats, gaps, and what needed fixing first.",
      "Reviewed live security controls and lined everything up cleanly with ISO/IEC 27001:2022.",
    ],
    outcome: [
      "Got a solid ISO/IEC 27001:2022 governance baseline up and running.",
      "Built repeatable risk-check and control-review habits across the team.",
    ],
  },
  {
    slug: "iso-27001-2022-iso-9001-2015-pt-mahardika-teknotama-integrasi",
    year: "2026",
    period: "Jun 2026 – Present",
    date: "2026-06-01",
    title:
      "ISO/IEC 27001:2022 & ISO 9001:2015 Implementation – PT Mahardika Teknotama Integrasi",
    tag: "ISMS + QMS",
    domain: "grc",
    summary:
      "Rolling out ISO/IEC 27001:2022 and ISO 9001:2015 together under one roof: gap checks, unified risk workflows, and internal audit prep.",
    role: "IT GRC Consultant",
    organization: "PT Mahardika Teknotama Integrasi",
    impact: "Unified ISMS (ISO 27001:2022) & QMS (ISO 9001:2015) setup",
    frameworks: ["ISO/IEC 27001:2022", "ISO 9001:2015", "Integrated Management System"],
    stack: ["Gap Assessment", "Risk Management", "Internal Audit Prep", "Compliance"],
    deliverables: [
      "Integrated ISMS & QMS Documentation",
      "Gap Assessment & Risk Management Register",
      "Internal Audit Prep & Compliance Review",
    ],
    overview:
      "Helping roll out both ISO/IEC 27001:2022 (security) and ISO 9001:2015 (quality) together at PT Mahardika Teknotama Integrasi.",
    challenge:
      "Running two ISO standards side by side without forcing teams to drown in duplicate SOPs and copy-paste docs.",
    approach: [
      "Ran gap checks against both ISO/IEC 27001:2022 and ISO 9001:2015 clauses.",
      "Built one clean documentation and risk workflow covering both info-sec and quality ops.",
      "Prepped internal audits and compliance checks so everything held together before audit day.",
    ],
    outcome: [
      "Got security and quality running under one unified, audit-ready system.",
      "Cut out duplicate paperwork while leveling up readiness across both standards.",
    ],
  },
  {
    slug: "iso-27001-2022-implementation-pt-inovasi-digital-untuk-transformasi",
    year: "2026",
    period: "Aug 2026 – Nov 2026",
    date: "2026-08-01",
    title:
      "ISO/IEC 27001:2022 Implementation – PT Inovasi Digital Untuk Transformasi",
    tag: "Implementation",
    domain: "grc",
    summary:
      "Led ISMS scoping and rollout: figuring out org context, spotting real risks, mapping controls, and writing lean docs that fit fast ops.",
    role: "IT GRC Consultant",
    organization: "PT Inovasi Digital Untuk Transformasi",
    impact: "ISMS scoping, risk mapping & practical control alignment",
    frameworks: ["ISO/IEC 27001:2022", "ISMS", "Risk Identification"],
    stack: ["Context Analysis", "Risk Identification", "Control Mapping", "Documentation"],
    deliverables: [
      "Org Context & ISMS Scope Definition",
      "Risk Identification & Control Requirements",
      "Core ISMS Policies & Procedures",
    ],
    overview:
      "Ran ISMS scoping and ISO/IEC 27001:2022 rollout work for PT Inovasi Digital Untuk Transformasi.",
    challenge:
      "Turning ISO/IEC 27001:2022 clauses into lean docs and controls that actually match how a fast-moving digital team ships.",
    approach: [
      "Mapped org context, key stakeholders, and clear ISMS boundaries.",
      "Flagged real security risks and picked the Annex A controls that actually made sense.",
      "Wrote straight-to-the-point ISMS docs built around how the team already works.",
    ],
    outcome: [
      "Shipped a clean ISMS doc set and risk baseline.",
      "Lined security controls straight up with core day-to-day operations.",
    ],
  },
  {
    slug: "iso-27001-2022-implementation-pt-sonicwave-nusantara-teknologi",
    year: "2026",
    period: "Jul 2026 – Sep 2026",
    date: "2026-07-01",
    title:
      "ISO/IEC 27001:2022 Implementation – PT Sonicwave Nusantara Teknologi",
    tag: "Implementation",
    domain: "grc",
    featured: true,
    summary:
      "Helped get ISO/IEC 27001:2022 live: ISMS docs, risk assessments, Annex A control alignment, and internal audit prep.",
    role: "IT GRC Consultant",
    organization: "PT Sonicwave Nusantara Teknologi",
    impact: "ISMS docs, risk checks & internal audit readiness",
    frameworks: ["ISO/IEC 27001:2022", "ISMS", "Internal Audit"],
    stack: ["ISMS Documentation", "Risk Assessment", "Internal Audit Prep", "Control Alignment"],
    deliverables: [
      "ISO/IEC 27001:2022 Documentation Pack",
      "Security Risk Assessment",
      "Internal Audit Prep & Control Alignment",
    ],
    overview:
      "Worked with PT Sonicwave Nusantara Teknologi to get their ISO/IEC 27001:2022 controls, docs, and internal audit prep dialed in.",
    challenge:
      "Getting full ISMS docs, risk checks, and internal audit prep buttoned up cleanly on a tight timeline.",
    approach: [
      "Drafted clean ISMS policies, procedures, and compliance records aligned with ISO/IEC 27001:2022.",
      "Ran security risk assessments and synced operational controls with Annex A.",
      "Prepped internal audits so gaps got spotted and patched before external auditors showed up.",
    ],
    outcome: [
      "Tightened the org's security structure and Annex A control coverage.",
      "Left the team confident and ready with solid docs and internal audit backing.",
    ],
  },
  {
    slug: "security-compliance-assessment-pt-solusi-dwi-satya",
    year: "2026",
    period: "2026",
    date: "2026-05-15",
    title: "Security Compliance Assessment – PT Solusi Dwi Satya",
    tag: "Compliance",
    domain: "grc",
    featured: true,
    summary:
      "Honest security compliance check: looking at real controls, spotting gaps, and mapping out what to fix first without checklist bloat.",
    role: "IT GRC Consultant",
    organization: "PT Solusi Dwi Satya",
    impact: "Clear gap snapshot, compliance readiness & prioritized fix roadmap",
    frameworks: ["ISO/IEC 27001:2022", "UU PDP", "Security Compliance"],
    stack: ["Gap Assessment", "Control Evaluation", "Compliance Advisory", "Risk Mapping"],
    deliverables: [
      "Security Compliance Gap Report",
      "Control Maturity Evaluation",
      "Prioritized Remediation Roadmap",
    ],
    overview:
      "Ran a hands-on security compliance check for PT Solusi Dwi Satya to see how their current controls stacked up against ISO 27001 and regulatory expectations.",
    challenge:
      "Giving leadership a clear, honest picture of compliance gaps without burying the team in theoretical checklists.",
    approach: [
      "Checked existing security policies, technical controls, and real day-to-day evidence.",
      "Mapped gaps straight against ISO/IEC 27001:2022 and data protection requirements.",
      "Built a practical fix roadmap ordered by actual business risk.",
    ],
    outcome: [
      "Gave PT Solusi Dwi Satya a clear baseline and concrete next moves.",
      "Got technical and governance folks aligned on the exact same priorities.",
    ],
  },
  {
    slug: "iso-27001-2022-surveillance-audit-bdx-data-center",
    year: "2026",
    period: "Apr 2026 – Jul 2026",
    date: "2026-04-01",
    title:
      "ISO/IEC 27001:2022 Surveillance Audit – PT Starone Mitra Telekomunikasi (BDx Data Centers)",
    tag: "Surveillance",
    domain: "grc",
    featured: true,
    summary:
      "Surveillance audit work at BDx Data Centers: checking physical & environmental security, access control, and live audit evidence.",
    role: "IT GRC Consultant",
    organization: "PT Starone Mitra Telekomunikasi (BDx Data Centers)",
    impact: "Data center physical, environmental & access-control review",
    frameworks: ["ISO/IEC 27001:2022", "Surveillance Audit", "Physical & Environmental Security"],
    stack: ["Physical Security Audit", "Access Management Review", "Audit Evidence"],
    deliverables: [
      "Data Center Physical & Environmental Control Review",
      "Access Management & Compliance Evidence Check",
      "Targeted Security Improvement Notes",
    ],
    overview:
      "Supported ISO/IEC 27001:2022 surveillance audit work at BDx Data Centers (PT Starone Mitra Telekomunikasi), checking real controls in a high-stakes data center environment.",
    challenge:
      "Validating strict physical, environmental, and access controls expected in a live data center while finding practical upgrades that actually help ops.",
    approach: [
      "Checked live controls with extra focus on physical and environmental security.",
      "Reviewed access management flows and verified real audit evidence.",
      "Flagged practical tweaks to keep facility security and the ISMS sharp.",
    ],
    outcome: [
      "Confirmed ongoing ISO/IEC 27001:2022 compliance and ISMS health on site.",
      "Handed over clear, actionable upgrade notes across physical, environmental, and access controls.",
    ],
  },
  {
    slug: "iso-27001-2022-implementation-pt-arta-mediatek-transformasi",
    year: "2026",
    period: "Mar 2026 – Jul 2026",
    date: "2026-03-01",
    title:
      "ISO/IEC 27001:2022 Implementation – PT Arta MediaTek Transformasi",
    tag: "Implementation",
    domain: "grc",
    summary:
      "Full ISO/IEC 27001:2022 rollout: policies, risk registers, SoA, internal audits, plus asset, incident, and vendor security controls.",
    role: "IT GRC Consultant",
    organization: "PT Arta MediaTek Transformasi",
    impact: "Full ISMS build: policies, risk register, SoA, asset, incident & vendor controls",
    frameworks: ["ISO/IEC 27001:2022", "SoA", "Supplier Security"],
    stack: ["Risk Register", "SoA", "Asset Management", "Incident Management", "Internal Audit"],
    deliverables: [
      "Security Policies & Risk Registers",
      "Statement of Applicability (SoA) & Internal Audit Docs",
      "Asset, Incident & Supplier Security Controls",
    ],
    overview:
      "Worked across the full ISO/IEC 27001:2022 ISMS build at PT Arta MediaTek Transformasi, wiring governance docs straight into real operational security.",
    challenge:
      "Pulling asset tracking, incident response, and third-party vendor controls together into one clean, auditable ISMS.",
    approach: [
      "Built core security policies, risk registers, and the Statement of Applicability (SoA).",
      "Set up practical controls for asset management, incident handling, and supplier security.",
      "Prepped internal audit docs to sanity-check controls before external review.",
    ],
    outcome: [
      "Shipped a complete ISO/IEC 27001:2022 governance and operational toolkit.",
      "Tightened coverage across internal assets, incident response, and external vendors.",
    ],
  },
  {
    slug: "security-compliance-pt-solusi-dwi-satya-2025",
    year: "2025",
    period: "2025",
    date: "2025-08-01",
    title: "Security Compliance – PT Solusi Dwi Satya",
    tag: "Compliance",
    domain: "grc",
    summary:
      "Security compliance work for PT Solusi Dwi Satya: checking real controls against requirements, finding gaps, and lining up evidence for audit.",
    role: "IT GRC Consultant",
    organization: "PT Solusi Dwi Satya",
    impact: "Security compliance review, gap visibility, and audit-ready evidence",
    frameworks: ["IT GRC", "Security Compliance"],
    stack: ["Control Review", "Gap Analysis", "Compliance Advisory"],
    deliverables: [
      "Security Compliance Review",
      "Gap & Priority Summary",
      "Audit Evidence Support",
    ],
    overview:
      "Worked with PT Solusi Dwi Satya on security compliance, looking at how their day-to-day controls held up against the requirements in scope.",
    challenge:
      "Getting an honest picture of where controls stood without burying the team in checklists.",
    approach: [
      "Reviewed existing policies, technical controls, and the evidence behind them.",
      "Mapped gaps against the compliance requirements in scope.",
      "Turned the gaps into a short, prioritized list the team could act on.",
    ],
    outcome: [
      "Gave PT Solusi Dwi Satya a clear view of its compliance position and what to fix first.",
      "Kept evidence organized so audit conversations were easier.",
    ],
  },
  {
    slug: "iso-27001-2022-implementation-pt-prima-sistem-informasi",
    year: "2025",
    period: "Jul 2025 – May 2026",
    date: "2025-07-01",
    title: "ISO/IEC 27001:2022 Implementation – PT Prima Sistem Informasi",
    tag: "Implementation",
    domain: "grc",
    summary:
      "Leveling up the org's ISMS with gap checks, risk treatment planning, core security docs, and Annex A control rollouts.",
    role: "IT GRC Consultant",
    organization: "PT Prima Sistem Informasi",
    impact: "Gap check, risk treatment plan & Annex A control rollout",
    frameworks: ["ISO/IEC 27001:2022", "ISMS", "Risk Treatment"],
    stack: ["Gap Assessment", "Risk Treatment Plan", "Security Docs", "Annex A Controls"],
    deliverables: [
      "Security Gap Assessment Report",
      "Risk Treatment Plan & ISMS Documentation",
      "Annex A Control Implementation Support",
    ],
    overview:
      "Helped build out and strengthen PT Prima Sistem Informasi's ISO/IEC 27001:2022 ISMS over a multi-quarter rollout.",
    challenge:
      "Closing governance and technical gaps step by step without teams burning out halfway through.",
    approach: [
      "Ran gap checks mapped against ISO/IEC 27001:2022 clauses.",
      "Put together practical risk treatment plans and maintainable docs.",
      "Supported the rollout of applicable Annex A controls across day-to-day ops.",
    ],
    outcome: [
      "Stepped up overall ISMS maturity and control coverage.",
      "Left behind clean risk tracking and audit-ready documentation.",
    ],
  },
  {
    slug: "iso-27001-2022-iso-9001-2015-pt-omnia-teknologi-indonesia",
    year: "2025",
    period: "Jun 2025 – Jan 2026",
    date: "2025-06-01",
    title:
      "ISO/IEC 27001:2022 & ISO 9001:2015 Implementation – PT Omnia Teknologi Indonesia",
    tag: "ISMS + QMS",
    domain: "grc",
    summary:
      "Built combined ISMS + QMS workflows connecting security controls, quality ops, risk checks, and internal audits in one place.",
    role: "IT GRC Consultant",
    organization: "PT Omnia Teknologi Indonesia",
    impact: "Combined ISMS & QMS setup, clean SOPs & internal audits",
    frameworks: ["ISO/IEC 27001:2022", "ISO 9001:2015", "Integrated ISMS & QMS"],
    stack: ["ISMS/QMS Framework", "Risk Assessment", "Documented Procedures", "Internal Audit"],
    deliverables: [
      "Integrated ISMS & QMS Procedures",
      "Security & Quality Risk Assessments",
      "Internal Audit Execution & Compliance Support",
    ],
    overview:
      "Built unified ISO/IEC 27001:2022 and ISO 9001:2015 frameworks at PT Omnia Teknologi Indonesia so security and quality ran smoothly together.",
    challenge:
      "Designing shared SOPs and audit cycles that satisfy both security and quality standards without creating busywork.",
    approach: [
      "Wrote unified documentation covering both security controls and quality workflows.",
      "Ran practical risk checks and locked in clean operational procedures.",
      "Backed internal audits to verify compliance and polish day-to-day execution.",
    ],
    outcome: [
      "Put a unified ISMS + QMS baseline in place.",
      "Made team workflows more consistent and ready for certification audits.",
    ],
  },
  {
    slug: "iso-27001-2022-implementation-pt-covena-teknologi-global",
    year: "2025",
    period: "Sep 2025 – Dec 2025",
    date: "2025-09-01",
    title: "ISO/IEC 27001:2022 Implementation – PT Covena Teknologi Global",
    tag: "Implementation",
    domain: "grc",
    summary:
      "Fast-track ISO/IEC 27001:2022 rollout and audit prep: ISMS docs, risk management, control checks, and getting the team audit-ready.",
    role: "IT GRC Consultant",
    organization: "PT Covena Teknologi Global",
    impact: "Fast-track ISMS rollout & certification audit prep",
    frameworks: ["ISO/IEC 27001:2022", "Certification Readiness", "ISMS"],
    stack: ["ISMS Documentation", "Risk Management", "Control Evaluation", "Audit Prep"],
    deliverables: [
      "ISMS Policy & Procedure Suite",
      "Risk Management Records",
      "Certification Audit Readiness & Control Check",
    ],
    overview:
      "Helped get PT Covena Teknologi Global's ISO/IEC 27001:2022 setup and certification prep across the finish line.",
    challenge:
      "Getting solid ISMS docs, risk evidence, and control checks lined up smoothly on a tight audit schedule.",
    approach: [
      "Put together core ISMS docs and clean risk records.",
      "Checked implemented controls against ISO/IEC 27001:2022 Annex A.",
      "Walked stakeholders through audit prep so nobody walked into certification guessing.",
    ],
    outcome: [
      "Got the team cleanly prepped for ISO/IEC 27001:2022 certification.",
      "Left behind verified control evidence and tidy risk documentation.",
    ],
  },
  {
    slug: "iso-27001-2022-implementation-pt-navios-evolusi-solusindo",
    year: "2025",
    period: "Jan 2025 – Dec 2025",
    date: "2025-01-01",
    title: "ISO/IEC 27001:2022 Implementation – PT Navios Evolusi Solusindo",
    tag: "Implementation",
    domain: "grc",
    summary:
      "Year-long ISMS build from scratch: security policies, risk management, Statement of Applicability (SoA), and Annex A alignment.",
    role: "IT GRC Consultant",
    organization: "PT Navios Evolusi Solusindo",
    impact: "Ground-up ISMS setup, policy suite & SoA alignment",
    frameworks: ["ISO/IEC 27001:2022", "ISMS", "Statement of Applicability"],
    stack: ["Policy Prep", "Risk Management", "SoA Development", "Control Alignment"],
    deliverables: [
      "Information Security Policy Framework",
      "Risk Register & Statement of Applicability (SoA)",
      "Security Control Alignment Pack",
    ],
    overview:
      "Helped build out PT Navios Evolusi Solusindo's ISO/IEC 27001:2022 ISMS from the ground up over the full year.",
    challenge:
      "Standing up an ISMS from zero: policies, risk criteria, and honest Annex A justifications in the SoA without overcomplicating daily ops.",
    approach: [
      "Drafted straightforward info-sec policies and day-to-day procedures.",
      "Ran risk management cycles and built out the Statement of Applicability (SoA).",
      "Lined everyday security controls up cleanly with ISO/IEC 27001:2022.",
    ],
    outcome: [
      "Put a clean, auditable information security management setup in place.",
      "Delivered honest SoA justifications and controls the team actually uses.",
    ],
  },
  {
    slug: "iso-27001-transition-pt-autopedia-sukses-lestari",
    year: "2025",
    period: "Jan 2025 – Aug 2025",
    date: "2025-01-01",
    title:
      "ISO/IEC 27001:2013 → 2022 Transition & Surveillance – PT Autopedia Sukses Lestari",
    tag: "Transition",
    domain: "grc",
    summary:
      "Migrated an existing ISMS from ISO/IEC 27001:2013 to 2022: delta gap checks, refreshed docs, updated risk maps, and revised Annex A controls.",
    role: "IT GRC Consultant",
    organization: "PT Autopedia Sukses Lestari",
    impact: "Smooth ISO/IEC 27001:2013 → 2022 upgrade & Annex A refresh",
    frameworks: ["ISO/IEC 27001:2022", "2013→2022 Transition", "Revised Annex A"],
    stack: ["Transition Gap Assessment", "Doc Modernization", "Annex A Mapping", "Risk Alignment"],
    deliverables: [
      "2013-to-2022 Delta Gap Assessment",
      "Updated ISMS Docs & Risk Alignment",
      "93 Revised Annex A Controls Evaluation",
    ],
    overview:
      "Helped migrate PT Autopedia Sukses Lestari's existing ISMS cleanly from ISO/IEC 27001:2013 to 2022 alongside their surveillance review.",
    challenge:
      "Remapping 114 older Annex A controls into the tighter 93-control structure (plus 11 brand-new 2022 controls) without disrupting live teams.",
    approach: [
      "Ran delta gap checks to catch every clause change and brand-new 2022 Annex A control.",
      "Refreshed ISMS policies, procedures, and risk records for the 2022 standard.",
      "Checked revised Annex A controls so the transition audit went smoothly.",
    ],
    outcome: [
      "Modernized legacy ISMS docs and control maps to ISO/IEC 27001:2022.",
      "Got the team cleanly set up for their transition audit.",
    ],
  },
  {
    slug: "iso-27001-transition-pt-jba-indonesia",
    year: "2025",
    period: "Jan 2025 – Aug 2025",
    date: "2025-01-01",
    title:
      "ISO/IEC 27001:2013 → 2022 Transition & Surveillance – PT JBA Indonesia",
    tag: "Transition",
    domain: "grc",
    summary:
      "Helped upgrade from ISO/IEC 27001:2013 to 2022: reviewing current ISMS habits, checking what changed, updating docs, and mapping revised Annex A.",
    role: "IT GRC Consultant",
    organization: "PT JBA Indonesia",
    impact: "ISMS delta review & clean revised Annex A upgrade",
    frameworks: ["ISO/IEC 27001:2022", "2013→2022 Transition", "Revised Annex A"],
    stack: ["ISMS Review", "Requirement Delta Check", "Doc Updates", "Control Alignment"],
    deliverables: [
      "Current ISMS Review & Delta Assessment",
      "Updated Policies, Procedures & Control Map",
      "Revised Annex A Alignment",
    ],
    overview:
      "Supported PT JBA Indonesia's upgrade from ISO/IEC 27001:2013 to ISO/IEC 27001:2022 across docs, requirements, and revised controls.",
    challenge:
      "Reviewing established 2013-era habits to catch every requirement change and modernize docs without adding unnecessary bloat.",
    approach: [
      "Checked current ISMS workflows and listed out everything that shifted in ISO/IEC 27001:2022.",
      "Updated governance and operational docs to match the new clauses.",
      "Mapped live security controls straight into the revised Annex A layout.",
    ],
    outcome: [
      "Brought PT JBA Indonesia's ISMS docs and controls smoothly up to ISO/IEC 27001:2022.",
      "Kept crystal-clear traceability from legacy controls to the new Annex A structure.",
    ],
  },
  {
    slug: "iso-27001-2022-surveillance-audit-pt-manpro-teknologi-indonesia",
    year: "2024",
    period: "Nov 2024 – Present",
    date: "2024-11-01",
    title:
      "ISO/IEC 27001:2022 Surveillance Audit – PT Manpro Teknologi Indonesia",
    tag: "Surveillance",
    domain: "grc",
    summary:
      "Ongoing ISO/IEC 27001:2022 surveillance support: making sure controls actually hold up, checking live audit evidence, and spotting easy wins.",
    role: "IT GRC Consultant",
    organization: "PT Manpro Teknologi Indonesia",
    impact: "Keeping the ISMS sharp & audit-ready year over year",
    frameworks: ["ISO/IEC 27001:2022", "Surveillance Audit", "Continual Improvement"],
    stack: ["Audit Evidence Review", "Control Verification", "ISMS Evaluation"],
    deliverables: [
      "ISMS Effectiveness & Control Check",
      "Compliance Evidence Review",
      "Continual Improvement Action Items",
    ],
    overview:
      "Helping with recurring ISO/IEC 27001:2022 surveillance audits at PT Manpro Teknologi Indonesia so their ISMS stays alive long after day one.",
    challenge:
      "Keeping controls real, well-evidenced, and useful as the company and its workflows keep evolving every year.",
    approach: [
      "Checked how well the ISMS was holding up across ISO/IEC 27001:2022 clauses and Annex A.",
      "Reviewed live controls and verified supporting compliance evidence.",
      "Flagged practical improvements to keep the setup sharp and audit-ready.",
    ],
    outcome: [
      "Kept solid, verifiable compliance evidence rolling across surveillance cycles.",
      "Shared practical tweaks that keep the ISMS evolving without extra friction.",
    ],
  },
  {
    slug: "iso-27001-2022-implementation-pt-pallav-kredit-makmur",
    year: "2024",
    period: "Aug 2024 – Oct 2024",
    date: "2024-08-01",
    title: "ISO/IEC 27001:2022 Implementation – PT Pallav Kredit Makmur",
    tag: "Implementation",
    domain: "grc",
    summary:
      "Helped build an ISO/IEC 27001:2022 ISMS from the ground up, core docs, risk checks, control rollouts, and governance basics.",
    role: "IT GRC Consultant",
    organization: "PT Pallav Kredit Makmur",
    impact: "ISMS foundation & financial info-sec governance baseline",
    frameworks: ["ISO/IEC 27001:2022", "ISMS", "Security Governance"],
    stack: ["Security Docs", "Risk Assessment", "Control Rollout", "Compliance"],
    deliverables: [
      "Core ISMS Security Documentation",
      "Information Security Risk Assessment",
      "Control Rollout & Governance Baseline",
    ],
    overview:
      "Helped stand up an ISO/IEC 27001:2022-aligned ISMS from scratch at PT Pallav Kredit Makmur.",
    challenge:
      "Getting a legit info-sec governance baseline built for financial credit ops inside a tight timeline.",
    approach: [
      "Drafted clean core ISMS docs aligned with ISO/IEC 27001:2022.",
      "Ran risk checks and backed the rollout of applicable security controls.",
      "Lined compliance requirements up neatly to level up security governance.",
    ],
    outcome: [
      "Got a formal ISO/IEC 27001:2022 ISMS baseline up and running.",
      "Put the team in a much stronger spot for governance and compliance.",
    ],
  },
  {
    slug: "security-awareness-program-pt-kilang-pertama-internasional",
    year: "2024",
    period: "2024",
    date: "2024-09-15",
    title: "Security Awareness Program – PT Kilang Pertama Internasional",
    tag: "Awareness",
    domain: "grc",
    summary:
      "Built and ran a security awareness program that actually sticks, real phishing red flags, everyday cyber hygiene, and zero boring slide-reading.",
    role: "IT GRC Consultant",
    organization: "PT Kilang Pertama Internasional",
    impact: "Practical security habits & human-layer risk reduction",
    frameworks: ["ISO/IEC 27001:2022 (A.6.3)", "Security Awareness"],
    stack: ["Security Culture", "Phishing Awareness", "Policy Training", "Data Protection"],
    deliverables: [
      "Security Awareness Curriculum & Training Deck",
      "Practical Social Engineering & Data Hygiene Modules",
      "Awareness Completion & Compliance Evidence",
    ],
    overview:
      "Ran security awareness sessions at PT Kilang Pertama Internasional to turn dry security policies into everyday habits people actually remember.",
    challenge:
      "Keeping security training relatable and interesting for both tech and non-tech folks in an industrial energy setting.",
    approach: [
      "Built sessions around real-world phishing tricks, password/account hygiene, and quick incident reporting.",
      "Connected everyday habits straight back to company data protection and ISO 27001 expectations.",
    ],
    outcome: [
      "Leveled up everyday security awareness and policy habits across participating teams.",
      "Ticked off ISO/IEC 27001 awareness compliance evidence cleanly along the way.",
    ],
  },
  {
    slug: "grc-one-dashboard",
    year: "2024",
    period: "2024 – Present",
    date: "2024-10-01",
    title: "GRC One Dashboard – Multi-Framework Compliance App",
    tag: "Product",
    domain: "grc",
    summary:
      "Built a web app to ditch messy compliance spreadsheets, unifying ISO/IEC 27001, 27701, SOC Type 2, Essential Eight, and UU PDP in one dashboard.",
    role: "Product & GRC Architect",
    organization: "Multi-Framework Compliance App",
    impact: "One clean workspace tracking 5 security & privacy frameworks",
    frameworks: [
      "ISO/IEC 27001",
      "ISO/IEC 27701",
      "SOC Type 2",
      "Essential Eight",
      "UU PDP",
    ],
    stack: ["Compliance Dashboard", "Control Mapping", "Evidence Tracking", "GRC Automation"],
    deliverables: [
      "Unified Multi-Framework Control Matrix",
      "Centralized Audit Evidence & Readiness Views",
      "Reusable Compliance Delivery Workflow",
    ],
    overview:
      "Built a compliance web app to replace chaotic spreadsheets with one clean workspace across ISO 27001, ISO 27701, SOC Type 2, Essential Eight, and UU PDP.",
    challenge:
      "Tracking overlapping controls and audit evidence across five frameworks in static Excel sheets gets messy fast.",
    approach: [
      "Mapped shared controls across ISO/IEC 27001, 27701, SOC Type 2, Essential Eight, and UU PDP into one clean data model.",
      "Built clear status views so teams can see control progress, gaps, and audit evidence at a glance.",
    ],
    outcome: [
      "Made multi-framework consulting and control tracking way faster across client projects.",
      "Turned repetitive compliance grunt work into a repeatable, productized flow.",
    ],
  },
];

const INCIDENT_PROJECTS: ProjectItem[] = [
  {
    slug: "incident-management-response-pt-javan-cipta-solusi",
    year: "2026",
    period: "2026",
    date: "2026-08-15",
    title: "Incident Management & Response – PT Javan Cipta Solusi",
    tag: "IR",
    domain: "incident-management",
    featured: true,
    summary:
      "Hands-on incident handling, log forensics, attack timeline reconstruction, and root cause analysis for an enterprise software & IT solutions environment.",
    role: "Incident Responder",
    organization: "PT Javan Cipta Solusi",
    impact: "Structured containment, root cause analysis & post-incident hardening",
    frameworks: ["Incident Management", "Root Cause Analysis", "Timeline Reconstruction"],
    stack: ["Log Forensics", "Telemetry Analysis", "Containment Advisory", "IR Coordination"],
    deliverables: [
      "Attack Timeline Reconstruction & Artifact Review",
      "Root Cause Analysis (RCA) Report",
      "Containment & Post-Incident Hardening Plan",
    ],
    overview:
      "Jumped in on incident management and response for PT Javan Cipta Solusi, tracing what happened, finding the root cause, and guiding calm containment.",
    challenge:
      "Piecing together application, server, and access logs quickly to separate signal from noise while keeping live client operations steady.",
    approach: [
      "Dug through system, application, and network telemetry to trace suspicious activity and rebuild the full event timeline.",
      "Coordinated containment steps directly with internal engineering and IT teams to close the entry point cleanly.",
      "Wrote up a clear root cause analysis and practical hardening checklist to stop repeat issues.",
    ],
    outcome: [
      "Delivered a straight-shooting RCA and prioritized hardening roadmap the team could act on immediately.",
      "Leveled up incident coordination and post-incident visibility across technical stakeholders.",
    ],
  },
  {
    slug: "incident-management-response-pt-pupuk-iskandar-muda",
    year: "2026",
    period: "2026",
    date: "2026-06-15",
    title: "Incident Management & Response – PT Pupuk Iskandar Muda",
    tag: "IR",
    domain: "incident-management",
    featured: true,
    summary:
      "Hands-on incident handling, alert digging, root cause analysis, and attack timeline reconstruction for critical industrial infrastructure.",
    role: "Incident Responder",
    organization: "PT Pupuk Iskandar Muda",
    impact: "Calm containment, root cause analysis & full attack timeline",
    frameworks: ["Incident Management", "Root Cause Analysis", "Timeline Reconstruction"],
    stack: ["Log Forensics", "Telemetry Analysis", "Containment Advisory", "IR Coordination"],
    deliverables: [
      "Attack Timeline Reconstruction & Artifact Review",
      "Root Cause Analysis (RCA) Report",
      "Containment & Post-Incident Hardening Plan",
    ],
    overview:
      "Stepped in on incident management and response for PT Pupuk Iskandar Muda, digging through evidence, finding the root cause, and guiding containment.",
    challenge:
      "Piecing together what happened quickly inside a critical industrial environment while keeping response steps calm, structured, and traceable.",
    approach: [
      "Dug through endpoint, server, and network logs to trace sketchy activity and rebuild the attack timeline.",
      "Worked side-by-side with internal IT and security teams to contain the issue and nail down the root cause.",
      "Wrote up practical post-incident hardening steps so the same thing couldn't happen twice.",
    ],
    outcome: [
      "Delivered a straight-shooting root cause analysis and actionable hardening plan.",
      "Tightened up how technical teams coordinate when real incidents hit.",
    ],
  },
  {
    slug: "incident-management-response-pt-bank-resona-perdania",
    year: "2024",
    period: "2024",
    date: "2024-02-01",
    title: "Incident Management & Response – PT Bank Resona Perdania",
    tag: "IR",
    domain: "incident-management",
    featured: true,
    summary:
      "Incident response coordination, SIEM log correlation, root cause analysis, and timeline reconstruction inside a banking environment.",
    role: "Incident Responder",
    organization: "PT Bank Resona Perdania",
    impact: "Banking incident investigation, timeline reconstruction & containment",
    frameworks: ["Incident Response", "SIEM Correlation", "Root Cause Analysis"],
    stack: ["Wazuh", "Elastic Stack (ELK)", "Endpoint Telemetry", "Log Investigation"],
    deliverables: [
      "Correlated Security Event Timeline",
      "Root Cause Analysis & IOC Summary",
      "Containment & Detection Tuning Recommendations",
    ],
    overview:
      "Backed incident management and response for PT Bank Resona Perdania, pairing SIEM telemetry with hands-on event investigation.",
    challenge:
      "Rebuilding accurate event timelines under strict banking scrutiny while coordinating smoothly with internal IT and security teams.",
    approach: [
      "Correlated endpoint and network logs across Wazuh and Elastic Stack (ELK) to isolate suspicious activity.",
      "Rebuilt the full event timeline and laid out clear root cause findings for stakeholders.",
      "Turned lessons learned straight into fresh SIEM detection rules.",
    ],
    outcome: [
      "Gave the team crisp timeline clarity and clear containment steps when it mattered most.",
      "Upgraded post-incident detection rules so similar patterns get flagged automatically next time.",
    ],
  },
];

const SOC_PROJECTS: ProjectItem[] = [
  makeSocEngagement({
    slug: "soc-monitoring-pt-asuransi-jasindo",
    client: "PT Asuransi Jasindo",
    year: "2023",
    sector: "Insurance",
    featured: true,
  }),
  makeSocEngagement({
    slug: "soc-monitoring-pt-hm-sampoerna-tbk",
    client: "PT HM Sampoerna Tbk",
    year: "2023",
    sector: "Enterprise FMCG",
  }),
  makeSocEngagement({
    slug: "soc-monitoring-pt-asuransi-jiwa-sequis-life",
    client: "PT Asuransi Jiwa Sequis Life",
    year: "2023",
    sector: "Insurance",
  }),
  makeSocEngagement({
    slug: "soc-monitoring-kpk",
    client: "KPK (Komisi Pemberantasan Korupsi)",
    year: "2023",
    sector: "Government & Public Sector",
  }),
  makeSocEngagement({
    slug: "soc-monitoring-pt-jict",
    client: "PT Jakarta International Container Terminal (JICT)",
    year: "2023",
    sector: "Port & Critical Infrastructure",
  }),
  makeSocEngagement({
    slug: "soc-monitoring-pt-bank-saqu-indonesia",
    client: "PT Bank Saqu Indonesia",
    year: "2023",
    sector: "Digital Banking",
  }),
  makeSocEngagement({
    slug: "soc-monitoring-pt-bank-hibank-indonesia",
    client: "PT Bank Hibank Indonesia",
    year: "2023",
    sector: "Banking",
  }),
  makeSocEngagement({
    slug: "soc-monitoring-pt-kalbe-farma",
    client: "PT Kalbe Farma",
    year: "2023",
    sector: "Healthcare & Pharmaceuticals",
  }),
  makeSocEngagement({
    slug: "soc-monitoring-pt-prodia-widyahusada",
    client: "PT Prodia Widyahusada",
    year: "2023",
    sector: "Healthcare",
  }),
];

const COMBINED_PROJECTS: ProjectItem[] = [
  ...VAPT_PROJECTS,
  ...BUG_BOUNTY_PROJECTS,
  ...GRC_PROJECTS,
  ...INCIDENT_PROJECTS,
  ...SOC_PROJECTS,
];

// Two engagements for the same client share a title; add the year so every page title stays unique.
const ALL_PROJECTS: ProjectItem[] = COMBINED_PROJECTS.map((p) =>
  COMBINED_PROJECTS.filter((x) => x.title === p.title).length > 1
    ? { ...p, title: `${p.title} (${p.year})` }
    : p
);

export const SITE_DATA = {
  profile: {
    name: "Rizky Aditya",
    handle: "@kxgapapa",
    githubHandle: "satorukikyy",
    linkedinHandle: "onerrorkx",
    instagramHandle: "kxs3c",
    brandMark: "A",
    role: "IT GRC Consultant · Penetration Tester · Bug Hunter",
    motto: "Good security starts with asking what could go wrong.",
    tagline:
      "IT GRC consultant, pentester, and bug hunter in South Jakarta. I get teams audit-ready on paper and hard to break in production.",
    location: "South Jakarta, Indonesia",
    timezone: "WIB (UTC+7)",
    email: "aditya@cloudsphere.id",
    linkedinUrl: "https://www.linkedin.com/in/onerrorkx/",
    githubUrl: "https://github.com/satorukikyy",
    xUrl: "https://x.com/kxgapapa",
    instagramUrl: "https://www.instagram.com/kxs3c/",
    whatsappUrl: "https://wa.me/6287889867060",
    availability:
      "Got a project, an audit coming up, or a bug you want a second pair of eyes on? Message me about IT GRC (ISO 27001, 27701, 42001), pentesting, or bug bounty. I read every message.",
    stats: [
      {
        value: `${Math.floor(ALL_PROJECTS.length / 10) * 10}+`,
        label: "Engagements",
      },
      { value: "2×", label: "ISO Lead Auditor" },
      { value: String(PROJECT_DOMAINS.length), label: "Security Tracks" },
    ],
    sameAs: [
      "https://www.linkedin.com/in/onerrorkx/",
      "https://github.com/satorukikyy",
      "https://x.com/kxgapapa",
      "https://www.instagram.com/kxs3c/",
    ],
  },

  nav: [
    { label: "About", href: "/about" },
    { label: "Experience", href: "/experience" },
    { label: "Project", href: "/project" },
    { label: "Contact", href: "/contact" },
    { label: "Journal", href: "/journal" },
  ] as const,

  about: {
    summary:
      "Rizky Aditya is an IT GRC consultant, penetration tester, and bug hunter based in South Jakarta. He builds ISO 27001, 27701, and 42001 programs and runs VAPT across Whitesec ID, AU, CA, and UK, reports bugs to Google VRP, HackerOne, and Bugcrowd, and is building a GRC platform at a stealth cybersecurity startup.",
    paragraphs: [
      "Hi, I’m Rizky. I work in IT GRC, pentesting, and bug bounty from South Jakarta. In short, I help teams look solid to auditors and actually be solid when someone attacks them.",
      "On the GRC side, I take ISO/IEC 27001, 27701, and 42001 from a blank page to certified: gap assessments, risk registers, Statements of Applicability, UU PDP alignment, and surveillance audits. The goal is documents people actually use, not a 200-page binder nobody opens.",
      "On the offensive side, I test web, mobile, and API apps with OWASP WSTG and PTES so real flaws get fixed before launch. Outside client work I hunt bugs on Google VRP, HackerOne, Bugcrowd, and GitHub Security Advisories, mostly the kind that scanners don’t catch.",
      "My rule of thumb: build it clean, keep the evidence ready, and try to break it yourself before someone else does.",
    ],
    now: "Right now I’m building a GRC platform at a stealth startup, running ISO 27001, 27701, 42001, and VAPT projects across Whitesec ID, AU, CA, and UK, and hunting web, API, and open source bugs on the side.",
    facts: [
      { label: "Based in", value: "South Jakarta, Indonesia (WIB / UTC+7)" },
      {
        label: "Current gigs",
        value:
          "Founder & CEO @ Stealth Startup · IT GRC & Pentester @ Whitesec ID · Bug Hunter @ HackerOne",
      },
      {
        label: "ISO Lead Auditor",
        value: "ISO/IEC 27001:2022 · ISO/IEC 27701:2025",
      },
      {
        label: "Core tracks",
        value: "VAPT · Bug Bounty · Governance, Risk & Compliance · Incident Management · SOC",
      },
      {
        label: "Frameworks",
        value:
          "ISO 27001/27701/42001, ISO 9001, UU PDP, SOC Type 2, Essential Eight, OWASP WSTG & API Top 10, PTES",
      },
      {
        label: "Daily toolkit",
        value: "Wazuh SIEM, Elastic Stack (ELK), pfSense, Linux, Mikrotik, VAPT Tooling",
      },
      {
        label: "Languages",
        value:
          "Indonesian (Native) · English (Professional, TOEFL 567 / Duolingo 100)",
      },
    ],
    skills: [
      "ISO/IEC 27001:2022",
      "ISO/IEC 27701:2025",
      "ISO/IEC 42001:2023",
      "UU PDP Compliance",
      "IT GRC",
      "ISMS & SoA",
      "DPIA & Vendor Risk",
      "Web / Mobile / API VAPT",
      "OWASP WSTG & PTES",
      "Bug Bounty",
      "Incident Management",
      "Root Cause Analysis",
      "Wazuh SIEM",
      "Elastic Stack (ELK)",
      "Detection Rules",
      "SOC Operations",
      "Linux Hardening",
      "pfSense",
    ],
    certifications: [
      {
        name: "ISO/IEC 27001:2022 Lead Auditor",
        issuer: "Mastermind Assurance",
        category: "ISO",
        issued: "Dec 2025",
        expires: "Dec 2028",
        credentialId: "ufng4bbvnk",
      },
      {
        name: "ISO/IEC 27701:2025 Lead Auditor",
        issuer: "Mastermind Assurance",
        category: "ISO",
      },
      {
        name: "ISO/IEC 27001:2022 Lead Auditor",
        issuer: "SGS",
        category: "ISO",
        issued: "Aug 2024",
      },
      {
        name: "Certified Web App Penetration Testing Apprentice",
        issuer: "Knight Squad Academy",
        category: "Security",
      },
      {
        name: "Ethical Hacker",
        issuer: "Cisco",
        category: "Security",
        issued: "Mar 2024",
      },
      {
        name: "CyberOps Associate",
        issuer: "Cisco",
        category: "Security",
      },
      {
        name: "Bug Bounty Masterclass",
        issuer: "Wiz",
        category: "Security",
        issued: "Apr 2026",
        expires: "Apr 2028",
      },
      {
        name: "AIQI ISO/IEC 42001:2023",
        issuer: "UKAS",
        category: "ISO",
        issued: "Sep 2025",
      },
      {
        name: "ISC2: Certified in Cybersecurity (CC)",
        issuer: "ISC2",
        category: "Security",
        issued: "Apr 2024",
        credentialId: "9b04a6ba-73a4-4e0f-828d-b23ff36212fa",
      },
      {
        name: "OWASP Top 10 API Security",
        issuer: "APIsec University",
        category: "Security",
        issued: "Jun 2024",
      },
      {
        name: "ISACA Student Summit 2025",
        issuer: "ISACA",
        category: "Security",
        issued: "Nov 2025",
      },
      {
        name: "OWASP Top 10 LLM and GenAI",
        issuer: "Snyk",
        category: "Security",
        issued: "Nov 2024",
      },
      {
        name: "OWASP Top 10 2021",
        issuer: "Snyk",
        category: "Security",
        issued: "Nov 2024",
      },
      {
        name: "Security for Developers",
        issuer: "Snyk",
        category: "Security",
        issued: "Nov 2024",
      },
      {
        name: "Cloud Technical Essentials",
        issuer: "AWS",
        category: "Cloud",
      },
      {
        name: "Google Cybersecurity Professional",
        issuer: "Google",
        category: "Cloud",
        issued: "Mar 2024",
      },
    ] as CertificationItem[],
    faqs: [
      {
        question: "Who is Rizky Aditya, and what does he do?",
        answer:
          "Rizky Aditya is an IT GRC consultant, penetration tester, and bug hunter based in South Jakarta. He is the founder of a stealth cybersecurity startup, consults and pentests across Whitesec ID, AU, CA, and UK, and reports bugs to Google VRP, HackerOne, Bugcrowd, and GitHub Security Advisories.",
      },
      {
        question: "Which ISO Lead Auditor certifications does Rizky hold?",
        answer:
          "Two Lead Auditor credentials: ISO/IEC 27001:2022 (information security, from Mastermind Assurance and SGS) and ISO/IEC 27701:2025 (privacy, from Mastermind Assurance). He also holds the AIQI ISO/IEC 42001:2023 certificate from UKAS.",
      },
      {
        question: "What does an ISO 27001 project with Rizky look like?",
        answer:
          "Usually scoping, a gap assessment, a risk assessment and treatment plan, policies and the Statement of Applicability, an internal audit, and then support through the certification audit and later surveillance audits. The paperwork is tied to what the team already does, so evidence comes out of daily work instead of a last-minute scramble.",
      },
      {
        question: "What do you get from a VAPT engagement?",
        answer:
          "A report with reproducible steps for every confirmed finding, CVSS-based severity, and fix guidance matched to your stack, plus a retest after your team patches. Testing follows OWASP WSTG and PTES and is done by hand, not just with scanners.",
      },
      {
        question: "Which industries has Rizky worked in?",
        answer:
          "Banking, insurance, securities, healthcare, fintech, data centers, government, energy, and critical infrastructure. Clients include BDx Data Centers, PT Bank Resona Perdania, PT Bank Hibank Indonesia, PT Bank Saqu Indonesia, PT Kalbe Farma, PT Prodia Widyahusada, KPK, PT Pupuk Iskandar Muda, and PT Hutama Karya Infrastruktur.",
      },
      {
        question: "What is the best way to contact Rizky?",
        answer:
          "Email aditya@cloudsphere.id, or message on LinkedIn (linkedin.com/in/onerrorkx), GitHub (github.com/satorukikyy), X (@kxgapapa), or Instagram (@kxs3c). Security reports go through /.well-known/security.txt.",
      },
    ] as FaqItem[],
  },

  experience: [
    {
      period: "2026 – Present",
      employmentType: "Founder",
      role: "Founder & Chief Executive Officer",
      company: "Stealth Company (Cybersecurity Startup)",
      location: "South Jakarta, Indonesia",
      summary:
        "Building a cybersecurity startup from scratch, mixing hands-on security consulting with a SaaS platform for GRC, risk, assets, and vendor security.",
      highlights: [
        "Setting product direction and go-to-market, while still doing hands-on consulting across GRC, VAPT, and security engineering.",
        "Building a governance platform meant to replace the compliance spreadsheets teams keep fighting with: risk, assets, vendor security, and security operations.",
        "Leading solution design, client discovery, proposals, and partnerships, and making sure each delivery holds up.",
      ],
      tags: [
        "Cybersecurity Strategy",
        "SaaS Product",
        "GRC",
        "VAPT",
        "Solution Architecture",
        "Startup Ops",
      ],
    },
    {
      period: "Aug 2026 – Present",
      employmentType: "Part-time",
      role: "Bug Hunter",
      company: "HackerOne",
      location: "South Jakarta · Remote",
      summary:
        "Hunting bugs in authorized web apps and APIs, going past automated scanners to report issues that reproduce cleanly.",
      highlights: [
        "Testing public and private bug bounty scopes for web and API vulnerabilities.",
        "Verifying every finding by hand, with a minimal PoC, an honest impact note, and a fix developers can use.",
        "Staying inside scope and following responsible disclosure so teams can patch safely.",
      ],
      tags: ["Bug Hunter", "Security Research", "Web & API", "Responsible Disclosure"],
    },
    {
      period: "Aug 2024 – Present",
      employmentType: "Full-time",
      role: "IT GRC Consultant & Penetration Tester",
      company:
        "Whitesec ID (PT Topi Putih Siberindo) · Whitesec AU · Whitesec UK · Whitesec CA",
      location: "Indonesia · Australia · UK · Canada",
      summary:
        "IT GRC consulting, penetration testing, and compliance tooling across Whitesec’s regional entities: Whitesec ID (Indonesia), AU (Australia), UK (United Kingdom), and CA (Canada).",
      highlights: [
        "Supporting consulting and offensive security engagements across Whitesec ID, AU, UK, and CA.",
        "Leading ISO/IEC 27001:2022, 27701, 42001, and ISO 9001:2015 projects end to end: gap assessments, risk registers, SoA, internal audits, and surveillance reviews.",
        "Testing web, mobile, and API apps against the OWASP Top 10, OWASP WSTG, and PTES, and delivering CVSS-rated reports with proof-of-concept steps.",
        "Built GRC One Dashboard, an internal web app that tracks controls across ISO 27001, 27701, SOC Type 2, Essential Eight, and UU PDP in one place.",
        "Running security awareness sessions and working directly with founders and engineers so findings turn into fixes.",
      ],
      tags: [
        "ISO 27001/27701/42001",
        "IT GRC",
        "VAPT",
        "OWASP WSTG",
        "UU PDP",
        "GRC One Dashboard",
      ],
    },
    {
      period: "Sep 2023 – 2024",
      employmentType: "Full-time",
      role: "Security Engineer",
      company: "Defenxor (PT Defender Nusa Semesta)",
      location: "South Jakarta · Hybrid",
      summary:
        "Ran Wazuh and Elastic Stack (ELK) SIEM for 9 enterprise SOC clients, wrote custom detection rules, and handled real incident response for banks.",
      highlights: [
        "Deployed and operated Wazuh SIEM and Elastic Stack monitoring for clients in banking, healthcare, insurance, government, and port infrastructure.",
        "Wrote custom Linux and Windows detection rules, tuned noisy alerts, and fed pfSense firewall logs into one central view.",
        "Worked live incidents for enterprise banking clients: incident management, log forensics, and attack timeline reconstruction.",
        "Helped build internal SOC tooling for incident tracking and event correlation across live clients.",
      ],
      tags: [
        "Wazuh SIEM",
        "Elastic Stack (ELK)",
        "SOC",
        "Detection Rules",
        "Incident Response",
        "pfSense",
      ],
    },
    {
      period: "Aug 2022 – Sep 2022",
      employmentType: "Internship",
      role: "IT Support Intern",
      company: "FMIPA Universitas Indonesia (UI)",
      location: "Depok · On-site",
      summary:
        "Kept campus computer labs, Windows machines, Microsoft 365 accounts, local switches, and IT asset records running.",
      highlights: [
        "Set up Windows workstations, handled OS patching and baseline security settings, and administered Microsoft 365 users.",
        "Helped with cabling, switch setup, and network troubleshooting to keep lab downtime close to zero.",
        "Kept IT asset inventories and day-to-day operations docs accurate and current.",
      ],
      tags: ["Windows", "Microsoft 365", "Networking", "IT Support", "Asset Management"],
    },
  ] as ExperienceItem[],

  projects: ALL_PROJECTS,

  journal: [
    {
      slug: "what-is-it-grc-actually",
      date: "2026-11-18",
      updatedAt: "2026-11-25",
      displayDate: "Nov 18, 2026",
      year: "2026",
      title: "IT GRC, Explained Like You're Not in a Meeting",
      description:
        "What governance, risk, and compliance actually mean, why companies need them, and how to do GRC without turning it into a paperwork graveyard.",
      category: "GRC",
      readTime: "4 min read",
      tldr: "GRC is how a company sets its rules (governance), figures out what could hurt it (risk), and proves it follows through (compliance). Do it right and audit week gets boring in a good way.",
      keyTakeaways: [
        "Governance is deciding who owns what, so nobody has to guess.",
        "Risk is ranking problems. You can't fix everything, so fix the scary stuff first.",
        "Compliance is receipts. ISO 27001, SOC 2, UU PDP, they all boil down to \"show me\".",
      ],
      sections: [
        {
          paragraphs: [
            "Say \"IT GRC\" at a party and people picture spreadsheets, a 200-page Word doc, and someone named Dave asking for evidence. When it's done badly, that's honestly accurate.",
            "When it's done well, it's the boring backbone that keeps a growing company from walking into problems it could have seen coming. Here's what the three letters mean once you take the corporate voice off.",
          ],
        },
        {
          heading: "G, R, and C in normal words",
          bullets: [
            "Governance is who owns what. Who approves access, who gets paged when something breaks, what \"secure enough\" means for each team. Without it, every team makes up its own rules and you get chaos with good intentions.",
            "Risk is what could actually hurt you, ranked. Leaked customer data or downtime on your payment API matters way more than a typo in an internal wiki. Risk work tells you where to spend your time first.",
            "Compliance is proof. Clients and regulators won't accept \"trust us, we're secure\". Frameworks like ISO/IEC 27001, 27701, 42001, SOC 2, and Indonesia's UU PDP give everyone the same way to check that your controls are real.",
          ],
        },
        {
          heading: "Why people hate GRC (fair) and how to fix it",
          paragraphs: [
            "Most people hate GRC because someone pasted generic templates from the internet and made engineers fill out forms that have nothing to do with how they ship code. I'd hate that too.",
            "The fix is to hook compliance into things teams already do: PR reviews, MFA, backups, offboarding people properly, regular pentests. Then when audit week shows up, the evidence is already sitting there and nobody is panic-screenshotting at midnight.",
          ],
          quote:
            "A policy with no real control behind it is just a nice document. A control with no owner stops working the day someone quits.",
        },
      ],
      faqs: [
        {
          question: "Is GRC just writing policies and filling spreadsheets all day?",
          answer:
            "It shouldn't be. Good GRC means working with engineering, IT, legal, and leadership to find the risks that matter and collect evidence from systems that already exist. If your GRC person never talks to engineers, something is off.",
        },
        {
          question: "Does an early-stage startup need GRC?",
          answer:
            "Not the full enterprise version. But getting the basics right early (who has access to what, backups that actually restore, who to call during an incident, a quick check on your vendors) saves a lot of pain when your first big client sends a security questionnaire or asks about ISO 27001.",
        },
      ],
    },
    {
      slug: "what-is-vapt-actually",
      date: "2026-11-15",
      updatedAt: "2026-11-25",
      displayDate: "Nov 15, 2026",
      year: "2026",
      title: "What a Pentest Actually Is (and Why a Scanner Doesn't Count)",
      description:
        "VA vs PT, what really happens during a pentest, and why running a scanner and calling it a day won't cut it.",
      category: "VAPT",
      readTime: "4 min read",
      tldr: "VAPT is two things. A vulnerability assessment lists your weak spots, and a penetration test tries to use them like a real attacker would. The point is to find and fix the bad stuff before someone else does.",
      keyTakeaways: [
        "VA goes wide and lists what looks weak. PT goes deep and proves what an attacker can actually do.",
        "Scanners miss the best bugs: broken access control, auth bypasses, business logic. A human has to poke at those.",
        "A good report is boring in the best way: clear steps, clear impact, clear fix. No hacker flexing.",
      ],
      sections: [
        {
          paragraphs: [
            "You can build a really clean app and still leave one tiny authorization bug open in production. It happens all the time. That's what VAPT (vulnerability assessment and penetration testing) is for: someone friendly tries your doors before someone unfriendly does.",
          ],
        },
        {
          heading: "VA vs PT in one minute",
          bullets: [
            "A vulnerability assessment is wide and shallow. You scan the web apps, mobile apps, APIs, or servers and list what looks off, like misconfigs, old components, and known weak spots. The question is \"what looks exposed?\"",
            "A penetration test is narrow and deep. A pentester takes a bug and keeps going. A small IDOR/BOLA turns into reading other people's data, then maybe taking over an account. The question is \"how bad is this if someone abuses it?\"",
          ],
        },
        {
          heading: "How an engagement usually goes",
          bullets: [
            "Scope and rules come first. What's in, what's out, which test accounts, when we test, and what we won't touch. Boring, but it keeps production safe.",
            "Then recon. Figure out how the app really works: endpoints, user roles, API flows, and where the sensitive data lives.",
            "Next is manual testing with OWASP WSTG and PTES. Auth, sessions, permissions, inputs, business logic. This is where the real findings come from.",
            "Last, the report and retest. Every bug gets repro steps, an honest CVSS score, and a fix that fits your stack. Once your devs patch, I test again to make sure it's actually gone.",
          ],
          quote:
            "Scanners tick boxes. Humans find the bug that ruins your Friday.",
        },
      ],
      faqs: [
        {
          question: "How often should we run a pentest?",
          answer:
            "At least once a year. ISO 27001 and most banking and fintech rules expect that. Also run one after big releases, new APIs, or major architecture changes.",
        },
        {
          question: "Will a pentest take down our app?",
          answer:
            "It shouldn't. A proper test follows agreed rules, ideally runs on staging or in a controlled production window, avoids destructive payloads, and keeps your engineers in the loop the whole time.",
        },
      ],
    },
    {
      slug: "what-is-bug-bounty-actually",
      date: "2026-11-12",
      updatedAt: "2026-11-25",
      displayDate: "Nov 12, 2026",
      year: "2026",
      title: "Bug Bounty for Beginners: Yes, You Can Get Paid to Break Stuff",
      description:
        "How bug bounty works, how it differs from a pentest, and the ground rules for hunting bugs without getting yourself in trouble.",
      category: "Bug Bounty",
      readTime: "4 min read",
      tldr: "Companies invite researchers to find real bugs in specific, authorized targets. You report a valid one privately, they fix it, and you get paid or at least a spot on their Hall of Fame.",
      keyTakeaways: [
        "It's legal because it's authorized. Stay inside the program's scope, always.",
        "A pentest pays for your time. Bug bounty pays for results. No valid, unique bug means no payout.",
        "Short, clear reports get triaged and paid faster than long ones stuffed with filler.",
      ],
      sections: [
        {
          paragraphs: [
            "Big companies already know this: even with a great security team and yearly pentests, people outside will find things you missed. That's the whole idea behind bug bounty.",
            "On platforms like HackerOne and Bugcrowd, or with a plain /.well-known/security.txt, a company basically says: here's what you can test, here are the rules, and if you find something real and tell us privately, we'll reward you.",
          ],
        },
        {
          heading: "Bug bounty vs pentest: same skills, different game",
          bullets: [
            "A pentest is scheduled with a fixed scope. A company hires someone to look at an app for a set window and pays for the whole thing.",
            "Bug bounty is open all the time. Lots of hunters look at the same target, and you only get paid when you find a valid bug that nobody reported yet.",
            "Doing both helps. Bounty hunting teaches you to get creative against hardened, real apps, and that instinct makes your pentests and GRC work better.",
          ],
        },
        {
          heading: "Ground rules so you don't mess up",
          bullets: [
            "Read the scope twice. Don't touch out-of-scope domains, third-party services, or real users' data. Use your own test accounts.",
            "Prove it small. Use the smallest safe PoC that shows the impact. No DoS, no dumping data, no social engineering unless the program says it's fine.",
            "Write the report you'd want to triage: short summary, exact endpoint, minimal steps, realistic impact, and a suggested fix. Skip the filler.",
          ],
          quote:
            "Patience beats noisy scanners in bug bounty, every single time.",
        },
      ],
      faqs: [
        {
          question: "Can beginners actually do bug bounty?",
          answer:
            "Yep. Get solid at web and HTTP basics first (PortSwigger's Web Security Academy is great), pick one bug class like IDOR or auth issues, and focus on understanding how one app works instead of blasting scanners at everything.",
        },
        {
          question: "Do you get paid for every report?",
          answer:
            "Nope. Some programs are VDPs, which give you credit or a Hall of Fame spot instead of cash. Paid programs also skip duplicates, out-of-scope stuff, and low-impact theory.",
        },
      ],
    },
  ] as JournalPost[],

  contact: {
    links: [
      {
        label: "Email",
        value: "aditya@cloudsphere.id",
        href: "mailto:aditya@cloudsphere.id",
        copyable: true,
      },
      {
        label: "WhatsApp",
        value: "Chat directly",
        href: "https://wa.me/6287889867060",
      },
      {
        label: "LinkedIn",
        value: "linkedin.com/in/onerrorkx",
        href: "https://www.linkedin.com/in/onerrorkx/",
      },
      {
        label: "GitHub",
        value: "github.com/satorukikyy",
        href: "https://github.com/satorukikyy",
      },
      {
        label: "X / Twitter",
        value: "@kxgapapa",
        href: "https://x.com/kxgapapa",
      },
      {
        label: "Instagram",
        value: "@kxs3c",
        href: "https://www.instagram.com/kxs3c/",
      },
      {
        label: "Security.txt",
        value: "/.well-known/security.txt",
        href: "/.well-known/security.txt",
        internal: true,
      },
    ] as ContactLinkItem[],
  },
};

export function getDomainInfo(domainId: ProjectDomainId): ProjectDomain {
  return (
    PROJECT_DOMAINS.find((d) => d.id === domainId) ?? PROJECT_DOMAINS[0]
  );
}

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  return SITE_DATA.projects.find((p) => p.slug === slug);
}

export function getJournalBySlug(slug: string): JournalPost | undefined {
  return SITE_DATA.journal.find((j) => j.slug === slug);
}
