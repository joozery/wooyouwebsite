import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Layers3, Workflow, Blocks, ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ERPModules from "./ERPModules";

const container = "mx-auto max-w-7xl px-5 sm:px-6 lg:px-8";
const eyebrow = "text-[10px] font-semibold tracking-[0.2em] text-blue-600";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";
const primary = `inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 ${focus}`;

export default async function ERPDetailPage() {
  const t = await getTranslations("erpDetail");
  const erp = await getTranslations("erp");
  const services = await getTranslations("services");
  return <main className="bg-white text-slate-900">
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-[#f7faff] to-[#eaf2ff] pb-12 pt-24 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-12 -z-10 size-[600px] rounded-full border-[60px] border-white/60" />
      <div className={container}>
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-slate-400"><Link href="/service" className={`hover:text-blue-600 ${focus}`}>{services("title")}</Link><span aria-hidden="true">/</span><span className="text-slate-600">ERP Systems</span></nav>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div><p className={eyebrow}>ERP & BUSINESS SYSTEMS</p><h1 className="mt-4 text-3xl font-semibold leading-[1.45] tracking-tight sm:text-4xl lg:text-[46px]">{t("heroTitle")}<span className="block text-blue-600">{t("heroAccent")}</span></h1><p className="mt-5 max-w-xl text-base leading-8 text-slate-500">{erp("desc1")}</p><p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">{erp("desc2")}</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/contact" className={primary}>{t("contact")}<ArrowUpRight className="size-4" /></Link><a href="#erp-modules" className={`inline-flex min-h-12 items-center gap-3 rounded-full border border-blue-200 bg-white px-6 text-sm font-medium hover:bg-blue-50 ${focus}`}>{t("explore")}<ArrowRight className="size-4" /></a></div><div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-slate-500">{["Custom Development", "Connected Workflows", "Scalable Modules"].map((label) => <span key={label} className="flex items-center gap-2"><Check className="size-3.5 text-blue-500" />{label}</span>)}</div></div>
          <div className="relative mx-auto w-full max-w-lg"><div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-blue-100/70 blur-2xl" /><Image src="/navbaricon/erp.webp" alt="" width={700} height={700} preload sizes="(min-width: 1024px) 480px, 90vw" className="relative h-auto w-full object-contain px-5" /><span className="absolute left-0 top-10 rounded-xl border border-white bg-white/90 px-4 py-3 text-xs font-medium text-blue-700 shadow-[0_8px_28px_-16px_rgba(37,99,235,0.4)]">Custom ERP</span><span className="absolute bottom-8 right-0 flex items-center gap-2 rounded-xl border border-white bg-white/90 px-4 py-3 text-xs font-medium text-slate-600 shadow-sm"><Workflow className="size-4 text-blue-500" />One connected system</span></div>
        </div>
      </div>
    </section>

    <section className="border-y border-slate-100 py-7 sm:py-9"><div className={`${container} grid gap-6 md:grid-cols-3 md:gap-8`}>{[Layers3, Workflow, Blocks].map((Icon, index) => <div key={index} className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon className="size-5" /></span><div><h2 className="text-sm font-semibold">{t(`benefit${index + 1}`)}</h2><p className="mt-2 text-xs leading-6 text-slate-500">{t(`benefit${index + 1}Body`)}</p></div></div>)}</div></section>

    <section id="erp-modules" className="scroll-mt-24 py-12 sm:py-16 lg:py-20"><div className={container}><p className={eyebrow}>BUILT AROUND YOUR WORKFLOW</p><h2 className="mt-3 text-2xl font-semibold leading-relaxed tracking-tight sm:text-3xl">{t("modulesTitle")}</h2><p className="mt-3 text-sm leading-7 text-slate-500">{t("modulesIntro")}</p><ERPModules /></div></section>

    <section className="bg-[#f6f8fb] py-12 sm:py-16"><div className={`${container} grid items-center gap-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-14`}><div><p className={eyebrow}>SELECTED WORK / SISTOMAT</p><h2 className="mt-3 text-2xl font-semibold leading-relaxed tracking-tight sm:text-3xl">{t("workTitle")}</h2><p className="mt-4 text-sm leading-7 text-slate-500">{t("workBody")}</p><Link href="/portfolio" className={`mt-6 inline-flex min-h-11 items-center gap-3 border-b border-blue-200 text-sm font-medium text-blue-600 ${focus}`}>{t("workLink")}<ArrowUpRight className="size-4" /></Link></div><Link href="/portfolio" aria-label={t("workLink")} className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_48px_-32px_rgba(15,23,42,0.35)] ${focus}`}><Image src="/port/03.png" alt="Sistomat" width={1599} height={863} sizes="(min-width: 1024px) 750px, 92vw" className="h-auto w-full rounded-xl transition-transform duration-500 motion-safe:group-hover:scale-[1.02]" /></Link></div></section>

    <section className="py-12 sm:py-16 lg:py-20"><div className={container}><p className={eyebrow}>OUR APPROACH</p><h2 className="mt-3 text-2xl font-semibold leading-relaxed tracking-tight sm:text-3xl">{t("processTitle")}</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{["Discover", "Design", "Develop", "Launch"].map((step, index) => <div key={step} className="border-t border-blue-100 pt-5"><div className="flex items-center justify-between"><span className="font-mono text-xs text-blue-500">0{index + 1}</span><ArrowRight className="size-4 text-blue-200" /></div><h3 className="mt-4 text-lg font-semibold">{step}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{t(`process${index + 1}`)}</p></div>)}</div></div></section>

    <section className="border-t border-slate-100 py-12 sm:py-16"><div className={`${container} grid gap-6 lg:grid-cols-[0.65fr_1.35fr] lg:gap-14`}><div><p className={eyebrow}>GOOD TO KNOW</p><h2 className="mt-3 text-2xl font-semibold leading-relaxed sm:text-3xl">{t("faqTitle")}</h2></div><div>{[1, 2, 3].map((number) => <details key={number} className="group border-b border-slate-200 py-5"><summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden ${focus}`}>{t(`q${number}`)}<ChevronDown aria-hidden="true" className="size-4 shrink-0 text-blue-500 transition-transform group-open:rotate-180" /></summary><p className="mt-3 pr-8 text-sm leading-7 text-slate-500">{t(`a${number}`)}</p></details>)}</div></div></section>

    <section className="px-5 pb-12 sm:px-6 sm:pb-16"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl border border-blue-100 bg-gradient-to-r from-[#edf4ff] to-[#f8fbff] p-6 sm:p-10 lg:flex-row lg:items-center"><div><p className={eyebrow}>LET’S BUILD YOUR SYSTEM</p><h2 className="mt-3 text-2xl font-semibold leading-relaxed sm:text-3xl">{t("ctaTitle")}</h2><p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">{t("ctaBody")}</p></div><Link href="/contact" className={`${primary} shrink-0`}>{t("contact")}<ArrowUpRight className="size-4" /></Link></div></section>
  </main>;
}
