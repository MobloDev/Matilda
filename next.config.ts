import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Off: every MATILDA page reads live data straight from the database on
  // each request, so there is nothing worth statically caching yet. Leaving
  // this on forces every dynamic data read to be wrapped in <Suspense>.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
