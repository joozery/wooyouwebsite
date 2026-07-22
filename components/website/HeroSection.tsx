"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-canvas pt-40 pb-24">
      {/* gradient orbs — mood จากโปรเจคเดิม */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-brand-purple/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-32 size-96 rounded-full bg-brand-blue/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12">
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-card px-4 py-1.5 text-[13px] font-medium text-brand-lavender">
            <Sparkles className="size-3.5" />
            Digital Agency ครบวงจร
          </span>

          <h1 className="mt-6 text-5xl leading-[1.05] font-medium tracking-[-0.03em] text-ink md:text-7xl">
            สร้างเว็บไซต์และ
            <span className="bg-gradient-to-r from-brand-blue via-brand-lavender to-brand-purple bg-clip-text text-transparent">
              ระบบ ERP
            </span>
            <br />
            ที่ขับเคลื่อนธุรกิจของคุณ
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-body-soft">
            รับทำเว็บไซต์ WordPress, Web Application, ระบบ ERP
            และการตลาดออนไลน์ SEO ครบวงจร โดยทีมงานมืออาชีพ
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-ink px-6 text-sm font-semibold text-canvas transition-opacity hover:opacity-85"
            >
              เริ่มต้นโปรเจค
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex h-12 items-center rounded-xl border border-hairline bg-canvas px-6 text-sm font-semibold text-ink transition-colors hover:bg-surface-soft"
            >
              ดูผลงานของเรา
            </Link>
          </div>

          <dl className="mt-14 flex gap-10">
            {[
              ["50+", "โปรเจกต์"],
              ["30+", "ลูกค้า"],
              ["5+", "ปีประสบการณ์"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-3xl font-medium tracking-tight text-ink">
                  {value}
                </dt>
                <dd className="mt-1 text-sm text-muted-soft">{label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* product UI fragment ตามภาษา design ของ Clay */}
        <motion.div
          className="hidden lg:col-span-5 lg:block"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="rounded-3xl border border-hairline bg-surface-soft p-6">
            <div className="rounded-2xl border border-hairline bg-surface-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">
                  Dashboard
                </span>
                <span className="rounded-full bg-brand-teal/15 px-3 py-1 text-xs font-medium text-brand-teal">
                  Live
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-brand-blue/15 p-4">
                  <p className="text-xs text-body-soft">รายได้เดือนนี้</p>
                  <p className="mt-1 text-xl font-semibold text-ink">
                    ฿245,000
                  </p>
                </div>
                <div className="rounded-xl bg-brand-purple/15 p-4">
                  <p className="text-xs text-body-soft">โปรเจคที่กำลังทำ</p>
                  <p className="mt-1 text-xl font-semibold text-ink">12</p>
                </div>
              </div>
              <div className="mt-3 flex items-end gap-2 rounded-xl bg-canvas/60 p-4">
                {[35, 55, 40, 70, 50, 85, 65, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-brand-blue to-brand-lavender"
                    style={{ height: `${h * 0.6}px` }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-hairline bg-surface-card px-5 py-4">
              <span className="text-sm text-body-soft">ใบเสนอราคา #QT-0042</span>
              <span className="rounded-full bg-brand-lavender/15 px-3 py-1 text-xs font-medium text-brand-lavender">
                อนุมัติแล้ว
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
