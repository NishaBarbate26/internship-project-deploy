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

const images = {
  japan:
    "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1200&q=80",
  thailand:
    "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
  bali: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
  india:
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
  manali:
    "https://images.unsplash.com/photo-1621330396167-b3d2c5f79de3?auto=format&fit=crop&w=1200&q=80",
};

export default function ItineraryCard({ itinerary, onDeleteSuccess }) {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const image =
    images[itinerary.destination?.toLowerCase()] ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

  const createdDate = itinerary.created_at
    ? new Date(itinerary.created_at).toLocaleDateString()
    : "Recently";

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteItinerary(itinerary.id);
      if (result.success && onDeleteSuccess) {
        onDeleteSuccess(itinerary.id);
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleExport = async (e) => {
    e.stopPropagation();
    try {
      setIsExporting(true);
      await exportItinerary(itinerary.id, itinerary.destination);
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
        className={`relative w-[300px] h-[380px] rounded-[1.8rem] overflow-hidden cursor-pointer group shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:-translate-y-3 hover:scale-[1.02] ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        <img
          src={image}
          alt={itinerary.destination}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        <div className="absolute top-4 right-4 flex gap-3 z-10">
          <button
            onClick={handleExport}
            className="text-white/80 hover:text-blue-400 transition"
          >
            {isExporting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaDownload />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
            className="text-white/80 hover:text-red-400 transition"
          >
            <FaTrashAlt />
          </button>
        </div>

        <div className="absolute bottom-0 p-6 text-white space-y-1">
          <h3 className="text-2xl font-black capitalize">
            <FaMapMarkerAlt className="inline mr-2 text-blue-400" />
            {itinerary.destination}
          </h3>
          <p className="text-sm text-white/80 flex items-center gap-2">
            <FaCalendarAlt /> {itinerary.start_date} — {itinerary.end_date}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-white/60">
            Created • {createdDate}
          </p>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)} // This now matches DeleteConfirmation props
        onConfirm={handleDeleteConfirm}
        itemName={itinerary.destination}
      />
    </>
  );
}
