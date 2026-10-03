import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function CTASection() {
  const t = await getTranslations("cta");
  return (
    <section 
      className="relative bg-[#05050f] py-16 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/covercon.png')" }}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl text-left">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-[64px] leading-tight md:leading-[1.1]">
            {t.rich("title", {
              br: () => <br />,
              hl: (chunks) => (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  {chunks}
                </span>
              ),
            })}
          </h2>
          <p className="mt-6 max-w-lg text-base sm:text-lg text-gray-400 leading-relaxed">
            {t.rich("desc", { br: () => <br className="hidden sm:block" /> })}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-start gap-4">
            <Link
              href="/contact"
              className="inline-flex h-14 w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-blue-600 px-8 text-base font-medium text-white transition-colors hover:bg-blue-700"
            >
              {t("contact")}
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href="/service"
              className="inline-flex h-14 w-full sm:w-auto justify-center items-center rounded-full border border-white/20 bg-transparent px-8 text-base font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {t("all")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
