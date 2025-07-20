import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { InsertKernelConfiguration } from "@shared/schema";

interface BuildOptionsProps {
  config: Partial<InsertKernelConfiguration>;
  onConfigChange: (config: Partial<InsertKernelConfiguration>) => void;
}

export default function BuildOptions({ config, onConfigChange }: BuildOptionsProps) {
  const handleInputChange = (field: keyof InsertKernelConfiguration) => (
    value: string | string[] | any
  ) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  const handleSkipOptionChange = (field: keyof NonNullable<InsertKernelConfiguration["skipOptions"]>) => (
    checked: boolean
  ) => {
    onConfigChange({
      ...config,
      skipOptions: {
        ...config.skipOptions,
        [field]: checked,
      },
    });
  };

  const addCustomConfig = () => {
    const currentConfigs = config.customKernelConfigs || [];
    onConfigChange({
      ...config,
      customKernelConfigs: [...currentConfigs, ""],
    });
  };

  const updateCustomConfig = (index: number, value: string) => {
    const currentConfigs = config.customKernelConfigs || [];
    const newConfigs = [...currentConfigs];
    newConfigs[index] = value;
    onConfigChange({
      ...config,
      customKernelConfigs: newConfigs,
    });
  };

  const removeCustomConfig = (index: number) => {
    const currentConfigs = config.customKernelConfigs || [];
    const newConfigs = currentConfigs.filter((_, i) => i !== index);
    onConfigChange({
      ...config,
      customKernelConfigs: newConfigs,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-white">Build Configuration</CardTitle>
        <CardDescription>Advanced kernel compilation settings</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="outputDir" className="text-sm font-medium text-slate-300 mb-2 block">
              Output Directory
            </Label>
            <Input
              id="outputDir"
              value={config.outputDir || ""}
              onChange={(e) => handleInputChange("outputDir")(e.target.value)}
              placeholder="~/kernel_build_output"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="wslDistroName" className="text-sm font-medium text-slate-300 mb-2 block">
              WSL Distribution
            </Label>
            <Select
              value={config.wslDistroName || "kali-linux"}
              onValueChange={handleInputChange("wslDistroName")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kali-linux">Kali Linux</SelectItem>
                <SelectItem value="Ubuntu">Ubuntu</SelectItem>
                <SelectItem value="Debian">Debian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="gitPatchLevel" className="text-sm font-medium text-slate-300 mb-2 block">
              Patch Level
            </Label>
            <Select
              value={config.gitPatchLevel || "1"}
              onValueChange={handleInputChange("gitPatchLevel")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Level 1 (recommended)</SelectItem>
                <SelectItem value="0">Level 0</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="defconfigFilenameTemplate" className="text-sm font-medium text-slate-300 mb-2 block">
              Defconfig Template
            </Label>
            <Input
              id="defconfigFilenameTemplate"
              value={config.defconfigFilenameTemplate || ""}
              onChange={(e) => handleInputChange("defconfigFilenameTemplate")(e.target.value)}
              placeholder="arch/arm64/configs/{codename}_defconfig"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* NetHunter Patches Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-span-2">
            <Label htmlFor="nethunterPatchesRepo" className="text-sm font-medium text-slate-300 mb-2 block">
              NetHunter Patches Repository
            </Label>
            <Input
              id="nethunterPatchesRepo"
              value={config.nethunterPatchesRepo || ""}
              onChange={(e) => handleInputChange("nethunterPatchesRepo")(e.target.value)}
              placeholder="https://gitlab.com/kalilinux/nethunter/build-scripts/kali-nethunter-project.git"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="nethunterPatchesBranch" className="text-sm font-medium text-slate-300 mb-2 block">
              NetHunter Branch
            </Label>
            <Input
              id="nethunterPatchesBranch"
              value={config.nethunterPatchesBranch || ""}
              onChange={(e) => handleInputChange("nethunterPatchesBranch")(e.target.value)}
              placeholder="master"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="nethunterPatchesDirRelative" className="text-sm font-medium text-slate-300 mb-2 block">
              Patches Directory
            </Label>
            <Input
              id="nethunterPatchesDirRelative"
              value={config.nethunterPatchesDirRelative || ""}
              onChange={(e) => handleInputChange("nethunterPatchesDirRelative")(e.target.value)}
              placeholder="nethunter-kernel-patches"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Custom Config Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-slate-300">Custom Kernel Configs</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomConfig}
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Config
            </Button>
          </div>
          <div className="space-y-2">
            {(config.customKernelConfigs || []).map((configLine, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={configLine}
                  onChange={(e) => updateCustomConfig(index, e.target.value)}
                  placeholder="CONFIG_EXAMPLE_FEATURE=y"
                  className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-primary focus:border-primary font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomConfig(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Add custom CONFIG_ directives that will be appended to your defconfig file.
          </p>
        </div>

        {/* Build Skip Options */}
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Skip Options</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: "skipEnvSetup", label: "Skip environment setup" },
              { key: "skipClone", label: "Skip repository clone" },
              { key: "skipPatches", label: "Skip patches" },
              { key: "skipConfigTweaks", label: "Skip config tweaks" },
              { key: "skipBuild", label: "Skip build" },
              { key: "cleanOutput", label: "Clean output" },
            ].map((option) => (
              <div key={option.key} className="flex items-center space-x-2">
                <Checkbox
                  id={option.key}
                  checked={config.skipOptions?.[option.key as keyof typeof config.skipOptions] || false}
                  onCheckedChange={handleSkipOptionChange(option.key as keyof NonNullable<InsertKernelConfiguration["skipOptions"]>)}
                  className="border-slate-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor={option.key} className="text-sm text-slate-300 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
