const stack = [
  "React / Next.js",
  "Node.js + Express",
  "MongoDB",
  "TypeScript",
  "Tailwind CSS",
  "AWS Cloud",
  "CI/CD",
  "SEO Optimization",
];

export default function IntroTechSection() {
  return (
    <section className="bg-canvas py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold tracking-[1.5px] text-brand-cyan uppercase">
              Technology
            </span>
            <h2 className="mt-4 text-4xl font-medium tracking-[-0.02em] text-ink md:text-5xl">
              เทคโนโลยีทันสมัย
              <br />
              ที่เราเลือกใช้
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-body-soft">
              เราเลือกใช้เทคโนโลยีที่เหมาะกับแต่ละโปรเจค
              เพื่อให้ได้ระบบที่เร็ว ปลอดภัย และดูแลต่อได้ในระยะยาว
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-hairline bg-surface-card px-5 py-2.5 text-sm font-medium text-body-soft"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
