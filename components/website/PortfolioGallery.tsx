"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useTranslations } from "next-intl";

const projects = [
  { id: "sistomat", title: "Sistomat", category: "erp", subtitle: "ERP & Business Systems", image: "/port/03.png", tags: "ERP · Business Systems" },
  { id: "gography", title: "Gography", category: "website", subtitle: "Tour & Booking Platform", image: "/port/01.png", tags: "Website · Travel · Booking" },
  { id: "sacit", title: "SACIT Symposium", category: "website", subtitle: "Event Website & Digital Experience", image: "/port/02.png", tags: "Website · Event" },
  { id: "caraway", title: "CAR AWAY", category: "website", subtitle: "Automotive Website", image: "/port/04.png", tags: "Website · Automotive" },
];
const categories = [
  { id: "all", label: "ALL" },
  { id: "website", label: "Website" },
  { id: "mobile", label: "Mobile App" },
  { id: "erp", label: "ERP & System" },
  { id: "design", label: "UI/UX" },
  { id: "marketing", label: "Digital Marketing" },
  { id: "game", label: "Game Development" },
];
const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";

export default function PortfolioGallery() {
  const t = useTranslations("portfolioPage");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const filtered = projects.filter((project) => category === "all" || project.category === category);

  function openProject(project: (typeof projects)[number]) {
    setSelected(project);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <nav aria-label={t("filterLabel")} className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 sm:px-6">
          <div className="flex min-w-0 flex-1 gap-6 overflow-x-auto py-4">
            {categories.map((item) => (
              <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)} className={`min-h-10 shrink-0 border-b-2 px-1 text-xs transition-colors ${category === item.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 hover:text-blue-600"} ${focusStyle}`}>
                {item.id === "all" ? t("all") : item.label}
              </button>
            ))}
          </div>
          <a href="#all-projects" className={`hidden min-h-10 shrink-0 items-center gap-3 border-l border-slate-200 pl-5 text-xs md:inline-flex ${focusStyle}`}>{t("allWorks")}<ArrowRight aria-hidden="true" className="size-4 text-blue-600" /></a>
        </div>
      </nav>

      <div aria-live="polite" className="sr-only">{t("resultCount", { count: filtered.length })}</div>
      <div>
        {filtered.slice(0, 3).map((project, index) => (
          <article key={project.id} className={`overflow-hidden ${index % 2 ? "bg-white" : "bg-gradient-to-r from-[#f5f8ff] to-[#edf3fc]"}`}>
            <div className="mx-auto grid max-w-6xl md:min-h-[360px] md:grid-cols-2 lg:min-h-[390px]">
              <div className={`flex flex-col justify-center px-5 py-8 sm:px-6 md:py-10 ${index % 2 ? "md:order-2 md:pl-10" : "md:pr-10"}`}>
                <p className="flex items-center gap-5 text-[10px] font-semibold tracking-[0.2em]"><span className="font-mono text-xs text-slate-500">0{index + 1}</span><span className="text-blue-700">{project.category === "erp" ? "ERP & SYSTEM" : "WEBSITE"}</span></p>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight lg:text-4xl">{project.title}</h2>
                <p className="mt-2 text-base font-medium leading-7 lg:text-lg">{project.subtitle}</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">{t(`descriptions.${project.id}`)}</p>
                <button type="button" onClick={() => openProject(project)} className={`mt-5 inline-flex min-h-12 items-center gap-4 self-start rounded-full pr-3 text-xs font-medium ${focusStyle}`}>
                  <span className="flex size-11 items-center justify-center rounded-full border border-blue-300 text-blue-600"><ArrowRight aria-hidden="true" className="size-4" /></span>{t("viewProject")}
                </button>
              </div>
              <div className={`flex items-center bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100/70 p-6 sm:p-8 ${index % 2 ? "md:order-1" : ""}`}>
                <div className={`w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_50px_-15px_rgba(15,23,42,0.25)] ${index % 2 ? "md:-rotate-2" : "md:rotate-2"}`}>
                  <div aria-hidden="true" className="flex h-7 items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3"><span className="size-1.5 rounded-full bg-red-300" /><span className="size-1.5 rounded-full bg-amber-300" /><span className="size-1.5 rounded-full bg-emerald-300" /><span className="mx-auto text-[9px] text-slate-400">{project.title}</span></div>
                  <button type="button" aria-label={`${t("viewProject")} — ${project.title}`} onClick={() => openProject(project)} className={`relative block aspect-video w-full ${focusStyle}`}>
                    <Image src={project.image} alt={project.title} fill sizes="(min-width: 1024px) 500px, (min-width: 768px) 45vw, 90vw" className="object-contain" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
        {filtered.length === 0 && <p className="mx-auto max-w-6xl px-5 py-14 text-center text-sm leading-7 text-slate-500">{t("empty")}</p>}
      </div>

      <section id="all-projects" aria-labelledby="all-projects-title" className="scroll-mt-20 bg-gradient-to-b from-white to-[#f8fbff] py-9 sm:py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-600">ALL PROJECTS</p>
          <h2 id="all-projects-title" className="mt-2 text-2xl font-semibold sm:text-3xl">{t("allWorks")}</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((project) => (
              <button key={project.id} type="button" onClick={() => openProject(project)} className={`group overflow-hidden rounded-xl border border-blue-100 bg-white text-left transition-colors hover:border-blue-300 ${focusStyle}`}>
                <div className="relative aspect-video overflow-hidden"><Image src={project.image} alt="" fill sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw" className="object-contain transition-transform duration-500 motion-safe:group-hover:scale-105" /></div>
                <div className="flex items-center justify-between gap-3 p-4"><div><p className="text-[9px] font-medium tracking-wide text-blue-600">{project.category === "erp" ? "ERP & SYSTEM" : "WEBSITE"}</p><h3 className="mt-1 text-sm font-semibold">{project.title}</h3></div><span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-blue-200 text-blue-600"><ArrowRight aria-hidden="true" className="size-3.5" /></span></div>
              </button>
            ))}
          </div>
          <Link href="/contact" className={`mt-8 inline-flex min-h-11 items-center gap-3 rounded-full bg-blue-600 px-6 text-xs font-medium text-white hover:bg-blue-700 ${focusStyle}`}>{t("contact")}<ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
      </section>

      <dialog ref={dialogRef} aria-labelledby="project-dialog-title" onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60">
        {selected && <>
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5"><div><h2 id="project-dialog-title" className="text-xl font-semibold">{selected.title}</h2><p className="mt-1 text-xs text-slate-500">{selected.tags}</p></div><button type="button" onClick={() => dialogRef.current?.close()} aria-label={t("close")} className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 ${focusStyle}`}><X aria-hidden="true" className="size-4" /></button></div>
          <Image src={selected.image} alt={selected.title} width={1600} height={865} sizes="(min-width: 1024px) 896px, 95vw" className="h-auto w-full" />
          <p className="p-5 text-sm leading-7 text-slate-600">{t(`descriptions.${selected.id}`)}</p>
        </>}
      </dialog>
    </>
  );
}
