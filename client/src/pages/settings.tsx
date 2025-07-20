import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-slate-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-slate-400">
              Configure your preferences and application settings
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-400">Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">Settings functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}