import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[82svh] w-full overflow-hidden">
      <Image
        src="/logo/hero.png"
        alt="Wooyou Galaxy — Creative Tech from the Next Dimension"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </section>
  );
}
