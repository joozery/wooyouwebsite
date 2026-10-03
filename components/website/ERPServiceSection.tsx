"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const rows = [
  { id: "INV-0041", client: "Bangkok Creative",   amount: "฿125,000", status: "paid",    dot: "#22c55e" },
  { id: "QUO-0039", client: "Siam Global Group",  amount: "฿450,000", status: "pending", dot: "#f59e0b" },
  { id: "INV-0038", client: "Thai Organic Foods", amount: "฿82,000",  status: "paid",    dot: "#22c55e" },
  { id: "QUO-0036", client: "NextGen Logistics",  amount: "฿110,000", status: "draft", dot: "#6b7280" },
  { id: "INV-0035", client: "Phuket Villa Resort",amount: "฿45,000",  status: "paid",    dot: "#22c55e" },
  { id: "QUO-0034", client: "Lanna Coffee Co.",   amount: "฿18,500",  status: "pending", dot: "#f59e0b" },
];

function MainWindow() {
  const t = useTranslations("erp");
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_32px_80px_rgba(0,0,0,0.3)] backdrop-blur-md">
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-5 py-4">
        <div className="flex gap-1.5">
          {["#ef4444","#f59e0b","#22c55e"].map(c => (
            <div key={c} className="size-3 rounded-full" style={{ background: c, opacity: 0.8 }} />
          ))}
        </div>
        <span className="text-xs font-medium text-gray-400">wooyou-erp.app / invoices</span>
      </div>
      {/* Table */}
      <div className="p-6">
        <div className="grid grid-cols-4 rounded-t-xl bg-gray-50 px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          <span>{t("colNo")}</span><span>{t("colClient")}</span><span>{t("colTotal")}</span><span>{t("colStatus")}</span>
        </div>
        <div className="space-y-1">
          {rows.map((r, i) => (
            <div
              key={r.id}
              className="grid grid-cols-4 items-center px-5 py-3.5 text-sm border-t border-gray-100 transition-colors hover:bg-gray-50"
            >
              <span className="font-mono text-gray-400 text-xs">{r.id}</span>
              <span className="text-gray-700">{r.client}</span>
              <span className="font-semibold text-gray-900">{r.amount}</span>
              <span className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ background: r.dot }} />
                <span style={{ color: r.dot }} className="text-xs">{t(r.status)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FloatingFormWindow() {
  const t = useTranslations("erp");
  return (
    <div className="w-[300px] overflow-hidden rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
        <span className="text-sm font-semibold text-gray-900">{t("formTitle")}</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{t("selectClient")}</label>
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-800 shadow-sm">
            Bangkok Creative Co.
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{t("itemLabel")}</label>
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-800 shadow-sm">
            {t("sampleItem")}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{t("amountLabel")}</label>
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-800 font-mono shadow-sm">
            125,000.00
          </div>
        </div>
        <button className="w-full mt-2 rounded-lg bg-indigo-600 py-3 text-xs font-bold text-white transition-colors hover:bg-indigo-500 shadow-lg shadow-indigo-600/30">
          {t("save")}
        </button>
      </div>
    </div>
  );
}

function FloatingStatWindow() {
  const t = useTranslations("erp");
  const stats = [
    { label: t("revenue"), value: "฿284,500", delta: "+12%", up: true },
    { label: t("outstanding"), value: t("invoicesCount", { n: 18 }), delta: t("overdue", { n: 5 }), up: false },
  ];
  return (
    <div className="w-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
       <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">{t("summary")}</span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Live</span>
      </div>
      <div className="p-5 space-y-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-medium text-gray-500">{s.label}</p>
            <div className="mt-1.5 flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className={`flex items-center gap-1 text-[11px] font-medium ${s.up ? "text-emerald-500" : "text-amber-500"}`}>
                {s.up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                {s.delta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ERPServiceSection() {
  const t = useTranslations("erp");
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#05050f]">
       {/* Background Setup */}
       <div 
         className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity"
         style={{ backgroundImage: "url('/covererp.png')" }}
       />
       <div className="absolute inset-0 bg-gradient-to-b from-[#05050f] via-transparent to-[#05050f]" />
       
       <div className="relative mx-auto max-w-7xl px-4 sm:px-6 z-10">
          
          {/* ── Centered Header ── */}
          <div className="mx-auto max-w-3xl text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                  Business OS
                </span>
              </div>
              <h2 className="text-4xl font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl">
                {t("title1")} <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  {t("title2")}
                </span>
              </h2>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-white/50 max-w-2xl mx-auto">
                {t("desc1")} <br className="hidden sm:block" />
                {t("desc2")}
              </p>
            </motion.div>
          </div>

          {/* ── Overlapping Mockups ── */}
          <div className="relative mx-auto mt-8 max-w-5xl h-[420px] sm:h-[460px] md:h-[480px]">
             {/* Center Main Window */}
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
               className="absolute left-1/2 top-0 w-full max-w-[850px] -translate-x-1/2 z-10"
             >
                <MainWindow />
             </motion.div>

             {/* Left Floating Window */}
             <motion.div
               initial={{ opacity: 0, x: -30, y: 20 }}
               whileInView={{ opacity: 1, x: 0, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
               className="absolute -left-6 sm:left-0 lg:-left-12 bottom-0 sm:bottom-4 md:bottom-8 z-20 hidden md:block"
             >
               <FloatingFormWindow />
             </motion.div>

             {/* Right Floating Window */}
             <motion.div
               initial={{ opacity: 0, x: 30, y: 20 }}
               whileInView={{ opacity: 1, x: 0, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
               className="absolute -right-6 sm:right-0 lg:-right-12 bottom-8 sm:bottom-12 md:bottom-16 z-20 hidden md:block"
             >
               <FloatingStatWindow />
             </motion.div>
          </div>

          {/* ── CTA ── */}
          <div className="mt-8 md:mt-12 flex justify-center pb-4">
             <Link
                href="/service/erp-systems"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-[15px] font-semibold text-black transition-all hover:bg-white/90 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
             >
                {t("cta")}
                <ArrowRight className="size-4" />
             </Link>
          </div>

       </div>
    </section>
  );
}
