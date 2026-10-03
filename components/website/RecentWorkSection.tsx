"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { useTranslations } from "next-intl";

const works = [
  {
    num: "01",
    title: "Vista Thailand",
    category: "website",
    year: "2024",
    url: "https://vistathailand.com",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "02",
    title: "Gography",
    category: "Web Application",
    year: "2024",
    url: "https://gography.com",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "03",
    title: "เช็คช่างก่อนโอน",
    category: "Web Application",
    year: "2023",
    url: "https://checkchaang.com",
    image: "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "04",
    title: "E-Commerce Plus",
    category: "E-Commerce",
    year: "2023",
    url: "https://ecommerceplus.co.th",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80",
  },
  {
    num: "05",
    title: "HR Connect",
    category: "Mobile App",
    year: "2023",
    url: "https://hrconnect.app",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
];

const cardBackgrounds = ["bg-[#eaf0f7]", "bg-[#f0ede8]", "bg-[#e9efeb]", "bg-[#eeeaf5]", "bg-[#e8eff3]"];

function WorkCard({ work, index }: { work: (typeof works)[number]; index: number }) {
  const t = useTranslations("recent");
  const category = work.category === "website" ? t("website") : work.category;
  const domain = new URL(work.url).hostname;

  return (
    <article className="min-w-0 snap-start">
      <a href={work.url} target="_blank" rel="noopener noreferrer" className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">
        <div className={`relative overflow-hidden rounded-2xl p-4 pb-0 transition-colors sm:p-5 sm:pb-0 ${cardBackgrounds[index % cardBackgrounds.length]}`}>
          <div className="mb-5 flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-slate-500">/{work.num}</span>
            <span className="rounded-full border border-white/80 bg-white/60 px-2.5 py-1 text-[10px] font-medium text-slate-600">{category}</span>
          </div>
          <div className="overflow-hidden rounded-t-lg border border-white/80 bg-white shadow-[0_8px_24px_-8px_rgba(23,32,58,0.2)] transition-transform duration-500 group-hover:-translate-y-2 group-focus-visible:-translate-y-2 motion-reduce:transform-none motion-reduce:transition-none">
            <div className="flex h-7 items-center gap-2 border-b border-slate-100 bg-white px-2.5">
              <div className="flex gap-1" aria-hidden="true">
                <span className="size-1.5 rounded-full bg-[#f0aca4]" />
                <span className="size-1.5 rounded-full bg-[#ebd29b]" />
                <span className="size-1.5 rounded-full bg-[#b1cdb6]" />
              </div>
              <span className="min-w-0 flex-1 truncate text-center text-[8px] text-slate-400">{domain}</span>
              <Globe className="size-2.5 text-slate-300" aria-hidden="true" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <Image src={work.image} alt={work.title} fill sizes="(min-width: 1280px) 260px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 85vw" className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none" />
              <div className="absolute inset-0 bg-[#17203a]/0 transition-colors group-hover:bg-[#17203a]/15" />
              <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-white text-[#17203a] shadow-sm transition-colors group-hover:bg-brand-blue group-hover:text-white">
                <span className="sr-only">{t("visit")}</span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start justify-between gap-3 px-1 pb-1 pt-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-[#17203a] transition-colors group-hover:text-brand-blue">{work.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{category} <span className="mx-1 text-slate-300" aria-hidden="true">/</span> {work.year}</p>
          </div>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-slate-400 transition-colors group-hover:text-brand-blue" aria-hidden="true" />
        </div>
      </a>
    </article>
  );
}

export default function RecentWorkSection() {
  const t = useTranslations("recent");
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ left: false, right: false, progress: 0 });

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollState({ left: el.scrollLeft > 2, right: el.scrollLeft < max - 2, progress: max > 0 ? Math.max(0, Math.min(1, el.scrollLeft / max)) : 0 });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollState]);

  function scroll(direction: "left" | "right") {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = (card?.offsetWidth ?? el.clientWidth) + gap;
    el.scrollBy({ left: direction === "right" ? step : -step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <section aria-labelledby="recent-work-title" className="overflow-hidden bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
              <span className="h-1.5 w-6 rounded-full bg-brand-blue" aria-hidden="true" />
              Recent Work
            </p>
            <h2 id="recent-work-title" className="mt-4 text-3xl font-semibold tracking-tight text-[#17203a] sm:text-4xl">{t("title")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">{t("subtitle")}</p>
          </div>
          <Link href="/portfolio" className="inline-flex w-fit shrink-0 items-center gap-3 rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-[#17203a] transition-colors hover:border-[#17203a] hover:bg-[#17203a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">
            {t("all")}<ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div ref={trackRef} onScroll={updateScrollState} role="region" aria-label={t("title")} tabIndex={0} className="grid auto-cols-[85%] grid-flow-col snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[calc((100%_-_1rem)/2)] lg:auto-cols-[calc((100%_-_3.75rem)/4)] lg:gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">
          {works.map((work, index) => <WorkCard key={work.num} work={work} index={index} />)}
        </div>

        <div className="mt-5 flex items-center justify-between gap-6 border-t border-slate-100 pt-5">
          <div aria-hidden="true" className="h-0.5 w-28 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/3 rounded-full bg-[#17203a]" style={{ transform: `translateX(${scrollState.progress * 200}%)` }} />
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => scroll("left")} disabled={!scrollState.left} aria-label={t.has("prev") ? t("prev") : `${t("title")} — Previous projects`} className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-[#17203a] transition-colors hover:bg-[#17203a] hover:text-white disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"><ChevronLeft className="size-4" aria-hidden="true" /></button>
            <button type="button" onClick={() => scroll("right")} disabled={!scrollState.right} aria-label={t.has("next") ? t("next") : `${t("title")} — Next projects`} className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-[#17203a] transition-colors hover:bg-[#17203a] hover:text-white disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"><ChevronRight className="size-4" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
