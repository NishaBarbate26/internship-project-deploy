import React, { useState } from "react";
import { Download } from "lucide-react"; // Assuming you use lucide-react, otherwise use a string icon

const ExportButton = ({ itineraryId, destination }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Replace with your actual API base URL
      const response = await fetch(`/api/itineraries/${itineraryId}/export`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${destination.replace(/\s+/g, "_")}_Itinerary.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Export Error:", error);
      alert("Failed to export itinerary.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
    >
      <Download size={18} />
      {isExporting ? "Exporting..." : "Export Markdown"}
    </button>
  );
};

export default ExportButton;
