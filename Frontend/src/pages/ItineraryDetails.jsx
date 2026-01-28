import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUtensils,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaUsers,
  FaMoneyBillWave,
  FaStar,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

import { getItineraryById } from "../services/itineraryService";
import ChatInterface from "../components/ChatInterface";

/* ------------------- UI Components ------------------- */

const TimeSlot = ({ title, content, icon: Icon }) => (
  <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
    <div className="flex items-center gap-2 mb-1">
      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
        <Icon className="text-lg" />
      </div>
      <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-blue-300">
        {title}
      </h4>
    </div>

    <p className="text-white font-semibold text-base pl-1">
      {content || "Not provided"}
    </p>
  </div>
);

const PreferenceTag = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/20">
    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
      <Icon size={18} />
    </div>

    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-300 font-bold">
        {label}
      </p>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  </div>
);

/* ------------------- Main Page ------------------- */

export default function ItineraryDetails() {
  const navigate = useNavigate();
  const { itinerary_id } = useParams();

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ------------------- Load Itinerary ------------------- */

  useEffect(() => {
    fetchItinerary();
  }, [itinerary_id]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);

      const res = await getItineraryById(itinerary_id);

      // ✅ Always use res.data
      setItinerary(res.data);
    } catch (err) {
      setError(err.message || "Failed to load itinerary details");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- Instant UI Update Handler ------------------- */

  const handleItineraryUpdate = useCallback((updatedData) => {
    setItinerary((prev) => {
      if (!prev) return null;

      console.log("✅ UI Updating With:", updatedData);

      return {
        ...prev,

        // ✅ Correct merge inside itinerary.itinerary
        itinerary: {
          ...prev.itinerary,
          ...(updatedData.updated_itinerary || {}),
        },

        // ✅ Correct merge preferences
        preferences: {
          ...prev.preferences,
          ...(updatedData.updated_preferences || {}),
        },
      };
    });
  }, []);

  /* ------------------- Loading UI ------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <FaSpinner className="animate-spin text-5xl text-blue-400" />
      </div>
    );
  }

  /* ------------------- Error UI ------------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-white/10 border border-red-500/40 rounded-2xl p-8 text-center">
          <FaExclamationTriangle className="text-red-400 text-4xl mx-auto mb-3" />
          <h2 className="text-white text-xl font-bold mb-2">
            Failed to Load Itinerary
          </h2>

          <p className="text-gray-300 mb-5">{error}</p>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl text-white font-bold"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!itinerary) return null;

  /* ------------------- Extract Data ------------------- */

  const itineraryContent = itinerary.itinerary || {};
  const days = itineraryContent.days || [];

  const preferences = itinerary.preferences || {};

  const travelStyle = preferences.travel_style || "Not specified";
  const budget = preferences.budget || "Not specified";
  const groupSize = preferences.group_size || "Not specified";

  /* ------------------- UI ------------------- */

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Preferences */}
        <section className="bg-white/10 rounded-2xl p-5 border border-white/20">
          <h2 className="text-xs uppercase tracking-[0.3em] text-blue-300 font-black mb-4 flex gap-2 items-center">
            <FaStar className="text-blue-400" />
            Travel Preferences
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <PreferenceTag icon={FaStar} label="Style" value={travelStyle} />
            <PreferenceTag
              icon={FaMoneyBillWave}
              label="Budget"
              value={budget}
            />
            <PreferenceTag icon={FaUsers} label="Travelers" value={groupSize} />
          </div>
        </section>

        {/* Days */}
        <section className="space-y-8">
          {days.map((day, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-xl font-black">
                Day {day.day}: {day.title}
              </h3>

              <TimeSlot title="Morning" content={day.morning} icon={FaSun} />
              <TimeSlot
                title="Afternoon"
                content={day.afternoon}
                icon={FaCloudSun}
              />
              <TimeSlot title="Evening" content={day.evening} icon={FaMoon} />
              <TimeSlot title="Cuisine" content={day.food} icon={FaUtensils} />
            </div>
          ))}
        </section>

        {/* Chat */}
        <ChatInterface
          itineraryId={parseInt(itinerary_id)}
          onItineraryUpdate={handleItineraryUpdate}
        />
      </div>
    </div>
  );
}
