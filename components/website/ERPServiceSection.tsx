import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const features = [
  "ใบเสนอราคา ใบแจ้งหนี้ ใบกำกับภาษี ใบเสร็จ ครบวงจร",
  "จัดการลูกค้าและโปรเจคในที่เดียว",
  "บัญชีรายรับ-รายจ่าย พร้อม export Excel",
  "Dashboard สรุปภาพรวมธุรกิจแบบ real-time",
];

export default function ERPServiceSection() {
  return (
    <section className="bg-canvas pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-indigo via-brand-blue to-brand-purple p-10 md:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold tracking-[1.5px] text-white/70 uppercase">
                ERP System
              </span>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.02em] text-white md:text-5xl">
                ระบบ ERP
                <br />
                สำหรับธุรกิจไทย
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-white/80">
                บริหารงานขาย เอกสารการเงิน และบัญชีในระบบเดียว
                ออกแบบมาเพื่อธุรกิจ SME โดยเฉพาะ
              </p>
              <Link
                href="/service/erp-systems"
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-brand-indigo transition-opacity hover:opacity-90"
              >
                ดูรายละเอียดระบบ ERP
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="space-y-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-white" />
                  <span className="text-sm leading-relaxed text-white">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
