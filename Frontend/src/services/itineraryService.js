import { auth } from "../config/firebase";

const API_URL = "http://localhost:8000";

/* ---------------- TOKEN ---------------- */
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

/* ---------------- GET: SINGLE ITINERARY BY ID ---------------- */
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

/* ---------------- PUT: UPDATE ---------------- */
export const updateItinerary = async (id, updatedData) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/itinerary/${id}`, {
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

/* ---------------- DELETE ---------------- */
export const deleteItinerary = async (id) => {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/itinerary/${id}`, {
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