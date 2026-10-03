import AboutShowcaseGallery from "./AboutShowcaseGallery";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function AboutShowcaseSection() {
  const t = await getTranslations("aboutShowcase");
  return (
    <section aria-labelledby="about-showcase-title" className="relative isolate overflow-hidden bg-[#f4f5f6] pt-12 sm:pt-16 lg:pt-20">
      <div className="relative z-10 mx-auto max-w-2xl px-5 text-center sm:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-blue sm:text-xs">Designing every business.</p>
        <h2 id="about-showcase-title" className="mx-auto mt-4 max-w-xl text-2xl font-semibold leading-relaxed tracking-tight text-[#17203a] sm:text-3xl">{t("title")}</h2>
        <div className="mx-auto mt-5 max-w-lg space-y-3 text-sm leading-7 text-slate-600">
          {(["lead", "body", "closing"] as const).map((key) => (
            <p key={key}>{t(key)}</p>
          ))}
        </div>
        <Link href="/portfolio" className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#17203a] px-5 py-3 text-xs font-medium text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">{t("cta")}<ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>
      </div>
      <AboutShowcaseGallery />
    </section>
  );
}
