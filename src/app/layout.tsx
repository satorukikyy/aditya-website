import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_DATA, SITE_URL } from "@/data/site";
import { buildRootJsonLd } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const ibmPlexMono = localFont({
  variable: "--font-ibm-plex-mono",
  display: "swap",
  src: [
    {
      path: "./fonts/ibm-plex-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/ibm-plex-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});

const bricolage = localFont({
  variable: "--font-bricolage",
  display: "swap",
  src: "./fonts/bricolage-grotesque-latin-wght-normal.woff2",
  weight: "200 800",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1c" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_DATA.profile.name} | ${SITE_DATA.profile.role}`,
    template: `%s | ${SITE_DATA.profile.name}`,
  },
  description: SITE_DATA.profile.tagline,
  applicationName: SITE_DATA.profile.name,
  authors: [{ name: SITE_DATA.profile.name, url: SITE_URL }],
  creator: SITE_DATA.profile.name,
  publisher: SITE_DATA.profile.name,
  category: "Cybersecurity",
  keywords: [
    "Rizky Aditya",
    "IT GRC Consultant",
    "Penetration Tester",
    "Bug Hunter",
    "VAPT Indonesia",
    "Pentest Jakarta",
    "ISO 27001 Lead Auditor",
    "ISO 27701",
    "ISO 42001",
    "UU PDP",
    "Incident Management",
    "SOC",
    "Wazuh",
  ],
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
      "text/plain": `${SITE_URL}/llms.txt`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_DATA.profile.name,
    title: `${SITE_DATA.profile.name} | ${SITE_DATA.profile.role}`,
    description: SITE_DATA.profile.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_DATA.profile.name} | ${SITE_DATA.profile.role}`,
    description: SITE_DATA.profile.tagline,
    creator: SITE_DATA.profile.handle,
  },
};

const themeInitScript = `
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${ibmPlexMono.variable} ${bricolage.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link
          rel="alternate"
          type="text/plain"
          title="LLMs.txt Summary"
          href="/llms.txt"
        />
        <link
          rel="alternate"
          type="text/plain"
          title="LLMs Full Corpus"
          href="/llms-full.txt"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_DATA.profile.name} Journal RSS`}
          href="/feed.xml"
        />
        <JsonLd data={buildRootJsonLd()} />
      </head>
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[var(--text)] focus:px-3 focus:py-1.5 focus:text-xs focus:font-medium focus:text-[var(--bg)]"
        >
          Skip to main content
        </a>

        <div className="flex min-h-screen flex-col">
          <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col px-4 pt-6 sm:px-6 sm:pt-10">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
