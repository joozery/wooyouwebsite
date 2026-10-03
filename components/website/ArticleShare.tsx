"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ArticleShare() {
  const t = useTranslations("articleDetail");
  const [copied, setCopied] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState("");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setFallbackUrl("");
    } catch {
      setFallbackUrl(window.location.href);
    }
  }

  return (
    <div>
      <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:border-blue-200 hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">{copied ? <Check className="size-3.5" aria-hidden="true" /> : <Link2 className="size-3.5" aria-hidden="true" />}{copied ? t("copied") : t("copy")}</button>
      <span role="status" className="sr-only">{copied ? t("copied") : ""}</span>
      {fallbackUrl && <div className="mt-3"><label htmlFor="article-share-url" className="text-xs text-slate-500">{t("copyFailed")}</label><input id="article-share-url" readOnly value={fallbackUrl} onFocus={(event) => event.currentTarget.select()} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600" /></div>}
    </div>
  );
}
