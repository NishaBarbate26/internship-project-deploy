import { FaUser, FaRobot } from "react-icons/fa";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-lg ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-purple-600 text-white rounded-bl-sm"
        }`}
      >
        <div className="flex items-center gap-2 mb-1 opacity-80">
          {isUser ? <FaUser size={12} /> : <FaRobot size={12} />}
          <span className="text-[10px] uppercase font-bold">
            {isUser ? "You" : "Assistant"}
          </span>
        </div>
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
}
