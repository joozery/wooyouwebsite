export default function HeroSection() {
  return (
    <section className="bg-canvas px-3 pt-20 sm:px-6">
      <div className="mx-auto max-w-[1548px]">
        <video
          className="aspect-video max-h-[70svh] w-full rounded-3xl border border-hairline object-cover"
          src="/motionhero/wooyoumotion.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
    </section>
  );
}
