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
  <div className="flex items-center gap-3 bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[1.25rem] px-5 py-4 shadow-xl transition-all duration-300 hover:bg-white/90 hover:scale-105 group cursor-default">
    <div className="p-2.5 bg-blue-600/10 rounded-xl text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600 font-black mb-0.5">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900 capitalize tracking-wide">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

const TimeSlot = ({ title, content, icon: Icon, iconColor }) => (
  <div className="flex flex-col gap-3 p-4 rounded-2xl transition-all duration-300 hover:bg-white/50 border border-transparent hover:border-white/60 group/slot">
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-xl bg-white/80 shadow-sm ${iconColor} transition-transform duration-300 group-hover/slot:scale-110`}
      >
        <Icon className="text-xl" />
      </div>
      <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-500 group-hover/slot:text-blue-600 transition-colors">
        {title}
      </h4>
    </div>
    <p className="text-slate-700 leading-relaxed text-[15px] font-medium pl-1 border-l-2 border-slate-200 group-hover/slot:border-blue-300 ml-3 transition-colors">
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
          let data = res.data;
          if (data?.start_date && data?.itinerary?.days?.length) {
            const start = new Date(data.start_date);
            start.setDate(start.getDate() + data.itinerary.days.length - 1);
            const computedEndDate = start.toISOString().split("T")[0];

            if (data.end_date !== computedEndDate) {
              data = {
                ...data,
                end_date: computedEndDate,
              };
            }
          }
          setItinerary(data);
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

  const handleItineraryUpdate = (updateData) => {
    const { updated_itinerary, updated_preferences } = updateData;

    setItinerary((prev) => {
      const finalItinerary = updated_itinerary || prev.itinerary;

      /* ======= ADDED LOGIC (DO NOT REMOVE ANYTHING ELSE) ======= */
      let recalculatedEndDate = prev.end_date;

      if (prev.start_date && finalItinerary?.days?.length) {
        const start = new Date(prev.start_date);
        start.setDate(start.getDate() + finalItinerary.days.length - 1);
        recalculatedEndDate = start.toISOString().split("T")[0];
      }
      /* ======================================================== */

      return {
        ...prev,
        itinerary: finalItinerary,
        preferences: updated_preferences
          ? { ...prev.preferences, ...updated_preferences }
          : prev.preferences,
        end_date: recalculatedEndDate, // ← ONLY NEW FIELD ADDED
      };
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this itinerary?"))
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
        <p className="text-blue-200/50 animate-pulse font-medium tracking-widest uppercase text-xs">
          {isDeleting ? "Wiping Data..." : "Mapping your journey..."}
        </p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center p-6">
        <div className="bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-xl">
          <p className="text-red-400 mb-6 font-bold text-lg">
            {error || "Itinerary not found"}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const days = itinerary.itinerary?.days || [];
  const prefs = itinerary.preferences || {};

  return (
    <div className="min-h-screen bg-slate-950 text-white relative selection:bg-blue-500/30">
      <div
        className="fixed inset-0 opacity-40 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/itinerary-details-bg.avif')",
        }}
      />

      <div className="fixed inset-0 bg-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-3 font-bold text-slate-200 hover:text-white transition-all"
          >
            <div className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
              <FaArrowLeft size={14} />
            </div>
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-blue-600 border border-white/20 px-5 py-2.5 rounded-xl transition-all font-bold text-sm"
            >
              <FaDownload className="opacity-70" /> Export
            </button>
            <button
              onClick={() => window.print()}
              className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 rounded-xl transition-all text-slate-100"
            >
              <FaPrint size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-3 bg-red-500/20 hover:bg-red-500 border border-red-500/30 rounded-xl transition-all text-red-100 hover:text-white"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-6xl font-black mb-6 capitalize tracking-tight drop-shadow-lg">
              {itinerary.destination}
            </h1>

            <div className="flex flex-wrap gap-4 mb-12">
              <div className="bg-white/70 backdrop-blur-2xl border border-white/50 px-5 py-2.5 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-900 shadow-xl">
                <FaCalendarAlt className="text-blue-600" />{" "}
                {itinerary.start_date} – {itinerary.end_date}
              </div>
              <div className="bg-white/70 backdrop-blur-2xl border border-white/50 px-5 py-2.5 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-900 shadow-xl">
                <FaMapMarkerAlt className="text-blue-600" /> {days.length} Day
                Expedition
              </div>
            </div>

            {/* Enhanced Preferences Grid */}
            <section className="mb-14">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-blue-400 mb-6 flex items-center gap-3">
                <span className="w-12 h-[2px] bg-blue-500"></span>
                Trip Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <PreferenceTag
                  icon={FaMoneyBillWave}
                  label="Budget"
                  value={prefs.budget}
                />
                <PreferenceTag
                  icon={FaUsers}
                  label="Group"
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
                      ? prefs.interests[0]
                      : prefs.interests
                  }
                />
              </div>
            </section>

            {/* Narrative Overview */}
            <section className="relative overflow-hidden bg-white/70 backdrop-blur-2xl border border-white/50 text-slate-900 rounded-[2.5rem] p-10 mb-16 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
              <h2 className="uppercase text-[10px] tracking-[0.25em] mb-4 font-black text-blue-700">
                The Vision
              </h2>
              <p className="text-2xl font-bold leading-relaxed tracking-tight text-slate-900">
                "{itinerary.itinerary?.overview}"
              </p>
            </section>

            {/* Daily Itinerary Timeline */}
            <div className="space-y-16 relative before:absolute before:left-[45px] before:top-10 before:bottom-10 before:w-[1px] before:bg-gradient-to-b before:from-blue-500 before:to-transparent">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row gap-10 group relative"
                >
                  <div className="md:w-24 shrink-0 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border-4 border-blue-500 flex items-center justify-center text-sm font-black z-10 group-hover:scale-125 group-hover:bg-blue-600 transition-all duration-300">
                      {day.day}
                    </div>
                  </div>

                  <div className="flex-1 bg-white/70 backdrop-blur-2xl border border-white/50 text-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl transition-all duration-500 group-hover:shadow-blue-500/20 group-hover:-translate-y-2 relative overflow-hidden">
                    <div className="mb-8">
                      <span className="text-[10px] font-black text-blue-700 tracking-widest uppercase mb-1 block">
                        Daily Chapter
                      </span>
                      <h3 className="text-3xl font-black tracking-tight">
                        {day.title}
                      </h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                      <TimeSlot
                        title="Morning"
                        content={day.morning}
                        icon={FaSun}
                        iconColor="text-orange-600"
                      />
                      <TimeSlot
                        title="Afternoon"
                        content={day.afternoon}
                        icon={FaCloudSun}
                        iconColor="text-blue-600"
                      />
                      <TimeSlot
                        title="Evening"
                        content={day.evening}
                        icon={FaMoon}
                        iconColor="text-indigo-700"
                      />
                      <TimeSlot
                        title="Dining"
                        content={day.food}
                        icon={FaUtensils}
                        iconColor="text-emerald-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="h-[calc(100vh-140px)] sticky top-24 hidden lg:block">
            <div className="h-full bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 overflow-hidden shadow-2xl">
              <ChatInterface
                itineraryId={itinerary_id}
                onItineraryUpdate={handleItineraryUpdate}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
