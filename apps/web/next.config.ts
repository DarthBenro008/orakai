import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

export default nextConfig;
