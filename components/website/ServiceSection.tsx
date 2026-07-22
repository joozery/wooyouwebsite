import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Gamepad2,
  LayoutDashboard,
  Megaphone,
  Palette,
  Smartphone,
} from "lucide-react";

const services = [
  {
    slug: "web-development",
    title: "Web Development",
    description:
      "เว็บไซต์และ Web Application ที่เร็ว ปลอดภัย รองรับทุกอุปกรณ์",
    icon: Code2,
    cardClass: "bg-brand-blue text-white",
    mutedClass: "text-white/75",
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    description: "ออกแบบประสบการณ์ใช้งานที่สวยงามและใช้ง่ายจริง",
    icon: Palette,
    cardClass: "bg-brand-lavender text-canvas",
    mutedClass: "text-canvas/70",
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    description: "SEO และโฆษณาออนไลน์ที่วัดผลได้ เพิ่มยอดขายจริง",
    icon: Megaphone,
    cardClass: "bg-brand-teal text-canvas",
    mutedClass: "text-canvas/70",
  },
  {
    slug: "erp-systems",
    title: "ERP Systems",
    description: "ระบบบริหารธุรกิจครบวงจร ใบเสนอราคาถึงบัญชี",
    icon: LayoutDashboard,
    cardClass: "bg-brand-orange text-canvas",
    mutedClass: "text-canvas/70",
  },
  {
    slug: "game-development",
    title: "Game Development",
    description: "เกม 2D/3D และ interactive experience บนทุกแพลตฟอร์ม",
    icon: Gamepad2,
    cardClass: "bg-brand-indigo text-white",
    mutedClass: "text-white/75",
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps",
    description: "แอปมือถือ iOS และ Android ที่ตอบโจทย์ธุรกิจ",
    icon: Smartphone,
    cardClass: "bg-brand-pink text-white",
    mutedClass: "text-white/75",
  },
];

export default function ServiceSection() {
  return (
    <section className="bg-canvas py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-[1.5px] text-brand-lavender uppercase">
            Services
          </span>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.02em] text-ink md:text-5xl">
            บริการของเรา
          </h2>
          <p className="mt-5 leading-relaxed text-body-soft">
            ครอบคลุมทุกความต้องการด้านดิจิทัล ตั้งแต่เว็บไซต์ไปจนถึงระบบหลังบ้าน
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/service/${service.slug}`}
              className={`group rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1 ${service.cardClass}`}
            >
              <div className="flex items-start justify-between">
                <service.icon className="size-9" strokeWidth={1.75} />
                <ArrowUpRight className="size-5 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mt-8 text-lg font-semibold">{service.title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${service.mutedClass}`}>
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
