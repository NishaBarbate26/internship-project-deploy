import { useEffect, useState } from "react";
import { getUserItineraries } from "../services/itineraryService";
import ItineraryCard from "./ItineraryCard";

export default function ItineraryList({ onCountChange }) {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await getUserItineraries();
        const data = res.data || [];

        setItineraries(data);

        onCountChange?.(data.length);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [onCountChange]);

  const handleDeleted = (id) => {
    setItineraries((prev) => {
      const updated = prev.filter((it) => it.id !== id);

      onCountChange?.(updated.length);

      if (index >= updated.length && index > 0) {
        setIndex(Math.max(0, index - 3));
      }

      return updated;
    });
  };

  const showNext = () => {
    if (index + 3 < itineraries.length) setIndex(index + 3);
  };

  const showPrev = () => {
    if (index - 3 >= 0) setIndex(index - 3);
  };

  const visibleItineraries = itineraries.slice(index, index + 3);

  if (loading) {
    return (
      <div className="flex gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-[300px] h-[380px] rounded-2xl bg-white/10 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (itineraries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex gap-8">
        {visibleItineraries.map((itinerary) => (
          <ItineraryCard
            key={itinerary.id}
            itinerary={itinerary}
            onDeleteSuccess={handleDeleted}
          />
        ))}
      </div>

      <div className="flex gap-16 text-blue-400 font-bold uppercase tracking-widest">
        {index > 0 && (
          <button
            onClick={showPrev}
            className="hover:text-blue-300 transition-colors"
          >
            ← View Less
          </button>
        )}

        {index + 3 < itineraries.length && (
          <button
            onClick={showNext}
            className="hover:text-blue-300 transition-colors"
          >
            View More →
          </button>
        )}
      </div>
    </div>
  );
}
