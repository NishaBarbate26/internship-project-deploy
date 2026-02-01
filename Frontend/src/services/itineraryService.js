import { auth } from "../config/firebase";

const API_URL = "http://localhost:8000";

/* ---------------- TOKEN HELPER ---------------- */
const getToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not logged in");
  }
  return await user.getIdToken();
};

/* ---------------- POST: GENERATE ---------------- */
export const generateItinerary = async (formData) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/generate-itinerary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || !data?.success) {
    throw new Error(data?.detail || "Itinerary creation failed");
  }

  return data;
};

/* ---------------- GET: USER ITINERARIES ---------------- */
export const getUserItineraries = async () => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/itineraries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || !data?.success) {
    throw new Error(data?.detail || "Failed to fetch itineraries");
  }

  return data;
};

/* ---------------- GET: SINGLE ITINERARY ---------------- */
export const getItineraryById = async (id) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/itineraries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || !data?.success) {
    throw new Error(data?.detail || "Failed to fetch itinerary");
  }

  return data;
};

/* ---------------- CHAT: SEND MESSAGE ---------------- */
export const sendChatMessage = async (itineraryId, message) => {
  const token = await getToken();
  const res = await fetch(
    `${API_URL}/api/itineraries/${itineraryId}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    }
  );

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || !data?.success) {
    throw new Error(data?.detail || "Failed to send message");
  }

  return data;
};

/* ---------------- CHAT: GET HISTORY ---------------- */
export const getChatHistory = async (itineraryId) => {
  const token = await getToken();
  const res = await fetch(
    `${API_URL}/api/itineraries/${itineraryId}/chat`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || !data?.success) {
    throw new Error(data?.detail || "Failed to fetch chat history");
  }

  return data;
};

export const exportItinerary = async (id, title) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/itineraries/${id}/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to download itinerary file");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const safeTitle = title ? title.replace(/\s+/g, '_') : 'My';
  link.setAttribute('download', `${safeTitle}_Itinerary.md`);
  
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};


export const deleteItinerary = async (id) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/itineraries/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || !data?.success) {
    throw new Error(data?.detail || "Failed to delete itinerary");
  }

  return data;
};


export const updateItinerary = async (id, updatedData) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/itineraries/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || !data?.success) {
    throw new Error(data?.detail || "Failed to update itinerary");
  }

  return data;
};