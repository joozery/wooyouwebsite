import { techCategories } from "@/lib/techStack";

const categoryAccents = [
  "from-brand-blue to-brand-cyan",
  "from-brand-teal to-brand-blue",
  "from-brand-purple to-brand-pink",
];

export default function TechStackSection() {
  return (
    <section className="bg-canvas py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold tracking-[1.5px] text-brand-cyan uppercase">
            Tech Stack
          </span>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.02em] text-ink md:text-5xl">
            เทคโนโลยีที่เราใช้
          </h2>
          <p className="mt-5 leading-relaxed text-body-soft">
            เราเลือกเครื่องมือที่เหมาะกับแต่ละโปรเจค เพื่อให้ได้ระบบที่เร็ว
            ปลอดภัย และดูแลต่อได้ในระยะยาว
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {techCategories.map((category, i) => (
            <div
              key={category.title}
              className="overflow-hidden rounded-3xl border border-hairline bg-surface-soft"
            >
              <div className={`h-1 bg-gradient-to-r ${categoryAccents[i]}`} />
              <div className="p-7">
                <h3 className="text-sm font-semibold tracking-[1.5px] text-ink uppercase">
                  {category.title}
                </h3>
                <ul className="mt-6 space-y-2">
                  {category.items.map((tech) => (
                    <li
                      key={tech.name}
                      className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-surface-card"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white p-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className="size-full object-contain"
                          loading="lazy"
                        />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">
                          {tech.name}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-body-soft">
                          {tech.description}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
