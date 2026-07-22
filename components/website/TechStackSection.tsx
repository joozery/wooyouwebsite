import { techCategories } from "@/lib/techStack";

export default function TechStackSection() {
  return (
    <section className="bg-canvas py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-[1.5px] text-brand-cyan uppercase">
            Tech Stack
          </span>
          <h2 className="mt-4 text-4xl font-medium tracking-[-0.02em] text-ink md:text-5xl">
            เทคโนโลยีที่เราใช้
          </h2>
          <p className="mt-5 leading-relaxed text-body-soft">
            เราเลือกเครื่องมือที่เหมาะกับแต่ละโปรเจค
            เพื่อให้ได้ระบบที่เร็ว ปลอดภัย และดูแลต่อได้ในระยะยาว
          </p>
        </div>

        <div className="mt-14 space-y-12">
          {techCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-sm font-semibold tracking-[1.5px] text-muted-soft uppercase">
                {category.title}
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {category.items.map((tech) => (
                  <div
                    key={tech.name}
                    className="group rounded-2xl border border-hairline bg-surface-card p-5 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <span
                      className="flex size-12 items-center justify-center rounded-xl bg-white p-2.5 [&>svg]:h-full [&>svg]:w-full"
                      dangerouslySetInnerHTML={{ __html: tech.svg }}
                    />
                    <h4 className="mt-4 text-sm font-semibold text-ink">
                      {tech.name}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-body-soft">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
