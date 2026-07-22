import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-canvas pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface-soft px-8 py-20 text-center md:px-20">
          <div className="pointer-events-none absolute -top-24 left-1/4 size-72 rounded-full bg-brand-purple/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 size-72 rounded-full bg-brand-blue/20 blur-3xl" />

          <h2 className="relative text-3xl font-medium tracking-[-0.02em] text-ink md:text-5xl">
            พร้อมเริ่มโปรเจคของคุณแล้วหรือยัง?
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl leading-relaxed text-body-soft">
            ปรึกษาฟรี ไม่มีค่าใช้จ่าย ทีมงานพร้อมให้คำแนะนำที่เหมาะกับธุรกิจของคุณ
          </p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-ink px-6 text-sm font-semibold text-canvas transition-opacity hover:opacity-85"
            >
              ติดต่อเรา
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/service"
              className="inline-flex h-12 items-center rounded-xl border border-hairline bg-canvas px-6 text-sm font-semibold text-ink transition-colors hover:bg-surface-card"
            >
              ดูบริการทั้งหมด
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
