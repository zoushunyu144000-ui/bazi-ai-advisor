import type { NextConfig } from "next";

// GitHub Pages 部署在 /bazi-ai-advisor/ 子路径；Vercel 部署在根路径。
// Vercel 构建环境会自动注入 VERCEL=1，借此区分两套配置。
const isGithubPages = !process.env.VERCEL;

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isGithubPages
    ? {
        // GitHub Pages 项目站点部署在 /bazi-ai-advisor/ 子路径下
        basePath: "/bazi-ai-advisor",
        assetPrefix: "/bazi-ai-advisor/",
      }
    : {}),
};

export default nextConfig;
