import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

interface DetailInspectorProps {
  selectedChunk: any;
  isProcessingComplete: boolean;
}

export function DetailInspector({
  selectedChunk,
  isProcessingComplete,
}: DetailInspectorProps) {
  const [detailTab, setDetailTab] = useState<"summary" | "original">("summary");

  useEffect(() => {
    setDetailTab("summary");
  }, [selectedChunk]);

  return (
    <div className="w-[40%] bg-gray-50 border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h4 className="font-medium text-gray-700">Detail Inspector</h4>
      </div>

      {selectedChunk ? (
        <div className="flex-1 overflow-y-auto">
          {(selectedChunk?.type?.includes("table") ||
            selectedChunk?.type?.includes("image")) && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-1">
                <button
                  onClick={() => setDetailTab("summary")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    detailTab === "summary"
                      ? "bg-[#4F63D2]/10 text-[#4F63D2] border border-[#4F63D2]/30"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📄 Summary
                </button>
                <button
                  onClick={() => setDetailTab("original")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    detailTab === "original"
                      ? "bg-[#4F63D2]/10 text-[#4F63D2] border border-[#4F63D2]/30"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📊 Original
                </button>
              </div>
            </div>
          )}

          <div className="p-4">
            {detailTab === "summary" && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {Array.isArray(selectedChunk.type) &&
                    selectedChunk.type.map((type: string) => (
                      <span
                        key={type}
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          type === "text"
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : type === "image"
                            ? "bg-purple-50 text-purple-600 border border-purple-200"
                            : "bg-orange-50 text-orange-600 border border-orange-200"
                        }`}
                      >
                        {type.toUpperCase()}
                      </span>
                    ))}
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-2">
                    Content
                  </h5>
                  <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">
                    {selectedChunk.content}
                  </div>
                </div>
              </div>
            )}

            {detailTab === "original" && (
              <div className="space-y-4">
                {selectedChunk.original_content?.text && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">
                      Original Text
                    </h5>
                    <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                      {selectedChunk.original_content.text}
                    </div>
                  </div>
                )}

                {selectedChunk.original_content?.tables &&
                  selectedChunk.original_content.tables.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">
                        Tables ({selectedChunk.original_content.tables.length})
                      </h5>
                      {selectedChunk.original_content.tables.map(
                        (table: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg p-4 overflow-auto max-h-96 mb-2 text-xs text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: table || "No table data available",
                            }}
                          />
                        )
                      )}
                    </div>
                  )}

                {selectedChunk.original_content?.images &&
                  selectedChunk.original_content.images.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">
                        Images ({selectedChunk.original_content.images.length})
                      </h5>
                      {selectedChunk.original_content.images.map(
                        (image: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg p-4 mb-2"
                          >
                            <img
                              src={`data:image/jpeg;base64,${image}`}
                              alt={`Document image ${index + 1}`}
                              className="max-w-full h-auto rounded"
                              style={{ maxHeight: "300px" }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-gray-400">
            <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Eye size={24} className="text-gray-400" />
            </div>
            <p className="text-sm">
              {isProcessingComplete
                ? "Select a chunk to inspect details"
                : "Chunks will be available when processing completes"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
