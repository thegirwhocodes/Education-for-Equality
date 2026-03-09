import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "sabi.eduforequality.org" }],
        destination: "/sabi",
      },
    ];
  },
};

export default nextConfig;
