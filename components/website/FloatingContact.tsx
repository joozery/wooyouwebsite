"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";

const contactItems = [
  {
    label: "call",
    href: "tel:+66XXXXXXXXX",
    bg: "#22c55e",
    // ซ้าย
    ox: -95,
    oy: 0,
    delay: 0,
    icon: <Phone className="size-5 text-white" strokeWidth={2} />,
  },
  {
    label: "LINE",
    href: "https://line.me/ti/p/~LINEID",
    bg: "#06C755",
    // แนวทแยงซ้าย-บน
    ox: -67,
    oy: -67,
    delay: 60,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-white">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/wooyoucreative",
    bg: "#1877F2",
    // บน
    ox: 0,
    oy: -95,
    delay: 120,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function FloatingContact() {
  const t = useTranslations("floating");
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      {/* wrapper ขนาดเท่า image เพื่อให้ absolute icons อ้างอิงจากกึ่งกลาง */}
      <div
        className="fixed right-5 bottom-8 z-50"
        style={{
          width: 120,
          height: 120,
          animation: "float 4s ease-in-out infinite",
        }}
      >
        {/* pulse rings — แสดงตลอด */}
        <span
          className="absolute inset-0 rounded-full bg-blue-500/25"
          style={{ animation: "ping-ring 2s ease-out infinite" }}
        />
        <span
          className="absolute inset-0 rounded-full bg-blue-400/15"
          style={{ animation: "ping-ring-slow 2s ease-out infinite 0.6s" }}
        />

        {/* contact icon buttons — absolute รอบกึ่งกลาง */}
        {contactItems.map((item) => (
          <div
            key={item.label}
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: open
                ? `translate(calc(-50% + ${item.ox}px), calc(-50% + ${item.oy}px)) scale(1)`
                : "translate(-50%, -50%) scale(0)",
              opacity: open ? 1 : 0,
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
              transitionDelay: open ? `${item.delay}ms` : "0ms",
              pointerEvents: open ? "auto" : "none",
            }}
          >
            <a
              href={item.href}
              aria-label={item.label === "call" ? t("call") : item.label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-11 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
              style={{ backgroundColor: item.bg }}
              onClick={() => setOpen(false)}
            >
              {item.icon}
            </a>
          </div>
        ))}

        {/* รูปหลัก — คลิกเพื่อ toggle */}
        <button
          type="button"
          aria-label={t("contact")}
          onClick={() => setOpen(!open)}
          className="relative z-10 transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/floting/contect.svg"
            alt={t("contact")}
            width={120}
            height={120}
            className="drop-shadow-[0_8px_24px_rgba(37,99,235,0.45)]"
            draggable={false}
          />
        </button>
      </div>
    </>
  );
}
