"use client";

import { UserButton } from "@clerk/nextjs";
import { Plus, Briefcase, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleProjectsClick = () => {
    router.push("/projects");
  };

  const handleNewProject = () => {
    router.push("/projects");
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 text-gray-800 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-[#1e3a8a]">OpenSlate</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          {isCollapsed ? (
            <PanelLeftOpen size={16} className="text-gray-500" />
          ) : (
            <PanelLeftClose size={16} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* New Project Button */}
      <div className="px-3 pb-3">
        <button
          onClick={handleNewProject}
          className={`w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg transition-colors flex items-center gap-3 ${
            isCollapsed ? "p-3 justify-center" : "p-3"
          }`}
        >
          <Plus size={16} />
          {!isCollapsed && <span className="font-medium">New project</span>}
        </button>
      </div>

      {/* Navigation */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <nav className="space-y-1">
            <button
              onClick={handleProjectsClick}
              className={`w-full flex items-center gap-3 p-2 text-sm rounded-md transition-colors ${
                pathname === "/projects"
                  ? "bg-[#eff6ff] text-[#1e3a8a] font-medium"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <Briefcase size={16} />
              <span>Projects</span>
            </button>
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* User Section */}
      <div className="p-3 border-t border-gray-200">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-3"
          }`}
        >
          <UserButton />
          {!isCollapsed && (
            <span className="text-sm text-gray-500">Profile</span>
          )}
        </div>
      </div>
    </div>
  );
}
