import Image from "next/image";
import PortfolioGallery from "@/components/website/PortfolioGallery";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("portfolioPage");
  return { title: `${t("title")} | Wooyou Creative`, description: t("intro") };
}

export default async function PortfolioPage() {
  const t = await getTranslations("portfolioPage");
  return (
    <main className="bg-white text-[#0b1021]">
      <section className="relative isolate overflow-hidden bg-[#f6f9ff] pt-28 sm:pt-32 lg:min-h-[480px]">
        <Image src="/coverwork.png" alt="" fill preload sizes="100vw" className="-z-10 object-cover object-center" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="relative z-10 pb-10 md:max-w-[48%] md:pb-14">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-blue-600 sm:text-xs">OUR PORTFOLIO</p>
            <h1 className="mt-3 text-[clamp(80px,12vw,150px)] leading-[0.95] font-bold tracking-[-0.065em]"><span className="text-blue-600">W</span>orks<span className="sr-only"> — {t("title")}</span></h1>
            <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">{t("intro")}</p>
          </div>
        </div>
      </section>
      <PortfolioGallery />
    </main>
  );
}
