"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

const frames = [
  { src: "/port/01.png", rotation: -6, drift: -1, travel: 24, className: "left-[-5%] top-4 z-10 w-[44%] sm:left-[1%] sm:top-5 sm:w-[32%] lg:left-[3%] lg:top-5 lg:w-[30%]" },
  { src: "/port/02.png", rotation: 6, drift: 1, travel: 18, className: "right-[-5%] top-4 z-10 w-[44%] sm:right-[1%] sm:top-5 sm:w-[32%] lg:right-[3%] lg:top-5 lg:w-[30%]" },
  { src: "/port/03.png", rotation: 4, drift: -1, travel: -18, className: "bottom-5 left-[1%] z-20 w-[36%] sm:bottom-7 sm:left-[10%] sm:w-[27%] lg:bottom-8 lg:left-[14%] lg:w-[26%]" },
  { src: "/port/04.png", rotation: -4, drift: 1, travel: -26, className: "bottom-5 right-[1%] z-20 w-[36%] sm:bottom-7 sm:right-[10%] sm:w-[27%] lg:bottom-8 lg:right-[14%] lg:w-[26%]" },
];

function ShowcaseFrame({ frame, progress, reducedMotion }: {
  frame: (typeof frames)[number];
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const x = useTransform(progress, [0, 0.5, 1], [`${-frame.drift * 4}%`, "0%", `${frame.drift * 4}%`]);
  const y = useTransform(progress, [0, 0.5, 1], [frame.travel, 0, -frame.travel]);
  const rotate = useTransform(progress, [0, 0.5, 1], [frame.rotation - frame.drift * 2, frame.rotation, frame.rotation + frame.drift * 2]);

  return (
    <motion.div
      style={{ x: reducedMotion ? 0 : x, y: reducedMotion ? 0 : y, rotate: reducedMotion ? frame.rotation : rotate }}
      className={`absolute overflow-hidden rounded-xl border border-white/90 bg-white shadow-[0_28px_60px_-20px_rgba(23,32,58,0.25)] ${frame.className}`}
    >
      <div className="flex h-6 items-center gap-1 border-b border-slate-100 bg-white px-2.5 sm:h-7">
        <span className="size-1.5 rounded-full bg-slate-200" /><span className="size-1.5 rounded-full bg-slate-200" /><span className="size-1.5 rounded-full bg-slate-200" />
        <div className="mx-auto h-2 w-1/3 rounded-full bg-slate-100" />
      </div>
      <div className="relative aspect-video overflow-hidden bg-white">
        <Image src={frame.src} alt="" fill sizes="(min-width: 1280px) 380px, (min-width: 640px) 32vw, 44vw" className="object-contain" />
      </div>
    </motion.div>
  );
}

export default function AboutShowcaseGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none relative mx-auto mt-8 h-[260px] max-w-7xl sm:mt-10 sm:h-[350px] lg:mt-8 lg:h-[420px]">
      {frames.map((frame) => (
        <ShowcaseFrame key={frame.src} frame={frame} progress={progress} reducedMotion={reducedMotion ?? true} />
      ))}
      <div className="absolute bottom-6 left-1/2 z-0 w-48 -translate-x-1/2 sm:bottom-8 sm:w-64 lg:bottom-8 lg:w-80">
        <Image src="/navbaricon/intern.png" alt="" width={1312} height={1199} sizes="(min-width: 1024px) 320px, (min-width: 640px) 256px, 192px" className="h-auto w-full object-contain" />
      </div>
    </div>
  );
}
