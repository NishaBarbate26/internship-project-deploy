import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPrint,
  FaUtensils,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaUsers,
  FaMoneyBillWave,
  FaStar,
  FaExclamationTriangle,
  FaSpinner,
  FaHeart,
} from "react-icons/fa";
import { getItineraryById } from "../services/itineraryService";

const TimeSlot = ({ title, content, icon: Icon, iconColor }) => (
  <div className="flex flex-col gap-2 p-3 group/slot transition-all">
    <div className="flex items-center gap-2 mb-1">
      <div className={`p-1.5 rounded-lg bg-blue-500/10 ${iconColor}`}>
        <Icon className="text-lg" />
      </div>
      <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-blue-600/70">
        {title}
      </h4>
    </div>
    <p className="text-slate-900 leading-relaxed text-base font-semibold pl-1">
      {content}
    </p>
  </div>
);

const PreferenceTag = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-blue-100">
    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default function ItineraryDetails() {
  const navigate = useNavigate();
  const { itinerary_id } = useParams();

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await getItineraryById(itinerary_id);
        setItinerary(response.data);
      } catch (err) {
        console.error("Error fetching itinerary:", err);
        setError(err.message || "Failed to load itinerary details");
      } finally {
        setLoading(false);
      }
    };

    if (itinerary_id) {
      fetchItinerary();
    }
  }, [itinerary_id]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <FaSpinner className="animate-spin text-4xl mx-auto mb-4 text-blue-400" />
          <p className="text-lg font-semibold">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-md border border-red-500/30 rounded-3xl p-8 max-w-md text-center">
          <FaExclamationTriangle className="text-5xl text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Unable to Load Itinerary
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 mx-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!itinerary) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">Itinerary not found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-blue-400 hover:text-blue-300 underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Extract data from response
  const {
    destination,
    start_date,
    end_date,
    preferences,
    itinerary: itineraryContent,
    created_at,
  } = itinerary;

  const days = itineraryContent?.days || [];
  const overview = itineraryContent?.overview || "No overview available";

  // Extract preferences
  const travelStyle = preferences?.travel_style || "Not specified";
  const budget = preferences?.budget || "Not specified";
  const groupSize = preferences?.group_size || "Not specified";
  const foodPreferences =
    preferences?.food_preferences?.join(", ") || "None specified";
  const interests = preferences?.interests?.join(", ") || "None specified";
  const specialRequirements = preferences?.special_requirements;

  return (
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-blue-100 bg-slate-950">
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      <div className="fixed inset-0 z-0 bg-blue-950/60 backdrop-blur-[2px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 lg:py-16 w-full">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-12 print:hidden">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 text-white drop-shadow-md hover:text-blue-200 transition-all duration-300 py-2 group"
          >
            <FaArrowLeft
              size={26}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-xl font-bold tracking-tight">
              Back to Itineraries
            </span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-blue-900 hover:text-blue-700 transition-all font-bold bg-blue-50/90 border border-blue-200 px-6 py-2.5 rounded-xl shadow-lg"
          >
            <FaPrint size={16} />
            <span className="text-sm tracking-wide font-bold uppercase">
              Save as PDF
            </span>
          </button>
        </nav>

        {/* Header */}
        <header className="mb-8 px-2">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
            {destination}
          </h1>
          <div className="flex flex-wrap gap-3">
            <div className="bg-blue-600/40 backdrop-blur-md px-5 py-2 rounded-full text-white border border-blue-300/30 shadow-sm font-semibold text-sm uppercase tracking-widest">
              <FaCalendarAlt className="inline mr-2" />
              {start_date} — {end_date}
            </div>
            <div className="bg-blue-600/40 backdrop-blur-md px-5 py-2 rounded-full text-white border border-blue-300/30 shadow-sm font-semibold text-sm uppercase tracking-widest">
              <FaMapMarkerAlt className="inline mr-2" />
              {days.length} Days
            </div>
            <div className="bg-purple-600/40 backdrop-blur-md px-5 py-2 rounded-full text-white border border-purple-300/30 shadow-sm font-semibold text-sm uppercase tracking-widest">
              <FaHeart className="inline mr-2" />
              {travelStyle}
            </div>
          </div>
        </header>

        {/* Preferences Grid */}
        <section className="mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-sm uppercase tracking-[0.3em] text-blue-300 font-black mb-4 flex items-center gap-2">
              <FaStar className="text-blue-400" /> Travel Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <PreferenceTag
                icon={FaStar}
                label="Travel Style"
                value={travelStyle}
              />
              <PreferenceTag
                icon={FaMoneyBillWave}
                label="Budget"
                value={budget}
              />
              <PreferenceTag
                icon={FaUsers}
                label="Group Size"
                value={groupSize}
              />
              <PreferenceTag
                icon={FaUtensils}
                label="Food Preferences"
                value={foodPreferences}
              />
              <PreferenceTag
                icon={FaHeart}
                label="Interests"
                value={interests}
              />
              {specialRequirements && (
                <PreferenceTag
                  icon={FaExclamationTriangle}
                  label="Special Requirements"
                  value={specialRequirements}
                />
              )}
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="mb-16">
          <div className="bg-[#f0f9ff]/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 border border-blue-100 shadow-2xl">
            <h2 className="text-xs uppercase tracking-[0.4em] text-blue-600 font-black mb-4">
              Trip Overview
            </h2>
            <p className="text-slate-900 text-xl md:text-2xl leading-relaxed font-bold italic">
              {overview}
            </p>
          </div>
        </section>

        {/* Days List */}
        <div className="space-y-12">
          {days.map((day) => (
            <div
              key={day.day}
              className="flex flex-col md:flex-row gap-6 group"
            >
              {/* Day Marker */}
              <div className="md:w-1/5 pt-4 text-white drop-shadow-lg">
                <span className="font-mono text-sm font-black tracking-[0.3em] uppercase opacity-80 text-blue-100">
                  Day {day.day}
                </span>
                <h3 className="text-2xl font-black leading-tight mt-1 group-hover:text-blue-200 transition-colors">
                  {day.title}
                </h3>
              </div>

              {/* Day Card */}
              <div className="md:w-4/5 w-full bg-[#f8fafc]/95 backdrop-blur-sm rounded-[2rem] p-8 border border-blue-100 shadow-xl transition-all duration-500 group-hover:shadow-blue-900/20 group-hover:-translate-y-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                  <TimeSlot
                    title="Morning"
                    content={day.morning}
                    icon={FaSun}
                    iconColor="text-orange-500"
                  />
                  <TimeSlot
                    title="Afternoon"
                    content={day.afternoon}
                    icon={FaCloudSun}
                    iconColor="text-blue-500"
                  />
                  <TimeSlot
                    title="Evening"
                    content={day.evening}
                    icon={FaMoon}
                    iconColor="text-blue-800"
                  />
                  <TimeSlot
                    title="Cuisine"
                    content={day.food}
                    icon={FaUtensils}
                    iconColor="text-cyan-600"
                  />
                  {day.notes && (
                    <div className="sm:col-span-2 mt-2 p-5 bg-blue-50 rounded-2xl border border-blue-100/60">
                      <p className="text-slate-700 text-sm font-bold leading-relaxed">
                        <span className="text-blue-600 font-black mr-2 uppercase text-[10px] tracking-widest underline decoration-blue-200">
                          Note
                        </span>
                        {day.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-24 py-10 text-center text-white/60 font-bold uppercase tracking-[0.5em] text-[10px]">
          <p>Created on {new Date(created_at).toLocaleDateString()}</p>
          <p className="mt-2">Smooth Sailing • {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
