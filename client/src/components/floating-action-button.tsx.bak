import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Rocket, Save, Download, Upload, Play, Zap } from "lucide-react";

interface FloatingActionButtonProps {
  onQuickBuild: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  isBuilding?: boolean;
}

export default function FloatingActionButton({ 
  onQuickBuild, 
  onSave, 
  onExport, 
  onImport, 
  isBuilding = false 
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const actions = [
    {
      icon: Play,
      label: "Quick Build",
      action: onQuickBuild,
      color: "bg-emerald-600 hover:bg-emerald-700",
      disabled: isBuilding
    },
    {
      icon: Save,
      label: "Save Config",
      action: onSave,
      color: "bg-blue-600 hover:bg-blue-700",
      disabled: false
    },
    {
      icon: Download,
      label: "Export Config",
      action: onExport,
      color: "bg-purple-600 hover:bg-purple-700",
      disabled: false
    },
    {
      icon: Upload,
      label: "Import Config",
      action: onImport,
      color: "bg-orange-600 hover:bg-orange-700",
      disabled: false
    }
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`flex flex-col space-y-3 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Tooltip key={action.label}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className={`w-12 h-12 rounded-full shadow-lg border-0 ${action.color} text-white transition-all duration-300 hover:scale-110 glow-effect`}
                    onClick={action.action}
                    disabled={action.disabled}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      transform: isExpanded ? 'scale(1)' : 'scale(0)',
                    }}
                  >
                    <Icon size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-slate-800 border-emerald-500/30 text-white">
                  {action.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        
        {/* Main FAB */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className={`w-16 h-16 rounded-full shadow-2xl border-0 transition-all duration-300 hover:scale-110 ${
                isBuilding 
                  ? 'bg-orange-600 hover:bg-orange-700 pulse-glow-effect' 
                  : 'bg-emerald-600 hover:bg-emerald-700 glow-effect'
              } text-white`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isBuilding ? (
                <Zap size={24} className="animate-pulse" />
              ) : (
                <Rocket size={24} className={isExpanded ? 'rotate-45' : ''} style={{transition: 'transform 0.3s'}} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-slate-800 border-emerald-500/30 text-white">
            {isBuilding ? 'Building...' : 'Quick Actions'}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}