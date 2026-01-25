import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
// Frontend/src/components/Hero.jsx
const Hero = () => (
    <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-up">
                <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                    Your Journey, <br />
                    <span className="text-indigo-600">Reimagined by AI.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Stop spending hours on Google. Our RAG-powered assistant builds 100% personalized itineraries using real-world data and hidden gems.
                </p>
                <div className="flex gap-4">
                    <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                        Start Planning
                    </button>
                </div>
            </div>

            <div className="relative floating hidden lg:block w-full max-w-lg ml-auto">
                {/* REMOVED rotate-3 HERE for a perfectly stable block */}
                <div className="img-zoom-container shadow-2xl overflow-hidden rounded-2xl border-4 border-white">
                    <Swiper
                        spaceBetween={0}
                        effect={'fade'}
                        centeredSlides={true}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Autoplay, EffectFade, Pagination]}
                        className="h-[500px] w-full"
                    >
                        <SwiperSlide>
                            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Destination 1" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Destination 2" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Destination 3" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Destination 4" />
                        </SwiperSlide>
                    </Swiper>
                </div>


            </div>
        </div>
    </section>
);
export default Hero;