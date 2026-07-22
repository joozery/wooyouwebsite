import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ | Wooyou Admin",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">Admin Login</h1>
    </main>
  );
}
