import { useEffect, useState } from "react";
import { getUserItineraries } from "../services/itineraryService";
import ItineraryCard from "./ItineraryCard";
import { useNavigate } from "react-router-dom";

export default function ItineraryList() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await getUserItineraries();
        setItineraries(res.data || []);
      } catch (err) {
        setError("Failed to load itineraries");
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 px-10 text-lg font-semibold text-white">
        <div className="animate-pulse">Exploring your journeys...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 px-10 text-red-400 font-semibold">
        {error}
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <div className="text-center py-24 max-w-md mx-auto">
        <h2 className="text-3xl font-black mb-4 text-white">
          No trips planned yet ✈️
        </h2>
        <p className="text-white/70 mb-10 text-lg">
          Ready to escape the ordinary? Let our AI design a journey perfectly
          tailored to you.
        </p>
        <button
          onClick={() => navigate("/create-itinerary")}
          className="px-10 py-4 border-2 border-blue-400 text-blue-400 rounded-full font-bold hover:bg-blue-400 hover:text-gray-900 transition-all duration-300"
        >
          Start your journey →
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center justify-center">
      {itineraries.map((itinerary) => (
        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
      ))}
    </div>
  );
}
