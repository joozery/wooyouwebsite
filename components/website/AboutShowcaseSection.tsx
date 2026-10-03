import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

function ShowcaseFrame({ position, className }: { position: string; className: string }) {
  return (
    <div className={`absolute overflow-hidden rounded-xl border border-white/90 bg-white shadow-[0_28px_60px_-20px_rgba(23,32,58,0.25)] ${className}`}>
      <div className="flex h-6 items-center gap-1 border-b border-slate-100 bg-white px-2.5 sm:h-7">
        <span className="size-1.5 rounded-full bg-slate-200" /><span className="size-1.5 rounded-full bg-slate-200" /><span className="size-1.5 rounded-full bg-slate-200" />
        <div className="mx-auto h-2 w-1/3 rounded-full bg-slate-100" />
      </div>
      <div className="relative aspect-[4/3] overflow-hidden bg-blue-50">
        <Image src="/navbaricon/work.png" alt="" fill sizes="(min-width: 1280px) 380px, (min-width: 640px) 32vw, 44vw" className={`object-cover ${position}`} />
      </div>
    </div>
  );
}

export default async function AboutShowcaseSection() {
  const t = await getTranslations("aboutShowcase");
  return (
    <section aria-labelledby="about-showcase-title" className="relative isolate overflow-hidden bg-[#f4f5f6] pt-12 sm:pt-16 lg:pt-20">
      <div className="relative z-10 mx-auto max-w-2xl px-5 text-center sm:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-blue sm:text-xs">Designing every business.</p>
        <h2 id="about-showcase-title" className="mx-auto mt-4 max-w-xl text-2xl font-semibold leading-relaxed tracking-tight text-[#17203a] sm:text-3xl">{t("title")}</h2>
        <div className="mx-auto mt-5 max-w-lg space-y-3 text-sm leading-7 text-slate-500"><p>{t("lead")}</p><p>{t("body")}</p><p className="text-slate-600">{t("closing")}</p></div>
        <Link href="/portfolio" className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#17203a] px-5 py-3 text-xs font-medium text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">{t("cta")}<ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>
      </div>
      <div aria-hidden="true" className="pointer-events-none relative mx-auto mt-8 h-[260px] max-w-7xl sm:mt-10 sm:h-[350px] lg:mt-8 lg:h-[420px]">
        <ShowcaseFrame position="object-left" className="left-[-5%] top-4 z-10 w-[44%] rotate-[-6deg] sm:left-[1%] sm:top-5 sm:w-[32%] lg:left-[3%] lg:top-5 lg:w-[30%]" />
        <ShowcaseFrame position="object-right" className="right-[-5%] top-4 z-10 w-[44%] rotate-[6deg] sm:right-[1%] sm:top-5 sm:w-[32%] lg:right-[3%] lg:top-5 lg:w-[30%]" />
        <div className="absolute bottom-6 left-1/2 z-0 w-48 -translate-x-1/2 sm:bottom-8 sm:w-64 lg:bottom-8 lg:w-80">
          <Image src="/navbaricon/intern.png" alt="" width={1312} height={1199} sizes="(min-width: 1024px) 320px, (min-width: 640px) 256px, 192px" className="h-auto w-full object-contain" />
        </div>
        <ShowcaseFrame position="object-center" className="bottom-5 left-[1%] z-20 w-[36%] rotate-[4deg] sm:bottom-7 sm:left-[10%] sm:w-[27%] lg:bottom-8 lg:left-[14%] lg:w-[26%]" />
        <ShowcaseFrame position="object-[70%_center]" className="bottom-5 right-[1%] z-20 w-[36%] rotate-[-4deg] sm:bottom-7 sm:right-[10%] sm:w-[27%] lg:bottom-8 lg:right-[14%] lg:w-[26%]" />
      </div>
    </section>
  );
}
