import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Smartphone, Settings } from "lucide-react";
import { InsertKernelConfiguration, DevicePreset, devicePresets } from "@shared/schema";

interface DeviceConfigurationProps {
  config: Partial<InsertKernelConfiguration>;
  onConfigChange: (config: Partial<InsertKernelConfiguration>) => void;
  onPresetChange: (preset: DevicePreset) => void;
}

export default function DeviceConfiguration({ config, onConfigChange, onPresetChange }: DeviceConfigurationProps) {
  const handleInputChange = (field: keyof InsertKernelConfiguration) => (
    value: string | string[]
  ) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  const handlePresetChange = (preset: DevicePreset) => {
    onPresetChange(preset);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-white">Target Device</CardTitle>
        <CardDescription>Select your device or configure a custom target</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Device Preset Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-slate-300 mb-3 block">Device Preset</Label>
          <RadioGroup
            value={config.device || "oneplus_nord"}
            onValueChange={handlePresetChange}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="relative">
              <RadioGroupItem value="oneplus_nord" id="oneplus_nord" className="sr-only" />
              <label
                htmlFor="oneplus_nord"
                className="flex items-center p-4 bg-slate-700 border-2 border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-white">OnePlus Nord</div>
                  <div className="text-sm text-slate-400">Codename: avicii</div>
                  <div className="text-xs text-slate-500 mt-1">ARM64 • Snapdragon 765G</div>
                </div>
                <Smartphone className="text-slate-400" size={20} />
              </label>
            </div>

            <div className="relative">
              <RadioGroupItem value="pixel_4" id="pixel_4" className="sr-only" />
              <label
                htmlFor="pixel_4"
                className="flex items-center p-4 bg-slate-700 border-2 border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-white">Google Pixel 4</div>
                  <div className="text-sm text-slate-400">Codename: flame</div>
                  <div className="text-xs text-slate-500 mt-1">ARM64 • Snapdragon 855</div>
                </div>
                <Smartphone className="text-slate-400" size={20} />
              </label>
            </div>

            <div className="relative">
              <RadioGroupItem value="custom" id="custom" className="sr-only" />
              <label
                htmlFor="custom"
                className="flex items-center p-4 bg-slate-700 border-2 border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-white">Custom Device</div>
                  <div className="text-sm text-slate-400">Manual configuration</div>
                  <div className="text-xs text-slate-500 mt-1">Specify your own settings</div>
                </div>
                <Settings className="text-slate-400" size={20} />
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Custom Device Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-slate-300 mb-2 block">
              Configuration Name
            </Label>
            <Input
              id="name"
              value={config.name || ""}
              onChange={(e) => handleInputChange("name")(e.target.value)}
              placeholder="My Kernel Build"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="device" className="text-sm font-medium text-slate-300 mb-2 block">
              Device Name
            </Label>
            <Input
              id="device"
              value={config.device || ""}
              onChange={(e) => handleInputChange("device")(e.target.value)}
              placeholder="oneplus_nord"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="codename" className="text-sm font-medium text-slate-300 mb-2 block">
              Codename
            </Label>
            <Input
              id="codename"
              value={config.codename || ""}
              onChange={(e) => handleInputChange("codename")(e.target.value)}
              placeholder="avicii"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="kernelArch" className="text-sm font-medium text-slate-300 mb-2 block">
              Architecture
            </Label>
            <Select
              value={config.kernelArch || "arm64"}
              onValueChange={handleInputChange("kernelArch")}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-primary focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="arm64">ARM64</SelectItem>
                <SelectItem value="arm">ARM</SelectItem>
                <SelectItem value="x86_64">x86_64</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="kernelRepo" className="text-sm font-medium text-slate-300 mb-2 block">
              Kernel Repository URL
            </Label>
            <Input
              id="kernelRepo"
              value={config.kernelRepo || ""}
              onChange={(e) => handleInputChange("kernelRepo")(e.target.value)}
              placeholder="https://github.com/OnePlusOSS/android_kernel_oneplus_sm7250.git"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="kernelBranch" className="text-sm font-medium text-slate-300 mb-2 block">
              Kernel Branch
            </Label>
            <Input
              id="kernelBranch"
              value={config.kernelBranch || ""}
              onChange={(e) => handleInputChange("kernelBranch")(e.target.value)}
              placeholder="android-10.0"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="kernelCrossCompile" className="text-sm font-medium text-slate-300 mb-2 block">
              Cross Compiler
            </Label>
            <Input
              id="kernelCrossCompile"
              value={config.kernelCrossCompile || ""}
              onChange={(e) => handleInputChange("kernelCrossCompile")(e.target.value)}
              placeholder="aarch64-linux-gnu-"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
