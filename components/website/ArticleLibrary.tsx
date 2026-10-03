"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Clock3, Search, X } from "lucide-react";
import type { BlogPost } from "@/lib/blogData";

export default function ArticleLibrary({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("articlePage");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("latest");
  const categories = [...new Set(posts.map((post) => post.category))];
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const search = query.trim().toLocaleLowerCase();
  const filtered = posts.filter((post) => (!category || post.category === category) && (!search || `${post.title} ${post.excerpt} ${post.category}`.toLocaleLowerCase().includes(search)));
  if (sort === "popular") filtered.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));

  function reset() {
    setQuery("");
    setCategory(null);
    setSort("latest");
  }

  return (
    <>
      {featured && (
        <section aria-label={t("featured")} className="mb-10">
          <Link href={`/article/${featured.slug}`} className="group grid overflow-hidden rounded-2xl bg-[#17203a] text-white sm:grid-cols-[1.05fr_1fr] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">
            <div className="relative aspect-[2/1] overflow-hidden bg-slate-800 sm:aspect-auto sm:min-h-[260px]">
              {featured.image && <Image src={featured.image} alt="" fill sizes="(min-width: 1280px) 620px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none" />}
              <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#17203a]">{t("featured")}</span>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-7 lg:px-9">
              <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200"><span>{featured.category}</span><span className="h-3 w-px bg-white/20" aria-hidden="true" /><span className="inline-flex items-center gap-1.5 text-slate-300"><Clock3 className="size-3.5" aria-hidden="true" />{featured.readTime}</span></div>
              <h2 className="mt-3 text-xl font-semibold leading-relaxed lg:text-2xl">{featured.title}</h2><p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-300">{featured.excerpt}</p>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4"><span className="text-xs text-slate-400">{featured.date}</span><span className="inline-flex items-center gap-2 text-sm font-medium text-white">{t("read")}<ArrowUpRight className="size-4" aria-hidden="true" /></span></div>
            </div>
          </Link>
        </section>
      )}

      <section aria-labelledby="article-library-title">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 id="article-library-title" className="text-xl font-semibold sm:text-2xl">{t("library")}</h2>
          <div className="relative w-full sm:w-80"><label htmlFor="article-search" className="sr-only">{t("searchLabel")}</label><Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input id="article-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-blue-100 [&::-webkit-search-cancel-button]:hidden" />{query && <button type="button" onClick={() => setQuery("")} aria-label={t("clearSearch")} className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-blue"><X className="size-3.5" aria-hidden="true" /></button>}</div>
        </div>
        <div role="group" aria-label={t("library")} className="mt-5 flex flex-wrap gap-2 border-b border-slate-200 pb-5">
          {[null, ...categories].map((item) => <button key={item ?? "all"} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${category === item ? "border-[#17203a] bg-[#17203a] text-white" : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-brand-blue"}`}>{item ?? t("all")}</button>)}
        </div>
        <div className="my-5 flex items-center justify-between gap-3"><p role="status" aria-live="polite" aria-atomic="true" className="text-xs text-slate-500">{t("results", { count: filtered.length })}</p><div><label htmlFor="article-sort" className="sr-only">{t("sortLabel")}</label><select id="article-sort" value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 focus:outline-2 focus:outline-brand-blue"><option value="latest">{t("latest")}</option><option value="popular">{t("popular")}</option></select></div></div>

        {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((post) => <article key={post.slug} className="min-w-0"><Link href={`/article/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_12px_32px_-20px_rgba(23,32,58,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue motion-reduce:transform-none">
            <div className="relative aspect-[1.8/1] overflow-hidden rounded-xl bg-slate-100">{post.image && <Image src={post.image} alt="" fill sizes="(min-width: 1280px) 290px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />}</div>
            <div className="flex flex-1 flex-col px-1 pb-1 pt-4"><div className="flex flex-wrap items-center justify-between gap-2 text-[10px]"><span className="font-semibold text-brand-blue">{post.category}</span><span className="flex items-center gap-1 text-slate-500"><Clock3 className="size-3" aria-hidden="true" />{post.readTime}</span></div><h3 className="mt-3 line-clamp-2 text-base font-semibold leading-relaxed text-[#17203a] transition-colors group-hover:text-brand-blue">{post.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.excerpt}</p><div className="mt-auto pt-5"><div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3"><div className="min-w-0"><p className="truncate text-[10px] font-medium text-slate-600">{post.author}</p><p className="mt-1 text-[10px] text-slate-400">{post.date}</p></div><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#17203a] text-white transition-colors group-hover:bg-brand-blue"><span className="sr-only">{t("read")}</span><ArrowUpRight className="size-3.5" aria-hidden="true" /></span></div></div></div>
          </Link></article>)}
        </div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><Search className="mx-auto size-7 text-slate-300" aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold">{t("emptyTitle")}</h3><p className="mt-2 text-sm text-slate-500">{t("emptyDesc")}</p><button type="button" onClick={reset} className="mt-5 rounded-full bg-[#17203a] px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">{t("reset")}</button></div>}
      </section>
    </>
  );
}
