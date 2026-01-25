const Hero = () => {
    return (
        <section className="relative h-[75vh] w-full overflow-hidden">

            {/* Background Image */}
            <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
                alt="Beach"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
                <h1 className="text-white text-6xl font-extrabold tracking-wide">
                    TRAVEL JOURNEY
                </h1>

                <span className="text-white text-4xl italic font-light mt-2">
                    Guide
                </span>

                <p className="text-white/90 text-lg mt-4">
                    Your journey starts here
                </p>

                {/* Search Bar */}
                <div className="mt-8 flex items-center bg-white rounded-full shadow-lg overflow-hidden w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Search for a destination or activity..."
                        className="flex-1 px-6 py-4 outline-none text-gray-700"
                    />
                    <button className="bg-blue-600 text-white px-8 py-4 font-semibold hover:bg-blue-700 transition">
                        Explore
                    </button>
                </div>
            </div>

            {/* Bottom Fade (UX hint that content continues) */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-whit-100 via-slate-100/70 to-transparent" />
        </section>
    );
};

export default Hero;
