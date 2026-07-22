import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา | Wooyou Creative",
  description:
    "รู้จักทีมงาน Wooyou Creative พันธกิจ วิสัยทัศน์ และค่านิยมของเรา",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <h1 className="text-3xl font-bold">เกี่ยวกับเรา</h1>
    </main>
  );
}
