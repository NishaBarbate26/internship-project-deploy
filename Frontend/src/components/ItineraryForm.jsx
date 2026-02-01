import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlane,
  FaCalendarAlt,
  FaUsers,
  FaUtensils,
  FaStar,
} from "react-icons/fa";
import { generateItinerary } from "../services/itineraryService";

/* ---------- Constants ---------- */
const INTERESTS = [
  "Culture",
  "Nature",
  "Shopping",
  "Nightlife",
  "History",
  "Food",
  "Adventure",
  "Relaxation",
];

const FOOD_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Local Cuisine",
  "Seafood",
  "Street Food",
  "Gluten-Free",
];

export default function ItineraryForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    destination: "",
    start_date: "",
    end_date: "",
    travel_style: "",
    food_preferences: [],
    interests: [],
    budget: "",
    group_size: 1,
    special_requirements: "",
  });

  /* ---------- Validation ---------- */
  const validate = () => {
    const newErrors = {};

    if (!formData.destination.trim())
      newErrors.destination = "Destination is required";

    if (!formData.travel_style)
      newErrors.travel_style = "Travel style is required";

    if (!formData.start_date) newErrors.start_date = "Start date is required";

    if (!formData.end_date) newErrors.end_date = "End date is required";

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      if (end <= start) {
        newErrors.end_date =
          "End date must be at least one day after the start date";
      }
    }

    if (formData.food_preferences.length === 0)
      newErrors.food_preferences = "Select at least one food preference";

    if (formData.interests.length === 0)
      newErrors.interests = "Select at least one interest";

    if (!formData.budget) newErrors.budget = "Budget is required";

    if (!formData.group_size || formData.group_size < 1)
      newErrors.group_size = "Group size must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- Toggles ---------- */
  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleFood = (food) => {
    setFormData((prev) => ({
      ...prev,
      food_preferences: prev.food_preferences.includes(food)
        ? prev.food_preferences.filter((f) => f !== food)
        : [...prev.food_preferences, food],
    }));
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await generateItinerary(formData);

      if (response?.success) {
        alert("✨ Itinerary created successfully!");
        navigate(`/itinerary-details/${response.data.itinerary_id}`, {
          state: { itinerary: response.data.itinerary },
        });
      } else {
        alert("❌ Itinerary was not created. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Itinerary was not created due to an error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        relative
        bg-white/20
        backdrop-blur-2xl
        rounded-[2.5rem]
        p-14
        border border-white/30
        shadow-[0_8px_32px_rgba(31,38,135,0.37)]
      "
    >
      <div className="absolute inset-0 rounded-[2.5rem] bg-white/10 pointer-events-none" />

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10">
        <Field label="Destination" icon={<FaPlane />}>
          <input
            className={inputClass}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
          />
          {errors.destination && <Error>{errors.destination}</Error>}
        </Field>

        <Field label="Travel Style" icon={<FaStar />}>
          <select
            className={selectClass}
            onChange={(e) =>
              setFormData({ ...formData, travel_style: e.target.value })
            }
          >
            <option value="">Select style</option>
            <option>Relaxed</option>
            <option>Adventure</option>
            <option>Luxury</option>
            <option>Backpacking</option>
          </select>
          {errors.travel_style && <Error>{errors.travel_style}</Error>}
        </Field>

        <Field label="Start Date" icon={<FaCalendarAlt />}>
          <input
            type="date"
            className={inputClass}
            min={today}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
          />
          {errors.start_date && <Error>{errors.start_date}</Error>}
        </Field>

        <Field label="End Date" icon={<FaCalendarAlt />}>
          <input
            type="date"
            className={inputClass}
            min={
              formData.start_date
                ? new Date(
                    new Date(formData.start_date).setDate(
                      new Date(formData.start_date).getDate() + 1,
                    ),
                  )
                    .toISOString()
                    .split("T")[0]
                : today
            }
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
          />
          {errors.end_date && <Error>{errors.end_date}</Error>}
        </Field>

        <Field label="Food Preferences" icon={<FaUtensils />}>
          <div className="flex flex-wrap gap-4">
            {FOOD_OPTIONS.map((food) => (
              <label key={food} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.food_preferences.includes(food)}
                  onChange={() => toggleFood(food)}
                />
                {food}
              </label>
            ))}
          </div>
          {errors.food_preferences && <Error>{errors.food_preferences}</Error>}
        </Field>

        <Field label="Budget">
          <select
            className={selectClass}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
          >
            <option value="">Select budget</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          {errors.budget && <Error>{errors.budget}</Error>}
        </Field>

        <Field label="Group Size" icon={<FaUsers />}>
          <input
            type="number"
            min="1"
            className={inputClass}
            value={formData.group_size}
            onChange={(e) =>
              setFormData({
                ...formData,
                group_size: Math.max(1, Number(e.target.value)),
              })
            }
          />
          {errors.group_size && <Error>{errors.group_size}</Error>}
        </Field>
      </div>

      <div className="relative mt-14">
        <label className="font-bold mb-4 block">Interests</label>
        <div className="flex flex-wrap gap-4">
          {INTERESTS.map((interest) => {
            const active = formData.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-6 py-3 rounded-full border backdrop-blur-md transition-all
                  ${
                    active
                      ? "bg-blue-600/80 text-white shadow-lg"
                      : "bg-white/30 text-gray-800 border-white/40 hover:bg-white/40"
                  }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
        {errors.interests && <Error>{errors.interests}</Error>}
      </div>

      <div className="relative mt-14">
        <textarea
          rows="4"
          placeholder="Special requirements"
          className={inputClass}
          onChange={(e) =>
            setFormData({
              ...formData,
              special_requirements: e.target.value,
            })
          }
        />
      </div>

      <div className="relative mt-16 text-center">
        <button
          disabled={loading}
          className="
            px-20 py-5
            rounded-full
            bg-blue-600/80
            text-white
            backdrop-blur-md
            shadow-xl
            hover:bg-blue-700/80
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </div>
    </form>
  );
}

/* ---------- Helpers ---------- */
function Field({ label, icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-3 font-bold mb-3">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function Error({ children }) {
  return <p className="text-red-600 text-sm mt-2">{children}</p>;
}

const inputClass =
  "w-full px-5 py-4 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400";

const selectClass = inputClass;
