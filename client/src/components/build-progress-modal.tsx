import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Pause, Download, Square } from "lucide-react";
import { BuildJob } from "@shared/schema";

interface BuildProgressModalProps {
  build: BuildJob;
  onClose: () => void;
  onCancel: () => void;
}

const steps = [
  { name: "Setup", description: "Environment setup" },
  { name: "Clone", description: "Repository cloning" },
  { name: "Patches", description: "Applying patches" },
  { name: "Build", description: "Kernel compilation" },
  { name: "Complete", description: "Finished" },
];

export default function BuildProgressModal({ build, onClose, onCancel }: BuildProgressModalProps) {
  const getStepStatus = (stepIndex: number) => {
    const progress = build.progress;
    if (progress >= (stepIndex + 1) * 20) return "completed";
    if (progress >= stepIndex * 20 && progress < (stepIndex + 1) * 20) return "running";
    return "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-amber-500/20 text-amber-400";
      case "completed":
        return "bg-emerald-500/20 text-emerald-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      case "cancelled":
        return "bg-slate-500/20 text-slate-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  const saveLogs = () => {
    const dataStr = build.logs;
    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `build_${build.id}_logs.txt`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-slate-800 border-slate-700 text-white flex flex-col">
        {/* Modal Header */}
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-medium text-white">Building Kernel</DialogTitle>
              <DialogDescription className="text-sm text-slate-400">
                {build.currentStep}
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className={getStatusColor(build.status)}>
                {build.status === "running" && <span className="animate-spin mr-1">⟳</span>}
                {build.status.charAt(0).toUpperCase() + build.status.slice(1)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="space-y-4">
            {/* Overall Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Overall Progress</span>
                <span className="text-sm text-slate-400">{build.progress}%</span>
              </div>
              <Progress
                value={build.progress}
                className="w-full bg-slate-700 [&>[data-state=complete]]:bg-primary"
              />
            </div>

            {/* Step Status */}
            <div className="grid grid-cols-5 gap-2">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                return (
                  <div key={step.name} className="text-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 text-xs font-medium ${
                        status === "completed"
                          ? "bg-emerald-500 text-white"
                          : status === "running"
                          ? "bg-amber-500 text-white"
                          : "bg-slate-600 text-slate-300"
                      }`}
                    >
                      {status === "completed" ? (
                        "✓"
                      ) : status === "running" ? (
                        <span className="animate-spin">⟳</span>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        status === "completed"
                          ? "text-emerald-400"
                          : status === "running"
                          ? "text-amber-400"
                          : "text-slate-400"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Log Output */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-300">Build Log</h4>
              <div className="flex items-center space-x-2">
                {build.status === "running" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
                    className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  >
                    <Square className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveLogs}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Save
                </Button>
              </div>
            </div>
            <div className="flex-1 bg-slate-900 rounded-lg p-4 overflow-y-auto font-mono text-sm log-viewer">
              <div className="text-slate-300 whitespace-pre-wrap">
                {build.logs || "Waiting for build output..."}
                {build.status === "running" && (
                  <span className="animate-pulse text-amber-400">█</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
