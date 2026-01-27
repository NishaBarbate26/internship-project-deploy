// src/pages/ItineraryViewer.jsx
import React from "react";

export default function ItineraryViewer({ itinerary }) {
  if (!itinerary) {
    return null;
  }

  const { overview, days } = itinerary;

  return (
    <div className="mt-10 p-8 bg-white/20 backdrop-blur-2xl rounded-xl border border-white/30 text-gray-900 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Itinerary Overview</h2>
      <p className="mb-6 italic">{overview}</p>

      {days && days.length > 0 ? (
        <div className="space-y-8">
          {days.map((day) => (
            <div key={day.day} className="border rounded-lg p-4 bg-white/50">
              <h3 className="text-xl font-semibold mb-2">
                Day {day.day}: {day.title || "Plan"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Morning:</strong>
                  <p>{day.morning || "No details provided"}</p>
                </div>
                <div>
                  <strong>Afternoon:</strong>
                  <p>{day.afternoon || "No details provided"}</p>
                </div>
                <div>
                  <strong>Evening:</strong>
                  <p>{day.evening || "No details provided"}</p>
                </div>
                <div>
                  <strong>Food:</strong>
                  <p>{day.food || "No details provided"}</p>
                </div>
                {day.notes && (
                  <div className="md:col-span-2">
                    <strong>Notes:</strong>
                    <p>{day.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No itinerary days found.</p>
      )}
    </div>
  );
}
