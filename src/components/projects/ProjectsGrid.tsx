"use client";

import { Plus, Search, Grid3X3, List, Folder, Trash2 } from "lucide-react";
import { Project } from "@/lib/types";

interface ProjectsGridProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  viewMode: "grid" | "list";
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onProjectClick: (projectId: string) => void;
  onCreateProject: () => void;
  onDeleteProject: (projectId: string) => void;
}

export function ProjectsGrid({
  projects,
  loading,
  error,
  searchQuery,
  viewMode,
  onSearchChange,
  onViewModeChange,
  onProjectClick,
  onCreateProject,
  onDeleteProject,
}: ProjectsGridProps) {
  return (
    <div className="min-h-screen bg-[#ECEEF6] text-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-5 ml-4">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
                Projects
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {projects.length} project{projects.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={onCreateProject}
              disabled={loading}
              className="bg-[#4F63D2] hover:bg-[#3D52C5] disabled:opacity-50 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none"
            >
              <Plus size={16} />
              Create new
            </button>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                disabled={loading}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F63D2]/20 focus:border-[#4F63D2] placeholder-gray-400 text-gray-800 text-sm disabled:opacity-50 transition-all duration-200"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-1.5 rounded transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-[#4F63D2] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid3X3 size={15} />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-1.5 rounded transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-[#4F63D2] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 pt-6 ml-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-8 ml-4">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            {searchQuery ? (
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sm">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Try adjusting your search terms or create a new project
                </p>
                <button
                  onClick={() => onSearchChange("")}
                  className="text-[#4F63D2] hover:text-[#3D52C5] text-sm underline underline-offset-4"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-[#4F63D2]/10 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                  <Plus size={36} className="text-[#4F63D2]" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Create your first project
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed text-sm">
                  Projects help you organize your documents and conversations.
                  Start by creating your first project.
                </p>
                <button
                  onClick={onCreateProject}
                  className="bg-[#4F63D2] hover:bg-[#3D52C5] text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Create your first project
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                Recent projects
              </h2>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => onProjectClick(project.id)}
                      className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#4F63D2]/30 rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative"
                    >
                      {/* Project Icon */}
                      <div className="w-11 h-11 bg-[#4F63D2]/10 rounded-xl mb-4 flex items-center justify-center">
                        <Folder size={22} className="text-[#4F63D2]" />
                      </div>

                      {/* Project Info */}
                      <div className="space-y-1.5">
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                          {project.name}
                        </h3>

                        {project.description && (
                          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        )}

                        <div className="pt-2">
                          <span className="text-xs text-gray-300">
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => onProjectClick(project.id)}
                      className="group flex items-center gap-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#4F63D2]/30 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="w-10 h-10 bg-[#4F63D2]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Folder size={20} className="text-[#4F63D2]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="text-gray-400 text-xs truncate mt-0.5">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="text-xs text-gray-300 flex-shrink-0">
                        {new Date(project.created_at).toLocaleDateString()}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
