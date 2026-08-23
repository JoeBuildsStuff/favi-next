import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@resvg/resvg-js"],
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/api/v1", destination: "/api" },
        { source: "/api/v1/:path*", destination: "/api/:path*" },
      ],
    }
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Vary", value: "Accept" }],
      },
    ]
  },
}

export default nextConfig
