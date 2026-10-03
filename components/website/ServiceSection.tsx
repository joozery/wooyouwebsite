import { getTranslations } from "next-intl/server";
import ServiceCards from "./ServiceCards";

export default async function ServiceSection() {
  const t = await getTranslations("services");
  return (
    <section 
      className="relative overflow-hidden pt-8 pb-16 md:pb-28 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/coverser.png')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#05050f]/80 backdrop-blur-[2px]" />

      {/* blend กับ hero ด้านบน */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-canvas to-transparent z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[2px] text-white/35 uppercase">
            Services
          </span>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 leading-relaxed text-white/45">
            {t("subtitle")}
          </p>
        </div>

        <ServiceCards />
      </div>

      {/* fade ต่อไป section ถัดไป */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-canvas" />
    </section>
  );
}
