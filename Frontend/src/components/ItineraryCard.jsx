import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

export default function ItineraryCard({ itinerary }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/itinerary-details/${itinerary.id}`, {
          state: { itinerary: itinerary.itinerary },
        })
      }
      className="
        w-80
        cursor-pointer
        bg-white/95
        rounded-3xl
        p-7
        shadow-[0_10px_30px_rgba(0,0,0,0.1)]
        border border-white/20
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]
        transition-all
        duration-300
        hover:-translate-y-2
        group
      "
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
          <span className="block text-blue-600 mb-1">
            <FaMapMarkerAlt className="inline mr-2 text-xl" />
          </span>
          {itinerary.destination}
        </h3>
      </div>

      <div className="space-y-2 mb-6">
        <p className="text-gray-600 font-medium flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400" />
          {itinerary.start_date} — {itinerary.end_date}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
          Created {new Date(itinerary.created_at).toLocaleDateString()}
        </p>
        <span className="text-blue-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          View Details →
        </span>
      </div>
    </div>
  );
}
