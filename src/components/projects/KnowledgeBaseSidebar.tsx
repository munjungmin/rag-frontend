"use client";

import { useDropzone } from "react-dropzone";
import {
  FileText,
  Settings,
  Plus,
  Upload,
  Globe,
  File,
  Presentation,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Info,
} from "lucide-react";
import { ProjectSettings, ProjectDocument } from "@/lib/types";
import { JSX, useState } from "react";

// Constants
const STRATEGY_OPTIONS = [
  {
    value: "basic",
    label: "Vector Search",
    description: "Semantic similarity matching",
  },
  {
    value: "hybrid",
    label: "Hybrid Search",
    description: "Semantic + keyword matching",
  },
  {
    value: "multi-query-vector",
    label: "Multi-Query Vector",
    description: "Multiple semantic queries",
  },
  {
    value: "multi-query-hybrid",
    label: "Multi-Query Hybrid",
    description: "Multiple hybrid queries",
  },
];

const RERANKING_MODELS = [
  { value: "rerank-english-v3.0", label: "rerank-english-v3.0" },
];

const EMBEDDING_MODELS = [
  { value: "text-embedding-3-large", label: "text-embedding-3-large" },
];

const AGENT_MODE_OPTIONS = [
  {
    value: "simple",
    label: "Simple RAG",
    description: "Documents-only search",
  },
  {
    value: "agentic",
    label: "Agentic RAG",
    description: "Smart tool selection with web search",
  },
];

// Utility functions
const documentUtils = {
  formatFileSize: (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  },

  formatTimeAgo: (dateString: string) => {
    const diffInHours = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60)
    );
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays < 7
      ? `${diffInDays}d ago`
      : new Date(dateString).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
  },

  getIcon: (doc: ProjectDocument) => {
    if (doc.source_url) return <Globe size={14} className="text-gray-400" />;
    const type = doc.file_type.toLowerCase();
    if (type.includes("pdf"))
      return <FileText size={14} className="text-gray-400" />;
    if (type.includes("ppt") || type.includes("presentation"))
      return <Presentation size={14} className="text-gray-400" />;
    if (type.includes("word") || type.includes("document"))
      return <File size={14} className="text-gray-400" />;
    return <FileText size={14} className="text-gray-400" />;
  },

  getDisplayName: (doc: ProjectDocument) => {
    if (!doc.source_url) return doc.filename;
    try {
      const url = new URL(doc.source_url);
      return `${url.hostname}${url.pathname}`;
    } catch {
      return doc.source_url;
    }
  },

  getSize: (doc: ProjectDocument) =>
    doc.source_url ? "Website" : documentUtils.formatFileSize(doc.file_size),

  getStatusIcon: (status: string) => {
    const icons: { [key: string]: JSX.Element } = {
      completed: <CheckCircle size={12} className="text-gray-400" />,
      failed: <AlertCircle size={12} className="text-red-400" />,
    };
    return (
      icons[status] || (
        <Loader2 size={12} className="text-[#4F63D2] animate-spin" />
      )
    );
  },

  getStatusText: (status: string) => {
    const texts: { [key: string]: string } = {
      uploading: "Uploading",
      queued: "Queued",
      partitioning: "Processing",
      chunking: "Chunking",
      summarising: "Summarising",
      vectorization: "Vectorizing",
      completed: "Ready",
      failed: "Failed",
    };
    return texts[status] || "Unknown";
  },
};

// Reusable Components
const SliderField = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled,
  info,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  info?: string;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-xs text-gray-500">{label}</label>
      <span className="text-xs text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded">
        {value}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 slider"
    />
    <div className="flex justify-between text-xs text-gray-400">
      <span>{min}</span>
      <span>{max}</span>
    </div>
    {info && <div className="text-xs text-gray-400 mt-1">{info}</div>}
  </div>
);

