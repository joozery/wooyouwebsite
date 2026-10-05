"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f5f6f8] px-4 py-10 text-slate-900">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 flex items-center gap-3 px-1">
          <Image src="/logo/logolong.svg" alt="Wooyou Creative" width={124} height={36} className="h-8 w-auto" />
          <span aria-hidden="true" className="h-6 w-px bg-slate-300" />
          <span className="text-sm font-medium text-slate-600">Workspace</span>
        </div>

        <section aria-labelledby="login-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_-12px_rgba(15,23,42,0.15)] sm:p-8">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <LockKeyhole aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
            สำหรับบุคลากรของบริษัท
          </div>
          <h1 id="login-title" className="mt-4 text-2xl font-semibold tracking-tight">เข้าสู่ระบบภายในบริษัท</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">ใช้บัญชีของคุณเพื่อเข้า Wooyou Workspace</p>
            <form onSubmit={handleSubmit} aria-busy={loading} className="mt-6 space-y-5">
              {error && <div id="login-error" role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-slate-700">อีเมล</Label>
                <div className="relative">
                  <Mail aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="email" name="email" type="email" autoComplete="username" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} aria-describedby={error ? "login-error" : undefined} className="h-12 rounded-lg border-slate-200 bg-slate-50/50 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/15" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium text-slate-700">รหัสผ่าน</Label>
                <div className="relative">
                  <LockKeyhole aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="กรอกรหัสผ่านของคุณ" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={loading} aria-describedby={error ? "login-error" : undefined} className="h-12 rounded-lg border-slate-200 bg-slate-50/50 pr-12 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/15" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading} aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"} aria-pressed={showPassword} aria-controls="password" className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600">
                    {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="mt-2 h-12 w-full rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus-visible:ring-blue-500/30">
                {loading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Button>
            </form>
          <p className="mt-6 border-t border-slate-100 pt-5 text-xs leading-6 text-slate-500">หากเข้าใช้งานไม่ได้ กรุณาติดต่อผู้ดูแลระบบของบริษัท</p>
        </section>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-slate-500">
          <p>© {new Date().getFullYear()} Wooyou Creative</p>
          <Link href="/" className="inline-flex min-h-10 items-center gap-1.5 rounded-sm transition-colors hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
            <ArrowLeft aria-hidden="true" className="size-3" />กลับหน้าเว็บไซต์
          </Link>
        </div>
      </div>
    </main>
  );
}
