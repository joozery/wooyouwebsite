import Link from "next/link";

const columns = [
  {
    title: "บริษัท",
    links: [
      { label: "เกี่ยวกับเรา", href: "/about" },
      { label: "ผลงาน", href: "/portfolio" },
      { label: "ลูกค้าของเรา", href: "/customer" },
      { label: "ติดต่อเรา", href: "/contact" },
    ],
  },
  {
    title: "บริการ",
    links: [
      { label: "Web Development", href: "/service/web-development" },
      { label: "UI/UX Design", href: "/service/ui-ux-design" },
      { label: "Digital Marketing", href: "/service/digital-marketing" },
      { label: "ERP Systems", href: "/service/erp-systems" },
    ],
  },
  {
    title: "ช่วยเหลือ",
    links: [
      { label: "นโยบายความเป็นส่วนตัว", href: "/privacy-policy" },
      { label: "ขอใบเสนอราคา", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface-soft">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple text-sm font-bold text-white">
                W
              </span>
              <span className="text-base font-semibold tracking-tight text-ink">
                Wooyou Creative
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-soft">
              Digital Agency ครบวงจร
              <br />
              เว็บไซต์ · ระบบ ERP · การตลาดออนไลน์
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-ink">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-hairline pt-8 text-sm text-muted-soft">
          © {new Date().getFullYear()} Wooyou Creative. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
