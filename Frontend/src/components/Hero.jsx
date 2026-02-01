import { ChevronDown } from "lucide-react";

const Hero = () => {
  const handleScrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background Container */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full"
          style={{
            width: "100vw",
            height: "56.25vw", // 16:9 Aspect Ratio
            minHeight: "100vh",
            minWidth: "177.77vh", // 16:9 Aspect Ratio
          }}
          src="https://www.youtube.com/embed/RFmQSO2fO30?autoplay=1&mute=1&loop=1&playlist=RFmQSO2fO30&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1"
          title="Background Video"
          allow="autoplay; encrypted-media"
          frameBorder="0"
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
