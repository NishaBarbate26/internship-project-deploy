import { useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { sendChatMessage, getChatHistory } from "../services/itineraryService";
import { FaSpinner, FaCompass } from "react-icons/fa";

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

      const userMsg = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);

      const res = await sendChatMessage(itineraryId, text);

      if (res && res.success) {
        const responseData = res.data || res;
        onItineraryUpdate({
          updated_itinerary: responseData.updated_itinerary,
          updated_preferences: responseData.updated_preferences,
        });
        setMessages(responseData.chat_history || []);
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setError("Chat failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
      {/* Enhanced Header */}
      <div className="px-8 py-6 border-b border-white/10 bg-white/5">
        <h3 className="text-blue-400 font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Modify Itinerary
        </h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
        {initialLoading ? (
          <div className="flex flex-col justify-center items-center h-full space-y-3">
            <FaSpinner className="animate-spin text-blue-400 text-3xl" />
            <p className="text-blue-200/30 text-[10px] font-bold uppercase tracking-widest">
              Synchronizing
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
            <div className="p-4 rounded-full bg-white/5 border border-white/10">
              <FaCompass className="text-3xl text-blue-400/50" />
            </div>
            <p className="text-white/60 text-sm font-medium tracking-wide">
              Ask me to modify your itinerary ✨
            </p>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <ChatMessage key={i} message={m} />
            ))}

            {/* Wavy Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-2xl w-fit border border-white/10 animate-pulse">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                  AI is thinking
                </span>
                <div className="flex gap-1 items-end h-3">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Error Handling */}
      {error && (
        <div className="mx-6 mb-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] text-center font-bold uppercase tracking-wider">
          {error}
        </div>
      )}

      <div className="p-6 bg-slate-950/50 backdrop-blur-md border-t border-white/5">
        <ChatInput onSendMessage={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
}
