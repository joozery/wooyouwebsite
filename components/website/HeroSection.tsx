"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("hero");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (preference.matches) video.pause();
      else void video.play().catch(() => {});
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-white pt-28 text-[#17203a] sm:pt-32 lg:flex lg:min-h-[640px] lg:items-center lg:py-28 xl:min-h-[720px]">
      <div className="relative z-20 mx-auto w-full max-w-7xl px-5 sm:px-6">
        <div className="max-w-xl lg:w-[44%]">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-blue sm:text-xs">
            <span className="h-px w-8 bg-brand-blue" aria-hidden="true" />
            Creative minds. Digital solutions.
          </p>
          <h1 id="hero-title" className="mt-6 text-4xl font-semibold leading-[1.3] tracking-tight sm:text-5xl xl:text-[58px]">
            {t("title")}<br />
            <span className="text-brand-blue">{t("highlight")}</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{t("description")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-4 rounded-full bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300">
              {t("contact")}<ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/portfolio" className="inline-flex items-center gap-4 rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-medium text-[#17203a] transition-colors hover:border-blue-200 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300">
              {t("portfolio")}<ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 pt-5 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:text-xs">
            <span>Web Development</span><span>ERP Systems</span><span>Digital Marketing</span>
          </div>
        </div>
      </div>

      <div className="relative mt-6 aspect-video w-full lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:aspect-auto lg:w-[67%]">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster="/motionhero/motionmiji-poster.jpg"
          aria-label={t("videoLabel")}
          className="h-full w-full object-cover object-center"
        >
          <source src="/motionhero/motionmiji.mp4" type="video/mp4" />
          {t("videoFallback")}
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent lg:bg-gradient-to-r lg:from-white lg:from-0% lg:via-white/90 lg:via-15% lg:to-transparent lg:to-45%" />

      </div>
    </section>
  );
}
