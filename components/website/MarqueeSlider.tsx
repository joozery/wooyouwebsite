const technologies = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "MongoDB",
  "Tailwind CSS",
  "WordPress",
  "AWS",
  "Figma",
  "Flutter",
  "Express",
  "Framer Motion",
];

export default function MarqueeSlider() {
  const items = [...technologies, ...technologies];

  return (
    <section className="border-y border-hairline bg-surface-soft py-6">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-12">
          {items.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="text-sm font-medium whitespace-nowrap text-muted-soft"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
