import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPrint,
  FaUtensils,
  FaSun,
  FaCloudSun,
  FaMoon,
} from "react-icons/fa";

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

export default function ItineraryDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const itinerary = location.state?.itinerary;

  useEffect(() => {
    if (!itinerary) {
      navigate("/create-itinerary");
    }
  }, [itinerary, navigate]);

  if (!itinerary) return null;

  return (
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-blue-100">
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80')",
        }}
      />

      {/* Blue Tint Overlay - Peaceful & Low Blur */}
      <div className="fixed inset-0 z-0 bg-blue-950/30 backdrop-blur-[2px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 lg:py-16 w-full">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-12 print:hidden">
          <button
            onClick={() => navigate("/create-itinerary")}
            className="flex items-center gap-3 text-white drop-shadow-md hover:text-blue-200 transition-all duration-300 py-2 group"
          >
            <FaArrowLeft
              size={26}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-xl font-bold tracking-tight">
              Back to planner
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
        <header className="mb-14 px-2">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
            Trip{" "}
            <span className="text-blue-200 italic underline decoration-blue-400/40">
              Itinerary
            </span>
          </h1>

          <div className="flex flex-wrap gap-4">
            <div className="bg-blue-900/40 backdrop-blur-md px-6 py-2 rounded-full text-white border border-blue-300/30 shadow-sm font-semibold text-sm uppercase tracking-widest">
              <FaCalendarAlt className="inline mr-2 text-blue-300" />
              {itinerary.days.length} Days
            </div>
            <div className="bg-blue-900/40 backdrop-blur-md px-6 py-2 rounded-full text-white border border-blue-300/30 shadow-sm font-semibold text-sm uppercase tracking-widest">
              <FaMapMarkerAlt className="inline mr-2 text-blue-300" />
              Custom Route
            </div>
          </div>
        </header>

        {/* Overview: Peaceful Pearl-Blue Card */}
        <section className="mb-16">
          <div className="bg-[#f0f9ff]/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 border border-blue-100 shadow-2xl">
            <h2 className="text-xs uppercase tracking-[0.4em] text-blue-600 font-black mb-4">
              Plan Overview
            </h2>
            <p className="text-slate-900 text-xl md:text-2xl leading-relaxed font-bold italic">
              {itinerary.overview}
            </p>
          </div>
        </section>

        {/* Days List */}
        <div className="space-y-12">
          {itinerary.days.map((day) => (
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

              {/* Day Card: Silk Blue-Gray Frame */}
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

        <footer className="mt-24 py-10 text-center text-white/60 font-bold uppercase tracking-[0.5em] text-[10px]">
          Smooth Sailing • {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
