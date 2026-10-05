"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Palette, Megaphone, LayoutDashboard, Gamepad2, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useMotionValue, useSpring, useMotionValueEvent } from "framer-motion";

const services = [
  { slug: "web-development", title: "Web Development", image: "/navbaricon/webdevelopment-cutout.webp", Icon: Code2, tags: ["Website", "Web Application", "E-commerce"] },
  { slug: "ui-ux-design", title: "UI/UX Design", image: "/navbaricon/uxui-cutout.webp", Icon: Palette, tags: ["User Experience", "Interface", "Prototype"] },
  { slug: "digital-marketing", title: "Digital Marketing", image: "/navbaricon/digitalmarketing-cutout.webp", Icon: Megaphone, tags: ["SEO", "Online Advertising", "Strategy"] },
  { slug: "erp-systems", title: "ERP & Business Systems", image: "/navbaricon/erp.webp", Icon: LayoutDashboard, tags: ["ERP", "Automation", "Business Systems"] },
  { slug: "game-development", title: "Game Development", image: "/navbaricon/game.webp", Icon: Gamepad2, tags: ["2D / 3D", "Interactive", "Multi-platform"] },
  { slug: "mobile-apps", title: "Mobile App Development", image: "/navbaricon/mobileapp.webp", Icon: Smartphone, tags: ["iOS", "Android", "Mobile Experience"] },
];

export default function ServiceCards() {
  const t = useTranslations("services");
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 96px", "end end"] });
  const scrollLift = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const imageX = useSpring(pointerX, { stiffness: 100, damping: 25 });
  const imageY = useSpring(pointerY, { stiffness: 100, damping: 25 });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduceMotion || !window.matchMedia("(min-width: 1024px) and (min-height: 720px)").matches) return;
    if (sectionRef.current?.querySelector("#home-service-preview")?.contains(document.activeElement)) return;
    setActive(Math.min(services.length - 1, Math.floor(progress * services.length)));
  });
  const selected = services[active];

  return (
    <div ref={sectionRef} className="service-scroll-stage">
    <div className="service-scroll-panel grid min-w-0 gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 xl:gap-14">
      <div className="grid grid-cols-2 gap-2 self-start rounded-[24px] border border-white/80 bg-white/65 p-2 shadow-[0_12px_40px_-24px_rgba(30,64,175,0.2)] backdrop-blur-xl sm:p-3 lg:grid-cols-1 lg:auto-rows-fr lg:self-stretch lg:rounded-[32px]" role="group" aria-label={t("title")}>
        {services.map((service, index) => (
          <button key={service.slug} type="button" aria-pressed={active === index} aria-controls="home-service-preview" onClick={() => setActive(index)} onFocus={() => setActive(index)} onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(index); }} className="group relative isolate flex min-w-0 items-center gap-2 rounded-2xl p-3 text-left transition-colors hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:gap-3 lg:gap-4 lg:px-4">
            {active === index && <motion.span layoutId="service-indicator" transition={{ duration: reduceMotion ? 0 : 0.25 }} aria-hidden="true" className="absolute inset-0 -z-10 rounded-2xl border border-blue-100 bg-white shadow-[0_4px_16px_-8px_rgba(37,99,235,0.2)]" />}
            <span aria-hidden="true" className={`flex size-8 shrink-0 items-center justify-center rounded-xl font-mono text-[11px] transition-colors sm:size-10 sm:text-xs ${active === index ? "bg-blue-600 text-white" : "bg-white/70 text-slate-400"}`}>{String(index + 1).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1"><span className={`block text-xs font-semibold leading-5 sm:text-sm lg:text-base xl:text-lg ${active === index ? "text-blue-700" : "text-slate-700"}`}>{service.title}</span><span className="mt-1 hidden text-[10px] font-normal leading-4 text-slate-400 sm:block lg:text-[11px]">{service.tags.slice(0, 2).join(" · ")}</span></span>
            <span className={`hidden size-8 shrink-0 items-center justify-center rounded-full transition-colors lg:flex ${active === index ? "bg-blue-50 text-blue-600" : "text-slate-300"}`}><ArrowRight aria-hidden="true" className="size-4" /></span>
          </button>
        ))}
      </div>

      <div id="home-service-preview" onPointerMove={(event) => {
        if (reduceMotion || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 16);
        pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 12);
      }} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }} className="relative min-w-0 self-start lg:self-stretch">
        <div className="relative isolate overflow-hidden lg:flex lg:h-full lg:flex-col rounded-[24px] border border-blue-100 bg-[#edf4ff] sm:rounded-[32px]">
          <div className="service-scroll-image relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#f5f9ff] via-[#eef4ff] to-[#e1edff] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[180px] lg:flex-1">
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white/30 shadow-[0_0_0_24px_rgba(255,255,255,0.2),0_0_0_48px_rgba(255,255,255,0.15)]" />
            <motion.div style={reduceMotion ? undefined : { y: scrollLift }} className="absolute inset-0"><motion.div style={reduceMotion ? undefined : { x: imageX, y: imageY }} className="absolute inset-0">{services.map((service, index) => <motion.div key={service.slug} initial={false} animate={{ opacity: active === index ? 1 : 0, scale: active === index ? 1 : 1.05 }} transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }} aria-hidden="true" className="absolute inset-0"><Image src={service.image} alt="" fill sizes="(min-width: 1280px) 650px, (min-width: 1024px) 52vw, 94vw" className="object-contain px-8 pb-4 pt-16 sm:px-12 sm:pb-5 sm:pt-16" /></motion.div>)}</motion.div></motion.div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3 py-2 text-[9px] font-semibold tracking-[0.15em] text-blue-700 backdrop-blur-sm sm:left-6 sm:top-6"><span aria-hidden="true" className="size-1.5 rounded-full bg-blue-600" />DESIGN. DEVELOP. DELIVER.</div>
            <span aria-hidden="true" className="absolute right-4 top-4 flex size-12 items-center justify-center rounded-2xl border border-white/70 bg-white/85 font-mono text-sm text-blue-600 backdrop-blur-sm sm:right-6 sm:top-6">{String(active + 1).padStart(2, "0")}<span className="ml-0.5 text-[9px] text-slate-400">/06</span></span>
          </div>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-blue-50"><motion.div style={reduceMotion ? { scaleX: (active + 1) / services.length } : { scaleX: scrollYProgress }} className="h-full origin-left bg-blue-500" /></div>
          <div className="relative shrink-0 bg-white px-5 pb-6 sm:px-7 sm:pb-7">
            <div className="mb-4 flex flex-wrap gap-2">{selected.tags.map((tag) => <span key={tag} className="rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-[10px] font-medium text-blue-600">{tag}</span>)}</div>
            <AnimatePresence mode="wait" initial={false}><motion.div key={selected.slug} initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }} transition={{ duration: reduceMotion ? 0 : 0.15 }}>
              <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{selected.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">{t(`desc.${selected.slug}`)}</p>
            </motion.div></AnimatePresence>
            <Link href={`/service/${selected.slug}`} className="group mt-5 inline-flex min-h-11 items-center gap-4 rounded-full bg-blue-600 py-2 pl-5 pr-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">{t("more")}<span className="flex size-8 items-center justify-center rounded-full bg-white/15"><ArrowRight aria-hidden="true" className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" /></span><span className="sr-only"> — {selected.title}</span></Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
