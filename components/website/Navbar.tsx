"use client";

import { useState } from "react";
import Link from "next/link";
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
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex h-14 w-full items-center justify-between border-b border-black/5 bg-white px-4 shadow-[0_4px_24px_rgba(10,10,10,0.08)] sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="relative flex size-7 items-end justify-center gap-0.5 overflow-hidden rounded-[9px] bg-[#f5f0e0] pb-1">
            <span className="h-3.5 w-1.5 rounded-full bg-[#ff6b5a]" />
            <span className="h-5 w-1.5 rounded-full bg-[#22b8cf]" />
            <span className="h-4 w-1.5 rounded-full bg-[#e8b94a]" />
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.04em] text-[#0a0a0a]">
            wooyou
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[13px] font-medium text-[#3a3a3a] transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

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
        <div className="w-full border-b border-black/5 bg-white px-5 py-4 shadow-[0_4px_24px_rgba(10,10,10,0.08)] md:hidden">
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
