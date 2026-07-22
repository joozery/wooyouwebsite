import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[70svh] w-full overflow-hidden">
      <Image
        src="/logo/6f6adcc9-2757-4d94-9b85-973c655c69b1.png"
        alt="Wooyou Galaxy — Creative Tech from the Next Dimension"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </section>
  );
}
