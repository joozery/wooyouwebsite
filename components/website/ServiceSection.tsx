import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ServiceCards from "./ServiceCards";

export default async function ServiceSection() {
  const t = await getTranslations("services");
  return (
    <section id="our-services" aria-labelledby="home-services-title" className="scroll-mt-24 relative isolate overflow-clip border-t border-slate-100 bg-white py-12 text-slate-900 sm:py-16 lg:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="sticky top-0 h-dvh w-full bg-cover bg-center" style={{ backgroundImage: "url('/motion01-poster.jpg')" }}>
          <video autoPlay muted loop playsInline preload="metadata" poster="/motion01-poster.jpg" className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden">
            <source src="/motion01.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/40" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 md:flex-row md:items-end md:gap-12">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-blue-600"><span aria-hidden="true" className="h-px w-7 bg-blue-600" />WHAT WE DO</p>
            <h2 id="home-services-title" className="mt-3 text-3xl font-semibold leading-relaxed tracking-tight sm:text-4xl lg:text-5xl">{t("title")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">{t("subtitle")}</p>
          </div>
          <Link href="/service" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 self-start rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 md:self-auto">{t("viewAll")}<ArrowUpRight aria-hidden="true" className="size-4" /></Link>
        </div>
        <ServiceCards />
      </div>
    </section>
  );
}
