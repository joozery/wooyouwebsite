"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { techCategories } from "@/lib/techStack";

const tabLabels = ["Frontend & Mobile", "Backend & Database", "Platform & Tools"];
const totalTechs = techCategories.flatMap((c) => c.items).length;

export default function TechStackSection() {
  const t = useTranslations("tech");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#05050f] px-4 py-20 sm:px-6 sm:py-28 md:px-10">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* ── Header ── */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-20">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-blue-500" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                02 Our Expertise
              </span>
            </div>
            <h2 className="text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {t("heading1")}
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                {t("heading2")}
              </span>
            </h2>
          </div>
          <p className="max-w-md flex-1 text-sm leading-relaxed text-white/40 sm:text-base">
            {t("intro")}
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">

          {/* Left — stat hero card */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-cover bg-center p-8 lg:col-span-4 shadow-inner shadow-white/20"
            style={{ backgroundImage: "url('/texh.png')" }}
          >
            <div className="relative z-10">
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
                Tech Stack
              </p>
              <div className="mb-3 flex items-end gap-2">
                <span className="bg-gradient-to-br from-slate-800 to-slate-500 bg-clip-text text-[76px] font-black leading-none text-transparent drop-shadow-sm">
                  {totalTechs}+
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-700">
                {t("stat1")}
                <br />
                {t("stat2")}
              </p>
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-2 gap-3">
              {[
                { label: "Projects Delivered", value: "100+" },
                { label: "Years Experience", value: "10+" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-900/10 bg-white/40 p-4 backdrop-blur-md"
                >
                  <p className="text-xl font-black text-slate-800">{s.value}</p>
                  <p className="mt-1 text-[11px] font-medium leading-tight text-slate-600">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — tech category tabs */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 rounded-3xl border border-white/[0.06] bg-[#0a0a18] p-7 lg:col-span-8"
          >
            {/* Tab bar */}
            <div className="flex flex-wrap gap-2">
              {tabLabels.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(i)}
                  className="relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200"
                  style={{ color: activeTab === i ? "#fff" : "rgba(255,255,255,0.35)" }}
                >
                  {activeTab === i && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full border border-white/15 bg-white/10"
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>

            {/* Animated tech grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
              >
                {techCategories[activeTab].items.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    className="group flex cursor-default items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="size-9 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-white/90">{tech.name}</p>
                      <p className="text-[11px] leading-tight text-white/38">{t(`desc.${tech.icon.replace("/tech/", "").replace(".svg", "")}`)}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
