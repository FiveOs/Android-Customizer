import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Settings, Search, Star } from "lucide-react";
import { InsertKernelConfiguration, DevicePreset, devicePresets } from "@shared/schema";
import { useState, useMemo } from "react";

interface DeviceConfigurationProps {
  config: Partial<InsertKernelConfiguration>;
  onConfigChange: (config: Partial<InsertKernelConfiguration>) => void;
  onPresetChange: (preset: DevicePreset) => void;
}

export default function DeviceConfiguration({ config, onConfigChange, onPresetChange }: DeviceConfigurationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  // Group devices by category
  const devicesByCategory = useMemo(() => {
    const categories: Record<string, Array<{ key: DevicePreset; preset: typeof devicePresets[DevicePreset] }>> = {};
    
    Object.entries(devicePresets).forEach(([key, preset]) => {
      const category = preset.category || "Other";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({ key: key as DevicePreset, preset });
    });

    return categories;
  }, []);

  // Filter devices based on search and category
  const filteredDevices = useMemo(() => {
    let filtered = Object.entries(devicesByCategory);

    if (selectedCategory !== "all") {
      filtered = filtered.filter(([category]) => category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.map(([category, devices]) => [
        category,
        devices.filter(({ preset }) => 
          preset.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
          preset.codename.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ]).filter(([, devices]) => devices.length > 0);
    }

    return filtered as [string, Array<{ key: DevicePreset; preset: typeof devicePresets[DevicePreset] }>][];
  }, [devicesByCategory, searchTerm, selectedCategory]);

  const categories = ["all", ...Object.keys(devicesByCategory)];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Smartphone className="text-blue-400" size={20} />
          </div>
          <div>
            <CardTitle className="text-white">Device Library</CardTitle>
            <CardDescription>Select from comprehensive device database or configure custom target</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="Search devices by name or codename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All Devices" : category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Device Grid */}
        <div className="space-y-6">
          {filteredDevices.map(([category, devices]) => (
            <div key={category}>
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-sm font-medium text-slate-300">{category}</h3>
                <Separator className="flex-1 bg-slate-600" />
                <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                  {devices.length} devices
                </Badge>
              </div>
              
              <RadioGroup
                value={config.device || "oneplus_nord"}
                onValueChange={handlePresetChange}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
              >
                {devices.map(({ key, preset }) => (
                  <div key={key} className="relative">
                    <RadioGroupItem value={key} id={key} className="sr-only" />
                    <label
                      htmlFor={key}
                      className="flex items-center p-4 bg-slate-700/50 border-2 border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600/50 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500/10 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="text-slate-400 group-data-[state=checked]:text-blue-400" size={20} />
                          <div>
                            <h4 className="font-medium text-white group-data-[state=checked]:text-blue-400">
                              {preset.device}
                            </h4>
                            <p className="text-xs text-slate-400">
                              {preset.codename} • {preset.kernelArch}
                            </p>
                          </div>
                        </div>
                        {category.includes("LineageOS") && (
                          <Badge variant="outline" className="mt-2 text-xs border-green-500/20 text-green-400">
                            LineageOS
                          </Badge>
                        )}
                        {category.includes("NetHunter") && (
                          <Badge variant="outline" className="mt-2 text-xs border-red-500/20 text-red-400">
                            NetHunter
                          </Badge>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        {/* Custom Configuration */}
        {config.device === "custom" && (
          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Custom Device Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Device Name</Label>
                <Input
                  value={config.device || ""}
                  onChange={(e) => handleInputChange("device")(e.target.value)}
                  placeholder="e.g., Custom Device"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Codename</Label>
                <Input
                  value={config.codename || ""}
                  onChange={(e) => handleInputChange("codename")(e.target.value)}
                  placeholder="e.g., mydevice"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Kernel Repository</Label>
                <Input
                  value={config.kernelRepo || ""}
                  onChange={(e) => handleInputChange("kernelRepo")(e.target.value)}
                  placeholder="https://github.com/user/kernel.git"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Kernel Branch</Label>
                <Input
                  value={config.kernelBranch || ""}
                  onChange={(e) => handleInputChange("kernelBranch")(e.target.value)}
                  placeholder="main"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Architecture</Label>
                <Select 
                  value={config.kernelArch || "arm64"} 
                  onValueChange={handleInputChange("kernelArch")}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="arm64">ARM64 (aarch64)</SelectItem>
                    <SelectItem value="arm">ARM (32-bit)</SelectItem>
                    <SelectItem value="x86_64">x86_64</SelectItem>
                    <SelectItem value="x86">x86 (32-bit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Cross Compile</Label>
                <Input
                  value={config.kernelCrossCompile || ""}
                  onChange={(e) => handleInputChange("kernelCrossCompile")(e.target.value)}
                  placeholder="aarch64-linux-gnu-"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Selected Device Info */}
        {config.device && config.device !== "custom" && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Star className="text-blue-400 mt-1" size={16} />
              <div className="text-sm">
                <h5 className="font-medium text-blue-400 mb-2">Selected Device</h5>
                <div className="grid grid-cols-2 gap-2 text-slate-300 text-xs">
                  <div><strong>Device:</strong> {devicePresets[config.device as DevicePreset]?.device}</div>
                  <div><strong>Codename:</strong> {devicePresets[config.device as DevicePreset]?.codename}</div>
                  <div><strong>Architecture:</strong> {devicePresets[config.device as DevicePreset]?.kernelArch}</div>
                  <div><strong>Category:</strong> {devicePresets[config.device as DevicePreset]?.category}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}