import { ChevronDown } from "lucide-react";

const Hero = () => {
  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
          src="/videos/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Center Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter uppercase">
          TRAVEL JOURNEY
        </h1>

        <span className="text-white text-4xl md:text-5xl font-script mt-2">
          Guide
        </span>

        <p className="text-white/90 text-xl md:text-2xl mt-8 font-medium">
          Your journey starts here
        </p>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer select-none"
        onClick={handleScrollDown}
        role="button"
        aria-label="Scroll down"
      >
        <span className="text-white/90 text-xs tracking-widest uppercase font-bold animate-pulse">
          Scroll Down
        </span>
        <ChevronDown className="w-6 h-6 text-white animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
