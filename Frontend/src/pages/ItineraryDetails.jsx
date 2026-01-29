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
  FaSpinner,
  FaCompass,
  FaTheaterMasks,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

import {
  getItineraryById,
  deleteItinerary,
  exportItinerary,
} from "../services/itineraryService";
import ChatInterface from "../components/ChatInterface";

const PreferenceTag = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-blue-100/50">
    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-900 capitalize">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

const TimeSlot = ({ title, content, icon: Icon, iconColor }) => (
  <div className="flex flex-col gap-2 p-3">
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

export default function ItineraryDetails() {
  const navigate = useNavigate();
  const { itinerary_id } = useParams();

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const res = await getItineraryById(itinerary_id);
        if (isMounted) {
          setItinerary(res.data);
          setError("");
        }
      } catch (err) {
        if (isMounted) setError("Failed to load itinerary");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchItinerary();
    return () => {
      isMounted = false;
    };
  }, [itinerary_id]);

  /**
   * UPDATED: This function is triggered by ChatInterface.
   * It now explicitly merges updated_preferences into the state
   * to trigger an immediate UI re-render for the PreferenceTags.
   */
  const handleItineraryUpdate = (updateData) => {
    const { updated_itinerary, updated_preferences } = updateData;

    setItinerary((prev) => ({
      ...prev,
      // Update the main itinerary object (overview, days)
      itinerary: updated_itinerary || prev.itinerary,
      // Update the preferences object (budget, style, etc.)
      preferences: updated_preferences
        ? { ...prev.preferences, ...updated_preferences }
        : prev.preferences,
    }));
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this itinerary? This cannot be undone.",
      )
    )
      return;

    try {
      setIsDeleting(true);
      await deleteItinerary(itinerary_id);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to delete itinerary");
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportItinerary(itinerary_id, itinerary.destination);
    } catch (err) {
      alert("Failed to export itinerary");
    }
  };

  if (loading || isDeleting) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-400 mb-4" />
        <p className="text-blue-200/50 animate-pulse">
          {isDeleting ? "Deleting your journey..." : "Loading your journey..."}
        </p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center p-6">
        <div>
          <p className="text-red-400 mb-4">{error || "Itinerary not found"}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-400 underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const days = itinerary.itinerary?.days || [];
  const prefs = itinerary.preferences || {};

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      <div
        className="fixed inset-0 opacity-40 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')",
        }}
      />
      <div className="fixed inset-0 bg-blue-950/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 font-bold hover:text-blue-400 transition-colors"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
              title="Export as Markdown"
            >
              <FaDownload size={18} />
              <span className="hidden sm:inline text-sm font-bold">Export</span>
            </button>

            <button
              onClick={() => window.print()}
              className="hover:text-blue-400 transition-colors"
            >
              <FaPrint size={20} />
            </button>

            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Delete Itinerary"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          <div>
            <h1 className="text-5xl font-black mb-6 capitalize">
              {itinerary.destination}
            </h1>

            <div className="flex flex-wrap gap-3 mb-10">
              <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                <FaCalendarAlt className="text-blue-400" />{" "}
                {itinerary.start_date} – {itinerary.end_date}
              </span>
              <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-blue-400" /> {days.length} Days
              </span>
            </div>

            <section className="mb-12 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <h3 className="text-[11px] uppercase tracking-[0.25em] font-black text-blue-400 mb-6 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-blue-400/50"></span> Travel
                Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <PreferenceTag
                  icon={FaMoneyBillWave}
                  label="Budget"
                  value={prefs.budget}
                />
                <PreferenceTag
                  icon={FaUsers}
                  label="Group Size"
                  value={prefs.group_size}
                />
                <PreferenceTag
                  icon={FaCompass}
                  label="Style"
                  value={prefs.travel_style}
                />
                <PreferenceTag
                  icon={FaTheaterMasks}
                  label="Interests"
                  value={
                    Array.isArray(prefs.interests)
                      ? prefs.interests.join(", ")
                      : prefs.interests
                  }
                />
              </div>
            </section>

            <section className="bg-white/90 text-black rounded-3xl p-8 mb-14">
              <h2 className="uppercase text-xs tracking-widest mb-3 font-black text-blue-600/60">
                Overview
              </h2>
              <p className="text-xl font-bold italic leading-relaxed">
                {itinerary.itinerary?.overview}
              </p>
            </section>

            <div className="space-y-12">
              {days.map((day, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/5 font-black">
                    <span className="text-blue-400 text-sm block">DAY</span>
                    <span className="text-4xl">{day.day}</span>
                    <p className="text-white/70 text-sm mt-1">{day.title}</p>
                  </div>
                  <div className="md:w-4/5 bg-white/95 text-black rounded-3xl p-8 grid sm:grid-cols-2 gap-8 shadow-lg">
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
                      iconColor="text-indigo-600"
                    />
                    <TimeSlot
                      title="Food"
                      content={day.food}
                      icon={FaUtensils}
                      iconColor="text-green-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-[calc(100vh-140px)] sticky top-24">
            <ChatInterface
              itineraryId={itinerary_id}
              onItineraryUpdate={handleItineraryUpdate}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
