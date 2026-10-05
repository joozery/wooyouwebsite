import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, Code2, MessagesSquare, CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import CustomerDirectory from "@/components/website/CustomerDirectory";

const container = "mx-auto max-w-6xl px-5 sm:px-6";
const eyebrow = "text-[10px] font-semibold tracking-[0.2em] text-blue-600";
const heading = "mt-2 text-2xl font-semibold leading-relaxed tracking-tight sm:text-3xl";
const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";
const projects = [
  { id: "sistomat", title: "Sistomat", subtitle: "Custom ERP Development", image: "/port/03.png", category: "ERP & SYSTEM" },
  { id: "gography", title: "Gography", subtitle: "Tour & Booking Platform", image: "/port/01.png", category: "WEB PLATFORM" },
  { id: "sacit", title: "SACIT Symposium", subtitle: "Event Website & Digital Experience", image: "/port/02.png", category: "WEBSITE" },
];

export async function generateMetadata() {
  const t = await getTranslations("customerPage");
  return { title: `${t("title")} | Wooyou Creative`, description: t("intro") };
}

export default async function CustomerPage() {
  const t = await getTranslations("customerPage");
  const about = await getTranslations("about");
  const portfolio = await getTranslations("portfolioPage");
  const pillars = [{ Icon: MessagesSquare, title: "Understand", body: about("p1B") }, { Icon: Code2, title: "Build", body: about("p3B") }, { Icon: ChartNoAxesCombined, title: "Grow", body: about("p4B") }];

  return (
    <main className="bg-white text-[#10112c]">
      <section className="relative isolate overflow-hidden bg-[#f4f8ff] pt-28 pb-12 sm:pt-32 sm:pb-14 lg:min-h-[420px]">
        <Image src="/partner.png" alt="" fill preload sizes="100vw" className="-z-10 object-cover object-center" />
        <div className={container}>
          <div className="max-w-[78%] sm:max-w-[65%] md:max-w-[48%]">
            <p className={eyebrow}>OUR CLIENTS</p>
            <h1 className="mt-3 text-3xl leading-[1.4] font-bold tracking-tight sm:text-4xl lg:text-5xl"><span className="text-blue-600">{t("titleBlue")}</span>{t("titleRest")}</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">{t("intro")}</p>
            <a href="#customer-directory" className={`mt-5 inline-flex min-h-11 items-center gap-3 rounded-full border border-blue-300 bg-white/80 px-5 text-xs font-medium ${focus}`}>{t("directory")}<ArrowRight aria-hidden="true" className="size-4 text-blue-600" /></a>
          </div>
        </div>
      </section>

      <CustomerDirectory />

      <section aria-labelledby="partnership-title" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-[#f8fbff] to-blue-100/60 py-9 sm:py-12">
        <div className={`${container} relative`}>
          <p className={eyebrow}>BUILT ON PARTNERSHIP</p>
          <div className="mt-3 grid gap-5 md:grid-cols-2 md:items-center md:gap-10">
            <h2 id="partnership-title" className="text-2xl font-semibold leading-relaxed tracking-tight sm:text-3xl">{t("partnershipTitle")}<br /><span className="text-blue-600">{t("partnershipAccent")}</span></h2>
            <p className="text-sm leading-7 text-slate-600 md:border-l md:border-blue-200 md:pl-7">{t("partnershipBody")}</p>
          </div>
          <div className="mt-7 grid gap-6 sm:grid-cols-3 md:max-w-[78%]">
            {pillars.map(({ Icon, title, body }) => <div key={title} className="sm:border-l sm:border-blue-200 sm:pl-5 sm:first:border-0 sm:first:pl-0"><Icon aria-hidden="true" className="size-6 text-blue-600" strokeWidth={1.5} /><h3 className="mt-3 text-base font-semibold">{title}</h3><p className="mt-2 text-xs leading-6 text-slate-600">{body}</p></div>)}
          </div>
          <Image src="/navbaricon/service.webp" alt="" width={700} height={567} sizes="180px" className="pointer-events-none absolute -right-5 -bottom-10 hidden w-44 md:block" />
        </div>
      </section>

      <section aria-labelledby="customer-projects-title" className="pt-8 sm:pt-10">
        <div className={`${container} pb-5`}><p className={eyebrow}>FEATURED CUSTOMERS</p><div className="flex flex-wrap items-end justify-between gap-3"><h2 id="customer-projects-title" className={heading}>{t("featured")}</h2><Link href="/portfolio" className={`inline-flex min-h-10 items-center gap-2 text-xs text-blue-600 ${focus}`}>{portfolio("allWorks")}<ArrowRight aria-hidden="true" className="size-4" /></Link></div></div>
        {projects.map((project, index) => (
          <article key={project.id} className={index % 2 ? "bg-white" : "bg-gradient-to-r from-[#f7faff] to-[#edf4ff]"}>
            <div className={`${container} grid items-center gap-6 py-8 md:min-h-[320px] md:grid-cols-2 md:gap-10`}>
              <div className={index % 2 ? "md:order-2" : ""}>
                <p className="flex items-center gap-5 text-[10px] font-semibold tracking-[0.2em]"><span className="font-mono text-slate-500">0{index + 1}</span><span className="text-blue-700">{project.category}</span></p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight">{project.title}</h3><p className="mt-2 text-base font-medium">{project.subtitle}</p><p className="mt-3 max-w-md text-sm leading-7 text-slate-600">{portfolio(`descriptions.${project.id}`)}</p>
                <Link href="/portfolio" className={`mt-4 inline-flex min-h-11 items-center gap-3 text-xs font-medium ${focus}`}><span className="flex size-10 items-center justify-center rounded-full border border-blue-300 text-blue-600"><ArrowRight aria-hidden="true" className="size-4" /></span>{portfolio("viewProject")}</Link>
              </div>
              <div className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_15px_45px_-15px_rgba(15,23,42,0.2)] ${index % 2 ? "md:order-1 md:-rotate-2" : "md:rotate-2"}`}>
                <div aria-hidden="true" className="flex h-6 items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3"><span className="size-1.5 rounded-full bg-red-300" /><span className="size-1.5 rounded-full bg-amber-300" /><span className="size-1.5 rounded-full bg-emerald-300" /></div>
                <div className="relative aspect-video"><Image src={project.image} alt={project.title} fill sizes="(min-width: 1024px) 520px, (min-width: 768px) 45vw, 90vw" className="object-contain" /></div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="py-9 sm:py-12">
        <div className={container}><p className={eyebrow}>WORKING TOGETHER</p><h2 className={heading}>{t("careTitle")}</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{["missionB", "valuesB", "p4B"].map((key) => <div key={key} className="rounded-xl border border-blue-100 p-5"><CheckCircle2 aria-hidden="true" className="size-5 text-blue-500" /><p className="mt-3 text-sm leading-7 text-slate-600">{about(key)}</p></div>)}</div></div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#f3f7ff] py-9 sm:py-12">
        <Image src="/coeve.png" alt="" fill sizes="100vw" className="-z-10 object-cover object-right" />
        <div className={container}><div className="max-w-[80%] md:max-w-[48%]"><p className={eyebrow}>LET’S BUILD YOUR NEXT STORY</p><h2 className={heading}>{t("ctaTitle")}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{t("ctaBody")}</p><Link href="/contact" className={`mt-5 inline-flex min-h-11 items-center gap-3 rounded-full bg-blue-600 px-6 text-xs font-medium text-white hover:bg-blue-700 ${focus}`}>{about("cta2")}<ArrowRight aria-hidden="true" className="size-4" /></Link></div></div>
      </section>
    </main>
  );
}
