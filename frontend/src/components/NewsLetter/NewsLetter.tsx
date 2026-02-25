import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="bg-gray-900 py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4 font-light">
          Stay Connected
        </p>
        <h2 className="font-light text-4xl md:text-5xl text-white tracking-tight mb-6">
          Join Our Community
        </h2>
        <p className="text-white/80 font-light text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          Be the first to know about new arrivals, exclusive offers, and style inspiration.
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-none text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-gray-900 font-medium text-sm tracking-[0.2em] uppercase hover:bg-white/90 transition-colors"
            >
              Subscribe
            </button>
          </div>
          <p className="text-white/50 text-xs mt-4 font-light">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;