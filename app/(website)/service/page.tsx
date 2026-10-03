import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Headphones, Layers3, Lightbulb, MessagesSquare, PencilLine, Rocket, Box } from "lucide-react";
import { getTranslations } from "next-intl/server";

const services = [
  { slug: "web-development", title: "Web Development", image: "/navbaricon/webdevelopment-cutout.webp" },
  { slug: "ui-ux-design", title: "UI/UX Design", image: "/navbaricon/uxui-cutout.webp" },
  { slug: "digital-marketing", title: "Digital Marketing", image: "/navbaricon/digitalmarketing-cutout.webp" },
  { slug: "erp-systems", title: "ERP & Business Systems", image: "/navbaricon/erp.webp" },
  { slug: "game-development", title: "Game Development", image: "/navbaricon/game.webp" },
  { slug: "mobile-apps", title: "Mobile App Development", image: "/navbaricon/mobileapp.webp" },
];
const works = [
  { image: "/port/01.png", title: "GOGRAPHY", detail: "Website · Travel · Booking" },
  { image: "/port/02.png", title: "SACIT Symposium", detail: "Website · Event" },
  { image: "/port/03.png", title: "SISTOMAT", detail: "ERP · Business Systems" },
  { image: "/port/04.png", title: "CAR AWAY", detail: "Website · Automotive" },
];
const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600";
const container = "mx-auto max-w-6xl px-5 sm:px-6";
const eyebrow = "text-[10px] font-semibold tracking-[0.2em] text-blue-600";
const heading = "mt-2 text-2xl font-semibold leading-relaxed tracking-tight sm:text-3xl";
const primaryButton = `inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-medium text-white shadow-[0_6px_18px_-6px_rgba(37,99,235,0.4)] transition-colors hover:bg-blue-700 ${focusStyle}`;
const secondaryButton = `inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-blue-200 bg-white/80 px-5 py-2.5 text-xs font-medium text-slate-900 transition-colors hover:bg-blue-50 ${focusStyle}`;

export async function generateMetadata() {
  const t = await getTranslations("services");
  return { title: `${t("title")} | Wooyou Creative`, description: t("subtitle") };
}

