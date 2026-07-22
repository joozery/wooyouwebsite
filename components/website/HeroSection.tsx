import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[82svh] w-full overflow-hidden bg-canvas">
      <Image
        src="/logo/hero.png"
        alt="Wooyou Galaxy — Creative Tech from the Next Dimension"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* ละลายขอบล่างของภาพเข้ากับสีพื้น section ถัดไป */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-canvas via-canvas/60 to-transparent" />
    </section>
  );
}
