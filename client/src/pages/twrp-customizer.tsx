import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive } from "lucide-react";

export default function TWRPCustomizerPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <HardDrive className="h-8 w-8 text-orange-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">TWRP Customizer</h1>
            <p className="text-slate-400">
              Build custom Team Win Recovery Project (TWRP) images
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-orange-400">TWRP Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">TWRP customizer functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}