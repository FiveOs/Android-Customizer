import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Download, History } from "lucide-react";

export default function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const actions = [
    { icon: Plus, label: "New Build", action: () => console.log("New Build") },
    { icon: Settings, label: "Settings", action: () => console.log("Settings") },
    { icon: Download, label: "Downloads", action: () => console.log("Downloads") },
    { icon: History, label: "History", action: () => console.log("History") },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end space-y-2">
        {isExpanded && (
          <div className="flex flex-col space-y-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={action.action}
                className="bg-slate-800 border-emerald-500/30 text-emerald-100 hover:bg-slate-700 hover:border-emerald-400"
              >
                <action.icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        )}
        
        <Button
          size="lg"
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
        >
          <Plus className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? 'rotate-45' : ''}`} />
        </Button>
      </div>
    </div>
  );
}