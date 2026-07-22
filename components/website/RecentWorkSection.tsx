import Link from "next/link";
import { ArrowRight } from "lucide-react";

const works = [
  {
    title: "Vista Thailand",
    category: "เว็บไซต์",
    tags: ["React", "UI/UX", "Responsive"],
    gradient: "from-brand-blue/30 to-brand-cyan/20",
  },
  {
    title: "Gography",
    category: "Web Application",
    tags: ["React", "Node.js", "MongoDB"],
    gradient: "from-brand-purple/30 to-brand-pink/20",
  },
  {
    title: "เช็คช่างก่อนโอน",
    category: "Web Application",
    tags: ["React", "Firebase", "UX"],
    gradient: "from-brand-teal/30 to-brand-blue/20",
  },
];

export default function RecentWorkSection() {
  return (
    <section className="bg-canvas py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold tracking-[1.5px] text-brand-cyan uppercase">
              Recent Work
            </span>
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.02em] text-ink md:text-5xl">
              ผลงานล่าสุด
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-opacity hover:opacity-70"
          >
            ดูผลงานทั้งหมด
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {works.map((work) => (
            <Link
              key={work.title}
              href="/portfolio"
              className="group overflow-hidden rounded-3xl border border-hairline bg-surface-soft transition-transform duration-300 hover:-translate-y-1"
            >
              <div
                className={`flex h-52 items-center justify-center bg-gradient-to-br ${work.gradient}`}
              >
                <span className="text-2xl font-medium tracking-tight text-ink/80">
                  {work.title}
                </span>
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold tracking-[1.5px] text-muted-soft uppercase">
                  {work.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-ink">
                  {work.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-blue/15 px-3 py-1 text-xs font-medium text-brand-cyan"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
