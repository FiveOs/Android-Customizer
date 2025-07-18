import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Microchip, Check, Download, Upload, FileText } from "lucide-react";

interface SidebarProps {
  currentStep: number;
  wslStatus?: {
    available: boolean;
    distros: string[];
    message: string;
  };
  onExportConfig: () => void;
  onImportConfig: () => void;
}

const steps = [
  { id: 1, name: "Configuration", description: "Device and features setup" },
  { id: 2, name: "Environment", description: "WSL setup and validation" },
  { id: 3, name: "Sources", description: "Clone repositories" },
  { id: 4, name: "Patches", description: "Apply NetHunter patches" },
  { id: 5, name: "Build", description: "Compile kernel" },
];

export default function Sidebar({ currentStep, wslStatus, onExportConfig, onImportConfig }: SidebarProps) {
  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Microchip className="text-primary-foreground" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Kernel Customizer</h1>
            <p className="text-sm text-slate-400">Android Development Tool</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex-1 p-6">
        <h2 className="text-sm font-medium text-slate-300 mb-4">Build Process</h2>
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                step.id === currentStep
                  ? "bg-primary/10 border border-primary/20"
                  : step.id < currentStep
                  ? "bg-slate-700/50"
                  : "bg-slate-700/30"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step.id < currentStep
                    ? "bg-primary text-primary-foreground"
                    : step.id === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-slate-600 text-slate-300"
                }`}
              >
                {step.id < currentStep ? (
                  <Check size={12} />
                ) : (
                  step.id
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  step.id <= currentStep ? "text-white" : "text-slate-300"
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Current Status */}
        <div className="mt-8 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-300">WSL Status</h3>
            <Badge variant={wslStatus?.available ? "default" : "destructive"}>
              {wslStatus?.available ? "Ready" : "Not Available"}
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            {wslStatus?.message || "Checking WSL environment..."}
          </p>
          {wslStatus?.available && wslStatus.distros.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-slate-500">Available distributions:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {wslStatus.distros.slice(0, 3).map((distro) => (
                  <Badge key={distro} variant="outline" className="text-xs">
                    {distro}
                  </Badge>
                ))}
                {wslStatus.distros.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{wslStatus.distros.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 border-t border-border">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={onExportConfig}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Configuration
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => document.getElementById("config-import")?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Configuration
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Build Logs
          </Button>
        </div>
      </div>
    </div>
  );
}
