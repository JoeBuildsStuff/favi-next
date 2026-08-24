import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@resvg/resvg-js"],
  // Generated catalog must be traced into serverless functions because
  // node_modules icon pack files are not included in the file trace.
  outputFileTracingIncludes: {
    "/api/icons": ["./generated/**"],
    "/api/icons/**": ["./generated/**"],
    "/api/libraries": ["./generated/**"],
    "/api/health": ["./generated/**"],
    "/api/export": ["./generated/**"],
  },
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
