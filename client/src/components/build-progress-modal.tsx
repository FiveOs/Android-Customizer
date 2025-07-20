import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from "@/hooks/use-websocket";
import { X, Download, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface BuildJob {
  id: string;
  device: string;
  buildType: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  progress: number;
  currentStep: string;
  logs: string;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

interface BuildProgressModalProps {
  buildJob: BuildJob | null;
  open: boolean;
  onClose: () => void;
  onCancel?: (buildId: string) => void;
}

export default function BuildProgressModal({
  buildJob,
  open,
  onClose,
  onCancel,
}: BuildProgressModalProps) {
  const [currentBuild, setCurrentBuild] = useState<BuildJob | null>(buildJob);
  const [logs, setLogs] = useState<string[]>([]);

  // WebSocket connection for real-time updates
  const { isConnected } = useWebSocket('/ws', {
    onMessage: (data) => {
      if (data.type === 'buildUpdate' && data.buildJobId === currentBuild?.id) {
        setCurrentBuild(prev => prev ? {
          ...prev,
          progress: data.progress ?? prev.progress,
          currentStep: data.currentStep ?? prev.currentStep,
          status: data.status ?? prev.status,
        } : null);

        if (data.logs) {
          setLogs(prev => [...prev, data.logs]);
        }
      }
    },
  });

  useEffect(() => {
    if (buildJob) {
      setCurrentBuild(buildJob);
      setLogs(buildJob.logs ? buildJob.logs.split('\n').filter(Boolean) : []);
    }
  }, [buildJob]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "failed":
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-yellow-600";
      case "completed":
        return "bg-green-600";
      case "failed":
        return "bg-red-600";
      case "cancelled":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const handleCancel = () => {
    if (currentBuild && onCancel) {
      onCancel(currentBuild.id);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  if (!currentBuild) return null;

  const canCancel = currentBuild.status === "running" || currentBuild.status === "pending";
  const isComplete = currentBuild.status === "completed";
  const hasFailed = currentBuild.status === "failed" || currentBuild.status === "cancelled";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-slate-900 border-slate-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center space-x-2">
              {getStatusIcon(currentBuild.status)}
              <span>Build Progress - {currentBuild.device}</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Build Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Status</p>
              <Badge className={getStatusColor(currentBuild.status)}>
                {currentBuild.status.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Build Type</p>
              <p className="text-white">{currentBuild.buildType}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Started</p>
              <p className="text-white">{formatTime(currentBuild.createdAt)}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Progress</p>
              <span className="text-sm text-white">{currentBuild.progress}%</span>
            </div>
            <Progress value={currentBuild.progress} className="h-2" />
            <p className="text-sm text-emerald-400">{currentBuild.currentStep}</p>
          </div>

          {/* Live Logs */}
          <div className="space-y-3">
            <p className="text-sm text-slate-400">Build Logs</p>
            <ScrollArea className="h-64 bg-slate-950 border border-slate-800 rounded p-4">
              <div className="font-mono text-xs space-y-1">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={
                      log.includes("ERROR") || log.includes("FAILED")
                        ? "text-red-400"
                        : log.includes("SUCCESS") || log.includes("COMPLETED")
                        ? "text-green-400"
                        : log.includes("WARNING")
                        ? "text-yellow-400"
                        : "text-slate-300"
                    }
                  >
                    {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-slate-500">No logs available yet...</div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-xs text-slate-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {canCancel && (
                <Button variant="destructive" onClick={handleCancel}>
                  Cancel Build
                </Button>
              )}
              {isComplete && currentBuild.downloadUrl && (
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}