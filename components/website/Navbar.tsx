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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-canvas/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple text-sm font-bold text-white">
            W
          </span>
          <span className="text-base font-semibold tracking-tight text-ink">
            Wooyou Creative
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-medium text-body-soft transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-xl bg-ink px-5 text-sm font-semibold text-canvas transition-opacity hover:opacity-85"
          >
            เริ่มโปรเจค
          </Link>
        </div>

        <button
          type="button"
          className="text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="เปิดเมนู"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-hairline bg-canvas px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block text-sm font-medium text-body-soft hover:text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-ink text-sm font-semibold text-canvas"
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
