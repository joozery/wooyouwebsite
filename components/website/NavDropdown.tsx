import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

const services = [
  { slug: "web-development", title: "Web Development", image: "/navbaricon/webdevelopment-cutout.webp" },
  { slug: "ui-ux-design", title: "UI/UX Design", image: "/navbaricon/uxui-cutout.webp" },
  { slug: "digital-marketing", title: "Digital Marketing", image: "/navbaricon/digitalmarketing-cutout.webp" },
  { slug: "erp-systems", title: "ERP Systems", image: "/navbaricon/erp.webp" },
  { slug: "game-development", title: "Game Development", image: "/navbaricon/game.webp" },
  { slug: "mobile-apps", title: "Mobile Apps", image: "/navbaricon/mobileapp.webp" },
];

// TODO: แทนรูป placeholder ด้วยภาพหน้าจอผลงานจริงของแต่ละหมวด (3 รูป/หมวด)
const works = [
  { slug: "corporate", title: "เว็บไซต์องค์กร", images: ["/covercon.png", "/coverser.png", "/hr.png"] },
  { slug: "ecommerce", title: "อีคอมเมิร์ซ", images: ["/ecommerce.png", "/warehouse.png", "/ticket.png"] },
  { slug: "promotion", title: "โปรโมชันและแลนดิ้งเพจ", images: ["/coverser.png", "/covercon.png", "/ecommerce.png"] },
  { slug: "saas", title: "บริการและ SaaS", images: ["/covererp.png", "/hr.png", "/coverser.png"] },
  { slug: "system", title: "ระบบ ERP และระบบองค์กร", images: ["/covererp.png", "/warehouse.png", "/hr.png"] },
  { slug: "app-game", title: "แอปและเกม", images: ["/ticket.png", "/covercon.png", "/ecommerce.png"] },
];

const HOVER = "[@media(hover:hover)_and_(pointer:fine)]";
const fan = [
  `${HOVER}:group-hover/card:[transform:translateY(25%)_rotate(5deg)]`,
  `${HOVER}:group-hover/card:[transform:translate(-13%,34%)]`,
  `${HOVER}:group-hover/card:[transform:translate(-44%,31%)_rotate(-5deg)]`,
];

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="invisible absolute inset-x-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100">
      <div className="grid grid-cols-[300px_1fr] gap-6 rounded-[22px] border border-black/5 bg-white p-5 shadow-[0_12px_40px_rgba(10,10,10,0.12)] xl:grid-cols-[338px_1fr]">
        {children}
      </div>
    </div>
  );
}

function Left({
  title,
  sub,
  href,
  image,
  wide,
}: {
  title: string;
  sub: string;
  href: string;
  image?: string;
  wide?: boolean;
}) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#fafafa] p-6">
      {image && (
        <Image
          src={image}
          alt=""
          width={wide ? 900 : 320}
          height={wide ? 506 : 260}
          className={
            wide
              ? "pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full mix-blend-multiply"
              : "pointer-events-none absolute bottom-0 left-1/2 w-[92%] max-w-[320px] -translate-x-1/2 object-contain"
          }
        />
      )}
      <div className="relative">
        <p className="text-4xl font-black tracking-tight text-[#0a0a0a]">{title}</p>
        <p className="mt-1 text-sm text-[#6b6b6b]">{sub}</p>
      </div>
      <Link
        href={href}
        aria-label={sub}
        className="relative z-10 mt-10 inline-flex size-12 items-center justify-center self-end rounded-full bg-[#0a0a0a] text-white transition-transform hover:scale-110"
      >
        <ArrowRight className="size-5" />
      </Link>
    </div>
  );
}

export function ServiceDropdown() {
  const t = useTranslations();
  return (
    <Shell>
      <Left title="SERVICE" sub={t("nav.serviceSub")} href="/service" image="/navbaricon/service.webp" />
      <div className="grid grid-cols-3 gap-3">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/service/${s.slug}`}
            className="group/card relative flex h-[160px] flex-col justify-between overflow-hidden rounded-2xl bg-[#fafafa] p-4 transition-colors hover:bg-[#f0f0f0]"
          >
            <div className="relative z-10 max-w-[60%] text-[#0a0a0a]">
              <p className="flex items-center gap-1 text-sm font-semibold">
                {s.title}
                <ArrowUpRight className="size-4 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#6b6b6b]">{t(`services.desc.${s.slug}`)}</p>
            </div>
            <Image
              src={s.image}
              alt=""
              width={140}
              height={140}
              className="absolute bottom-0 right-3 h-[120px] w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover/card:scale-105"
            />
          </Link>
        ))}
      </div>
    </Shell>
  );
}

export function WorksDropdown() {
  const t = useTranslations();
  return (
    <Shell>
      <Left title="WORKS" sub={t("nav.worksSub")} href="/portfolio" image="/navbaricon/work.webp" wide />
      <div className="grid grid-cols-3 gap-3">
        {works.map((w) => (
          <Link
            key={w.slug}
            href={`/portfolio?category=${w.slug}`}
            className="group/card relative flex h-[149px] overflow-hidden rounded-2xl bg-[#fafafa] p-4 transition-colors hover:bg-[#f0f0f0]"
          >
            <p className="relative z-40 flex h-fit items-center gap-1 text-sm font-semibold text-[#0a0a0a]">
              {t(`nav.workCat.${w.slug}`)}
              <ArrowUpRight className="size-4" />
            </p>
            <div className="absolute bottom-0 right-4 aspect-[250/210] w-[47.45%]">
              {w.images.map((src, i) => (
                <Image
                  key={src + i}
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className={`rounded-md object-cover shadow-md transition-transform duration-500 ease-out ${fan[i]}`}
                  style={{ zIndex: 30 - i * 10 }}
                />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
