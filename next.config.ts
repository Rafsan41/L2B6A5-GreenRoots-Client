import type { NextConfig } from "next";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Auth routes are handled by the local Next.js filesystem route — never proxy them.
      // All other /api/* routes are proxied to the Express backend.
      beforeFiles: [],
      afterFiles: [
        {
          // Negative match: /api/* but NOT /api/auth/*
          source: "/api/((?!auth/).*)",
          destination: `${BACKEND}/api/$1`,
        },
      ],
      fallback: [],
    }
  },
};

export default nextConfig;