export default async function ServicePage() {
  const t = await getTranslations("services");
  const page = await getTranslations("servicePage");
  const about = await getTranslations("about");
  const whyItems = [
    { Icon: Lightbulb, title: page("whyDesign"), body: about("p1B") },
    { Icon: Layers3, title: page("whyCustom"), body: about("p3B") },
    { Icon: Headphones, title: page("whySupport"), body: about("p4B") },
  ];
  const steps = [
    { Icon: MessagesSquare, title: "Discover", body: about("p1B") },
    { Icon: PencilLine, title: "Design", body: about("p2B") },
    { Icon: Box, title: "Develop", body: page("developBody") },
    { Icon: CheckCircle2, title: "Test", body: page("testBody") },
    { Icon: Rocket, title: "Launch", body: about("p4B") },
  ];

  return (
    <main className="bg-white text-[#10112c]">
      <h1 className="sr-only">{t("title")}</h1>
      <section aria-label={t("title")} className="bg-white pt-14">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="block h-[240px] w-full object-cover object-center sm:h-[340px] lg:h-[460px]"
        >
          <source src="/servicemo/servicemotion.mp4" type="video/mp4" />
        </video>
      </section>

      <section id="service-list" aria-labelledby="service-list-title" className="scroll-mt-20 py-8 sm:py-10">
        <div className={container}>
          <p className={eyebrow}>WHAT WE DO</p>
          <h2 id="service-list-title" className={heading}>{t("title")}</h2>
          <p className="mt-1 text-sm leading-7 text-slate-500">{t("subtitle")}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link key={service.slug} href={`/service/${service.slug}`} className={`group rounded-2xl border border-blue-100/80 bg-gradient-to-b from-[#f8fbff] to-white p-4 shadow-[0_3px_14px_-8px_rgba(37,99,235,0.12)] transition-colors hover:border-blue-300 ${focusStyle}`}>
                <div className="relative flex h-36 items-center justify-center sm:h-40">
                  <Image src={service.image} alt="" width={320} height={260} sizes="(min-width: 1024px) 280px, (min-width: 640px) 40vw, 80vw" className="h-full w-full object-contain transition-transform duration-500 motion-safe:group-hover:scale-105" />
                </div>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div><h3 className="text-sm font-semibold sm:text-base">{service.title}</h3><p className="mt-1.5 text-xs leading-6 text-slate-500">{t(`desc.${service.slug}`)}</p></div>
                  <span className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-blue-200 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white"><ArrowRight aria-hidden="true" className="size-3.5" /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="service-why-title" className="overflow-hidden bg-gradient-to-r from-[#edf4ff] via-[#f8fbff] to-white">
        <div className={`${container} grid items-center gap-5 pt-7 md:grid-cols-[0.65fr_1.35fr] md:gap-8 md:pt-0`}>
          <div className="order-2 mx-auto max-w-[260px] md:order-1 md:max-w-none md:self-end">
            <Image src="/navbaricon/intern.png" alt="" width={1312} height={1199} sizes="(min-width: 768px) 340px, 260px" className="h-auto w-full" />
          </div>
          <div className="order-1 md:order-2 md:py-9">
            <p className={eyebrow}>WHY WOO YOU</p>
            <h2 id="service-why-title" className={`${heading} max-w-xl`}>{page("whyTitle")}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {whyItems.map(({ Icon, title, body }) => (
                <div key={title} className="sm:border-l sm:border-blue-100 sm:pl-4 sm:first:border-0 sm:first:pl-0">
                  <span className="flex size-10 items-center justify-center rounded-full bg-blue-100/70 text-blue-600"><Icon aria-hidden="true" className="size-5" strokeWidth={1.5} /></span>
                  <h3 className="mt-3 text-sm font-semibold">{title}</h3><p className="mt-1.5 text-xs leading-6 text-slate-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="service-process-title" className="py-8 sm:py-10">
        <div className={container}>
          <p className={eyebrow}>OUR PROCESS</p>
          <h2 id="service-process-title" className={heading}>{about("processT")}</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {steps.map(({ Icon, title, body }, index) => (
              <li key={title} className="relative">
                {index < steps.length - 1 && <div aria-hidden="true" className="absolute top-6 right-[-20px] left-12 hidden h-px bg-blue-200 lg:block" />}
                <span className="relative flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Icon aria-hidden="true" className="size-5" strokeWidth={1.5} /></span>
                <p aria-hidden="true" className="mt-3 font-mono text-[10px] text-slate-400">0{index + 1}</p>
                <h3 className="mt-1 text-sm font-semibold">{title}</h3><p className="mt-1 max-w-52 text-xs leading-6 text-slate-500">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="service-works-title" className="bg-gradient-to-b from-[#f8fbff] to-white py-8 sm:py-10">
        <div className={container}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className={eyebrow}>FEATURED WORKS</p><h2 id="service-works-title" className={heading}>{page("worksTitle")}</h2></div>
            <Link href="/portfolio" className={`inline-flex min-h-10 items-center gap-2 text-xs font-medium text-blue-600 ${focusStyle}`}>{page("viewWorks")}<ArrowRight aria-hidden="true" className="size-3.5" /></Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {works.map((work) => (
              <Link key={work.title} href="/portfolio" className={`group overflow-hidden rounded-2xl border border-blue-100/70 bg-white transition-colors hover:border-blue-300 ${focusStyle}`}>
                <div className="relative aspect-video overflow-hidden"><Image src={work.image} alt="" fill sizes="(min-width: 1024px) 270px, 45vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /></div>
                <div className="p-3"><h3 className="text-xs font-semibold">{work.title}</h3><p className="mt-1 text-[10px] leading-5 text-slate-500">{work.detail}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#f3f7ff]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 hidden md:block"><Image src="/coeve.png" alt="" fill sizes="100vw" className="object-cover object-right" /><div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 via-40% to-transparent to-75%" /></div>
        <div className={`${container} py-9 sm:py-12`}>
          <div className="max-w-lg md:max-w-[52%]">
            <p className={eyebrow}>READY TO START?</p><h2 className={heading}>{page("ctaTitle")}</h2><p className="mt-2 text-sm leading-7 text-slate-600">{page("ctaBody")}</p>
            <div className="mt-5 flex flex-wrap gap-3"><Link href="/contact" className={primaryButton}>{about("cta2")}<ArrowRight aria-hidden="true" className="size-4" /></Link><Link href="/portfolio" className={secondaryButton}>{page("viewWorks")}</Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
