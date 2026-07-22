import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ลูกค้าของเรา | Wooyou Creative",
  description: "ลูกค้า ผลงาน testimonials และ case studies ของ Wooyou Creative",
};

export default function CustomerPage() {
  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold">ลูกค้าของเรา</h1>
    </main>
  );
}
