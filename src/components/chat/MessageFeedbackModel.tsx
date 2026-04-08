"use client";

import { useState } from "react";
import { X, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

interface FeedbackData {
  rating: "like" | "dislike";
  comment?: string;
  category?: string;
}

interface MessageFeedbackModalProps {
  isOpen: boolean;
  feedbackType?: "like" | "dislike";
  onSubmit: (feedback: FeedbackData) => Promise<void>;
  onClose: () => void;
}

const FEEDBACK_CATEGORIES = {
  like: [
    { value: "helpful", label: "Helpful" },
    { value: "accurate", label: "Accurate" },
    { value: "well-formatted", label: "Well formatted" },
    { value: "comprehensive", label: "Comprehensive" },
  ],
  dislike: [
    { value: "unhelpful", label: "Not helpful" },
    { value: "inaccurate", label: "Inaccurate" },
    { value: "incomplete", label: "Incomplete" },
    { value: "irrelevant", label: "Off topic" },
  ],
};

export function MessageFeedbackModal({
  isOpen,
  feedbackType,
  onSubmit,
  onClose,
}: MessageFeedbackModalProps) {
  const [comment, setComment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackType) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        rating: feedbackType,
        comment: comment.trim() || undefined,
        category: selectedCategory || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !feedbackType) return null;

  const categories = FEEDBACK_CATEGORIES[feedbackType];
  const isLike = feedbackType === "like";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
              {isLike ? (
                <ThumbsUp size={16} className="text-gray-500" />
              ) : (
                <ThumbsDown size={16} className="text-gray-500" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800">
                {isLike ? "What did you like?" : "What went wrong?"}
              </h2>
              <p className="text-sm text-gray-500">
                Your feedback helps improve responses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What specifically {isLike ? "did you like" : "went wrong"}?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setSelectedCategory(category.value)}
                  disabled={isSubmitting}
                  className={`p-3 text-sm rounded-lg border transition-colors disabled:opacity-50 ${
                    selectedCategory === category.value
                      ? "border-[#4F63D2] bg-[#4F63D2]/5 text-[#4F63D2]"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Additional feedback (optional)
            </label>
            <div className="relative">
              <MessageSquare
                className="absolute top-3 left-3 text-gray-400"
                size={14}
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us more about your experience..."
                rows={4}
                disabled={isSubmitting}
                maxLength={500}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4F63D2] resize-none disabled:opacity-50 placeholder:text-gray-400 text-gray-700 transition-colors"
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">
                Help us understand what happened
              </p>
              <p className="text-xs text-gray-400">{comment.length}/500</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed border border-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[#4F63D2] hover:bg-[#3d4fb8] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                "Submit feedback"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
