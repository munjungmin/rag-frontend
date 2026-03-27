import { useState } from "react";
import { Search, FileText, Loader2 } from "lucide-react";

interface ChunksViewerProps {
  chunks: any[];
  chunksLoading: boolean;
  selectedChunk: any;
  onSelectChunk: (chunk: any) => void;
}

export function ChunksViewer({
  chunks,
  chunksLoading,
  selectedChunk,
  onSelectChunk,
}: ChunksViewerProps) {
  const [chunksFilter, setChunksFilter] = useState<
    "all" | "text" | "image" | "table"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChunks = chunks.filter((chunk) => {
    const matchesFilter =
      chunksFilter === "all" ||
      (Array.isArray(chunk.type) && chunk.type.includes(chunksFilter));
    const matchesSearch = chunk.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Chunks Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Content Chunks</h3>
          <div className="text-sm text-gray-400">
            {filteredChunks.length} of {chunks.length} chunks
            {chunksLoading && (
              <span className="text-[#4F63D2]"> (Loading...)</span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex gap-2">
            {["all", "text", "image", "table"].map((filter) => (
              <button
                key={filter}
                onClick={() => setChunksFilter(filter as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  chunksFilter === filter
                    ? "bg-[#4F63D2]/10 text-[#4F63D2] border border-[#4F63D2]/30"
                    : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 hover:text-gray-700"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search chunks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F63D2]/20 focus:border-[#4F63D2] text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Chunks List */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#ECEEF6]">
        {chunksLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#4F63D2]" />
              <span className="text-gray-500">Loading chunks...</span>
            </div>
          </div>
        ) : filteredChunks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No chunks found</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChunks.map((chunk) => (
              <div
                key={chunk.id}
                onClick={() => onSelectChunk(chunk)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedChunk?.id === chunk.id
                    ? "border-[#4F63D2]/40 bg-[#4F63D2]/5"
                    : "border-gray-200 bg-white hover:border-[#4F63D2]/30 hover:bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {Array.isArray(chunk.type) &&
                      chunk.type.map((type: string) => (
                        <span
                          key={type}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            type === "text"
                              ? "bg-green-50 text-green-600 border border-green-200"
                              : type === "image"
                              ? "bg-purple-50 text-purple-600 border border-purple-200"
                              : "bg-orange-50 text-orange-600 border border-orange-200"
                          }`}
                        >
                          {type}
                        </span>
                      ))}
                    <span className="text-sm text-gray-400">
                      Page {chunk.page}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">{chunk.chars} chars</div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {chunk.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
