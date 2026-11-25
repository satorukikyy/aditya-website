import { SITE_DATA } from "@/data/site";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { ContactActions } from "@/components/ContactActions";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Reach out to Rizky Aditya via email (aditya@cloudsphere.id), WhatsApp, LinkedIn, GitHub, X, Instagram, or /.well-known/security.txt for VAPT, Bug Bounty, GRC, Incident Management, and SOC.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.025em] text-[var(--text)]">
          Contact
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--text-secondary)]">
          {SITE_DATA.profile.availability}
        </p>
      </header>

      <ContactActions />
    </div>
  );
}
