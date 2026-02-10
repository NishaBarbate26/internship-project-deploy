import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ItineraryForm from "../components/ItineraryForm";

export default function CreateItinerary() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/auth-bg.avif')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-white mb-8 hover:text-blue-400 transition"
        >
          <FaArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="text-center mb-14">
          <h1 className="text-6xl font-black text-white mb-4">
            Plan Your Perfect Trip
          </h1>
          <p className="text-gray-100 text-xl">
            Share your travel preferences and let AI plan it for you
          </p>
        </div>

        {/* Itinerary Form */}
        <ItineraryForm />
      </div>
    </div>
  );
}
