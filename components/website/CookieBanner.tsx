"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "wc_cookie_consent";
const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

export default function CookieBanner() {
  const tc = useTranslations("cookie");
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const savedChoice = useRef(false);

  useEffect(() => {
    let hasConsent = false;
    try {
      hasConsent = Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      // Show the banner when browser storage is unavailable.
    }
    if (!hasConsent) {
      const timer = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss(value: "accepted" | "declined") {
    if (savedChoice.current) return;
    savedChoice.current = true;
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* Dismiss for this visit when storage is unavailable. */ }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-labelledby="cookie-banner-title"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-h-[calc(100dvh-2rem)] max-w-7xl overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/95 p-4 text-slate-900 shadow-[0_12px_48px_-12px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5"
        >
          <button type="button" onClick={() => dismiss("declined")} aria-label={tc("close")} className={`absolute right-2 top-2 flex size-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 ${focusStyle}`}><X aria-hidden="true" className="size-4" /></button>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6 lg:pr-9">
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:size-12"><Cookie aria-hidden="true" className="size-5" strokeWidth={1.6} /></span>
              <div className="min-w-0 flex-1">
                <h2 id="cookie-banner-title" className="pr-8 text-sm font-semibold leading-6 lg:pr-0">{tc("title")}</h2>
                <p className="mt-1 text-xs leading-6 text-slate-500">
                  {tc.rich("body", { link: (chunks) => <Link href="/privacy-policy" className={`text-blue-700 underline decoration-blue-200 underline-offset-4 hover:decoration-blue-600 ${focusStyle}`}>{chunks}</Link> })}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">{[tc("necessary"), tc("analytics"), tc("marketing")].map((tag, index) => <span key={tag} className={index === 0 ? "text-blue-600" : undefined}>{tag}</span>)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 lg:shrink-0">
              <button type="button" onClick={() => dismiss("declined")} className={`min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 ${focusStyle}`}>{tc("decline")}</button>
              <button type="button" onClick={() => dismiss("accepted")} className={`min-h-11 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 ${focusStyle}`}>{tc("accept")}</button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
