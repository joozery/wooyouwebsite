import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/blogData";

const categoryColors: Record<string, string> = {
  "Web Development": "bg-brand-blue/15 text-brand-cyan",
  "ERP Systems": "bg-brand-orange/15 text-brand-orange",
  "Digital Marketing": "bg-brand-teal/15 text-brand-teal",
};

export default function BlogSection() {
  return (
    <section className="bg-canvas py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold tracking-[1.5px] text-brand-pink uppercase">
              Blog
            </span>
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.02em] text-ink md:text-5xl">
              บทความล่าสุด
            </h2>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/article/${post.slug}`}
              className="group flex flex-col rounded-3xl border border-hairline bg-surface-soft p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  categoryColors[post.category] ??
                  "bg-brand-lavender/15 text-brand-lavender"
                }`}
              >
                {post.category}
              </span>
              <h3 className="mt-5 text-lg leading-snug font-semibold text-ink">
                {post.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-body-soft">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between text-xs text-muted-soft">
                <span>{post.readTime}</span>
                <ArrowRight className="size-4 text-ink opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
