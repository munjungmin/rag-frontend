import { CheckCircle, Loader2, AlertCircle, Clock } from "lucide-react";

interface GenericStepProps {
  stepName: string;
  description: string;
  status: "completed" | "processing" | "failed" | "pending";
}

export function GenericStep({
  stepName,
  description,
  status,
}: GenericStepProps) {
  const getIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "processing":
        return <Loader2 className="w-16 h-16 animate-spin text-[#4F63D2]" />;
      case "failed":
        return <AlertCircle className="w-16 h-16 text-red-500" />;
      default:
        return <Clock className="w-16 h-16 text-gray-300" />;
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "processing":
        return (
          <div className="bg-[#4F63D2]/5 border border-[#4F63D2]/20 rounded-xl p-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#4F63D2]" />
              <span className="text-[#4F63D2] font-medium">Processing...</span>
            </div>
          </div>
        );
      case "completed":
        return (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-600 font-medium">
                Step completed successfully
              </span>
            </div>
          </div>
        );
      case "failed":
        return (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-600 font-medium">
                Processing failed at this step
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-[#4F63D2]/10 border border-[#4F63D2]/20 rounded-2xl flex items-center justify-center">
          {getIcon()}
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">{stepName}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        {getStatusDisplay()}
      </div>
    </div>
  );
}
