import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "files.stripe.com",
      },
      {
        protocol: "https" as const,
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
