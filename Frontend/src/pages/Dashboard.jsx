import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import ItineraryList from "../components/ItineraryList";

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
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-12 py-6 backdrop-blur-2xl bg-gray-900/95 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <Link
            to="/"
            className="text-3xl font-black text-white tracking-tighter hover:text-blue-400 transition-all duration-300 transform hover:scale-105"
          >
            TRAVEL<span className="text-blue-400">AI</span>
          </Link>

          <div className="flex items-center gap-10">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-bold">
                User Session
              </span>
              <span className="text-sm font-medium text-white/90">
                {user?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-800 text-white font-bold px-6 py-2 rounded-full border border-white/10 shadow-lg hover:bg-red-500 hover:border-red-400 hover:shadow-red-500/40 transition-all duration-300 active:scale-95"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Header */}
        <header className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row md:justify-between md:items-center gap-6 w-full">
          <div>
            <h1 className="text-6xl font-black text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] mb-3 tracking-tight">
              My Itineraries
            </h1>
            <p className="text-white/90 max-w-xl font-light text-xl tracking-wide leading-relaxed border-l-2 border-blue-400/50 pl-4">
              Welcome,{" "}
              <span className="font-semibold text-blue-300">
                {user?.email?.split("@")[0]}
              </span>
              . Your dream destinations are one click away.
            </p>
          </div>

          <Link
            to="/create-itinerary"
            className="group relative inline-flex items-center gap-3 bg-blue-500 hover:bg-blue-400 text-gray-950 font-black rounded-xl px-8 py-4 shadow-[0_10px_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-400/60"
          >
            <FaPlusCircle className="text-2xl transition-transform group-hover:rotate-90 duration-500" />
            <span className="tracking-wider uppercase text-sm">
              New Adventure
            </span>
          </Link>
        </header>

        {/* MAIN CONTENT - Centering Logic Improved */}
        <main className="flex-grow w-full px-6 mb-20 flex justify-center">
          <div
            className="
              w-fit 
              max-w-7xl
              h-fit
              bg-white/10 
              backdrop-blur-xl 
              rounded-[2.5rem] 
              border border-white/20 
              px-6 py-10 md:px-12
              shadow-2xl
              transition-all duration-500
            "
          >
            <ItineraryList />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-white/30 text-[10px] tracking-[0.5em] uppercase font-bold bg-black/40 border-t border-white/5">
          &copy; 2026 Travel Guide AI • Created for {user?.email}
        </footer>
      </div>
    </div>
  );
}
