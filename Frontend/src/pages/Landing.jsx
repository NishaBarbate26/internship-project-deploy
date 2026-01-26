import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />
            <Hero />
            <Features />

            <footer className="bg-slate-900 text-slate-400 py-10 text-center border-t border-white/5 text-sm">
                <div className="mb-2 text-white font-semibold">Travel Guide AI</div>
                © 2026 Travel Guide AI. All rights reserved.
            </footer>
        </div>
    );
};

export default Landing;