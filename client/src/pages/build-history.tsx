import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Clock, CheckCircle, XCircle, AlertCircle, Play } from "lucide-react";
import { format } from "date-fns";
import BackButton from "@/components/back-button";

export default function BuildHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: builds = [], isLoading } = useQuery({
    queryKey: ["/api/builds"],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "running":
        return <Play className="w-4 h-4 text-blue-500" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filteredBuilds = builds.filter((build: any) => {
    const matchesSearch = build.configurationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         build.device?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || build.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading build history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <BackButton to="/" label="Home" className="mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Build History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your kernel build progress and download completed builds
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search builds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredBuilds.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 dark:text-gray-400">
                <p className="text-lg font-medium mb-2">No builds found</p>
                <p>Start your first kernel build to see the history here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBuilds.map((build: any) => (
              <Card key={build.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(build.status)}
                        <CardTitle className="text-lg">
                          {build.configurationName || `Build #${build.id}`}
                        </CardTitle>
                        <Badge className={getStatusColor(build.status)}>
                          {build.status}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        Started {format(new Date(build.createdAt), "PPp")}
                        {build.completedAt && (
                          <span> • Completed {format(new Date(build.completedAt), "PPp")}</span>
                        )}
                      </CardDescription>
                    </div>
                    {build.status === "completed" && build.outputFiles?.length > 0 && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {build.status === "running" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{build.currentStep || "Initializing..."}</span>
                          <span>{build.progress || 0}%</span>
                        </div>
                        <Progress value={build.progress || 0} className="w-full" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Device</p>
                        <p className="font-medium">{build.device || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Architecture</p>
                        <p className="font-medium">{build.kernelArch || "arm64"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="font-medium">
                          {build.completedAt && build.startedAt
                            ? `${Math.round(
                                (new Date(build.completedAt).getTime() - new Date(build.startedAt).getTime()) / 60000
                              )} min`
                            : build.startedAt
                            ? `${Math.round(
                                (new Date().getTime() - new Date(build.startedAt).getTime()) / 60000
                              )} min`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Output Files</p>
                        <p className="font-medium">{build.outputFiles?.length || 0} files</p>
                      </div>
                    </div>

                    {build.errorMessage && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-red-700 dark:text-red-300 text-sm font-medium">Error:</p>
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">{build.errorMessage}</p>
                      </div>
                    )}

                    {build.logs && (
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                          View Build Logs
                        </summary>
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-h-32 overflow-y-auto">
                            {build.logs}
                          </pre>
                        </div>
                      </details>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}