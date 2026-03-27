import { CheckCircle } from "lucide-react";
import { GenericStep } from "./GenericStep";

interface PartitioningStepProps {
  status: "completed" | "processing" | "failed" | "pending";
  elementsFound?: {
    text: number;
    tables: number;
    images: number;
    titles: number;
    other: number;
  };
}

export function PartitioningStep({
  status,
  elementsFound,
}: PartitioningStepProps) {
  if (!elementsFound || status !== "completed") {
    return (
      <GenericStep
        stepName="Partitioning"
        description="Processing and extracting text, images, and tables"
        status={status}
      />
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-xl font-medium text-gray-800 mb-2">Partitioning</h3>
        <p className="text-gray-500 mb-6">
          Processing and extracting text, images, and tables
        </p>

        <div className="mb-6 bg-[#4F63D2]/5 border border-[#4F63D2]/20 rounded-xl p-4">
          <h4 className="font-medium text-[#4F63D2] mb-3">
            📊 Elements Discovered
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(elementsFound)
              .filter(([key, value]) => value > 0)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-white rounded px-3 py-2 border border-gray-200"
                >
                  <span className="text-gray-600">
                    {key === "text"
                      ? " Text sections"
                      : key === "tables"
                      ? " Tables"
                      : key === "images"
                      ? " Images"
                      : key === "titles"
                      ? " Titles/Headers"
                      : " Other elements"}
                  </span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-600 font-medium">
              Step completed successfully
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
