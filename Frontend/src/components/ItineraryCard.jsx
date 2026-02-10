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

  paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  london:
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
  italy:
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
  switzerland:
    "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
  greece:
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",

  newyork:
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
  brazil:
    "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1200&q=80",
  canada:
    "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80",
  mexico:
    "https://images.unsplash.com/photo-1518105779142-d975b22f1b0a?auto=format&fit=crop&w=1200&q=80",

  dubai:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  egypt:
    "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80",
  morocco:
    "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80",

  singapore:
    "https://images.unsplash.com/photo-1525598912003-663126343e1f?auto=format&fit=crop&w=1200&q=80",
  australia:
    "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=80",
  vietnam:
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  maldives:
    "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
];

const getFallbackImage = (destination) => {
  if (!destination) return fallbackImages[0];
  const index = destination.length % fallbackImages.length;
  return fallbackImages[index];
};

export default function ItineraryCard({ itinerary, onDeleteSuccess }) {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const destinationKey = itinerary.destination
    ?.toLowerCase()
    .replace(/\s+/g, "");

  const image =
    images[destinationKey] || getFallbackImage(itinerary.destination);

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
        className={`relative w-[300px] h-[380px] rounded-[1.8rem] overflow-hidden cursor-pointer group shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:-translate-y-3 hover:scale-[1.02] ${
          isDeleting ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <img
          src={image}
          alt={itinerary.destination}
          loading="lazy"
          onError={(e) => (e.target.src = fallbackImages[0])}
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
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={itinerary.destination}
      />
    </>
  );
}
