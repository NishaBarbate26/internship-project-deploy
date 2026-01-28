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
        const res = await getChatHistory(itineraryId);

        // ✅ Always use res.data
        setMessages(res.data || []);
      } catch {
        setError("Failed to load chat history");
      } finally {
        setInitialLoading(false);
      }
    };

    loadHistory();
  }, [itineraryId]);

  /* ---------------- Send Message ---------------- */

  const handleSendMessage = async (text) => {
    try {
      setLoading(true);

      // Optimistic message
      setMessages((prev) => [...prev, { role: "user", content: text }]);

      const res = await sendChatMessage(itineraryId, text);

      const data = res.data;

      console.log("✅ Backend Returned:", data);

      // ✅ Pass correct updated data
      onItineraryUpdate({
        updated_itinerary: data.updated_itinerary,
        updated_preferences: data.updated_preferences,
      });

      // ✅ Update chat messages
      setMessages(data.chat_history || []);
    } catch {
      setError("Chat failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col h-[500px] bg-white/10 rounded-2xl border border-white/20 shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/20">
        <h3 className="text-white font-black text-sm uppercase">
          Modify Itinerary
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {initialLoading ? (
          <FaSpinner className="animate-spin text-blue-400 text-2xl mx-auto" />
        ) : messages.length === 0 ? (
          <p className="text-white/60 text-sm text-center">
            Ask me to modify your itinerary ✨
          </p>
        ) : (
          messages.map((m, i) => <ChatMessage key={i} message={m} />)
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-300 text-xs text-center pb-2">{error}</div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/20">
        <ChatInput onSendMessage={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
}
