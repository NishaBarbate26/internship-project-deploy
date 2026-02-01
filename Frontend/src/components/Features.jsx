const Features = () => {
  const features = [
    {
      title: "Mountain Retreats",
      desc: "Breathtaking Peaks",
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Urban Exploring",
      desc: "Modern Marvels",
      img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Coastal Escapes",
      desc: "Serene Horizons",
      img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Cultural Journeys",
      desc: "Rich Traditions",
      img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <section className="mt-12 pt-32 pb-24 bg-gradient-to-b from-slate-100 via-gray-50 to-white relative z-20">
      {/* Decorative divider */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full" />

      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          Expert Guidance for Every Vibe
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
            >
              {/* Image */}
              <img
                src={f.img}
                alt={f.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              {/* Text */}
              <div className="absolute bottom-0 left-0 p-6 w-full transform transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
                  {f.desc}
                </p>
                <h3 className="text-white font-bold text-2xl">{f.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
