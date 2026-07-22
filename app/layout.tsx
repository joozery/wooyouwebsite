import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "รับทำเว็บไซต์ ระบบ ERP และการตลาดออนไลน์ | Wooyou Creative",
  description:
    "บริการรับทำเว็บไซต์ WordPress, Web Application, ระบบ ERP และการตลาดออนไลน์ SEO ครบวงจร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
