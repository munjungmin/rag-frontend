"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      await onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 focus-within:border-[#4F63D2] transition-colors">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your documents..."
              disabled={disabled}
              rows={1}
              className="flex-1 resize-none border-0 bg-transparent px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 disabled:opacity-50 min-h-[48px] max-h-32 overflow-y-auto"
              style={{
                height: "auto",
                minHeight: "48px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />

            {/* Send Button */}
            <div className="flex items-end p-2">
              <button
                type="submit"
                disabled={disabled || !message.trim()}
                className="flex items-center justify-center w-8 h-8 bg-[#4F63D2] hover:bg-[#3d4fb8] disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-lg transition-colors"
              >
                {disabled ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Hint Text */}
          <div className="flex items-center justify-between mt-3 px-2">
            <p className="text-xs text-gray-400">
              Press{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 text-xs">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 text-xs">
                Shift
              </kbd>{" "}
              +{" "}
              <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 text-xs">
                Enter
              </kbd>{" "}
              for new line
            </p>
            {message.length > 0 && (
              <p className="text-xs text-gray-400">
                {message.length} characters
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