const StatusAlert = ({
  type,
  message,
}: {
  type: "error" | "loading";
  message: string;
}) => (
  <div
    className={`border rounded-lg p-3 ${
      type === "error"
        ? "bg-red-50 border-red-200"
        : "bg-[#4F63D2]/5 border-[#4F63D2]/20"
    }`}
  >
    <div className="flex items-center gap-3">
      {type === "error" ? (
        <Info size={14} className="text-red-500 flex-shrink-0" />
      ) : (
        <div className="w-3 h-3 border border-[#4F63D2] border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      )}
      <span
        className={`text-sm ${
          type === "error" ? "text-red-600" : "text-[#4F63D2]"
        }`}
      >
        {message}
      </span>
    </div>
  </div>
);

// Main Component
interface KnowledgeBaseSidebarProps {
  activeTab: "documents" | "settings";
  onSetActiveTab: (tab: "documents" | "settings") => void;
  projectDocuments: ProjectDocument[];
  onDocumentUpload: (docs: File[]) => Promise<void>;
  onDocumentDelete: (docId: string) => Promise<void>;
  onOpenDocument: (docId: string) => void;
  onUrlAdd: (url: string) => Promise<void>;
  projectSettings: ProjectSettings | null;
  settingsError: string | null;
  settingsLoading: boolean;
  onUpdateSettings: (updates: Partial<ProjectSettings>) => void;
  onApplySettings: () => void;
}

export function KnowledgeBaseSidebar({
  activeTab,
  onSetActiveTab,
  projectDocuments,
  onDocumentUpload,
  onDocumentDelete,
  onOpenDocument,
  onUrlAdd,
  projectSettings,
  settingsError,
  settingsLoading,
  onUpdateSettings,
  onApplySettings,
}: KnowledgeBaseSidebarProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isAddingUrl, setIsAddingUrl] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDocumentUpload,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
    },
    maxSize: 50 * 1024 * 1024,
  });

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || isAddingUrl) return;

    setIsAddingUrl(true);
    try {
      await onUrlAdd(urlInput.trim());
      setUrlInput("");
    } catch (error) {
      console.error("Failed to add URL:", error);
      alert("Failed to add website. Please try again.");
    } finally {
      setIsAddingUrl(false);
    }
  };

  const getPerformanceMetrics = () => {
    if (!projectSettings) return { totalChunks: 0, latency: 0 };

    const strategyConfig = {
      basic: { latency: 400 },
      hybrid: { latency: 600 },
      "multi-query-vector": { latency: 800 },
      "multi-query-hybrid": { latency: 1000 },
    }[projectSettings.rag_strategy] || { latency: 400 };

    const isMultiQuery = projectSettings.rag_strategy.includes("multi-query");
    const totalChunks =
      projectSettings.chunks_per_search *
      (isMultiQuery ? projectSettings.number_of_queries : 1);

    const baseLatency = strategyConfig.latency;
    const queryLatency = isMultiQuery
      ? projectSettings.number_of_queries * 200
      : 0;
    const rerankingLatency = projectSettings.reranking_enabled ? 200 : 0;

    const latency = baseLatency + queryLatency + rerankingLatency;

    return { totalChunks, latency };
  };

  const isMultiQuery = projectSettings?.rag_strategy?.includes("multi-query");
  const isHybrid = projectSettings?.rag_strategy?.includes("hybrid");
  const isEmbeddingLocked = projectDocuments.length > 0;

  return (
    <div className="w-80 bg-white border border-gray-200 h-full flex flex-col rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <div className="w-6 h-6 bg-[#4F63D2]/10 border border-[#4F63D2]/20 rounded-md flex items-center justify-center">
              <FileText size={14} className="text-[#4F63D2]" />
            </div>
            Knowledge Base
          </h2>
          <button
            onClick={() => onSetActiveTab("documents")}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Add documents"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {[
          {
            id: "documents",
            icon: FileText,
            label: "Documents",
            badge: projectDocuments.length,
          },
          {
            id: "settings",
            icon: Settings,
            label: "Settings",
            error: settingsError,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSetActiveTab(tab.id as "documents" | "settings")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? "border-[#4F63D2] text-[#4F63D2] bg-white"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? "bg-[#4F63D2]/10 text-[#4F63D2]"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {tab.badge}
              </span>
            )}
            {tab.error && (
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "documents" ? (
          <div className="p-6 space-y-8 bg-white h-full overflow-y-auto">
            {/* Upload Section */}
            <section className="space-y-6">
              <h3 className="text-sm font-medium text-gray-700">Add Sources</h3>

              {/* File Upload */}
              <div
                {...getRootProps()}
                className={`border border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDragActive
                    ? "border-[#4F63D2] bg-[#4F63D2]/5"
                    : "border-gray-300 hover:border-[#4F63D2]/50 bg-gray-50 hover:bg-[#4F63D2]/5"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Upload className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      {isDragActive
                        ? "Drop files here"
                        : "Drop files or click to upload"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {isDragActive
                        ? "Release to upload"
                        : "PDF, DOCX, PPT, MD, TXT • Max 50GB"}
                    </p>
                  </div>
                </div>
              </div>

              {/* URL Input */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-xs text-gray-400 px-2">OR</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <form onSubmit={handleUrlSubmit} className="space-y-3">
                <div className="relative">
                  <Globe
                    size={14}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Paste website URL"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={isAddingUrl}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4F63D2] focus:ring-2 focus:ring-[#4F63D2]/20 disabled:opacity-50 text-sm text-gray-800 placeholder:text-gray-400 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!urlInput.trim() || isAddingUrl}
                  className="w-full px-4 py-3 bg-[#4F63D2] hover:bg-[#3D52C5] disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {isAddingUrl ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Adding website...
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      Add website
                    </>
                  )}
                </button>
              </form>
            </section>

            <hr className="border-gray-200" />

            {/* Documents List */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Sources</h3>
                <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2 py-1 rounded">
                  {projectDocuments.length}
                </span>
              </div>

              {projectDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    No sources added yet
                  </p>
                  <p className="text-xs text-gray-400">
                    Upload files or add websites to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {projectDocuments
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => onOpenDocument(doc.id)}
                        className="group bg-gray-50 hover:bg-[#4F63D2]/5 border border-gray-200 hover:border-[#4F63D2]/30 rounded-lg p-3 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-7 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center">
                            {documentUtils.getIcon(doc)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                                {documentUtils.getDisplayName(doc)}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDocumentDelete(doc.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                title="Delete source"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>{documentUtils.getSize(doc)}</span>
                                <span>•</span>
                                <span>
                                  {documentUtils.formatTimeAgo(doc.created_at)}
                                </span>
                              </div>
                              {doc.processing_status &&
                                doc.processing_status !== "completed" && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    {documentUtils.getStatusIcon(
                                      doc.processing_status
                                    )}
                                    <span>
                                      {documentUtils.getStatusText(
                                        doc.processing_status
                                      )}
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="p-6 space-y-8 bg-white h-full overflow-y-auto">
            {/* Status Alerts */}
            {settingsError && (
              <StatusAlert type="error" message={settingsError} />
            )}
            {settingsLoading && (
              <StatusAlert type="loading" message="Applying settings..." />
            )}

            {projectSettings ? (
              <div
                className={`space-y-8 ${
                  settingsLoading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {/* Embedding Model */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      Embedding Model
                    </h3>
                    <div
                      className="w-3 h-3 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center"
                      title={
                        isEmbeddingLocked
                          ? "Locked (documents uploaded)"
                          : "Locked after first document upload"
                      }
                    >
                      <Info size={8} className="text-amber-500" />
                    </div>
                  </div>
                  <select
                    value={projectSettings.embedding_model}
                    onChange={(e) =>
                      onUpdateSettings({ embedding_model: e.target.value })
                    }
                    disabled={isEmbeddingLocked || settingsLoading}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4F63D2] focus:ring-2 focus:ring-[#4F63D2]/20 text-sm text-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {EMBEDDING_MODELS.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-amber-500">
                    {isEmbeddingLocked
                      ? "Locked (documents uploaded)"
                      : "Locked after first document upload"}
                  </p>
                </section>

                <hr className="border-gray-200" />

                {/* Search Strategy */}
                <section className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Search Strategy
                  </h3>
                  <div className="space-y-2">
                    {STRATEGY_OPTIONS.map((strategy) => (
                      <label
                        key={strategy.value}
                        className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                          projectSettings.rag_strategy === strategy.value
                            ? "border-[#4F63D2]/40 bg-[#4F63D2]/5"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="ragStrategy"
                            value={strategy.value}
                            checked={
                              projectSettings.rag_strategy === strategy.value
                            }
                            onChange={(e) =>
                              onUpdateSettings({ rag_strategy: e.target.value })
                            }
                            disabled={settingsLoading}
                            className="w-4 h-4 text-[#4F63D2] border-gray-300 focus:ring-[#4F63D2]/20"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">
                              {strategy.label}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {strategy.description}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                <hr className="border-gray-200" />

                {/* Search Parameters */}
                <section className="space-y-5">
                  <h3 className="text-sm font-medium text-gray-700">
                    Search Parameters
                  </h3>

                  <SliderField
                    label="Chunks per Search"
                    value={projectSettings.chunks_per_search}
                    min={5}
                    max={30}
                    onChange={(e) =>
                      onUpdateSettings({
                        chunks_per_search: parseInt(e.target.value),
                      })
                    }
                    disabled={settingsLoading}
                  />

                  <SliderField
                    label="Final Context Size"
                    value={projectSettings.final_context_size}
                    min={3}
                    max={10}
                    onChange={(e) =>
                      onUpdateSettings({
                        final_context_size: parseInt(e.target.value),
                      })
                    }
                    disabled={settingsLoading}
                  />

                  <SliderField
                    label="Similarity Threshold"
                    value={projectSettings.similarity_threshold}
                    min={0.1}
                    max={0.9}
                    step={0.1}
                    onChange={(e) =>
                      onUpdateSettings({
                        similarity_threshold: parseFloat(e.target.value),
                      })
                    }
                    disabled={settingsLoading}
                  />

                  {isMultiQuery && (
                    <div className="pt-2 border-t border-gray-200">
                      <SliderField
                        label="Number of Queries"
                        value={projectSettings.number_of_queries}
                        min={3}
                        max={7}
                        onChange={(e) =>
                          onUpdateSettings({
                            number_of_queries: parseInt(e.target.value),
                          })
                        }
                        disabled={settingsLoading}
                      />
                    </div>
                  )}
                </section>

                {/* Hybrid Search Weights */}
                {isHybrid && (
                  <>
                    <hr className="border-gray-200" />
                    <section className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-700">
                        Search Weights
                      </h3>
                      <SliderField
                        label="Vector Weight"
                        value={projectSettings.vector_weight}
                        min={0.1}
                        max={0.9}
                        step={0.1}
                        onChange={(e) => {
                          const vectorWeight = parseFloat(e.target.value);
                          onUpdateSettings({
                            vector_weight: vectorWeight,
                            keyword_weight: 1 - vectorWeight,
                          });
                        }}
                        disabled={settingsLoading}
                        info={`Keyword weight: ${projectSettings.keyword_weight.toFixed(
                          1
                        )} (auto-calculated)`}
                      />
                    </section>
                  </>
                )}

                <hr className="border-gray-200" />

                {/* Reranking */}
                <section className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Reranking
                  </h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projectSettings.reranking_enabled}
                      onChange={(e) =>
                        onUpdateSettings({
                          reranking_enabled: e.target.checked,
                        })
                      }
                      disabled={settingsLoading}
                      className="w-4 h-4 text-[#4F63D2] border-gray-300 rounded focus:ring-[#4F63D2]/20"
                    />
                    <span className="text-sm text-gray-700">
                      Enable reranking
                    </span>
                  </label>

                  {projectSettings.reranking_enabled && (
                    <div className="ml-7 space-y-2">
                      <label className="text-xs text-gray-500">Model</label>
                      <select
                        value={projectSettings.reranking_model}
                        onChange={(e) =>
                          onUpdateSettings({ reranking_model: e.target.value })
                        }
                        disabled={settingsLoading}
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4F63D2] text-sm text-gray-800 disabled:opacity-50 transition-colors"
                      >
                        {RERANKING_MODELS.map((model) => (
                          <option key={model.value} value={model.value}>
                            {model.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </section>

                <hr className="border-gray-200" />

                {/* Agent Mode */}
                <section className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Agent Mode
                  </h3>
                  <div className="space-y-2">
                    {AGENT_MODE_OPTIONS.map((mode) => (
                      <label
                        key={mode.value}
                        className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                          projectSettings.agent_type === mode.value
                            ? "border-[#4F63D2]/40 bg-[#4F63D2]/5"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="agentMode"
                            value={mode.value}
                            checked={projectSettings.agent_type === mode.value}
                            onChange={(e) =>
                              onUpdateSettings({ agent_type: e.target.value })
                            }
                            disabled={settingsLoading}
                            className="w-4 h-4 text-[#4F63D2] border-gray-300 focus:ring-[#4F63D2]/20"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">
                              {mode.label}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {mode.description}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                <hr className="border-gray-200" />

                {/* Performance Impact */}
                <section className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Performance Impact
                  </h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-medium text-gray-800">
                          ~{getPerformanceMetrics().totalChunks}
                        </div>
                        <div className="text-xs text-gray-400">
                          Total chunks
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-medium text-gray-800">
                          ~{getPerformanceMetrics().latency}ms
                        </div>
                        <div className="text-xs text-gray-400">Latency</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Apply Settings Button */}
                <button
                  onClick={onApplySettings}
                  disabled={settingsLoading}
                  className="w-full bg-[#4F63D2] hover:bg-[#3D52C5] disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Settings size={16} />
                  {settingsLoading ? "Applying..." : "Apply Settings"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-200 border-t-[#4F63D2] rounded-full animate-spin"></div>
                  Loading settings...
                </div>
              </div>
            )}

            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                height: 16px;
                width: 16px;
                background: #4F63D2;
                border-radius: 50%;
                cursor: pointer;
                border: none;
                transition: all 0.2s ease;
              }
              .slider::-webkit-slider-thumb:hover {
                background: #3D52C5;
                transform: scale(1.1);
              }
              .slider::-moz-range-thumb {
                height: 16px;
                width: 16px;
                background: #4F63D2;
                border-radius: 50%;
                cursor: pointer;
                border: none;
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
