import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "บริการของเรา | Wooyou Creative",
  description:
    "บริการรับทำเว็บไซต์ UI/UX Design การตลาดออนไลน์ ระบบ ERP เกม และ Mobile Apps",
};

export default function ServicePage() {
  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold">บริการของเรา</h1>
    </main>
  );
}
