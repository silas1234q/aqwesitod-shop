const Lookbook = () => {
  const looks = [
    {
      id: 1,
      title: "Spring Essentials",
      description: "Light layers for transitional weather",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
    },
    {
      id: 2,
      title: "Urban Minimalism",
      description: "Elevated basics for city living",
      image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800"
    }
  ];

  return (
    <section className="bg-[#FAFAFA] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-4 font-light">
            Style Inspiration
          </p>
          <h2 className="font-light text-5xl md:text-6xl text-gray-900 tracking-tight">
            Lookbook
          </h2>
        </div>

        {/* Lookbook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {looks.map((look) => (
            <div key={look.id} className="group relative h-150 overflow-hidden cursor-pointer">
              <img
                src={look.image}
                alt={look.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-500"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-12">
                <h3 className="text-white text-3xl md:text-4xl font-light mb-3 tracking-wide">
                  {look.title}
                </h3>
                <p className="text-white/90 text-sm font-light tracking-wide mb-6">
                  {look.description}
                </p>
                <button className="text-white text-sm font-medium tracking-[0.2em] uppercase border-b-2 border-white/50 hover:border-white transition-all pb-2 w-fit">
                  Shop The Look
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Lookbook;