"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { defaultPortfolioProjects, portfolioCategories as categories, type PortfolioProject } from "@/lib/portfolio";

const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";


function ProjectImageSlider({ project, paused, onSelect, label }: {
  project: PortfolioProject;
  paused: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <div className="group/slider overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className="flex w-max animate-[marquee_36s_linear_infinite] [animation-play-state:paused] [@media(hover:hover)_and_(pointer:fine)]:group-hover/slider:[animation-play-state:running] group-focus-within/slider:[animation-play-state:paused] motion-reduce:animate-none"
        style={paused ? { animationPlayState: "paused" } : undefined}
      >
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1 ? true : undefined} inert={copy === 1 ? true : undefined} className="flex shrink-0 gap-2 pr-2">
            {project.gallery.map((src, imageIndex) => (
              <button
                key={`${copy}-${imageIndex}`}
                type="button"
                tabIndex={copy === 1 ? -1 : 0}
                aria-label={`${label} — ${project.title} ${imageIndex + 1}`}
                onClick={onSelect}
                className={`group relative h-36 shrink-0 overflow-hidden bg-white sm:h-40 lg:h-44 ${imageIndex % 2 === 0 ? "w-56 sm:w-64 lg:w-72" : "w-36 sm:w-40 lg:w-44"} ${focusStyle}`}
              >
                <Image src={src} alt="" fill sizes="(min-width: 1024px) 288px, 256px" className={`${src.includes("navbaricon") ? "object-contain p-3" : "object-cover object-top"} transition-transform duration-500 motion-safe:group-hover:scale-105`} />
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PortfolioGallery() {
  const t = useTranslations("portfolioPage");
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/portfolio", { signal: controller.signal, cache: "no-store" })
      .then((response) => { if (!response.ok) throw new Error("Portfolio unavailable"); return response.json(); })
      .then((data) => { if (Array.isArray(data.projects)) setProjects(data.projects); })
      .catch(() => { if (!controller.signal.aborted) setProjects(defaultPortfolioProjects); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  function description(project: PortfolioProject) {
    return project.description || (t.has(`descriptions.${project.id}`) ? t(`descriptions.${project.id}`) : project.subtitle);
  }
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<PortfolioProject | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const filtered = projects.filter((project) => project.isVisible && (category === "all" || project.category === category));

  function openProject(project: PortfolioProject) {
    setSelected(project);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <nav aria-label={t("filterLabel")} className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 sm:px-6">
          <div className="flex min-w-0 flex-1 gap-6 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
      <section aria-labelledby="selected-projects-title" className="bg-[#f5f5f5] py-9 sm:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-start md:gap-12">
            <h2 id="selected-projects-title" className="max-w-lg text-3xl font-semibold leading-relaxed tracking-tight text-[#333] sm:text-4xl">{t("title")}</h2>
            <p className="max-w-sm text-sm leading-7 text-slate-600">{t("intro")}</p>
          </div>
          <div className="space-y-8 sm:space-y-10">
            {filtered.slice(0, 5).map((project, index) => (
              <article key={project.id}>
                <ProjectImageSlider
                  project={project}
                  paused={selected !== null}
                  onSelect={() => openProject(project)}
                  label={t("viewProject")}
                />
                <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-start sm:gap-8">
                  <button type="button" onClick={() => openProject(project)} className={`flex items-baseline gap-3 self-start text-left ${focusStyle}`}>
                    <span aria-hidden="true" className="font-mono text-[10px] text-slate-400">0{index + 1}</span>
                    <h3 className="text-base font-semibold leading-7 text-[#333]">{project.title}<span className="ml-2 text-sm font-normal text-slate-600">{project.subtitle}</span></h3>
                  </button>
                  <p className="max-w-lg text-xs leading-6 text-slate-600 sm:text-right">{description(project)}</p>
                </div>
              </article>
            ))}
          </div>
          {loading && <p role="status" className="py-8 text-center text-sm text-slate-500">{t("title")}…</p>}
          {!loading && filtered.length === 0 && <p className="py-8 text-center text-sm leading-7 text-slate-500">{t("empty")}</p>}
        </div>
      </section>

      <section id="all-projects" aria-labelledby="all-projects-title" className="scroll-mt-20 bg-gradient-to-b from-white to-[#f8fbff] py-9 sm:py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-600">ALL PROJECTS</p>
          <h2 id="all-projects-title" className="mt-2 text-2xl font-semibold sm:text-3xl">{t("allWorks")}</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((project) => (
              <button key={project.id} type="button" onClick={() => openProject(project)} className={`group overflow-hidden rounded-xl border border-blue-100 bg-white text-left transition-colors hover:border-blue-300 ${focusStyle}`}>
                <div className="relative aspect-video overflow-hidden"><Image src={project.image} alt="" fill sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 90vw" className="object-contain transition-transform duration-500 motion-safe:group-hover:scale-105" /></div>
                <div className="flex items-center justify-between gap-3 p-4"><div><p className="text-[9px] font-medium tracking-wide text-blue-600">{categories.find((item) => item.id === project.category)?.label}</p><h3 className="mt-1 text-sm font-semibold">{project.title}</h3></div><span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-blue-200 text-blue-600"><ArrowRight aria-hidden="true" className="size-3.5" /></span></div>
              </button>
            ))}
          </div>
          <Link href="/contact" className={`mt-8 inline-flex min-h-11 items-center gap-3 rounded-full bg-blue-600 px-6 text-xs font-medium text-white hover:bg-blue-700 ${focusStyle}`}>{t("contact")}<ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
      </section>

      <dialog ref={dialogRef} onClose={() => setSelected(null)} aria-labelledby="project-dialog-title" onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60">
        {selected && <>
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5"><div><h2 id="project-dialog-title" className="text-xl font-semibold">{selected.title}</h2><p className="mt-1 text-xs text-slate-500">{selected.tags}</p></div><button type="button" onClick={() => dialogRef.current?.close()} aria-label={t("close")} className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 ${focusStyle}`}><X aria-hidden="true" className="size-4" /></button></div>
          <Image src={selected.image} alt={selected.title} width={1600} height={865} sizes="(min-width: 1024px) 896px, 95vw" className="h-auto w-full" />
          <p className="p-5 text-sm leading-7 text-slate-600">{description(selected)}</p>
        </>}
      </dialog>
    </>
  );
}
