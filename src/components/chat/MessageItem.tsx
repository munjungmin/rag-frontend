import { ThumbsUp, ThumbsDown, User, Bot } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
  chat_id: string;
  clerk_id: string;
  citations?: Array<{
    filename: string;
    page: number;
  }>;
}

interface MessageItemProps {
  message: Message;
  onFeedback?: (messageId: string, type: "like" | "dislike") => void;
}

export function MessageItem({ message, onFeedback }: MessageItemProps) {
  const isUser = message.role === "user";
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div className={`max-w-[85%] ${isUser ? "ml-12" : "mr-12"} relative`}>
        {/* Avatar & Message Container */}
        <div className="flex items-start gap-3">
          {/* Avatar - Only show for assistant */}
          {!isUser && (
            <div className="flex-shrink-0 w-7 h-7 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mt-1">
              <Bot size={14} className="text-gray-400" />
            </div>
          )}

          {/* Message Bubble */}
          <div
            className={`rounded-lg p-4 border transition-colors ${
              isUser
                ? "bg-[#4F63D2] text-white border-[#4F63D2]"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed text-sm">
              {message.content}
            </p>
          </div>

          {/* User Avatar - Only show for user */}
          {isUser && (
            <div className="flex-shrink-0 w-7 h-7 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mt-1">
              <User size={14} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Feedback Buttons - Only show for assistant messages */}
        {!isUser && (
          <div className="absolute -bottom-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => onFeedback?.(message.id, "like")}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors group/btn"
              title="Like this response"
            >
              <ThumbsUp
                size={12}
                className="text-gray-400 group-hover/btn:text-gray-600 transition-colors"
              />
            </button>
            <button
              onClick={() => onFeedback?.(message.id, "dislike")}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors group/btn"
              title="Dislike this response"
            >
              <ThumbsDown
                size={12}
                className="text-gray-400 group-hover/btn:text-gray-600 transition-colors"
              />
            </button>
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`flex items-center gap-2 mt-2 px-1 ${
            isUser ? "justify-end" : "justify-start ml-10"
          }`}
        >
          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {time}
          </span>
          {!isUser && (
            <div className="w-1 h-1 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          )}
        </div>
      </div>
    </div>
  );
}
