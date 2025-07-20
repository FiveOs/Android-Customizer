import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Smartphone, Settings, Lock } from "lucide-react";

interface TWRPConfigurationProps {
  config: {
    enabled: boolean;
    version: string;
    theme: string;
    encryption: boolean;
    touchSupport: boolean;
    customFlags: string[];
  };
  onConfigChange: (config: TWRPConfigurationProps["config"]) => void;
}

export default function TWRPConfiguration({ config, onConfigChange }: TWRPConfigurationProps) {
  const handleToggleChange = (field: keyof typeof config) => (checked: boolean) => {
    onConfigChange({
      ...config,
      [field]: checked,
    });
  };

  const handleSelectChange = (field: keyof typeof config) => (value: string) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  const addFlag = () => {
    onConfigChange({
      ...config,
      customFlags: [...config.customFlags, ""],
    });
  };

  const updateFlag = (index: number, value: string) => {
    const newFlags = [...config.customFlags];
    newFlags[index] = value;
    onConfigChange({
      ...config,
      customFlags: newFlags,
    });
  };

  const removeFlag = (index: number) => {
    const newFlags = config.customFlags.filter((_, i) => i !== index);
    onConfigChange({
      ...config,
      customFlags: newFlags,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Smartphone className="text-orange-400" size={20} />
          </div>
          <div>
            <CardTitle className="text-white">TWRP Configuration</CardTitle>
            <CardDescription>Custom recovery environment settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Enable TWRP */}
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-3">
              <Smartphone className="text-orange-400" size={20} />
              <div>
                <h4 className="font-medium text-white">Enable TWRP Support</h4>
                <p className="text-sm text-slate-400">Include custom recovery integration</p>
              </div>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={handleToggleChange("enabled")}
            />
          </div>

          {config.enabled && (
            <>
              {/* Version and Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">
                    TWRP Version
                  </Label>
                  <Select value={config.version} onValueChange={handleSelectChange("version")}>
                    <SelectTrigger className="">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectItem value="latest">Latest (3.7.0+)</SelectItem>
                      <SelectItem value="3.7.0">3.7.0 (Stable)</SelectItem>
                      <SelectItem value="3.6.2">3.6.2 (Legacy)</SelectItem>
                      <SelectItem value="3.5.2">3.5.2 (Old Stable)</SelectItem>
                      <SelectItem value="custom">Custom Build</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">
                    Theme
                  </Label>
                  <Select value={config.theme} onValueChange={handleSelectChange("theme")}>
                    <SelectTrigger className="">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectItem value="portrait_hdpi">Portrait HDPI</SelectItem>
                      <SelectItem value="landscape_hdpi">Landscape HDPI</SelectItem>
                      <SelectItem value="portrait_mdpi">Portrait MDPI</SelectItem>
                      <SelectItem value="landscape_mdpi">Landscape MDPI</SelectItem>
                      <SelectItem value="watch_mdpi">Watch MDPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-300">Recovery Features</h4>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="text-green-400" size={16} />
                    <div>
                      <span className="text-white text-sm font-medium">Encryption Support</span>
                      <p className="text-xs text-slate-400">Support for encrypted data partitions</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.encryption}
                    onCheckedChange={handleToggleChange("encryption")}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Settings className="text-blue-400" size={16} />
                    <div>
                      <span className="text-white text-sm font-medium">Touch Support</span>
                      <p className="text-xs text-slate-400">Enable touchscreen input for recovery</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.touchSupport}
                    onCheckedChange={handleToggleChange("touchSupport")}
                  />
                </div>
              </div>

              {/* Custom Build Flags */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-300">Custom Build Flags</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addFlag}
                    className="bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Flag
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {config.customFlags.map((flag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={flag}
                        onChange={(e) => updateFlag(index, e.target.value)}
                        placeholder="TW_CUSTOM_FLAG=value"
                        className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-500 font-mono text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFlag(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Common flags:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><code className="bg-slate-700 px-1 rounded">TW_THEME=portrait_hdpi</code> - Set recovery theme</li>
                    <li><code className="bg-slate-700 px-1 rounded">TW_INCLUDE_CRYPTO=true</code> - Enable encryption</li>
                    <li><code className="bg-slate-700 px-1 rounded">TW_NO_REBOOT_BOOTLOADER=true</code> - Disable bootloader reboot</li>
                    <li><code className="bg-slate-700 px-1 rounded">TW_HAS_DOWNLOAD_MODE=true</code> - Enable download mode</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}