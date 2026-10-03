"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Gamepad2,
  LayoutDashboard,
  Megaphone,
  Palette,
  Smartphone,
} from "lucide-react";
import { useRef, useState, type ElementType } from "react";

interface Service {
  slug: string;
  num: string;
  title: string;
  Icon: ElementType;
  image: string;
  accent: string;
  glow: string;
}

const services: Service[] = [
  {
    slug: "web-development",
    num: "01",
    title: "Web Development",
    Icon: Code2,
    image: "/serveicepic/01.png",
    accent: "#3b82f6",
    glow: "rgba(59,130,246,0.35)",
  },
  {
    slug: "ui-ux-design",
    num: "02",
    title: "UI/UX Design",
    Icon: Palette,
    image: "/serveicepic/02.png",
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
  },
  {
    slug: "digital-marketing",
    num: "03",
    title: "Digital Marketing",
    Icon: Megaphone,
    image: "/serveicepic/03.png",
    accent: "#34d399",
    glow: "rgba(52,211,153,0.35)",
  },
  {
    slug: "erp-systems",
    num: "04",
    title: "ERP Systems",
    Icon: LayoutDashboard,
    image: "/serveicepic/04.png",
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.35)",
  },
  {
    slug: "game-development",
    num: "05",
    title: "Game Development",
    Icon: Gamepad2,
    image: "/serveicepic/05.png",
    accent: "#c084fc",
    glow: "rgba(192,132,252,0.35)",
  },
  {
    slug: "mobile-apps",
    num: "06",
    title: "Mobile Apps",
    Icon: Smartphone,
    image: "/serveicepic/06.png",
    accent: "#fb923c",
    glow: "rgba(251,146,60,0.35)",
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const t = useTranslations("services");
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 180, damping: 24 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 180, damping: 24 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={`/service/${service.slug}`}
          className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl"
          style={{
            boxShadow: hovered
              ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${service.accent}70`
              : "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.07)",
            transition: "box-shadow 0.35s ease",
          }}
        >
          {/* background image — zooms on hover */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ backgroundImage: `url('${service.image}')` }}
          />

          {/* always-on dark scrim so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          {/* accent color wash on hover */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(ellipse at 50% 100%, ${service.glow} 0%, transparent 65%)`,
            }}
          />

          {/* top-left: icon badge */}
          <div className="relative z-10 p-5">
            <span
              className="flex size-10 items-center justify-center rounded-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              style={{ background: `${service.accent}28`, border: `1px solid ${service.accent}50` }}
            >
              <service.Icon className="size-5" style={{ color: service.accent }} strokeWidth={1.8} />
            </span>
          </div>

          {/* number — fades in on hover */}
          <span
            className="pointer-events-none absolute right-4 top-3 select-none font-black leading-none text-[72px] text-white opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.12]"
          >
            {service.num}
          </span>

          {/* bottom content — slides up on hover */}
          <div className="relative z-10 mt-auto p-5 pt-0">
            {/* accent line */}
            <div
              className="mb-3 h-px w-8 transition-all duration-500 group-hover:w-14"
              style={{ background: service.accent }}
            />

            <h3 className="text-[17px] font-semibold text-white">{service.title}</h3>
            <p
              className="mt-1.5 max-h-0 overflow-hidden text-[13px] leading-relaxed text-white/65 transition-all duration-500 group-hover:max-h-16"
            >
              {t(`desc.${service.slug}`)}
            </p>

            {/* CTA */}
            <div
              className="mt-3 flex items-center gap-1.5 text-[13px] font-medium opacity-0 transition-all duration-400 group-hover:opacity-100"
              style={{ color: service.accent }}
            >
              <span>{t("more")}</span>
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function ServiceCards() {
  return (
    <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <ServiceCard key={service.slug} service={service} index={index} />
      ))}
    </div>
  );
}
