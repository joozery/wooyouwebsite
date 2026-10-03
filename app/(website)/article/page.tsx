import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ArticleLibrary from "@/components/website/ArticleLibrary";
import { blogPosts } from "@/lib/blogData";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("articlePage");
  const nav = await getTranslations("nav");
  return { title: `${nav("article")} | Wooyou Creative`, description: t("metaDescription") };
}

export default async function ArticleIndexPage() {
  const t = await getTranslations("articlePage");
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fa] text-[#17203a]">
      <header className="relative overflow-hidden border-b border-slate-200/70 bg-white pb-10 pt-28 sm:pb-12 sm:pt-32">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 size-[440px] rounded-full border-[65px] border-blue-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue"><span className="h-1.5 w-6 rounded-full bg-brand-blue" aria-hidden="true" />Insights & Ideas</p>
          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><h1 className="text-3xl font-semibold leading-[1.4] tracking-tight sm:text-4xl lg:text-5xl">{t("title")}<br /><span className="text-brand-blue">{t("highlight")}</span></h1><p className="max-w-md text-sm leading-7 text-slate-500 sm:text-base sm:leading-8 lg:pb-1">{t("intro")}</p></div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10"><ArticleLibrary posts={blogPosts} /></div>
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16"><div className="flex flex-col justify-between gap-6 rounded-2xl bg-[#17203a] p-6 text-white sm:flex-row sm:items-center sm:p-8"><div><h2 className="text-xl font-semibold">{t("contactTitle")}</h2><p className="mt-2 text-sm leading-7 text-slate-300">{t("contactDesc")}</p></div><Link href="/contact" className="inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#17203a] transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300">{t("contactAction")}<ArrowUpRight className="size-4" aria-hidden="true" /></Link></div></section>
    </main>
  );
}
