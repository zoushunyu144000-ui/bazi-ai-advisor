import type { NextConfig } from "next";

// GitHub Pages 部署在 /bazi-ai-advisor/ 子路径；Vercel 部署在根路径。
// Vercel 构建环境会自动注入 VERCEL=1，借此区分两套配置。
const isGithubPages = !process.env.VERCEL;
const publicBasePath = isGithubPages ? "/bazi-ai-advisor" : "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: publicBasePath },
  turbopack: { root: process.cwd() },
  ...(isGithubPages
    ? {
        // GitHub Pages 项目站点部署在 /bazi-ai-advisor/ 子路径下
        basePath: publicBasePath,
        assetPrefix: publicBasePath,
      }
    : {}),
} satisfies NextConfig;

export default nextConfig;
