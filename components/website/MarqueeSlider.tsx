import { techList } from "@/lib/techStack";

export default function MarqueeSlider() {
  const items = [...techList, ...techList];

  return (
    <section className="border-y border-hairline bg-surface-soft py-5">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-10">
          {items.map((tech, i) => (
            <span
              key={`${tech.name}-${i}`}
              className="flex items-center gap-2.5 whitespace-nowrap"
            >
              <span
                className="flex size-7 items-center justify-center rounded-md bg-white p-1.5 [&>svg]:h-full [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: tech.svg }}
              />
              <span className="text-sm font-medium text-body-soft">
                {tech.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
