import { useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

export default function ChatInput({ onSendMessage, loading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    onSendMessage(message.trim());
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-3 bg-white/80 backdrop-blur-xl rounded-2xl p-3 border border-white/50 shadow-lg">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask to modify your itinerary..."
          className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-sm resize-none max-h-32 min-h-[44px] py-2 px-3"
          rows={1}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className={`
            flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
            transition-all duration-300 transform active:scale-95
            ${
              loading || !message.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-500/40"
            }
          `}
        >
          {loading ? (
            <FaSpinner className="animate-spin" size={18} />
          ) : (
            <FaPaperPlane
              size={16}
              className="translate-x-[-1px] translate-y-[1px]"
            />
          )}
        </button>
      </div>

      <p className="text-[10px] text-white/50 mt-2 text-center font-medium uppercase tracking-wider">
        Press Enter to send, Shift + Enter for new line
      </p>
    </form>
  );
}
