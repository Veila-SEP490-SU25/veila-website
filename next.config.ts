import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "loremflickr.com",
      "picsum.photos",
      "firebasestorage.googleapis.com",
      "cdn.jsdelivr.net",
    ],
  },
};

export default nextConfig;
