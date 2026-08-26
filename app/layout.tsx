import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/app/_components/site-nav";
import { SiteFooter } from "@/app/_components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "八字人格俱乐部 · Bazi Personality",
    template: "%s · 八字人格俱乐部",
  },
  description: "用确定性八字排盘认领十怪人格之一。里面认真算，外面认真发疯。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans">
      <body className="paper-grain">
        <a href="#main-content" className="skip-link">跳到主要内容</a>
        <SiteNav />
        <div id="main-content" className="min-h-[calc(100vh-4.5rem)]">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
