import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X(Twitter)用 縦長画像4分割ツール | タップ推奨・分割アート作成",
  description: "X（旧Twitter）で人気の「タップして全体表示」や「4分割画像」を簡単に作成できる無料ツール。縦長の画像を自動で水平4等分にスライスします。ドラッグ＆ドロップで一瞬で完成。",
  keywords: ["X", "Twitter", "画像分割", "4分割", "縦長画像", "タップ推奨", "スライス", "ネタ画像", "便利ツール", "タップで縦長"],
  openGraph: {
    title: "X(Twitter)用 縦長画像4分割ツール",
    description: "縦長の画像をサクッと4分割！Xの投稿ネタ作りに最適です。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "X(Twitter)用 縦長画像4分割ツール",
    description: "縦長の画像をサクッと4分割！Xの投稿ネタ作りに最適です。",
  },
  verification: {
    google: "odv3ZW8llw6HKYe2M7fzMwgQj41ug5nXGw8mKrKSorE",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
