import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BuildProgressModal from "@/components/build-progress-modal";
import DeviceConfiguration from "@/components/device-configuration";
import NetHunterFeatures from "@/components/nethunter-features";
import BuildOptions from "@/components/build-options";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Cpu, 
  Play, 
  Settings, 
  Shield, 
  Zap,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface KernelConfiguration {
  device: string;
  buildType: string;
  androidVersion: string;
  netHunterFeatures: {
    wifiMonitor: boolean;
    packetInjection: boolean;
    wirelessDrivers: boolean;
    badUsb: boolean;
    hidSupport: boolean;
    bluetoothArsenal: boolean;
    nfcHacking: boolean;
    sdrSupport: boolean;
  };
  rootSolution: "none" | "kernelsu" | "magisk";
  buildOptions: {
    compiler: "gcc" | "clang";
    optimization: "performance" | "battery" | "balanced";
    debugMode: boolean;
    ltoEnabled: boolean;
    ccacheEnabled: boolean;
  };
  skipOptions: {
    skipEnvSetup: boolean;
    skipClone: boolean;
    skipPatches: boolean;
    skipConfigTweaks: boolean;
    skipBuild: boolean;
    cleanOutput: boolean;
  };
}

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

export default function KernelBuilderPage() {
  const { toast } = useToast();
  const [configuration, setConfiguration] = useState<KernelConfiguration>({
    device: "",
    buildType: "nethunter",
    androidVersion: "14",
    netHunterFeatures: {
      wifiMonitor: true,
      packetInjection: true,
      wirelessDrivers: true,
      badUsb: false,
      hidSupport: false,
      bluetoothArsenal: false,
      nfcHacking: false,
      sdrSupport: false,
    },
    rootSolution: "kernelsu",
    buildOptions: {
      compiler: "clang",
      optimization: "performance",
      debugMode: false,
      ltoEnabled: true,
      ccacheEnabled: true,
    },
    skipOptions: {
      skipEnvSetup: false,
      skipClone: false,
      skipPatches: false,
      skipConfigTweaks: false,
      skipBuild: false,
      cleanOutput: false,
    },
  });

  const [activeBuild, setActiveBuild] = useState<BuildJob | null>(null);
  const [showBuildModal, setShowBuildModal] = useState(false);

  // Fetch recent builds
  const { data: recentBuilds } = useQuery<BuildJob[]>({
    queryKey: ["/api/kernel/builds"],
    refetchInterval: 5000,
  });

  // Build mutation
  const buildMutation = useMutation({
    mutationFn: (config: KernelConfiguration) =>
      apiRequest("/api/kernel/build", {
        method: "POST",
        body: JSON.stringify(config),
      }),
    onSuccess: (buildJob: BuildJob) => {
      setActiveBuild(buildJob);
      setShowBuildModal(true);
      queryClient.invalidateQueries({ queryKey: ["/api/kernel/builds"] });
      toast({
        title: "Build Started",
        description: `Started building kernel for ${configuration.device}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Build Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cancel build mutation
  const cancelMutation = useMutation({
    mutationFn: (buildId: string) =>
      apiRequest(`/api/kernel/build/${buildId}/cancel`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kernel/builds"] });
      toast({
        title: "Build Cancelled",
        description: "Build was successfully cancelled",
      });
    },
  });

  const handleStartBuild = () => {
    if (!configuration.device) {
      toast({
        title: "Device Required",
        description: "Please select a device before starting the build",
        variant: "destructive",
      });
      return;
    }

    buildMutation.mutate(configuration);
  };

  const handleCancelBuild = (buildId: string) => {
    cancelMutation.mutate(buildId);
  };

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

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cpu className="h-8 w-8 text-emerald-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Kernel Builder</h1>
              <p className="text-slate-400">
                Build custom Android kernels with NetHunter security features
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleStartBuild}
              disabled={buildMutation.isPending || !configuration.device}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Play className="h-4 w-4 mr-2" />
              {buildMutation.isPending ? "Starting..." : "Start Build"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Configuration Panel */}
        <div className="xl:col-span-3 space-y-6">
          {/* Device Configuration */}
          <DeviceConfiguration
            configuration={configuration}
            onConfigurationChange={setConfiguration}
          />

          {/* NetHunter Features */}
          <NetHunterFeatures
            configuration={configuration}
            onConfigurationChange={setConfiguration}
          />

          {/* Build Options */}
          <BuildOptions
            configuration={configuration}
            onConfigurationChange={setConfiguration}
          />
        </div>

        {/* Status Panel */}
        <div className="space-y-6">
          {/* Quick Status */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Build Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Device</span>
                  <span className="text-white">
                    {configuration.device || "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Build Type</span>
                  <Badge variant="secondary">{configuration.buildType}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Root Solution</span>
                  <Badge variant="secondary">{configuration.rootSolution}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Builds */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Builds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentBuilds?.slice(0, 5).map((build) => (
                <div
                  key={build.id}
                  className="flex items-center justify-between p-3 rounded bg-slate-800 cursor-pointer hover:bg-slate-700 transition-colors"
                  onClick={() => {
                    setActiveBuild(build);
                    setShowBuildModal(true);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(build.status)}
                    <div>
                      <p className="text-sm text-white">{build.device}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(build.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(build.status)}>
                    {build.status}
                  </Badge>
                </div>
              ))}
              {(!recentBuilds || recentBuilds.length === 0) && (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-400">No builds yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Build Progress Modal */}
      <BuildProgressModal
        buildJob={activeBuild}
        open={showBuildModal}
        onClose={() => setShowBuildModal(false)}
        onCancel={handleCancelBuild}
      />
    </div>
  );
}