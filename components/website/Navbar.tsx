"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const menuItems = [
  { label: "หน้าแรก", href: "/" },
  { label: "บริการ", href: "/service" },
  { label: "ผลงาน", href: "/portfolio" },
  { label: "ลูกค้า", href: "/customer" },
  { label: "ติดต่อ", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6">
      <nav className="mx-auto flex h-14 max-w-[1548px] items-center justify-between rounded-b-[22px] border-x border-b border-black/5 bg-white px-4 shadow-[0_4px_24px_rgba(10,10,10,0.08)] sm:px-6">
        <div className="flex items-center gap-8">
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

          <ul className="hidden items-center gap-2 lg:flex">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group block px-3.5 py-2 text-[13px] font-medium text-[#3a3a3a] [perspective:120px]"
                >
                  <span className="relative block overflow-hidden">
                    <span className="block origin-top transition-all duration-300 ease-out group-hover:-translate-y-full group-hover:[transform:translateY(-100%)_rotateX(60deg)] group-hover:opacity-0">
                      {item.label}
                    </span>
                    <span
                      aria-hidden
                      className="absolute inset-0 block origin-bottom translate-y-full font-semibold text-black opacity-0 [transform:translateY(100%)_rotateX(-60deg)] transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:[transform:translateY(0)_rotateX(0)] group-hover:opacity-100"
                    >
                      {item.label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/contact"
            className="inline-flex h-10 items-center rounded-xl bg-[#f5f3ee] px-4 text-[13px] font-medium text-[#0a0a0a] transition-colors hover:bg-[#ebe6d6]"
          >
            ขอใบเสนอราคา
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center rounded-xl bg-[#0a0a0a] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#1f1f1f]"
          >
            เริ่มโปรเจค
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[#0a0a0a] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="เปิดเมนู"
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
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#0a0a0a] text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                เริ่มโปรเจค
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
