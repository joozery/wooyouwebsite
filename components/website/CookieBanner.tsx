"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "wc_cookie_consent";

export default function CookieBanner() {
  const tc = useTranslations("cookie");
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss(value: "accepted" | "declined") {
    setLeaving(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, value);
      setVisible(false);
      setLeaving(false);
    }, 400);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 left-5 z-[60] w-[320px]"
      style={{
        animation: leaving
          ? "none"
          : "cookieEnter 0.5s cubic-bezier(0.16,1,0.3,1) both",
        transform: leaving ? "translateY(16px) scale(0.96)" : undefined,
        opacity: leaving ? 0 : undefined,
        transition: leaving
          ? "transform 0.38s cubic-bezier(0.4,0,1,1), opacity 0.32s ease"
          : undefined,
      }}
    >
      {/* outer glow ring */}
      <div
        className="absolute -inset-px rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(37,99,235,0.5) 0%, rgba(139,92,246,0.4) 50%, rgba(34,211,238,0.25) 100%)",
          filter: "blur(1px)",
        }}
      />

      {/* card */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(160deg, rgba(18,18,36,0.98) 0%, rgba(13,13,26,0.99) 100%)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* top gradient bar */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, #2563eb 0%, #8b5cf6 50%, #22d3ee 100%)",
          }}
        />

        {/* ambient blobs */}
        <div className="pointer-events-none absolute -right-8 -top-8 size-36 rounded-full bg-brand-blue/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-6 -left-6 size-28 rounded-full bg-brand-purple/12 blur-2xl" />

        {/* close */}
        <button
          type="button"
          onClick={() => dismiss("declined")}
          aria-label={tc("close")}
          className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-md text-muted-soft transition-colors hover:bg-white/8 hover:text-ink"
        >
          <X className="size-3.5" />
        </button>

        <div className="relative p-5">
          {/* header */}
          <div className="mb-4 flex items-center gap-3">
            {/* icon badge */}
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.2) 0%, rgba(139,92,246,0.2) 100%)",
                border: "1px solid rgba(37,99,235,0.3)",
              }}
            >
              <ShieldCheck className="size-5 text-brand-blue" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-tight text-ink">
                {tc("title")}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-soft">
                wooyoucreative.com
              </p>
            </div>
          </div>

          {/* divider */}
          <div className="mb-4 h-px bg-white/[0.06]" />

          {/* body */}
          <p className="mb-4 text-xs leading-[1.7] text-body-soft">
            {tc.rich("body", {
              link: (chunks) => (
                <a
                  href="/privacy-policy"
                  className="text-brand-lavender underline-offset-2 transition-colors hover:text-brand-cyan hover:underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>

          {/* cookie type pills */}
          <div className="mb-5 flex flex-wrap gap-1.5">
            {[tc("necessary"), tc("analytics"), tc("marketing")].map((tag, i) => (
              <span
                key={tag}
                className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background:
                    i === 0
                      ? "rgba(37,99,235,0.15)"
                      : "rgba(255,255,255,0.05)",
                  border: `1px solid ${i === 0 ? "rgba(37,99,235,0.3)" : "rgba(255,255,255,0.08)"}`,
                  color: i === 0 ? "#93b4ff" : "#6e6e8a",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* actions */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => dismiss("accepted")}
              className="relative h-10 w-full overflow-hidden rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #2563eb 0%, #4f46e5 60%, #7c3aed 100%)",
                boxShadow:
                  "0 4px 24px rgba(37,99,235,0.4), 0 1px 0 rgba(255,255,255,0.1) inset",
              }}
            >
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)",
                  animation: "shimmer 2.8s ease-in-out infinite",
                }}
              />
              <span className="relative">{tc("accept")}</span>
            </button>

            <button
              type="button"
              onClick={() => dismiss("declined")}
              className="h-9 w-full rounded-xl text-[12px] font-medium text-muted-soft transition-all duration-200 hover:bg-white/5 hover:text-body-soft active:scale-[0.98]"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {tc("decline")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
