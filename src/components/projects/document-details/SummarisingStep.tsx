import { GenericStep } from "./GenericStep";
import { Loader2, CheckCircle } from "lucide-react";

interface SummarisingStepProps {
  status: "completed" | "processing" | "failed" | "pending";
  summarisingData?: {
    current_chunk: number;
    total_chunks: number;
  };
}

export function SummarisingStep({
  status,
  summarisingData,
}: SummarisingStepProps) {
  if (!summarisingData) {
    return (
      <GenericStep
        stepName="Summarisation"
        description="Enhancing content with AI summaries for images and tables"
        status={status}
      />
    );
  }

  if (status === "processing") {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Summarisation
          </h3>
          <p className="text-gray-500 mb-6">
            Enhancing content with AI summaries for images and tables
          </p>

          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h4 className="font-medium text-purple-600 mb-3">
              🤖 AI Summarising Progress
            </h4>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-center">
                <div className="font-bold text-3xl text-purple-500 mb-2">
                  {summarisingData.current_chunk} /{" "}
                  {summarisingData.total_chunks}
                </div>
                <div className="text-gray-400">chunks processed</div>
              </div>
            </div>

            <div className="mt-3 text-xs text-purple-500">
              Processing chunks and creating AI summaries for images and tables
            </div>
          </div>

          <div className="bg-[#4F63D2]/5 border border-[#4F63D2]/20 rounded-xl p-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#4F63D2]" />
              <span className="text-[#4F63D2] font-medium">Processing...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Summarisation
          </h3>
          <p className="text-gray-500 mb-6">
            Enhancing content with AI summaries for images and tables
          </p>

          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-medium text-green-600 mb-3">
              🤖 AI Enhancement Complete
            </h4>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-center">
                <div className="font-bold text-3xl text-green-500 mb-2">
                  {summarisingData.total_chunks}
                </div>
                <div className="text-gray-400">
                  chunks enhanced with AI summaries
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-green-600">
              All chunks have been processed and enhanced with AI summaries for
              images and tables
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

  return (
    <GenericStep
      stepName="Summarisation"
      description="Enhancing content with AI summaries for images and tables"
      status={status}
    />
  );
}
