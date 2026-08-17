import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bazi AI Advisor",
  description: "AI Bazi and modern behavioral guidance system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <body>{children}</body>
    </html>
  );
}
