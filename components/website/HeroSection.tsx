export default function HeroSection() {
  return (
    <section className="relative h-[70svh] w-full overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover"
        src="/motionhero/wooyoumotion.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </section>
  );
}
