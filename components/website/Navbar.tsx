"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, Globe, Menu, X } from "lucide-react";
import { languages, type Locale } from "@/i18n/config";
import { setLocale } from "@/app/actions/locale";
import { ServiceDropdown, WorksDropdown } from "./NavDropdown";

const menuItems = [
  { key: "home", href: "/" },
  { key: "service", href: "/service" },
  { key: "works", href: "/portfolio" },
  { key: "customer", href: "/customer" },
  { key: "article", href: "/article" },
  { key: "contact", href: "/contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const lang = useLocale() as Locale;
  const t = useTranslations("nav");
  const router = useRouter();

  async function changeLang(code: Locale) {
    await setLocale(code);
    router.refresh();
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6">
      <nav className="relative mx-auto flex h-14 max-w-[1548px] items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] rounded-b-[22px] border-x border-b border-black/5 bg-white px-4 shadow-[0_4px_24px_rgba(10,10,10,0.08)] sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo/logolong.svg"
              alt="Wooyou Creative"
              width={124}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </Link>
        </div>

        <ul className="hidden items-center gap-2 lg:flex">
          {menuItems.map((item) => (
            <li key={item.href} className="group/nav">
              <Link
                href={item.href}
                className="group block px-3.5 py-2 text-[13px] font-medium text-[#3a3a3a] perspective-[120px]"
              >
                <span className="relative block overflow-hidden">
                  <span className="block origin-top transition-all duration-300 ease-out group-hover:transform-[translateY(-100%)_rotateX(60deg)] group-hover:opacity-0">
                    {t(item.key)}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 block origin-bottom font-semibold text-black opacity-0 transform-[translateY(100%)_rotateX(-60deg)] transition-all duration-300 ease-out group-hover:transform-[translateY(0)_rotateX(0)] group-hover:opacity-100"
                  >
                    {t(item.key)}
                  </span>
                </span>
              </Link>
              {item.href === "/service" && <ServiceDropdown />}
              {item.href === "/portfolio" && <WorksDropdown />}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex lg:justify-self-end">
          <Link
            href="/contact"
            className="inline-flex h-10 items-center rounded-xl bg-[#f5f3ee] px-4 text-[13px] font-medium text-[#0a0a0a] transition-colors hover:bg-[#ebe6d6]"
          >
            {t("quote")}
          </Link>
          <div className="group/lang relative">
            <button
              type="button"
              aria-label={t("language")}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#0a0a0a] px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1f1f1f]"
            >
              <Globe className="size-4" />
              {languages.find((l) => l.code === lang)?.short}
            </button>
            <ul className="invisible absolute right-0 top-full z-10 mt-2 min-w-36 rounded-2xl border border-black/5 bg-white p-1.5 opacity-0 shadow-[0_12px_40px_rgba(10,10,10,0.12)] transition-all group-hover/lang:visible group-hover/lang:opacity-100 group-focus-within/lang:visible group-focus-within/lang:opacity-100">
              {languages.map((l) => (
                <li key={l.code}>
                  <button
                    type="button"
                    onClick={() => changeLang(l.code)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] text-[#3a3a3a] hover:bg-[#f5f3ee]"
                  >
                    {l.label}
                    {l.code === lang && <Check className="size-4" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[#0a0a0a] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={t("openMenu")}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-[1548px] rounded-2xl border border-black/5 bg-white px-5 py-4 shadow-[0_4px_24px_rgba(10,10,10,0.08)] md:hidden">
          <ul className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block text-sm font-medium text-[#3a3a3a] hover:text-black"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => changeLang(l.code)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${l.code === lang ? "bg-[#0a0a0a] text-white" : "bg-[#f5f3ee] text-[#3a3a3a]"}`}
                >
                  {l.label}
                </button>
              ))}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
