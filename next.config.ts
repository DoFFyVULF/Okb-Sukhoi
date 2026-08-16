import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Wikimedia's Special:FilePath URLs redirect to upload.wikimedia.org.
    // Next follows redirects without re-validating remotePatterns (default
    // maximumRedirects = 3), but we whitelist both hosts to be explicit.
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
    ],
    // Next 16 restricts allowed qualities — extend the default [75] allowlist.
    qualities: [50, 75, 90, 100],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
