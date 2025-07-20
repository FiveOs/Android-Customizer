import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Cpu, Zap, Bug, Trash2 } from "lucide-react";

interface BuildOptionsProps {
  configuration: any;
  onConfigurationChange: (config: any) => void;
}

export default function BuildOptions({
  configuration,
  onConfigurationChange,
}: BuildOptionsProps) {
  const handleBuildOptionChange = (option: string, value: any) => {
    onConfigurationChange({
      ...configuration,
      buildOptions: {
        ...configuration.buildOptions,
        [option]: value,
      },
    });
  };

  const handleSkipOptionChange = (option: string, value: boolean) => {
    onConfigurationChange({
      ...configuration,
      skipOptions: {
        ...configuration.skipOptions,
        [option]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Build Options */}
      <Card className="bg-slate-900 border-blue-500 border-2">
        <CardHeader>
          <CardTitle className="text-blue-300 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Build Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">
                Compiler
              </Label>
              <Select
                value={configuration.buildOptions.compiler}
                onValueChange={(value) => handleBuildOptionChange("compiler", value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="clang" className="text-white">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4" />
                      <span>Clang (Recommended)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="gcc" className="text-white">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4" />
                      <span>GCC</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">
                Optimization
              </Label>
              <Select
                value={configuration.buildOptions.optimization}
                onValueChange={(value) => handleBuildOptionChange("optimization", value)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="performance" className="text-white">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Performance</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="battery" className="text-white">Battery Life</SelectItem>
                  <SelectItem value="balanced" className="text-white">Balanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-slate-300">
                    Debug Mode
                  </Label>
                  <p className="text-xs text-slate-400">
                    Include debugging symbols
                  </p>
                </div>
                <Switch
                  checked={configuration.buildOptions.debugMode}
                  onCheckedChange={(checked) => handleBuildOptionChange("debugMode", checked)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <Label className="font-medium text-white">LTO (Link Time Optimization)</Label>
                  <Badge variant="secondary" className="text-xs">Advanced</Badge>
                </div>
                <p className="text-xs text-slate-400">Improves performance but increases build time</p>
              </div>
              <Switch
                checked={configuration.buildOptions.ltoEnabled}
                onCheckedChange={(checked) => handleBuildOptionChange("ltoEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <Label className="font-medium text-white">ccache</Label>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <p className="text-xs text-slate-400">Cache compilation to speed up rebuilds</p>
              </div>
              <Switch
                checked={configuration.buildOptions.ccacheEnabled}
                onCheckedChange={(checked) => handleBuildOptionChange("ccacheEnabled", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skip Options */}
      <Card className="bg-slate-900 border-yellow-500 border-2">
        <CardHeader>
          <CardTitle className="text-yellow-300 flex items-center">
            <Bug className="h-5 w-5 mr-2" />
            Developer Options
            <Badge variant="outline" className="ml-2 text-yellow-400 border-yellow-400">
              Advanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                key: "skipEnvSetup",
                label: "Skip Environment Setup",
                description: "Skip WSL and dependency installation",
              },
              {
                key: "skipClone",
                label: "Skip Repository Clone",
                description: "Use existing kernel source",
              },
              {
                key: "skipPatches",
                label: "Skip NetHunter Patches",
                description: "Build without NetHunter modifications",
              },
              {
                key: "skipConfigTweaks",
                label: "Skip Config Tweaks",
                description: "Use default kernel configuration",
              },
              {
                key: "skipBuild",
                label: "Skip Build Process",
                description: "Only prepare configuration",
              },
              {
                key: "cleanOutput",
                label: "Clean Output Directory",
                description: "Remove previous build artifacts",
              },
            ].map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg"
              >
                <div>
                  <Label className="font-medium text-white">{option.label}</Label>
                  <p className="text-xs text-slate-400">{option.description}</p>
                </div>
                <Switch
                  checked={configuration.skipOptions[option.key]}
                  onCheckedChange={(checked) => handleSkipOptionChange(option.key, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}