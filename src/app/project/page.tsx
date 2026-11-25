import { SITE_DATA } from "@/data/site";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildPageMetadata,
} from "@/lib/seo";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildPageMetadata({
  title: "Project",
  description:
    "Cybersecurity projects by Rizky Aditya across five tracks: VAPT, bug bounty, GRC, incident management, and security engineering.",
  path: "/project",
});

export default function ProjectPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Project", path: "/project" },
        ])}
      />

      <JsonLd
        data={buildItemListJsonLd({
          name: "Projects",
          description:
            "Cybersecurity projects by Rizky Aditya across VAPT, bug bounty, GRC, incident management, and security engineering.",
          path: "/project",
          items: SITE_DATA.projects.map((p) => ({
            name: p.title,
            path: `/project/${p.slug}`,
          })),
        })}
      />

      <header>
        <h1 className="font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text)]">
          Project
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
          Client work and security research across five tracks. Pick a track
          or search all{" "}
          <span className="font-mono text-[13.5px] tabular-nums text-[var(--text)]">
            {SITE_DATA.projects.length}
          </span>{" "}
          projects.
        </p>
      </header>

      <ProjectExplorer projects={SITE_DATA.projects} />
    </div>
  );
}
