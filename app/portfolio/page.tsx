import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ผลงานของเรา | Wooyou Creative",
  description: "ผลงานเว็บไซต์ Web Application และ Corporate Website ทั้งหมด",
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold">ผลงานของเรา</h1>
    </main>
  );
}
