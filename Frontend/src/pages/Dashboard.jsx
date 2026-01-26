import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { FaPlusCircle, FaPlaneDeparture } from "react-icons/fa";

export default function Dashboard() {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center relative transition-all duration-700"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80')",
            }}
        >
            {/* Soft Clearance Overlay */}
            <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"></div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Navbar - Deep Dark Gray with Glass Glow */}
                <nav className="flex justify-between items-center px-12 py-6 backdrop-blur-2xl bg-gray-900/95 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                    <Link
                        to="/"
                        className="text-3xl font-black text-white tracking-tighter hover:text-blue-400 transition-all duration-300 transform hover:scale-105"
                    >
                        TRAVEL<span className="text-blue-400">AI</span>
                    </Link>

                    <div className="flex items-center gap-10">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-bold">User Session</span>
                            <span className="text-sm font-medium text-white/90">{user?.email}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-800 text-white font-bold px-6 py-2 rounded-full border border-white/10 shadow-lg hover:bg-red-500 hover:border-red-400 hover:shadow-red-500/40 transition-all duration-300 active:scale-95"
                        >
                            Logout
                        </button>
                    </div>
                </nav>

                {/* Header Section */}
                <header className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row md:justify-between md:items-center gap-6 w-full">
                    <div className="animate-fade-in">
                        <h1 className="text-6xl font-black text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] mb-3 tracking-tight">
                            My Itineraries
                        </h1>
                        <p className="text-white/90 max-w-xl font-light text-xl tracking-wide leading-relaxed border-l-2 border-blue-400/50 pl-4">
                            Welcome, <span className="font-semibold text-blue-300">{user?.email?.split('@')[0]}</span>. Your dream destinations are one click away.
                        </p>
                    </div>

                    <Link
                        to="/create-itinerary"
                        className="group relative inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-gray-950 font-black rounded-xl px-8 py-4 shadow-[0_10px_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-400/60"
                    >
                        <FaPlusCircle className="text-2xl transition-transform group-hover:rotate-90 duration-500" />
                        <span className="tracking-wider uppercase text-sm">New Adventure</span>
                    </Link>
                </header>

                {/* Main Content - Enhanced Card Glow */}
                <main className="flex-grow max-w-5xl mx-auto px-6 mb-20 w-full">
                    <section
                        className="relative overflow-hidden bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-14 text-center shadow-2xl transition-all duration-500 hover:bg-white/10 hover:border-blue-400/50 group cursor-default"
                    >
                        {/* Hidden Glow Effect that shows on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-blue-400/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner">
                                <FaPlaneDeparture className="text-blue-400 text-5xl group-hover:text-blue-300 transition-colors" />
                            </div>

                            <h2 className="text-4xl font-black mb-4 text-white drop-shadow-md tracking-tight">
                                No trips planned yet
                            </h2>
                            <p className="max-w-md mx-auto mb-10 text-white/70 font-light text-xl tracking-wide leading-relaxed">
                                Ready to escape the ordinary? Let our AI design a journey perfectly tailored to you.
                            </p>

                            <Link
                                to="/create-itinerary"
                                className="inline-block px-12 py-4 bg-transparent border-2 border-blue-400 text-blue-400 rounded-full font-bold text-lg hover:bg-blue-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Start your journey →
                            </Link>
                        </div>
                    </section>
                </main>

                <footer className="py-8 text-center text-white/30 text-[10px] tracking-[0.5em] uppercase font-bold bg-black/40 border-t border-white/5">
                    &copy; 2026 Travel Guide AI &bull; Created for {user?.email}
                </footer>
            </div>
        </div>
    );
}