import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Shield, Eye, Zap } from "lucide-react";

interface MagiskConfigurationProps {
  config: {
    enabled: boolean;
    version: string;
    hideRoot: boolean;
    zygiskEnabled: boolean;
    denyListEnabled: boolean;
    modules: string[];
  };
  onConfigChange: (config: MagiskConfigurationProps["config"]) => void;
}

export default function MagiskConfiguration({ config, onConfigChange }: MagiskConfigurationProps) {
  const handleToggleChange = (field: keyof typeof config) => (checked: boolean) => {
    onConfigChange({
      ...config,
      [field]: checked,
    });
  };

  const handleVersionChange = (version: string) => {
    onConfigChange({
      ...config,
      version,
    });
  };

  const addModule = () => {
    onConfigChange({
      ...config,
      modules: [...config.modules, ""],
    });
  };

  const updateModule = (index: number, value: string) => {
    const newModules = [...config.modules];
    newModules[index] = value;
    onConfigChange({
      ...config,
      modules: newModules,
    });
  };

  const removeModule = (index: number) => {
    const newModules = config.modules.filter((_, i) => i !== index);
    onConfigChange({
      ...config,
      modules: newModules,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Shield className="text-blue-400" size={20} />
          </div>
          <div>
            <CardTitle className="text-white">Magisk Configuration</CardTitle>
            <CardDescription>Systemless root and module management</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Enable Magisk */}
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-3">
              <Shield className="text-blue-400" size={20} />
              <div>
                <h4 className="font-medium text-white">Enable Magisk Integration</h4>
                <p className="text-sm text-slate-400">Include kernel patches for Magisk compatibility</p>
              </div>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={handleToggleChange("enabled")}
            />
          </div>

          {config.enabled && (
            <>
              {/* Version Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">
                    Magisk Version
                  </Label>
                  <Select value={config.version} onValueChange={handleVersionChange}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="latest">Latest (Recommended)</SelectItem>
                      <SelectItem value="v27.0">v27.0 (Stable)</SelectItem>
                      <SelectItem value="v26.4">v26.4 (Legacy)</SelectItem>
                      <SelectItem value="v25.2">v25.2 (Old Stable)</SelectItem>
                      <SelectItem value="canary">Canary (Development)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Core Features */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-300">Core Features</h4>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="text-yellow-400" size={16} />
                    <div>
                      <span className="text-white text-sm font-medium">MagiskHide</span>
                      <p className="text-xs text-slate-400">Hide root from banking apps and games</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.hideRoot}
                    onCheckedChange={handleToggleChange("hideRoot")}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="text-purple-400" size={16} />
                    <div>
                      <span className="text-white text-sm font-medium">Zygisk</span>
                      <p className="text-xs text-slate-400">Advanced process injection framework</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.zygiskEnabled}
                    onCheckedChange={handleToggleChange("zygiskEnabled")}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="text-red-400" size={16} />
                    <div>
                      <span className="text-white text-sm font-medium">DenyList</span>
                      <p className="text-xs text-slate-400">Enhanced app hiding capabilities</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.denyListEnabled}
                    onCheckedChange={handleToggleChange("denyListEnabled")}
                  />
                </div>
              </div>

              {/* Modules */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-300">Pre-installed Modules</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addModule}
                    className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Module
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {config.modules.map((module, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={module}
                        onChange={(e) => updateModule(index, e.target.value)}
                        placeholder="Module name or GitHub repo URL"
                        className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModule(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-slate-500">
                  Add module names or GitHub repository URLs to pre-install with the kernel.
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}