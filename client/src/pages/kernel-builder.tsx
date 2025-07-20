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
import MagiskConfiguration from "@/components/magisk-configuration";
import TWRPConfiguration from "@/components/twrp-configuration";
import KernelSUConfiguration from "@/components/kernelsu-configuration";
import BuildToolchainConfig from "@/components/build-toolchain-config";
import BuildOutputConfig from "@/components/build-output-config";
import DeviceTreeConfig from "@/components/device-tree-config";
import HardwareDriversConfig from "@/components/hardware-drivers-config";
import PerformanceConfig from "@/components/performance-config";
import SecurityConfig from "@/components/security-config";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackButton from "@/components/back-button";
import FloatingActionButton from "@/components/floating-action-button";
import TabbedDeviceSelector from "@/components/tabbed-device-selector";
import BreadcrumbNavigation from "@/components/breadcrumb-navigation";
import { Save, Play, Download, Upload, Code, Zap, Settings } from "lucide-react";
import { KernelConfiguration, InsertKernelConfiguration, BuildJob, devicePresets, DevicePreset } from "@shared/schema";

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
      // NetHunter Core Features
      wifiMonitorMode: true,
      usbGadget: true,
      hidSupport: true,
      rtl8812auDriver: false,
      
      // Advanced NetHunter Features
      packetInjection: true,
      badUSB: true,
      wirelessKeylogger: false,
      bluetoothArsenal: true,
      nfcHacking: false,
      sdrSupport: false,
      rfAnalyzer: false,
      
      // Wireless Drivers
      rtl88xxauDriver: false,
      rt2800usbDriver: false,
      rt73usbDriver: false,
      zd1211rwDriver: false,
      ath9kHtcDriver: false,
      
      // Root & Security
      kernelSU: true,
      magiskIntegration: true,
      selinuxPermissive: true,
      dmVerityDisable: true,
      
      // Performance & Debugging
      kprobeSupport: true,
      ftracingSupport: false,
      perfCounters: false,
      cpuGovernors: true,
      
      // Custom Recovery Support
      twrpSupport: true,
      recoveryRamdisk: true,
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
    magiskConfig: {
      enabled: true,
      version: "latest",
      hideRoot: true,
      zygiskEnabled: true,
      denyListEnabled: true,
      modules: [],
    },
    twrpConfig: {
      enabled: true,
      version: "latest",
      theme: "portrait_hdpi",
      encryption: true,
      touchSupport: true,
      customFlags: [],
    },
    kernelSUConfig: {
      enabled: true,
      version: "latest",
      managerApp: true,
      webUI: false,
      safeMode: true,
      logLevel: "info",
    },
  });

  // WebSocket for real-time updates
  const { isConnected } = useWebSocket((data) => {
    if (data.type === "buildUpdate" && data.buildJobId === activeBuildId) {
      queryClient.invalidateQueries({ queryKey: ["/api/builds", activeBuildId] });
    }
  });

  // Queries
  const { data: wslStatus } = useQuery<{ available: boolean; distros: string[]; message: string }>({
    queryKey: ["/api/wsl/status"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  const { data: activeBuild } = useQuery<BuildJob>({
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

  const cancelBuildMutation = useMutation({
    mutationFn: async (buildId: number) => {
      await apiRequest("POST", `/api/builds/${buildId}/cancel`, {});
    },
    onSuccess: () => {
      toast({
        title: "Build cancelled",
        description: "The build process has been cancelled.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/builds", activeBuildId] });
    },
    onError: () => {
      toast({
        title: "Cancel failed",
        description: "Failed to cancel the build process.",
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

  const handleImportConfig = () => {
    document.getElementById("config-import")?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/20" style={{background: 'linear-gradient(to bottom right, #0f172a, #1e293b, rgba(16, 185, 129, 0.2))'}}>
      <Sidebar
        currentStep={currentStep}
        wslStatus={wslStatus}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
      />

      <div className="flex-1 flex flex-col">
        {/* Enhanced Top Bar with Quick Selections */}
        <div className="bg-slate-800/90 border-b border-emerald-500/20 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <BackButton to="/" label="Home" className="text-slate-400 hover:text-emerald-400 transition-colors" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                  <Code className="text-emerald-400" size={16} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white font-['Roboto_Condensed']">Kernel Customizer</h2>
                  <p className="text-xs text-emerald-400/80">Build your perfect Android kernel</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saveConfigMutation.isPending}
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm h-8"
              >
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                onClick={handleStartBuild}
                disabled={startBuildMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 text-sm h-8"
              >
                <Play className="w-3 h-3 mr-1" />
                Build
              </Button>
            </div>
          </div>
          
          {/* Quick Selection Bar */}
          <div className="px-6 pb-4">
            <div className="bg-slate-900/50 rounded-xl border border-emerald-500/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-emerald-400 flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Quick Start Configuration</span>
                </h3>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                  Select & Build
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">📱 Selected Device</label>
                  <div className="bg-slate-700/30 border border-emerald-500/30 text-white px-3 py-2 rounded-md text-sm">
                    {config.device ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-400">✓</span>
                        <span>{config.device.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-400">
                        <span>⚠</span>
                        <span>No device selected</span>
                      </div>
                    )}
                  </div>
                  {!config.device && (
                    <p className="text-xs text-yellow-400">Choose a device in the Device Selection section below</p>
                  )}
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">🔓 Root Solution</label>
                  <Select onValueChange={(value) => {
                    const newFeatures = {...config.features};
                    if (value === "kernelsu") {
                      newFeatures.kernelSU = true;
                      newFeatures.magiskIntegration = false;
                    } else if (value === "magisk") {
                      newFeatures.kernelSU = false;
                      newFeatures.magiskIntegration = true;
                    } else {
                      newFeatures.kernelSU = true;
                      newFeatures.magiskIntegration = true;
                    }
                    setConfig({...config, features: newFeatures});
                  }}>
                    <SelectTrigger className="bg-slate-700/50 border-emerald-500/30 text-white hover:border-emerald-400 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10">
                      <SelectValue placeholder="Root Method" />
                    </SelectTrigger>
                    <SelectContent 
                      className="border-emerald-500/30"
                      style={{
                        backgroundColor: 'rgb(30, 41, 59)',
                        zIndex: 9999,
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      <SelectItem value="kernelsu" className="hover:bg-emerald-500/20" style={{backgroundColor: 'rgb(30, 41, 59)', color: 'white'}}>
                        🔑 KernelSU (Recommended)
                      </SelectItem>
                      <SelectItem value="magisk" className="hover:bg-emerald-500/20" style={{backgroundColor: 'rgb(30, 41, 59)', color: 'white'}}>
                        🎭 Magisk
                      </SelectItem>
                      <SelectItem value="both" className="hover:bg-emerald-500/20" style={{backgroundColor: 'rgb(30, 41, 59)', color: 'white'}}>
                        ⚡ Both Solutions
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">🔍 NetHunter Mode</label>
                  <Select onValueChange={(value) => {
                    const newFeatures = {...config.features};
                    if (value === "full") {
                      newFeatures.wifiMonitorMode = true;
                      newFeatures.packetInjection = true;
                      newFeatures.badUSB = true;
                      newFeatures.bluetoothArsenal = true;
                    } else if (value === "lite") {
                      newFeatures.wifiMonitorMode = true;
                      newFeatures.packetInjection = false;
                      newFeatures.badUSB = false;
                      newFeatures.bluetoothArsenal = false;
                    }
                    setConfig({...config, features: newFeatures});
                  }}>
                    <SelectTrigger className="bg-slate-700/50 border-emerald-500/30 text-white hover:border-emerald-400 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10">
                      <SelectValue placeholder="NetHunter" />
                    </SelectTrigger>
                    <SelectContent 
                      className="border-emerald-500/30"
                      style={{
                        backgroundColor: 'rgb(30, 41, 59)',
                        zIndex: 9999,
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      <SelectItem value="full" className="hover:bg-emerald-500/20" style={{backgroundColor: 'rgb(30, 41, 59)', color: 'white'}}>
                        🚀 Full NetHunter
                      </SelectItem>
                      <SelectItem value="lite" className="hover:bg-emerald-500/20" style={{backgroundColor: 'rgb(30, 41, 59)', color: 'white'}}>
                        💡 NetHunter Lite
                      </SelectItem>
                      <SelectItem value="custom" className="hover:bg-emerald-500/20" style={{backgroundColor: 'rgb(30, 41, 59)', color: 'white'}}>
                        🔧 Custom Build
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">⚡ Build Type</label>
                  <Select onValueChange={(value) => setConfig({...config, outputFormat: value})}>
                    <SelectTrigger className="bg-slate-700/50 border-emerald-500/30 text-white hover:border-emerald-400 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10">
                      <SelectValue placeholder="Output" />
                    </SelectTrigger>
                    <SelectContent 
                      className="border-emerald-500/30"
                      style={{
                        backgroundColor: 'rgb(30, 41, 59)',
                        zIndex: 9999,
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      <SelectItem value="boot_img" className="hover:bg-emerald-500/20" style={{backgroundColor: 'rgb(30, 41, 59)', color: 'white'}}>
                        📦 Boot Image
                      </SelectItem>
                      <SelectItem value="kernel_only" className="hover:bg-emerald-500/20" style={{backgroundColor: 'rgb(30, 41, 59)', color: 'white'}}>
                        🔧 Kernel Only
                      </SelectItem>
                      <SelectItem value="full_package" className="hover:bg-emerald-500/20" style={{backgroundColor: 'rgb(30, 41, 59)', color: 'white'}}>
                        📱 Flashable ZIP
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            <BreadcrumbNavigation 
              items={[
                { label: "Kernel Builder", href: "/kernel-builder" },
                { label: "Configuration", current: true }
              ]}
            />
            
            <div>
              <TabbedDeviceSelector
                value={config.device || ""}
                onChange={(value) => setConfig(prev => ({ ...prev, device: value }))}
              />
            </div>

            <div>
              <FeatureToggles
              features={config.features || {
                // NetHunter Core Features
                wifiMonitorMode: true,
                usbGadget: true,
                hidSupport: true,
                rtl8812auDriver: false,
                
                // Advanced NetHunter Features
                packetInjection: true,
                badUSB: true,
                wirelessKeylogger: false,
                bluetoothArsenal: true,
                nfcHacking: false,
                sdrSupport: false,
                rfAnalyzer: false,
                
                // Wireless Drivers
                rtl88xxauDriver: false,
                rt2800usbDriver: false,
                rt73usbDriver: false,
                zd1211rwDriver: false,
                ath9kHtcDriver: false,
                
                // Root & Security
                kernelSU: true,
                magiskIntegration: true,
                selinuxPermissive: true,
                dmVerityDisable: true,
                
                // Performance & Debugging
                kprobeSupport: true,
                ftracingSupport: false,
                perfCounters: false,
                cpuGovernors: true,
                
                // Custom Recovery Support
                twrpSupport: true,
                recoveryRamdisk: true,
              }}
              onFeaturesChange={(features) => setConfig(prev => ({ ...prev, features }))}
            />

            {/* ROM & Recovery Options */}
            <div className="form-section">
              <div className="flex items-center space-x-3 mb-6">
                <Settings size={18} style={{color: '#FF6900'}} />
                <h3 className="text-lg font-medium text-white">ROM & Recovery Options</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">ROM Base</label>
                  <select 
                    className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg px-4 py-3 text-white"
                    value={config.customROM || 'lineageos'}
                    onChange={(e) => setConfig(prev => ({ ...prev, customROM: e.target.value }))}
                  >
                    <option value="lineageos">LineageOS</option>
                    <option value="nethunter">NetHunter OS (OnePlus only)</option>
                    <option value="aosp">AOSP</option>
                    <option value="custom">Custom Base</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-2">Choose your ROM foundation</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">GApps Package</label>
                  <select 
                    className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg px-4 py-3 text-white"
                    value={config.gappsVariant || 'none'}
                    onChange={(e) => setConfig(prev => ({ ...prev, gappsVariant: e.target.value }))}
                  >
                    <option value="none">No GApps</option>
                    <option value="pico">Pico (Minimal - 50MB)</option>
                    <option value="nano">Nano (Basic - 150MB)</option>
                    <option value="micro">Micro (Standard - 300MB)</option>
                    <option value="mini">Mini (Extended - 500MB)</option>
                    <option value="full">Full (Complete - 1GB+)</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-2">Google Apps integration level</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">TWRP Theme</label>
                  <select 
                    className="w-full bg-slate-700 border-2 border-slate-600 rounded-lg px-4 py-3 text-white"
                    value={config.twrpTheme || 'portrait_hdpi'}
                    onChange={(e) => setConfig(prev => ({ ...prev, twrpTheme: e.target.value }))}
                  >
                    <option value="portrait_hdpi">Portrait (HD)</option>
                    <option value="landscape_hdpi">Landscape (HD)</option>
                    <option value="watch_hdpi">Watch Style</option>
                    <option value="portrait_mdpi">Portrait (Standard)</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-2">Recovery interface theme</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-700/30 border-2 border-slate-600/60 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">BusyBox Integration</h4>
                      <p className="text-slate-400 text-sm mt-1">Essential Unix utilities for Android</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.busyboxIncluded !== false}
                      onChange={(e) => setConfig(prev => ({ ...prev, busyboxIncluded: e.target.checked }))}
                      className="w-5 h-5 text-emerald-600 rounded"
                    />
                  </div>
                </div>
                
                <div className="bg-slate-700/30 border-2 border-slate-600/60 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">TWRP Recovery</h4>
                      <p className="text-slate-400 text-sm mt-1">Custom recovery with themes & encryption</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.twrpCustomization || false}
                      onChange={(e) => setConfig(prev => ({ ...prev, twrpCustomization: e.target.checked }))}
                      className="w-5 h-5 text-emerald-600 rounded"
                    />
                  </div>
                </div>
              </div>
              
              {/* NetHunter OS Notice for OnePlus */}
              {config.device && config.device.includes('oneplus') && config.customROM === 'nethunter' && (
                <div className="mt-6 p-4 bg-emerald-900/20 border-2 border-emerald-500/40 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-sm">⭐</span>
                    </div>
                    <div>
                      <h4 className="text-emerald-400 font-medium">NetHunter OS Available</h4>
                      <p className="text-emerald-300/80 text-sm mt-1">
                        This OnePlus device supports complete NetHunter OS ROM with all security tools pre-installed.
                        Perfect for penetration testing and security research.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <KernelSUConfiguration
              config={config.kernelSUConfig || {
                enabled: true,
                version: "latest",
                managerApp: true,
                webUI: false,
                safeMode: true,
                logLevel: "info",
              }}
              onConfigChange={(kernelSUConfig) => setConfig(prev => ({ ...prev, kernelSUConfig }))}
            />

            <MagiskConfiguration
              config={{
                enabled: config.magiskConfig?.enabled ?? true,
                version: config.magiskConfig?.version ?? "latest",
                hideRoot: config.magiskConfig?.hideRoot ?? true,
                zygiskEnabled: config.magiskConfig?.zygiskEnabled ?? true,
                denyListEnabled: config.magiskConfig?.denyListEnabled ?? true,
                modules: config.magiskConfig?.modules ?? [],
              }}
              onConfigChange={(magiskConfig) => setConfig(prev => ({ ...prev, magiskConfig }))}
            />

            <TWRPConfiguration
              config={{
                enabled: config.twrpConfig?.enabled ?? true,
                version: config.twrpConfig?.version ?? "latest",
                theme: config.twrpConfig?.theme ?? "portrait_hdpi",
                encryption: config.twrpConfig?.encryption ?? true,
                touchSupport: config.twrpConfig?.touchSupport ?? true,
                customFlags: config.twrpConfig?.customFlags ?? [],
              }}
              onConfigChange={(twrpConfig) => setConfig(prev => ({ ...prev, twrpConfig }))}
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
            if (activeBuildId) {
              cancelBuildMutation.mutate(activeBuildId);
            }
            setShowBuildModal(false);
            setActiveBuildId(null);
          }}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onQuickBuild={handleStartBuild}
        onSave={handleSave}
        onExport={handleExportConfig}
        onImport={handleImportConfig}
        isBuilding={startBuildMutation.isPending || !!activeBuildId}
      />

      {/* Hidden file input for import */}
      <input
        type="file"
        accept=".json"
        onChange={handleFileImport}
        style={{ display: 'none' }}
        id="config-import"
      />
      </div>
    </div>
  );
}
