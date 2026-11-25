import type { MetadataRoute } from "next";
import { SITE_DATA } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_DATA.profile.name} — ${SITE_DATA.profile.role}`,
    short_name: SITE_DATA.profile.name,
    description: SITE_DATA.profile.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#fcfcfc",
    theme_color: "#141414",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
