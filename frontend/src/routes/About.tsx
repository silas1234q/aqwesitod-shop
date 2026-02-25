const About = () => {
  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-6 font-light">
            Our Story
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight mb-8">
            About Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
            Redefining modern elegance through timeless design and exceptional craftsmanship
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
                Our Beginning
              </h2>
              <p className="text-gray-700 font-light leading-relaxed text-lg">
                Founded in 2020, we started with a simple belief: fashion should be
                timeless, sustainable, and accessible. What began as a small studio
                has grown into a global brand, but our commitment to quality and
                craftsmanship remains unchanged.
              </p>
              <p className="text-gray-700 font-light leading-relaxed text-lg">
                Every piece we create is designed to transcend seasons, combining
                classic silhouettes with contemporary details. We work with the
                finest materials and ethical manufacturers to ensure each garment
                meets our exacting standards.
              </p>
            </div>
            <div className="aspect-4/5 bg-gray-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea3c3f49?w=800"
                alt="Our studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
              Our Values
            </h2>
            <div className="w-16 h-px bg-gray-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide">
                Quality First
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We source only the finest materials and work with skilled artisans
                to create pieces that last.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide">
                Sustainability
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Environmental responsibility guides every decision, from design to
                delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide">
                Ethical Practice
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Fair wages, safe conditions, and respect for everyone in our supply
                chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Grid Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"
                alt="Collection 1"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"
                alt="Collection 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
                alt="Collection 3"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (Optional) */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
              Meet Our Team
            </h2>
            <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
              The passionate people behind every collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: "Sarah Johnson", role: "Creative Director", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" },
              { name: "Michael Chen", role: "Head of Design", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
              { name: "Emma Williams", role: "Sustainability Lead", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="aspect-3/4 bg-gray-200 mb-4 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 font-light tracking-wide uppercase">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-8">
            Join Our Journey
          </h2>
          <p className="text-gray-600 font-light text-lg mb-12 leading-relaxed">
            Be part of our community and get exclusive access to new collections,
            behind-the-scenes content, and special offers.
          </p>
          <a
            href="/collections"
            className="inline-flex items-center gap-3 text-gray-900 text-sm tracking-[0.2em] uppercase font-medium border-b-2 border-gray-900/30 hover:border-gray-900 pb-2 transition-all duration-300 group"
          >
            Shop Collection
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;