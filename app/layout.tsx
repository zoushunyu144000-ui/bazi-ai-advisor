import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/app/_components/site-nav";
import { SiteFooter } from "@/app/_components/site-footer";

export const metadata: Metadata = {
  title: "八字顾问 · Bazi AI Advisor",
  description:
    "基于确定性排盘引擎的 AI 八字与现代行为指导。输入出生信息，即时生成四柱命盘、五行分布与大运走势。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteNav />
        <div className="min-h-[calc(100vh-4.5rem)]">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
