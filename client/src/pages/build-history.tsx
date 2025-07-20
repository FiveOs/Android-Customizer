import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export default function BuildHistoryPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <History className="h-8 w-8 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Build History</h1>
            <p className="text-slate-400">
              Track your kernel and TWRP builds with detailed progress
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-purple-400">Recent Builds</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">Build history functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}