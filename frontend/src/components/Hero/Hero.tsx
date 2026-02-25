import { Link } from "react-router-dom";
import heroImg from "../../assets/heroImage4.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen">
      {/* Background Image */}
      <img
        src={heroImg}
        alt="New collection hero"
        className="absolute inset-0 h-full w-full object-cover opacity-90 object-left"
      />

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/60" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start pt-20 md:pt-24">
        <div className="max-w-3xl">
          {/* Small Label */}
          <p className="text-white/80 text-sm tracking-[0.3em] uppercase mb-8 font-light">
            Spring/Summer 2026
          </p>

          {/* Main Heading */}
          <h1 className="text-white font-light tracking-tight leading-[0.95] mb-8">
            <span className="block text-6xl md:text-7xl lg:text-8xl">New</span>
            <span className="block text-6xl md:text-7xl lg:text-8xl md:ml-16">
              Collection
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-white/90 text-lg md:text-xl font-light mb-12 max-w-xl leading-relaxed">
            Timeless elegance meets contemporary design. Discover pieces crafted
            for the modern wardrobe.
          </p>

          {/* CTA Button */}
          <Link
            to="/collections"
            className="inline-flex items-center gap-3 text-white text-sm tracking-[0.2em] uppercase font-medium
                       border-b-2 border-white/50 hover:border-white pb-2 transition-all duration-300 group"
          >
            Explore Collection
            <svg
              className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2">
          <div className="w-1 h-2 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;