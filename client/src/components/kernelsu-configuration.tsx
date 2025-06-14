import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Globe, Settings, AlertTriangle } from "lucide-react";

interface KernelSUConfigurationProps {
  config: {
    enabled: boolean;
    version: string;
    managerApp: boolean;
    webUI: boolean;
    safeMode: boolean;
    logLevel: string;
  };
  onConfigChange: (config: KernelSUConfigurationProps["config"]) => void;
}

export default function KernelSUConfiguration({ config, onConfigChange }: KernelSUConfigurationProps) {
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

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Shield className="text-emerald-400" size={20} />
          </div>
          <div>
            <CardTitle className="text-white">KernelSU Configuration</CardTitle>
            <CardDescription>Kernel-level root solution with enhanced security</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Enable KernelSU */}
          <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center space-x-3">
              <Shield className="text-emerald-400" size={20} />
              <div>
                <h4 className="font-medium text-white">Enable KernelSU</h4>
                <p className="text-sm text-slate-400">Modern kernel-based root with enhanced security features</p>
              </div>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={handleToggleChange("enabled")}
            />
          </div>

          {config.enabled && (
            <>
              {/* Version and Log Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">
                    KernelSU Version
                  </Label>
                  <Select value={config.version} onValueChange={handleSelectChange("version")}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="latest">Latest (Recommended)</SelectItem>
                      <SelectItem value="v0.7.2">v0.7.2 (Stable)</SelectItem>
                      <SelectItem value="v0.6.9">v0.6.9 (Legacy)</SelectItem>
                      <SelectItem value="main">Main Branch (Development)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">
                    Log Level
                  </Label>
                  <Select value={config.logLevel} onValueChange={handleSelectChange("logLevel")}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="info">Info (Recommended)</SelectItem>
                      <SelectItem value="debug">Debug (Verbose)</SelectItem>
                      <SelectItem value="warn">Warning Only</SelectItem>
                      <SelectItem value="error">Error Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Core Features */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-300">Core Features</h4>
                
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Settings className="text-blue-400" size={16} />
                    <div>
                      <span className="text-white text-sm font-medium">Manager App</span>
                      <p className="text-xs text-slate-400">Install KernelSU Manager APK for root management</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.managerApp}
                    onCheckedChange={handleToggleChange("managerApp")}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="text-purple-400" size={16} />
                    <div>
                      <span className="text-white text-sm font-medium">Web UI</span>
                      <p className="text-xs text-slate-400">Enable web-based management interface</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.webUI}
                    onCheckedChange={handleToggleChange("webUI")}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="text-yellow-400" size={16} />
                    <div>
                      <span className="text-white text-sm font-medium">Safe Mode</span>
                      <p className="text-xs text-slate-400">Enable additional security checks and protections</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.safeMode}
                    onCheckedChange={handleToggleChange("safeMode")}
                  />
                </div>
              </div>

              {/* Information Panel */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="text-emerald-400 mt-1" size={16} />
                  <div className="text-sm">
                    <h5 className="font-medium text-emerald-400 mb-2">KernelSU Benefits</h5>
                    <ul className="text-slate-300 space-y-1 text-xs">
                      <li>• Kernel-level implementation for better security</li>
                      <li>• Module system for systemless modifications</li>
                      <li>• App profile management with fine-grained permissions</li>
                      <li>• Built-in hiding mechanisms for security apps</li>
                      <li>• Over-the-air updates without reflashing</li>
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