"use client";

import { useState } from "react";
import { Users, Receipt, Package, ContactRound, ChartNoAxesCombined, Blocks, ArrowRight, Check, Database, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const modules = [
  { key: "sales", Icon: Users, label: "CRM & SALES" },
  { key: "finance", Icon: Receipt, label: "FINANCE" },
  { key: "inventory", Icon: Package, label: "INVENTORY" },
  { key: "people", Icon: ContactRound, label: "PEOPLE" },
  { key: "reports", Icon: ChartNoAxesCombined, label: "ANALYTICS" },
  { key: "custom", Icon: Blocks, label: "CUSTOM ERP" },
];

export default function ERPModules() {
  const t = useTranslations("erpDetail");
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const selected = modules[active];
  return <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-1" role="group" aria-label={t("modulesTitle")}>
      {modules.map((item, index) => <button key={item.key} type="button" aria-pressed={index === active} aria-controls="erp-module-panel" onClick={() => setActive(index)} className={`flex min-h-14 min-w-0 items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-4 ${active === index ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-100 bg-white text-slate-500 hover:border-blue-100 hover:bg-slate-50"}`}><item.Icon aria-hidden="true" className="size-4 shrink-0" /><span className="flex-1">{t(item.key)}</span><ArrowRight aria-hidden="true" className="hidden size-4 shrink-0 sm:block" /></button>)}
    </div>
    <div id="erp-module-panel" className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-[#edf4ff] via-[#f8fbff] to-white p-5 sm:p-8">
      <div aria-hidden="true" className="rounded-2xl border border-white bg-white/80 p-5 shadow-[0_16px_48px_-28px_rgba(37,99,235,0.4)] sm:p-7"><div className="flex items-center justify-between border-b border-slate-100 pb-4"><span className="text-[10px] font-semibold tracking-widest text-blue-600">WOOYOU / {selected.label}</span><div className="flex gap-1.5"><span className="size-2 rounded-full bg-blue-200" /><span className="size-2 rounded-full bg-blue-300" /><span className="size-2 rounded-full bg-blue-500" /></div></div><div className="mt-6 flex items-center justify-center gap-3 sm:gap-5"><span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white"><selected.Icon className="size-6" /></span><span className="h-px flex-1 bg-blue-200" /><span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600"><Database className="size-6" /></span><span className="h-px flex-1 bg-blue-200" /><span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600"><ShieldCheck className="size-6" /></span></div><div className="mt-6 space-y-2">{[80, 60, 90].map((width, i) => <div key={width} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5"><Check className="size-3 text-blue-400" /><span className="h-1.5 rounded-full bg-blue-100" style={{ width: `${width}%` }} /><span className="ml-auto font-mono text-[9px] text-slate-300">0{i + 1}</span></div>)}</div></div>
      <AnimatePresence mode="wait" initial={false}><motion.div key={selected.key} initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.15 }} className="mt-6"><h3 className="text-xl font-semibold text-slate-900">{t(selected.key)}</h3><p className="mt-3 min-h-20 text-sm leading-7 text-slate-500">{t(`${selected.key}Body`)}</p></motion.div></AnimatePresence>
    </div>
  </div>;
}
