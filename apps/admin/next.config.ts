import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // This is required to use shared packages in nextjs App
  transpilePackages: ["@cms/shared"],

  // This isrequired to fix firebase functions Calls, CORS error.
  async rewrites() {
    return [
      {
        source: "/api/functions/:path*",
        destination:
          "https://us-central1-cms-dev-proj.cloudfunctions.net/:path*",
      },
    ];
  },
};

export default nextConfig;
