"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { StoryContent, StoryLocale } from "@/lib/story";

const ease = [0.22, 1, 0.36, 1] as const;

// text reveal: แถบเทาวิ่งผ่านตัวอักษรตอน scroll มาถึง
function RevealLine({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <span className="relative block w-fit overflow-hidden">
      <motion.span
        className="block bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a] to-blue-600 bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.01, delay: delay + 0.35 }}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-gray-300"
        initial={{ x: "-101%" }}
        whileInView={{ x: ["-101%", "0%", "101%"] }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay, ease, times: [0, 0.45, 1] }}
      />
    </span>
  );
}

export default function OurStoryContent({ content, locale }: { content: StoryContent; locale: StoryLocale }) {
  const text = content.texts[locale];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-28%"]);

  if (!content.isVisible) return null;
  return (
    <section id="our-story" ref={ref} className="scroll-mt-20 overflow-hidden bg-white py-16 md:py-24">
      {/* header */}
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-4 sm:px-6">
        <div>
          <p className="text-[44px] font-black leading-[1.05] tracking-tight sm:text-6xl md:text-[75px]">
            <RevealLine>{text.titleLine1}</RevealLine>
            <RevealLine delay={0.15}>{text.titleLine2}</RevealLine>
          </p>
          <h2 className="mt-4 w-fit text-base font-semibold bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a] to-blue-600 bg-clip-text text-transparent md:text-lg">{text.subtitle}</h2>
        </div>
        {/* TODO: มาสคอต/ภาพประกอบมุมขวา (โผล่จากขอบล่าง) */}
        <div aria-hidden className="hidden h-32 w-32 shrink-0 md:block" />
      </div>

      {/* full-bleed grayscale team strip (scroll-linked) */}
      {content.images.length > 0 && <div className="mt-10 md:mt-14">
        <motion.div style={{ x }} className="flex w-max gap-2">
          {content.images.map((p, i) => (
            <div
              key={p.id}
              className="relative h-[200px] shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-[260px] md:h-[320px]"
              style={{ width: `min(${p.width}px, 70vw)`, marginTop: i % 2 ? 16 : 0 }}
            >
              <Image src={p.src} alt={p.alt} fill sizes="420px" className="object-cover grayscale" />
            </div>
          ))}
        </motion.div>
      </div>

      }

      {/* content */}
      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 md:mt-16">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-[220px_1fr] md:gap-8">
          <h3 className="text-2xl font-bold text-[#333] md:text-[28px]">{text.heading}</h3>
          <p className="whitespace-pre-line text-sm leading-[2] text-[#333]/80 md:text-base">{text.body}</p>
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href={content.buttonHref}
            className="inline-flex h-14 items-center gap-3 rounded-full bg-[#0a0a0a] px-8 text-sm font-medium text-white transition-colors hover:bg-[#1f1f1f]"
          >
            {text.cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
