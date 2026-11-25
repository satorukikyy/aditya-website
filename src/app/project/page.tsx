import {
  PROJECT_DOMAINS,
  SITE_DATA,
  type ProjectDomainId,
} from "@/data/site";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildPageMetadata({
  title: "Project",
  description:
    "Cybersecurity work by Rizky Aditya organized across five tracks: Vulnerability Assessment & Penetration Testing, Bug Bounty, Governance, Risk & Compliance, Incident Management, and Security Engineering.",
  path: "/project",
});

const validDomains = new Set<string>(PROJECT_DOMAINS.map((d) => d.id));

export default async function ProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const resolved = await searchParams;
  const rawDomain = resolved?.domain;
  const initialDomain: ProjectDomainId | "all" =
    rawDomain && validDomains.has(rawDomain)
      ? (rawDomain as ProjectDomainId)
      : "all";

  return (
    <div className="space-y-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Project", path: "/project" },
        ])}
      />

      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-[var(--text)]">
          Project
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
          Real client work and hands-on security research across five tracks —
          pick a track below or search across all{" "}
          <span className="font-mono text-[13.5px] tabular-nums text-[var(--text)]">
            {SITE_DATA.projects.length}
          </span>{" "}
          projects.
        </p>
      </header>

      <ProjectExplorer
        key={initialDomain}
        projects={SITE_DATA.projects}
        initialDomain={initialDomain}
      />
    </div>
  );
}
