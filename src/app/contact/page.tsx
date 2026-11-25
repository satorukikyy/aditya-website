import { SITE_DATA } from "@/data/site";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { ContactActions } from "@/components/ContactActions";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Rizky Aditya by email, WhatsApp, LinkedIn, GitHub, X, or Instagram about VAPT, GRC, incident management, or bug bounty. Security reports go through /.well-known/security.txt.",
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
        <h1 className="font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--text)]">
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
