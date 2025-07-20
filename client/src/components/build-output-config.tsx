import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Package, Shield, FileArchive } from "lucide-react";

interface BuildOutputConfigProps {
  config: {
    outputFormat: "boot_img" | "kernel_only" | "kernel_modules" | "full_package";
    compressionType: "gzip" | "lz4" | "xz" | "zstd";
    signKernel: boolean;
    signatureKey: string;
    enableVerifiedBoot: boolean;
    customBootArgs: string[];
  };
  onConfigChange: (config: BuildOutputConfigProps["config"]) => void;
}

export default function BuildOutputConfig({ config, onConfigChange }: BuildOutputConfigProps) {
  const handleSelectChange = (field: keyof typeof config) => (value: string) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

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

  const addBootArg = () => {
    onConfigChange({
      ...config,
      customBootArgs: [...config.customBootArgs, ""],
    });
  };

  const updateBootArg = (index: number, value: string) => {
    const newArgs = [...config.customBootArgs];
    newArgs[index] = value;
    onConfigChange({
      ...config,
      customBootArgs: newArgs,
    });
  };

  const removeBootArg = (index: number) => {
    const newArgs = config.customBootArgs.filter((_, i) => i !== index);
    onConfigChange({
      ...config,
      customBootArgs: newArgs,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Package className="text-purple-400" size={20} />
          </div>
          <div>
            <CardTitle className="text-white">Build Output Configuration</CardTitle>
            <CardDescription>Output format, compression, and security settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Output Format */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Output Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Package Format</Label>
                <Select value={config.outputFormat} onValueChange={handleSelectChange("outputFormat")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boot_img">Boot Image (boot.img)</SelectItem>
                    <SelectItem value="kernel_only">Kernel Only (zImage/Image)</SelectItem>
                    <SelectItem value="kernel_modules">Kernel + Modules</SelectItem>
                    <SelectItem value="full_package">Full Package (Flashable ZIP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Compression</Label>
                <Select value={config.compressionType} onValueChange={handleSelectChange("compressionType")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gzip">gzip (Standard)</SelectItem>
                    <SelectItem value="lz4">LZ4 (Fast)</SelectItem>
                    <SelectItem value="xz">XZ (High Compression)</SelectItem>
                    <SelectItem value="zstd">Zstandard (Balanced)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-3 bg-slate-700/30 rounded-lg text-xs text-slate-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>boot.img:</strong> Standard Android boot image format
                  <br />
                  <strong>Kernel Only:</strong> Raw kernel file for custom flashing
                </div>
                <div>
                  <strong>Kernel + Modules:</strong> Includes loadable kernel modules
                  <br />
                  <strong>Full Package:</strong> Complete flashable package with installer
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Security & Signing</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="text-green-400" size={16} />
                  <div>
                    <span className="text-white text-sm font-medium">Kernel Signing</span>
                    <p className="text-xs text-slate-400">Sign kernel with custom key for verified boot</p>
                  </div>
                </div>
                <Switch
                  checked={config.signKernel}
                  onCheckedChange={handleToggleChange("signKernel")}
                />
              </div>

              {config.signKernel && (
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">Signature Key Path</Label>
                  <Input
                    value={config.signatureKey}
                    onChange={(e) => handleInputChange("signatureKey")(e.target.value)}
                    placeholder="/path/to/signing/key.pem"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="text-blue-400" size={16} />
                  <div>
                    <span className="text-white text-sm font-medium">Android Verified Boot</span>
                    <p className="text-xs text-slate-400">Enable AVB 2.0 for boot verification</p>
                  </div>
                </div>
                <Switch
                  checked={config.enableVerifiedBoot}
                  onCheckedChange={handleToggleChange("enableVerifiedBoot")}
                />
              </div>
            </div>
          </div>

          {/* Boot Arguments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300">Custom Boot Arguments</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addBootArg}
                className="bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Argument
              </Button>
            </div>
            
            <div className="space-y-2">
              {config.customBootArgs.map((arg, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={arg}
                    onChange={(e) => updateBootArg(index, e.target.value)}
                    placeholder="androidboot.selinux=permissive"
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-500 font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBootArg(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="text-xs text-slate-500 space-y-1">
              <p>Common boot arguments:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><code className="bg-slate-700 px-1 rounded">androidboot.selinux=permissive</code> - Disable SELinux enforcement</li>
                <li><code className="bg-slate-700 px-1 rounded">androidboot.hardware=qcom</code> - Set hardware platform</li>
                <li><code className="bg-slate-700 px-1 rounded">console=ttyMSM0,115200,n8</code> - Enable serial console</li>
                <li><code className="bg-slate-700 px-1 rounded">androidboot.bootdevice=soc/7824900.sdhci</code> - Set boot device</li>
              </ul>
            </div>
          </div>

          {/* Compression Information */}
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <FileArchive className="text-purple-400 mt-1" size={16} />
              <div className="text-sm">
                <h5 className="font-medium text-purple-400 mb-2">Compression Comparison</h5>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                  <div>
                    <strong>gzip:</strong> Standard, good compatibility
                    <br />
                    <strong>LZ4:</strong> Fastest decompression, larger size
                  </div>
                  <div>
                    <strong>XZ:</strong> Best compression ratio, slower
                    <br />
                    <strong>Zstd:</strong> Modern, balanced performance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}