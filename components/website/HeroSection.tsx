"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (preference.matches) video.pause();
      else void video.play().catch(() => {});
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return (
    <section aria-label={t("videoLabel")} className="relative isolate aspect-video overflow-hidden bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/heromotionhome-poster.jpg"
          className="h-full w-full object-cover object-center"
        >
          <source src="/heromotionhome.mp4" type="video/mp4" />
          {t("videoFallback")}
        </video>

      </div>
    </section>
  );
}
