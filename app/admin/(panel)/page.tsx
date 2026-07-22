import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Wooyou Admin",
};

export default function AdminDashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
    </main>
  );
}
