import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTrashAlt,
  FaDownload,
  FaSpinner,
} from "react-icons/fa";
import DeleteConfirmation from "./DeleteConfirmation";
import { deleteItinerary, exportItinerary } from "../services/itineraryService";

export default function ItineraryCard({ itinerary, onDeleteSuccess }) {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteItinerary(itinerary.id);
      if (result.success) {
        setIsDeleteModalOpen(false);
        if (onDeleteSuccess) {
          onDeleteSuccess(itinerary.id);
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async (e) => {
    e.stopPropagation(); // Prevents navigating to details page
    try {
      setIsExporting(true);
      await exportItinerary(itinerary.id, itinerary.destination);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export itinerary");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div
        onClick={() =>
          navigate(`/itinerary-details/${itinerary.id}`, {
            state: { itinerary: itinerary.itinerary },
          })
        }
        className={`
          w-80
          relative
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
          ${isDeleting ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {/* Action Buttons Container - Top Right */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
          {/* Download Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
            title="Download Markdown"
          >
            {isExporting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaDownload size={16} />
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete Itinerary"
          >
            <FaTrashAlt size={16} />
          </button>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="text-2xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
            <span className="block text-blue-600 mb-1">
              <FaMapMarkerAlt className="inline mr-2 text-xl" />
            </span>
            <h3 className="capitalize">{itinerary.destination}</h3>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="text-gray-600 font-medium flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <span>
              {itinerary.start_date} — {itinerary.end_date}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Created{" "}
            {itinerary.created_at
              ? new Date(itinerary.created_at).toLocaleDateString()
              : "Recently"}
          </p>
          <span className="text-blue-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            View Details →
          </span>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={itinerary.destination}
      />
    </>
  );
}
