import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";

const Landing = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Hero />
            <Features />

            <footer className="bg-slate-900 text-slate-300 py-10 text-center">
                © 2026 Travel Guide AI. All rights reserved.
            </footer>
        </div>
    );
};

export default Landing;
