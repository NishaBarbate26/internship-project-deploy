import { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { sendChatMessage, getChatHistory } from "../services/itineraryService";
import { FaSpinner } from "react-icons/fa";

export default function ChatInterface({ itineraryId, onItineraryUpdate }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- Load Chat History ---------------- */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setError("");
        const res = await getChatHistory(itineraryId);
        // Res.data is where your array lives based on service code
        setMessages(res.data || []);
      } catch (err) {
        setError("Failed to load chat history");
      } finally {
        setInitialLoading(false);
      }
    };

    if (itineraryId) loadHistory();
  }, [itineraryId]);

  /* ---------------- Send Message ---------------- */
  const handleSendMessage = async (text) => {
    try {
      setLoading(true);
      setError("");

      // 1. Optimistic Update: Add user message to UI immediately
      const userMsg = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);

      // 2. Call API
      const res = await sendChatMessage(itineraryId, text);

      // 3. Handle successful response
      if (res && res.success) {
        console.log("✅ Backend Returned:", res);

        // Update the parent component with the new itinerary data
        // Check if data is nested under res.data or just res based on your API
        const responseData = res.data || res;

        onItineraryUpdate({
          updated_itinerary: responseData.updated_itinerary,
          updated_preferences: responseData.updated_preferences,
        });

        // Update chat history from the response
        setMessages(responseData.chat_history || []);
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setError("Chat failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col h-[500px] bg-white/10 rounded-2xl border border-white/20 shadow-xl">
      <div className="px-4 py-3 border-b border-white/20">
        <h3 className="text-white font-black text-sm uppercase">
          Modify Itinerary
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {initialLoading ? (
          <div className="flex justify-center items-center h-full">
            <FaSpinner className="animate-spin text-blue-400 text-2xl" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-white/60 text-sm text-center">
            Ask me to modify your itinerary ✨
          </p>
        ) : (
          messages.map((m, i) => <ChatMessage key={i} message={m} />)
        )}
      </div>

      {error && (
        <div className="text-red-400 text-xs text-center pb-2 font-medium">
          {error}
        </div>
      )}

      <div className="p-3 border-t border-white/20">
        <ChatInput onSendMessage={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
}
