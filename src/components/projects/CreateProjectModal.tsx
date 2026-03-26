"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, description: string) => Promise<void>;
  isLoading: boolean;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreateProject,
  isLoading,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        await onCreateProject(name.trim(), description.trim());
        setName("");
        setDescription("");
      } catch (err) {
        console.error("Failed to create project:", err);
      }
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800">
                Create new project
              </h2>
              <p className="text-sm text-gray-400">
                Start organizing your knowledge
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Project name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Research Analysis, Meeting Notes..."
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F63D2]/20 focus:border-[#4F63D2] disabled:opacity-50 text-gray-800 placeholder-gray-400 transition-all duration-200"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Description
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this project be about?"
              rows={3}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F63D2]/20 focus:border-[#4F63D2] disabled:opacity-50 text-gray-800 placeholder-gray-400 resize-none transition-all duration-200"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-xl transition-all duration-200 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="flex-1 px-4 py-3 bg-[#4F63D2] hover:bg-[#3D52C5] disabled:opacity-50 text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Create project
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer hint */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-400 text-center">
            You can add documents and start chatting once your project is
            created
          </p>
        </div>
      </div>
    </div>
  );
}
