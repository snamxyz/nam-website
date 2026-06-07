import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nam/core", "@nam/db"],
};

export default nextConfig;
