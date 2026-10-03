import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

const serviceLinks = [
  { label: "Web Development", href: "/service/web-development" },
  { label: "UI/UX Design", href: "/service/ui-ux-design" },
  { label: "Digital Marketing", href: "/service/digital-marketing" },
  { label: "ERP Systems", href: "/service/erp-systems" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/wooyoucreative",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "LINE",
    href: "https://line.me/ti/p/~LINEID",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    ),
  },
];

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
  const contactItems = [
    { icon: Phone, label: "+66 XX XXX XXXX", href: "tel:+66XXXXXXXXX" },
    { icon: Mail, label: "hello@wooyoucreative.co.th", href: "mailto:hello@wooyoucreative.co.th" },
    { icon: MapPin, label: t("address"), href: undefined },
  ];
  return (
    <footer className="bg-white">
      {/* divider gradient ต่อจาก section เข้ม */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">

          {/* brand column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block">
              <Image
                src="/logo/logolong.svg"
                alt="Wooyou Creative"
                width={160}
                height={46}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#6b7280]">
              {t("desc")}
            </p>

            <div className="mt-7 flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-[#e5e7eb] text-[#9ca3af] transition-all duration-200 hover:border-[#2563eb] hover:bg-[#2563eb]/5 hover:text-[#2563eb]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* nav columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-semibold tracking-[1.5px] text-[#2563eb] uppercase">
                  {column.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#6b7280] transition-colors duration-200 hover:text-[#0a0a14]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* contact column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold tracking-[1.5px] text-[#2563eb] uppercase">
              {t("contactUs")}
            </h3>
            <ul className="mt-5 space-y-4">
              {contactItems.map((item) => {
                const content = (
                  <>
                    <item.icon className="mt-0.5 size-4 shrink-0 text-[#2563eb]" strokeWidth={1.8} />
                    <span className="text-sm leading-relaxed text-[#6b7280]">{item.label}</span>
                  </>
                );
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="flex items-start gap-3 transition-colors duration-200 hover:text-[#0a0a14]"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-start gap-3">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col-reverse items-center gap-3 border-t border-[#f3f4f6] pt-8 sm:flex-row sm:justify-between md:mt-16">
          <p className="text-xs text-[#9ca3af]">
            © {new Date().getFullYear()} Wooyou Creative. All rights reserved.
          </p>
          <Link
            href="/privacy-policy"
            className="text-xs text-[#9ca3af] transition-colors hover:text-[#0a0a14]"
          >
            {t("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
