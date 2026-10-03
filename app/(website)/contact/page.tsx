import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Navigation, Sparkles } from "lucide-react";
import ContactForm from "@/components/website/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contactPage");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ContactPage() {
  const t = await getTranslations("contactPage");
  const recent = await getTranslations("recent");
  const address = "54/298 หมู่ที่ 4 ตำบลคลองสี่ อำเภอคลองหลวง จ.ปทุมธานี 12120";
  const mapQuery = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const contactRoutes = [
    { image: "/navbaricon/recriuit.png", title: t("careerTitle"), description: t("careerDesc"), action: t("careerAction"), href: `mailto:hello@wooyoucreative.co.th?subject=${encodeURIComponent(t("careerSubject"))}` },
    { image: "/navbaricon/intern.png", title: t("internTitle"), description: t("internDesc"), action: t("internAction"), href: `mailto:hello@wooyoucreative.co.th?subject=${encodeURIComponent(t("internSubject"))}` },
    { image: "/navbaricon/contact.png", title: t("urgentTitle"), description: t("urgentDesc"), action: t("urgentAction"), href: "https://facebook.com/wooyoucreative" },
  ];
  const channels = [
    { icon: Mail, title: t("emailTitle"), description: t("emailDesc"), value: "hello@wooyoucreative.co.th", href: "mailto:hello@wooyoucreative.co.th" },
    { icon: MessageCircle, title: t("socialTitle"), description: t("socialDesc"), value: "Wooyou Creative", href: "https://facebook.com/wooyoucreative" },
  ];

  return (
    <main className="overflow-hidden bg-[#f7f8fa] text-[#17203a]">
      <section aria-labelledby="contact-title" className="relative overflow-hidden border-b border-slate-200/70 bg-white pb-12 pt-28 sm:pb-16 sm:pt-36">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-16 size-[420px] rounded-full border-[60px] border-blue-50 sm:size-[560px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] text-brand-blue"><span aria-hidden="true" className="h-1.5 w-6 rounded-full bg-brand-blue" />{t("eyebrow")}</p>
          <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h1 id="contact-title" className="text-4xl font-semibold leading-[1.35] tracking-tight sm:text-5xl lg:text-6xl">{t("title")}<br /><span className="text-brand-blue">{t("highlight")}</span></h1>
            <p className="max-w-lg text-sm leading-7 text-slate-500 sm:text-base sm:leading-8 lg:pb-2">{t("intro")}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-routes-title" className="mx-auto max-w-7xl px-5 pt-10 sm:px-6 sm:pt-14">
        <div className="mb-6"><h2 id="contact-routes-title" className="text-xl font-semibold sm:text-2xl">{t("routesTitle")}</h2><p className="mt-2 text-sm leading-7 text-slate-500">{t("routesDesc")}</p></div>
        <div className="grid gap-4 md:grid-cols-3">
          {contactRoutes.map((route) => (
            <a key={route.title} href={route.href} target={route.href.startsWith("https") ? "_blank" : undefined} rel={route.href.startsWith("https") ? "noopener noreferrer" : undefined} className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_12px_32px_-20px_rgba(23,32,58,0.25)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue motion-reduce:transform-none">
              <div className="mb-5">
                <div className="min-w-0"><h3 className="text-lg font-semibold">{route.title}</h3><p className="mt-2 text-sm leading-7 text-slate-500">{route.description}</p></div>
                <Image src={route.image} alt="" width={1312} height={1199} sizes="160px" className="mx-auto mt-4 h-36 w-40 object-contain transition-transform duration-300 group-hover:rotate-3 motion-reduce:transform-none" />
              </div>
              <span className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm font-medium text-brand-blue">{route.action}<ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="contact-form-title" className="mx-auto grid max-w-7xl items-start gap-6 px-5 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-8">
        <aside className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#17203a] p-7 text-white sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 size-52 rounded-full border-[32px] border-white/5" />
            <div className="relative">
              <span className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-blue-300"><Sparkles className="size-5" aria-hidden="true" /></span>
              <h2 className="mt-6 max-w-xs text-2xl font-semibold leading-relaxed">{t("panelTitle")}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{t("panelDesc")}</p>
              <div className="mt-6 flex flex-wrap gap-2 text-[10px] text-blue-100">
                {["Web Development", "ERP Systems", "Digital Marketing"].map((service) => <span key={service} className="rounded-full border border-white/15 px-3 py-1.5">{service}</span>)}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
            {channels.map((channel) => (
              <a key={channel.href} href={channel.href} target={channel.href.startsWith("https") ? "_blank" : undefined} rel={channel.href.startsWith("https") ? "noopener noreferrer" : undefined} className="group flex items-start gap-4 border-b border-slate-100 p-6 transition-colors hover:bg-blue-50/50 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-blue">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-blue"><channel.icon className="size-4" aria-hidden="true" /></span>
                <div className="min-w-0"><h3 className="text-sm font-semibold">{channel.title}</h3><p className="mt-1 text-xs leading-6 text-slate-500">{channel.description}</p><p className="mt-2 break-all text-sm font-medium text-brand-blue">{channel.value}</p></div>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-slate-400 transition-colors group-hover:text-brand-blue" aria-hidden="true" />
              </a>
            ))}
            <div className="flex items-start gap-4 p-6"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500"><MapPin className="size-4" aria-hidden="true" /></span><div><h3 className="text-sm font-semibold">{t("locationTitle")}</h3><p className="mt-1 text-xs leading-6 text-slate-500">{t("locationDesc")}</p></div></div>
          </div>
        </aside>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_60px_-40px_rgba(23,32,58,0.2)] sm:p-6">
          <div className="mb-5 border-b border-slate-100 pb-4"><h2 id="contact-form-title" className="text-lg font-semibold sm:text-xl">{t("formTitle")}</h2><p className="mt-1.5 text-sm leading-6 text-slate-500">{t("formDesc")}</p></div>
          <ContactForm />
        </div>
      </section>

      <section aria-labelledby="contact-map-title" className="mx-auto max-w-7xl px-5 pb-12 sm:px-6 sm:pb-16">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
          <div className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">Visit us</p><h2 id="contact-map-title" className="text-xl font-semibold sm:text-2xl">{t("mapTitle")}</h2><address className="mt-3 max-w-xl text-sm not-italic leading-7 text-slate-600">{t("locationDesc")}</address><p className="mt-2 text-xs leading-6 text-slate-500">{t("mapDesc")}</p></div>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#17203a] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"><Navigation className="size-4" aria-hidden="true" />{t("directions")}<ArrowUpRight className="size-4" aria-hidden="true" /></a>
          </div>
          <iframe title={t("mapLabel")} src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="h-[300px] w-full border-0 bg-slate-100 sm:h-[380px]" />
        </div>
      </section>

      <section aria-labelledby="contact-process-title" className="border-t border-slate-200/70 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 id="contact-process-title" className="text-2xl font-semibold">{t("processTitle")}</h2><p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">{t("processDesc")}</p></div><Link href="/portfolio" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand-blue hover:underline">{recent("all")}<ArrowUpRight className="size-4" aria-hidden="true" /></Link></div>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">{[1, 2, 3].map((step) => <li key={step} className="border-t border-slate-200 pt-5"><span className="font-mono text-xs text-brand-blue">0{step}</span><h3 className="mt-3 text-base font-semibold">{t(`step${step}Title`)}</h3><p className="mt-2 text-sm leading-7 text-slate-500">{t(`step${step}Desc`)}</p></li>)}</ol>
        </div>
      </section>
    </main>
  );
}
