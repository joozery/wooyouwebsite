import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowUpRight, CalendarDays, ChevronRight, Clock3, List, Lightbulb } from "lucide-react";
import { getBlogBySlug, getRelatedBlogs } from "@/lib/blogData";
import { blogContent } from "@/lib/blogContent";
import ArticleShare from "@/components/website/ArticleShare";

type ArticleProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();
  return { title: `${post.title} | Wooyou Creative`, description: post.excerpt, openGraph: { title: post.title, description: post.excerpt, type: "article", authors: [post.author], ...(post.image ? { images: [{ url: post.image }] } : {}) } };
}

export default async function ArticleDetailPage({ params }: ArticleProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();
  const t = await getTranslations("articleDetail");
  const content = blogContent[slug];
  const sections = content?.sections ?? [{ id: "overview", title: t("overview"), paragraphs: [post.excerpt] }];
  const related = getRelatedBlogs(slug);

  return (
    <main className="min-h-screen bg-white pb-12 pt-24 text-[#17203a] sm:pb-16 sm:pt-28">
      <article>
        <header className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-7"><ol className="flex flex-wrap items-center gap-2 text-xs leading-6 text-slate-500"><li><Link href="/" className="hover:text-brand-blue">{t("home")}</Link></li><li aria-hidden="true"><ChevronRight className="size-3" /></li><li><Link href="/article" className="hover:text-brand-blue">{t("articles")}</Link></li><li aria-hidden="true"><ChevronRight className="size-3" /></li><li aria-current="page" className="text-brand-blue">{post.category}</li></ol></nav>
          <div className="w-full">
            <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-brand-blue">{post.category}</span>
            <h1 className="mt-4 text-3xl font-semibold leading-[1.5] tracking-tight sm:text-4xl lg:text-[44px]">{post.title}</h1>
            <p className="mt-4 text-base leading-8 text-slate-500">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 py-5">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-slate-500"><span className="font-semibold text-[#17203a]">{post.author}</span><span className="flex items-center gap-2"><CalendarDays className="size-3.5" aria-hidden="true" />{post.date}</span><span className="flex items-center gap-2"><Clock3 className="size-3.5" aria-hidden="true" />{post.readTime}</span></div>
              <ArticleShare />
            </div>
          </div>
          {post.image && <div className="relative mx-auto mt-2 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 sm:aspect-[2.5/1]"><Image src={post.image} alt={post.title} fill preload sizes="(min-width: 1280px) 1232px, 100vw" className="object-cover" /></div>}
        </header>

        <div className="mx-auto mt-10 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          <aside className="lg:col-start-2 lg:row-start-1">
            <div className="space-y-5 lg:sticky lg:top-24">
              <nav aria-labelledby="article-toc-title" className="rounded-2xl border border-slate-200/80 bg-[#f7f8fa] p-5"><h2 id="article-toc-title" className="flex items-center gap-2 text-sm font-semibold"><List className="size-4 text-brand-blue" aria-hidden="true" />{t("contents")}</h2><ol className="mt-4 space-y-3">{sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`} className="flex gap-3 text-xs leading-6 text-slate-500 transition-colors hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"><span className="font-mono text-[10px] text-slate-400">{String(index + 1).padStart(2, "0")}</span><span>{section.title}</span></a></li>)}</ol></nav>
              <div className="rounded-2xl bg-[#17203a] p-5 text-white"><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-200">Let’s work together</span><h2 className="mt-3 text-lg font-semibold leading-relaxed">{t("ctaTitle")}</h2><p className="mt-3 text-xs leading-6 text-slate-300">{t("ctaDesc")}</p><Link href="/contact" className="mt-5 flex items-center justify-between rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-[#17203a] transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300">{t("ctaAction")}<ArrowUpRight className="size-4" aria-hidden="true" /></Link></div>
            </div>
          </aside>

          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <div className="space-y-9">{sections.map((section) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24"><h2 id={`${section.id}-title`} className="text-xl font-semibold leading-relaxed sm:text-2xl">{section.title}</h2><div className="mt-4 space-y-4 text-base leading-8 text-slate-600">{section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>{"bullets" in section && section.bullets && <ul className="mt-5 space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-5">{section.bullets.map((bullet) => <li key={bullet} className="flex items-start gap-3 text-sm leading-7 text-slate-600"><span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-blue" /><span>{bullet}</span></li>)}</ul>}</section>)}</div>
            {content?.takeaway && <section aria-labelledby="article-takeaway-title" className="mt-9 rounded-r-xl border-l-4 border-brand-blue bg-blue-50 px-5 py-6"><h2 id="article-takeaway-title" className="flex items-center gap-2 text-base font-semibold text-[#17203a]"><Lightbulb className="size-4 text-brand-blue" aria-hidden="true" />{t("takeaway")}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{content.takeaway}</p></section>}
            {content?.reference && <div className="mt-6 text-xs leading-6 text-slate-500"><p>{t("references")}</p><a href={content.reference.url} target="_blank" rel="noopener noreferrer" className="text-brand-blue underline underline-offset-2">{content.reference.title}</a></div>}
            <div className="mt-9 rounded-2xl border border-slate-200 p-5"><p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{t("author")}</p><h2 className="mt-2 text-base font-semibold">{post.author}</h2><p className="mt-2 text-sm leading-7 text-slate-500">{t("authorDesc")}</p></div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5"><Link href="/article" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand-blue"><ArrowLeft className="size-3.5" aria-hidden="true" />{t("back")}</Link><ArticleShare /></div>
          </div>
        </div>
      </article>

      <section aria-labelledby="related-articles-title" className="mt-14 border-t border-slate-200 bg-[#f7f8fa] py-10 sm:mt-16 sm:py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h2 id="related-articles-title" className="text-xl font-semibold sm:text-2xl">{t("related")}</h2><p className="mt-2 text-sm leading-7 text-slate-500">{t("relatedDesc")}</p></div><Link href="/article" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-blue hover:underline">{t("allArticles")}<ArrowUpRight className="size-4" aria-hidden="true" /></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <article key={item.slug}><Link href={`/article/${item.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"><div className="relative aspect-[2.2/1] overflow-hidden rounded-xl bg-slate-100">{item.image && <Image src={item.image} alt="" fill sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />}</div><div className="flex flex-1 flex-col p-3"><p className="text-[10px] font-semibold text-brand-blue">{item.category}</p><h3 className="mt-2 line-clamp-2 text-base font-semibold leading-relaxed transition-colors group-hover:text-brand-blue">{item.title}</h3><div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-slate-500"><span>{item.date}</span><ArrowUpRight className="size-4 text-brand-blue" aria-hidden="true" /></div></div></Link></article>)}</div></div></section>
    </main>
  );
}
