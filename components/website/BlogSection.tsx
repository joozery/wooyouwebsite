"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { blogPosts, type BlogPost } from "@/lib/blogData";

function ArticleCard({ post, index }: { post: BlogPost; index: number }) {
  const t = useTranslations("blog");

  return (
    <article className="min-w-0 snap-start">
      <Link
        href={`/article/${post.slug}`}
        className={`group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-20px_rgba(23,32,58,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue motion-reduce:transform-none motion-reduce:transition-none ${post.featured ? "min-h-[360px] border-[#17203a] bg-[#17203a]" : "border-slate-200/70 bg-white p-3"}`}
      >
        <div className={post.featured ? "absolute inset-0 -z-10 overflow-hidden" : "relative aspect-[2.2/1] shrink-0 overflow-hidden rounded-xl bg-slate-100"}>
          {post.image && (
            <Image
              src={post.image}
              alt=""
              fill
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
            />
          )}
          {post.featured && <div className="absolute inset-0 bg-gradient-to-t from-[#111b32] via-[#111b32]/85 to-[#111b32]/15" />}
          {post.featured && (
            <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {t("featured")}
            </span>
          )}
        </div>

        <div className={`relative flex min-w-0 flex-1 flex-col ${post.featured ? "justify-end px-6 pb-6 pt-24" : "px-2 pb-2 pt-4"}`}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            <span className={`font-semibold ${post.featured ? "text-blue-200" : "text-brand-blue"}`}>{post.category}</span>
            <span className={`h-3 w-px ${post.featured ? "bg-white/25" : "bg-slate-200"}`} aria-hidden="true" />
            <span className={`flex items-center gap-1.5 ${post.featured ? "text-white/65" : "text-slate-500"}`}>
              <Clock3 className="size-3.5" aria-hidden="true" />
              {post.readTime}
            </span>
          </div>
          <h3 className={`mt-3 line-clamp-2 font-semibold leading-relaxed transition-colors ${post.featured ? "text-xl text-white sm:text-[22px]" : "text-base text-[#17203a] group-hover:text-brand-blue"}`}>
            {post.title}
          </h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${post.featured ? "text-white/70" : "text-slate-500"}`}>
            {post.excerpt}
          </p>
          <div className={post.featured ? "pt-5" : "mt-auto pt-4"}>
            <div className={`flex items-center justify-between gap-3 border-t pt-3 ${post.featured ? "border-white/15" : "border-slate-100"}`}>
              <div className="min-w-0">
                <p className={`truncate text-xs font-medium ${post.featured ? "text-white/85" : "text-slate-700"}`}>{post.author}</p>
                <p className={`mt-1 text-xs ${post.featured ? "text-white/55" : "text-slate-500"}`}>{post.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className={`font-mono text-xs ${post.featured ? "text-white/35" : "text-slate-300"}`}>{String(index + 1).padStart(2, "0")}</span>
                <span className={`flex shrink-0 items-center rounded-full p-2.5 transition-colors ${post.featured ? "bg-white text-[#17203a] group-hover:bg-blue-200" : "bg-[#17203a] text-white group-hover:bg-brand-blue"}`}>
                <span className="sr-only">{t("readArticle")}</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
              </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function BlogSection() {
  const t = useTranslations("blog");
  if (blogPosts.length === 0) return null;

  return (
    <section aria-labelledby="latest-articles-title" className="relative overflow-hidden bg-[#f7f8fa] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <span className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
              <span className="h-1.5 w-6 rounded-full bg-brand-blue" aria-hidden="true" />
              Insights & Ideas
            </span>
            <h2 id="latest-articles-title" className="mt-4 text-3xl font-semibold tracking-tight text-[#17203a] sm:text-4xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-500 sm:max-w-sm">{t("subtitle")}</p>
        </div>

        <div
          role="region"
          aria-label={t("title")}
          tabIndex={0}
          className="grid auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory pb-5 sm:auto-cols-[calc((100%_-_1rem)/2)] lg:auto-cols-[calc((100%_-_3.75rem)/4)] lg:gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
        >
          {blogPosts.map((post, index) => <ArticleCard key={post.slug} post={post} index={index} />)}
        </div>
      </div>
    </section>
  );
}
