import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, TreePine, Cpu } from "lucide-react";

interface DeviceTreeConfigProps {
  config: {
    enableDeviceTree: boolean;
    dtbPath: string;
    customDtOverlays: string[];
    hardwareVariant: string;
    boardRevision: string;
  };
  onConfigChange: (config: DeviceTreeConfigProps["config"]) => void;
}

export default function DeviceTreeConfig({ config, onConfigChange }: DeviceTreeConfigProps) {
  const handleToggleChange = (field: keyof typeof config) => (checked: boolean) => {
    onConfigChange({
      ...config,
      [field]: checked,
    });
  };

  const handleInputChange = (field: keyof typeof config) => (value: string) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  const addOverlay = () => {
    onConfigChange({
      ...config,
      customDtOverlays: [...config.customDtOverlays, ""],
    });
  };

  const updateOverlay = (index: number, value: string) => {
    const newOverlays = [...config.customDtOverlays];
    newOverlays[index] = value;
    onConfigChange({
      ...config,
      customDtOverlays: newOverlays,
    });
  };

  const removeOverlay = (index: number) => {
    const newOverlays = config.customDtOverlays.filter((_, i) => i !== index);
    onConfigChange({
      ...config,
      customDtOverlays: newOverlays,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <TreePine className="text-green-400" size={20} />
          </div>
          <div>
            <CardTitle className="text-white">Device Tree Configuration</CardTitle>
            <CardDescription>Hardware description and device tree overlays</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Enable Device Tree */}
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-3">
              <TreePine className="text-green-400" size={20} />
              <div>
                <h4 className="font-medium text-white">Enable Device Tree Support</h4>
                <p className="text-sm text-slate-400">Include device tree blob (DTB) in kernel build</p>
              </div>
            </div>
            <Switch
              checked={config.enableDeviceTree}
              onCheckedChange={handleToggleChange("enableDeviceTree")}
            />
          </div>

          {config.enableDeviceTree && (
            <>
              {/* Hardware Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300">Hardware Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">Hardware Variant</Label>
                    <Input
                      value={config.hardwareVariant}
                      onChange={(e) => handleInputChange("hardwareVariant")(e.target.value)}
                      placeholder="e.g., msm8998-v2.1"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">Board Revision</Label>
                    <Input
                      value={config.boardRevision}
                      onChange={(e) => handleInputChange("boardRevision")(e.target.value)}
                      placeholder="e.g., rev-1.0"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* DTB Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-300">Device Tree Blob (DTB)</h3>
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">DTB Path</Label>
                  <Input
                    value={config.dtbPath}
                    onChange={(e) => handleInputChange("dtbPath")(e.target.value)}
                    placeholder="arch/arm64/boot/dts/qcom/msm8998-oneplus-cheeseburger.dts"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Path to device tree source file relative to kernel root
                  </p>
                </div>
              </div>

              {/* Device Tree Overlays */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-300">Device Tree Overlays</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addOverlay}
                    className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Overlay
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {config.customDtOverlays.map((overlay, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={overlay}
                        onChange={(e) => updateOverlay(index, e.target.value)}
                        placeholder="overlay-name.dtso"
                        className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-500 font-mono text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOverlay(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Device tree overlays for runtime hardware modifications:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><code className="bg-slate-700 px-1 rounded">camera-overlay.dtso</code> - Camera module configuration</li>
                    <li><code className="bg-slate-700 px-1 rounded">display-panel.dtso</code> - Display panel settings</li>
                    <li><code className="bg-slate-700 px-1 rounded">gpio-config.dtso</code> - GPIO pin assignments</li>
                    <li><code className="bg-slate-700 px-1 rounded">thermal-zones.dtso</code> - Thermal management zones</li>
                  </ul>
                </div>
              </div>

              {/* Information Panel */}
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Cpu className="text-green-400 mt-1" size={16} />
                  <div className="text-sm">
                    <h5 className="font-medium text-green-400 mb-2">Device Tree Information</h5>
                    <ul className="text-slate-300 space-y-1 text-xs">
                      <li>• Device trees describe hardware layout to the kernel</li>
                      <li>• DTB files are compiled from DTS source files</li>
                      <li>• Overlays allow runtime hardware configuration changes</li>
                      <li>• Essential for ARM64 devices and modern Android kernels</li>
                      <li>• Incorrect device trees can prevent boot or damage hardware</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}