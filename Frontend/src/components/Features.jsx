// Frontend/src/components/Features.jsx
const Features = () => {
    const features = [
        {
            title: "Mountain Retreats",
            desc: "Find the best hidden cabins and trails.",
            img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=60&w=500"
        },
        {
            title: "Urban Exploring",
            desc: "City guides that go beyond the tourist traps.",
            img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=60&w=500"
        },
        {
            title: "Coastal Escapes",
            desc: "Private beaches and waterfront dining.",
            img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=60&w=500"
        },
        {
            title: "Cultural Journeys",
            desc: "Deep dives into local history and art.",
            img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=60&w=500"
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-16">Expert Guidance for Every Vibe</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
                            <div className="h-48 overflow-hidden">
                                <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-xl mb-2">{f.title}</h3>
                                <p className="text-gray-500 text-sm">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default Features;