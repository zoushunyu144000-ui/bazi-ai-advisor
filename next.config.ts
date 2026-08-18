import type { NextConfig } from "next";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // GitHub Pages 项目站点部署在 /bazi-ai-advisor/ 子路径下
  basePath: "/bazi-ai-advisor",
  assetPrefix: "/bazi-ai-advisor/",
};

export default nextConfig;
