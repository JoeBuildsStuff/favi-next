import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@resvg/resvg-js"],
}

export default nextConfig
