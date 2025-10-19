import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Docker runtime
  output: "standalone",
  // Dev proxy so the browser can call /api without CORS in local
  async rewrites() {
    const target = process.env.API_PROXY_TARGET || "http://localhost:8080/api";
    return [
      {
        source: "/api/:path*",
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default nextConfig;
