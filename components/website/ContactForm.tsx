"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Mail } from "lucide-react";

const fieldClass = "mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-[#17203a] placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100";
const services = ["web", "design", "erp", "marketing", "other"] as const;

export default function ContactForm() {
  const t = useTranslations("contactPage");
  const [draft, setDraft] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const body = [
      `${t("name")}: ${value("name")}`,
      `${t("email")}: ${value("email")}`,
      value("company") ? `${t("company")}: ${value("company")}` : "",
      value("phone") ? `${t("phone")}: ${value("phone")}` : "",
      `${t("services")}: ${data.getAll("services").join(", ") || t("other")}`,
      value("budget") ? `${t("budget")}: ${value("budget")}` : "",
      `\n${t("details")}:\n${value("details")}`,
    ].filter(Boolean).join("\n");
    setDraft(body);
    window.location.href = `mailto:hello@wooyoucreative.co.th?subject=${encodeURIComponent(t("subject"))}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label htmlFor="contact-name" className="text-sm font-medium">{t("name")} <span className="text-brand-blue" aria-label={t("required")}>*</span></label><input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder={t("namePlaceholder")} className={fieldClass} /></div>
        <div><label htmlFor="contact-email" className="text-sm font-medium">{t("email")} <span className="text-brand-blue" aria-label={t("required")}>*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" className={fieldClass} /></div>
        <div><label htmlFor="contact-company" className="text-sm font-medium">{t("company")} <span className="text-xs font-normal text-slate-400">({t("optional")})</span></label><input id="contact-company" name="company" autoComplete="organization" maxLength={150} placeholder={t("companyPlaceholder")} className={fieldClass} /></div>
        <div><label htmlFor="contact-phone" className="text-sm font-medium">{t("phone")} <span className="text-xs font-normal text-slate-400">({t("optional")})</span></label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="08X XXX XXXX" className={fieldClass} /></div>
      </div>

      <fieldset><legend className="text-sm font-medium">{t("services")}</legend><div className="mt-2 flex flex-wrap gap-1.5">{services.map((service) => <label key={service} className="relative cursor-pointer"><input type="checkbox" name="services" value={t(service)} className="peer sr-only" /><span className="inline-flex rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-600 transition-colors hover:border-blue-300 peer-checked:border-brand-blue peer-checked:bg-blue-50 peer-checked:text-brand-blue peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue">{t(service)}</span></label>)}</div></fieldset>

      <div><label htmlFor="contact-budget" className="text-sm font-medium">{t("budget")} <span className="text-xs font-normal text-slate-400">({t("optional")})</span></label><select id="contact-budget" name="budget" defaultValue="" className={fieldClass}><option value="" disabled>{t("budgetPlaceholder")}</option>{[1, 2, 3, 4, 5].map((index) => <option key={index} value={t(`budget${index}`)}>{t(`budget${index}`)}</option>)}</select></div>
      <div><label htmlFor="contact-details" className="text-sm font-medium">{t("details")} <span className="text-brand-blue" aria-label={t("required")}>*</span></label><textarea id="contact-details" name="details" required maxLength={2000} rows={3} placeholder={t("detailsPlaceholder")} className={`${fieldClass} min-h-24 resize-y leading-6`} /></div>
      <p className="text-xs leading-6 text-slate-500">{t("privacyBefore")} <Link href="/privacy-policy" className="font-medium text-brand-blue underline underline-offset-2">{t("privacyLink")}</Link></p>
      <div><button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">{t("submit")}<ArrowUpRight className="size-4" aria-hidden="true" /></button><p className="mt-2 text-center text-xs leading-5 text-slate-400">{t("emailNote")}</p></div>
      {draft && <div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><p role="status" className="flex items-start gap-2 text-xs leading-6 text-blue-800"><Mail className="mt-1 size-4 shrink-0" aria-hidden="true" />{t("draftNotice")}</p><label htmlFor="contact-draft" className="sr-only">{t("draftLabel")}</label><textarea id="contact-draft" readOnly value={draft} rows={7} className={`${fieldClass} bg-white leading-6`} onFocus={(event) => event.currentTarget.select()} /></div>}
    </form>
  );
}
