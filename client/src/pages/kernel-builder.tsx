import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import DeviceConfiguration from "@/components/device-configuration";
import FeatureToggles from "@/components/feature-toggles";
import BuildOptions from "@/components/build-options";
import ConfigurationPreview from "@/components/configuration-preview";
import BuildProgressModal from "@/components/build-progress-modal";
import { Button } from "@/components/ui/button";
import { Save, Play, Download, Upload } from "lucide-react";
import { KernelConfiguration, InsertKernelConfiguration, devicePresets, DevicePreset } from "@shared/schema";

export default function KernelBuilder() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeBuildId, setActiveBuildId] = useState<number | null>(null);
  const [showBuildModal, setShowBuildModal] = useState(false);

  // Configuration state
  const [config, setConfig] = useState<Partial<InsertKernelConfiguration>>({
    name: "My Kernel Build",
    device: "oneplus_nord",
    codename: "avicii",
    kernelRepo: "https://github.com/OnePlusOSS/android_kernel_oneplus_sm7250.git",
    kernelBranch: "android-10.0",
    nethunterPatchesRepo: "https://gitlab.com/kalilinux/nethunter/build-scripts/kali-nethunter-project.git",
    nethunterPatchesBranch: "master",
    nethunterPatchesDirRelative: "nethunter-kernel-patches",
    gitPatchLevel: "1",
    outputDir: "~/kernel_build_output",
    defconfigFilenameTemplate: "arch/arm64/configs/{codename}_defconfig",
    kernelArch: "arm64",
    kernelCrossCompile: "aarch64-linux-gnu-",
    kernelImageNamePatterns: ["Image.gz-dtb", "Image.gz", "Image"],
    features: {
      wifiMonitorMode: true,
      usbGadget: true,
      hidSupport: true,
      rtl8812auDriver: false,
    },
    customKernelConfigs: [],
    wslDistroName: "kali-linux",
    skipOptions: {
      skipEnvSetup: false,
      skipClone: false,
      skipPatches: false,
      skipConfigTweaks: false,
      skipBuild: false,
      cleanOutput: false,
    },
  });

  // WebSocket for real-time updates
  const { isConnected } = useWebSocket((data) => {
    if (data.type === "buildUpdate" && data.buildJobId === activeBuildId) {
      queryClient.invalidateQueries({ queryKey: ["/api/builds", activeBuildId] });
    }
  });

  // Queries
  const { data: wslStatus } = useQuery({
    queryKey: ["/api/wsl/status"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  const { data: activeBuild } = useQuery({
    queryKey: ["/api/builds", activeBuildId],
    enabled: !!activeBuildId,
    refetchInterval: activeBuildId ? 2000 : false,
  });

  // Mutations
  const saveConfigMutation = useMutation({
    mutationFn: async (configData: InsertKernelConfiguration) => {
      const response = await apiRequest("POST", "/api/configurations", configData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Configuration saved",
        description: "Your kernel configuration has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/configurations"] });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startBuildMutation = useMutation({
    mutationFn: async (configData: InsertKernelConfiguration) => {
      // First save the configuration
      const configResponse = await apiRequest("POST", "/api/configurations", configData);
      const savedConfig = await configResponse.json();

      // Create a build job
      const buildResponse = await apiRequest("POST", "/api/builds", {
        configurationId: savedConfig.id,
        status: "pending",
        currentStep: "Preparing build...",
        progress: 0,
        logs: "",
        outputFiles: [],
      });
      const buildJob = await buildResponse.json();

      // Start the build
      await apiRequest("POST", `/api/builds/${buildJob.id}/start`, {});
      
      return buildJob;
    },
    onSuccess: (buildJob) => {
      setActiveBuildId(buildJob.id);
      setShowBuildModal(true);
      toast({
        title: "Build started",
        description: "Your kernel build has been started.",
      });
    },
    onError: () => {
      toast({
        title: "Build failed to start",
        description: "Failed to start the build process. Please check your configuration.",
        variant: "destructive",
      });
    },
  });

  const handleDevicePresetChange = (preset: DevicePreset) => {
    const presetConfig = devicePresets[preset];
    setConfig(prev => ({
      ...prev,
      ...presetConfig,
    }));
  };

  const handleSave = () => {
    if (!config.name || !config.device || !config.codename) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    saveConfigMutation.mutate(config as InsertKernelConfiguration);
  };

  const handleStartBuild = () => {
    if (!config.name || !config.device || !config.codename) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    startBuildMutation.mutate(config as InsertKernelConfiguration);
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${config.name || 'kernel_config'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        setConfig(importedConfig);
        toast({
          title: "Configuration imported",
          description: "Configuration has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to parse the configuration file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-50">
      <Sidebar
        currentStep={currentStep}
        wslStatus={wslStatus}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
      />

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-medium text-white">Device Configuration</h2>
            <p className="text-sm text-slate-400">Step 1 of 5 - Configure your target device and features</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={saveConfigMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={handleStartBuild}
              disabled={startBuildMutation.isPending}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Build
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            <DeviceConfiguration
              config={config}
              onConfigChange={setConfig}
              onPresetChange={handleDevicePresetChange}
            />

            <FeatureToggles
              features={config.features || {
                wifiMonitorMode: true,
                usbGadget: true,
                hidSupport: true,
                rtl8812auDriver: false,
              }}
              onFeaturesChange={(features) => setConfig(prev => ({ ...prev, features }))}
            />

            <BuildOptions
              config={config}
              onConfigChange={setConfig}
            />

            <ConfigurationPreview config={config} />
          </div>
        </div>
      </div>

      {/* Build Progress Modal */}
      {showBuildModal && activeBuild && (
        <BuildProgressModal
          build={activeBuild}
          onClose={() => setShowBuildModal(false)}
          onCancel={() => {
            // TODO: Implement cancel build
            setShowBuildModal(false);
            setActiveBuildId(null);
          }}
        />
      )}

      {/* Hidden file input for import */}
      <input
        type="file"
        accept=".json"
        onChange={handleImportConfig}
        style={{ display: 'none' }}
        id="config-import"
      />
    </div>
  );
}
