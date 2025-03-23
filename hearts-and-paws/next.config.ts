import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.clerk.com","storage.googleapis.com"], // Allow Clerk profile images
  },
};

export default nextConfig;
