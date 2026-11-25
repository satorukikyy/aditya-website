import type { NextConfig } from "next";

// Static export for Cloudflare Pages (output dir: `out`).
// HTTP security headers live in `public/_headers` (headers() is unsupported with `output: "export"`).
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
