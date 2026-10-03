import Link from "next/link";
import Image from "next/image";
import AboutShowcaseSection from "@/components/website/AboutShowcaseSection";
import { ArrowRight, ArrowUpRight, Eye, Heart, Target } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return { title: `${t("metaTitle")} | Wooyou Creative` };
}

const serviceSlugs = [
  { slug: "web-development", title: "Web Development" },
  { slug: "ui-ux-design", title: "UI/UX Design" },
  { slug: "digital-marketing", title: "Digital Marketing" },
  { slug: "erp-systems", title: "ERP Systems" },
  { slug: "game-development", title: "Game Development" },
  { slug: "mobile-apps", title: "Mobile Apps" },
];

const gradientText =
  "bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a] to-blue-600 bg-clip-text text-transparent";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const sv = await getTranslations("services");

  const pillars = [
    { Icon: Target, title: t("missionT"), body: t("missionB"), accent: "bg-blue-50 text-blue-600" },
    { Icon: Eye, title: t("visionT"), body: t("visionB"), accent: "bg-violet-50 text-violet-600" },
    { Icon: Heart, title: t("valuesT"), body: t("valuesB"), accent: "bg-rose-50 text-rose-600" },
  ];
  const steps = [
    { title: t("p1T"), body: t("p1B") },
    { title: t("p2T"), body: t("p2B") },
    { title: t("p3T"), body: t("p3B") },
    { title: t("p4T"), body: t("p4B") },
  ];

  return (
    <main className="bg-white text-[#0a0a0a]">
      {/* hero */}
      <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="pointer-events-none absolute -left-40 top-10 h-[460px] w-[460px] rounded-full bg-blue-200/50 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-40 h-[380px] w-[380px] rounded-full bg-violet-200/50 blur-[110px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[2px] text-gray-400">
              {t("eyebrow")}
            </span>
            <h1
              className={`mt-4 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl ${gradientText}`}
            >
              Creative Tech
              <br />
              from the Next
              <br />
              Dimension.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-[1.9] text-gray-600 md:text-lg">
              {t("intro")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/service"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0a0a0a] px-7 text-sm font-medium text-white transition-colors hover:bg-[#1f1f1f]"
              >
                {t("cta1")}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-gray-300 px-7 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
              >
                {t("cta2")}
              </Link>
            </div>
          </div>
          <Image
            src="/navbaricon/service.webp"
            alt="Wooyou Creative"
            width={700}
            height={567}
            priority
            className="mx-auto h-auto w-full max-w-[520px]"
          />
        </div>
      </section>

      <AboutShowcaseSection />

      <section aria-labelledby="experience-title" className="border-b border-gray-100 py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-600">{t("experience.eyebrow")}</p>
            <h2 id="experience-title" className="mt-3 text-3xl font-semibold leading-[1.4] tracking-tight sm:text-4xl">
              {t("experience.title")}
            </h2>
            <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">{t("experience.body")}</p>
          </div>
          <dl className="grid grid-cols-2 gap-6 sm:gap-8">
            <div className="border-t-2 border-blue-600 pt-5">
              <dt className="text-sm font-medium text-gray-700">{t("experience.teamLabel")}</dt>
              <dd className="mt-3">
                <span className={`text-6xl font-semibold tracking-tight sm:text-7xl ${gradientText}`}>10</span>
                <span className="ml-2 text-sm text-gray-500">{t("experience.years")}</span>
                <p className="mt-3 text-xs leading-6 text-gray-500 sm:text-sm">{t("experience.teamDetail")}</p>
              </dd>
            </div>
            <div className="border-t-2 border-violet-400 pt-5">
              <dt className="text-sm font-medium text-gray-700">{t("experience.companyLabel")}</dt>
              <dd className="mt-3">
                <span className={`text-6xl font-semibold tracking-tight sm:text-7xl ${gradientText}`}>5</span>
                <span className="ml-2 text-sm text-gray-500">{t("experience.companyYear")}</span>
                <p className="mt-3 text-xs leading-6 text-gray-500 sm:text-sm">{t("experience.companyDetail")}</p>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* mission / vision / values */}
      <section className="py-10 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <figure className="flex min-w-0 flex-col">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 sm:aspect-[16/9] lg:aspect-auto lg:min-h-[400px] lg:flex-1">
              <Image
                src="/about.png"
                alt=""
                fill
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 40vw, (min-width: 640px) 90vw, 100vw"
                className="object-cover object-[42%_center]"
              />
            </div>
          </figure>
          <div className="self-start divide-y divide-slate-200/80 border-y border-slate-200/80">
            {pillars.map(({ Icon, title, body, accent }, index) => (
              <article
                key={title}
                className="grid grid-cols-[28px_1fr] items-start gap-x-4 gap-y-3 py-6 sm:gap-x-6 lg:py-7"
              >
                <span aria-hidden="true" className="pt-3 font-mono text-xs tracking-wider text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-4">
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${accent}`}>
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
                  </span>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
                </div>
                <p className="col-start-2 max-w-2xl text-sm leading-7 text-slate-600">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* what we do */}
      <section className="bg-[#fafafa] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("whatT")}</h2>
          <p className="mt-3 text-gray-500">{t("whatS")}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceSlugs.map((s) => (
              <Link
                key={s.slug}
                href={`/service/${s.slug}`}
                className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold">{s.title}</p>
                  <ArrowUpRight className="size-4 text-gray-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {sv(`desc.${s.slug}`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("processT")}</h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="relative rounded-3xl border border-gray-100 p-6">
                <span className={`text-5xl font-black ${gradientText}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-[1.9] text-gray-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6 md:pb-24">
        <div
          className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-blue-50 bg-cover bg-right"
          style={{ backgroundImage: "url('/coeve.png')" }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-white/85 via-white/40 via-40% to-transparent to-70% sm:from-white/75 sm:via-white/25 sm:via-35% sm:to-60%" />
          <div className="px-6 py-10 text-left sm:px-10 sm:py-14 lg:w-[48%] lg:px-12 lg:py-16">
            <h2 className="max-w-md text-3xl font-semibold leading-[1.4] tracking-tight text-[#0f172a] sm:text-4xl">
              {t("ctaT")}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">{t("ctaB")}</p>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
            >
              {t("ctaBtn")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
