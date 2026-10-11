import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "http://api.repsi.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
