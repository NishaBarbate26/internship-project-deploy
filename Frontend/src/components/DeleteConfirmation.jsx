import React from "react";

const DeleteConfirmation = ({ isOpen, onCancel, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900">
          Delete Itinerary?
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <strong>{itemName || "this itinerary"}</strong>? This will remove all
          associated chat history.
          <span className="text-red-600 font-medium block mt-1">
            This action cannot be undone.
          </span>
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
