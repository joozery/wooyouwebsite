"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface Customer { name: string; imageUrl: string; category?: string }
const categories = ["all", "corporate", "sme", "government", "startup", "other"] as const;

export default function CustomerDirectory() {
  const t = useTranslations("customerPage");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    fetch(api ? `${api}/client-logos/public` : "/api/client-logos", { signal: controller.signal, cache: "no-store" })
      .then((response) => response.ok ? response.json() : [])
      .then((data: unknown) => {
        const records = Array.isArray(data) ? data : (data as { data?: unknown } | null)?.data;
        if (!Array.isArray(records)) return;
        const valid: Customer[] = records.flatMap((item) => {
          const imageUrl = item?.imageUrl || item?.image || item?.logoUrl;
          return typeof item?.name === "string" && typeof imageUrl === "string" && imageUrl.trim() && item.isVisible !== false
            ? [{ name: item.name, imageUrl, category: item.category }]
            : [];
        });
        setCustomers(valid);
      })
      .catch(() => { /* Do not substitute unrelated brands when logos are unavailable. */ })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const filtered = customers.filter((customer) => (category === "all" || (customer.category ?? "other") === category) && customer.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  return (
    <section id="customer-directory" aria-label={t("directory")} className="scroll-mt-20 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div aria-label={t("filter")} className="flex gap-5 overflow-x-auto">
            {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`min-h-11 shrink-0 border-b-2 px-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 ${category === item ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 hover:text-blue-600"}`}>{t(`categories.${item}`)}</button>)}
          </div>
          <label className="flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 md:w-56">
            <Search aria-hidden="true" className="size-4 shrink-0 text-slate-400" /><span className="sr-only">{t("search")}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} className="w-full min-w-0 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400" />
          </label>
        </div>
        <div aria-live="polite" className="sr-only">{t("results", { count: filtered.length })}</div>
        <div aria-busy={loading} className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {loading && Array.from({ length: 6 }, (_, index) => <div key={index} aria-hidden="true" className="h-28 animate-pulse rounded-xl bg-slate-100 motion-reduce:animate-none" />)}
          {filtered.map((customer) => (
            <div key={`${customer.name}-${customer.imageUrl}`} title={customer.name} className="flex h-28 items-center justify-center rounded-xl border border-slate-200/80 bg-white px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_8px_24px_-12px_rgba(37,99,235,0.18)] motion-reduce:transform-none">
              {/* Logos may come from the existing admin's external image hosts. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={customer.imageUrl} alt={customer.name} loading="lazy" decoding="async" className="h-full w-full object-contain" />
            </div>
          ))}
        </div>
        {!loading && !filtered.length && <p className="py-8 text-center text-sm text-slate-500">{t("empty")}</p>}
      </div>
    </section>
  );
}
