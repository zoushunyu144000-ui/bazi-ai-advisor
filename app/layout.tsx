import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "知序 BAZI｜现代人格图谱与 AI 顾问",
  description: "把传统八字结构翻译成现代人格、行为模式与可执行建议。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans">
      <body>{children}</body>
    </html>
  );
}
