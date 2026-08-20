import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/app/_components/site-nav";
import { SiteFooter } from "@/app/_components/site-footer";

export const metadata: Metadata = {
  title: "八字人格 · 测测你到底是什么东西",
  description: "八字版 SBTI：不用答几十道题。用确定性八字排盘与 Interpretation，看看你是犟种、狠人、活菩萨，还是天生反骨。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteNav />
        <div className="min-h-[calc(100vh-4.5rem)]">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
