import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

const serviceLinks = [
  { label: "Web Development", href: "/service/web-development" },
  { label: "UI/UX Design", href: "/service/ui-ux-design" },
  { label: "Digital Marketing", href: "/service/digital-marketing" },
  { label: "ERP Systems", href: "/service/erp-systems" },
];

const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue";

export default async function Footer() {
  const t = await getTranslations("footer");
  const columns = [
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "/about" },
        { label: t("works"), href: "/portfolio" },
        { label: t("clients"), href: "/customer" },
        { label: t("contactUs"), href: "/contact" },
      ],
    },
    { title: t("services"), links: serviceLinks },
  ];

  return (
    <footer
      className="border-t border-slate-200/70 bg-white text-slate-900"
      style={{
        backgroundImage: "radial-gradient(ellipse at 10% 100%, rgba(139, 92, 246, 0.035), transparent 60%), radial-gradient(ellipse at 90% 100%, rgba(37, 99, 235, 0.025), transparent 55%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-x-8 gap-y-6 py-7 md:grid-cols-2 lg:grid-cols-12 lg:py-8">
          <div className="min-w-0 lg:col-span-4">
            <Link href="/" className={`inline-block ${focusStyle}`}>
              <Image
                src="/logo/logolong.svg"
                alt="Wooyou Creative"
                width={144}
                height={42}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-3 max-w-sm text-[13px] leading-6 text-slate-600">
              {t("desc")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:col-span-4 lg:gap-8">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-2 text-[13px] font-medium text-slate-900">{column.title}</h3>
                <ul className="space-y-1">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`inline-flex min-h-9 items-center text-[13px] leading-6 text-slate-600 transition-colors hover:text-brand-blue ${focusStyle}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="min-w-0 lg:col-span-4 lg:pl-8">
            <h3 className="mb-2 text-[13px] font-medium text-slate-900">{t("contactUs")}</h3>
            <a
              href="mailto:hello@wooyoucreative.co.th"
              className={`group inline-flex min-h-9 max-w-full items-center gap-3 border-b border-slate-200 pb-2 text-sm text-slate-900 transition-colors hover:border-brand-blue hover:text-brand-blue ${focusStyle}`}
            >
              <span className="min-w-0 break-words">hello@wooyoucreative.co.th</span>
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </a>
            <p className="mt-2 text-[13px] leading-6 text-slate-600">{t("address")}</p>
            <a
              href="https://facebook.com/wooyoucreative"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-1 inline-flex min-h-10 items-center gap-2 text-[13px] text-slate-600 transition-colors hover:text-brand-blue ${focusStyle}`}
            >
              Facebook
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-slate-200/70 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-[11px] leading-6 text-slate-600">
            © {new Date().getFullYear()} Wooyou Creative. All rights reserved.
          </p>
          <Link
            href="/privacy-policy"
            className={`inline-flex min-h-10 items-center self-start text-[11px] text-slate-600 transition-colors hover:text-brand-blue sm:self-auto ${focusStyle}`}
          >
            {t("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
