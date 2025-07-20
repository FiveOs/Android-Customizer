import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Wrench, Zap, Settings, HardDrive, Shield } from "lucide-react";

interface BuildToolchainConfigProps {
  config: {
    compiler: "gcc" | "clang";
    gccVersion: string;
    clangVersion: string;
    enableCcache: boolean;
    ccacheSize: string;
    enableLto: boolean;
    optimizationLevel: "O2" | "O3" | "Os" | "Oz";
    enableDebugInfo: boolean;
  };
  onConfigChange: (config: BuildToolchainConfigProps["config"]) => void;
}

export default function BuildToolchainConfig({ config, onConfigChange }: BuildToolchainConfigProps) {
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

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Wrench className="text-orange-400" size={20} />
          </div>
          <div>
            <CardTitle className="text-white">Build Toolchain Configuration</CardTitle>
            <CardDescription>Compiler settings and build optimization options</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Compiler Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Compiler Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Primary Compiler</Label>
                <Select value={config.compiler} onValueChange={handleSelectChange("compiler")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gcc">GCC (GNU Compiler Collection)</SelectItem>
                    <SelectItem value="clang">Clang/LLVM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">
                  {config.compiler === "gcc" ? "GCC Version" : "Clang Version"}
                </Label>
                <Select 
                  value={config.compiler === "gcc" ? config.gccVersion : config.clangVersion} 
                  onValueChange={handleSelectChange(config.compiler === "gcc" ? "gccVersion" : "clangVersion")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {config.compiler === "gcc" ? (
                      <>
                        <SelectItem value="13.2.0">GCC 13.2.0 (Latest)</SelectItem>
                        <SelectItem value="12.3.0">GCC 12.3.0 (Stable)</SelectItem>
                        <SelectItem value="11.4.0">GCC 11.4.0 (LTS)</SelectItem>
                        <SelectItem value="10.5.0">GCC 10.5.0 (Legacy)</SelectItem>
                        <SelectItem value="9.5.0">GCC 9.5.0 (Old)</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="17.0.0">Clang 17.0.0 (Latest)</SelectItem>
                        <SelectItem value="16.0.0">Clang 16.0.0 (Stable)</SelectItem>
                        <SelectItem value="15.0.0">Clang 15.0.0 (LTS)</SelectItem>
                        <SelectItem value="14.0.0">Clang 14.0.0 (Legacy)</SelectItem>
                        <SelectItem value="13.0.0">Clang 13.0.0 (Old)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-3 bg-slate-700/30 rounded-lg">
              <p className="text-xs text-slate-400">
                <strong>GCC:</strong> Traditional GNU compiler with excellent optimization and wide compatibility.
                <br />
                <strong>Clang:</strong> Modern LLVM-based compiler with faster compilation and better diagnostics.
              </p>
            </div>
          </div>

          <Separator className="bg-slate-600" />

          {/* Build Optimization */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Build Optimization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Optimization Level</Label>
                <Select value={config.optimizationLevel} onValueChange={handleSelectChange("optimizationLevel")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O2">-O2 (Recommended)</SelectItem>
                    <SelectItem value="O3">-O3 (Maximum Performance)</SelectItem>
                    <SelectItem value="Os">-Os (Size Optimized)</SelectItem>
                    <SelectItem value="Oz">-Oz (Ultra Size Optimized)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-300">Link Time Optimization (LTO)</Label>
                  <Switch
                    checked={config.enableLto}
                    onCheckedChange={handleToggleChange("enableLto")}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Enables whole-program optimization for better performance
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-300">Debug Information</Label>
                <Switch
                  checked={config.enableDebugInfo}
                  onCheckedChange={handleToggleChange("enableDebugInfo")}
                />
              </div>
              <p className="text-xs text-slate-400">
                Include debug symbols for kernel debugging (increases build size)
              </p>
            </div>
          </div>

          <Separator className="bg-slate-600" />

          {/* Build Cache Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Build Cache (ccache)</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-slate-300">Enable ccache</Label>
                  <p className="text-xs text-slate-400">Speeds up rebuilds by caching compilation results</p>
                </div>
                <Switch
                  checked={config.enableCcache}
                  onCheckedChange={handleToggleChange("enableCcache")}
                />
              </div>
              
              {config.enableCcache && (
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">Cache Size</Label>
                  <Select value={config.ccacheSize} onValueChange={handleSelectChange("ccacheSize")}>
                    <SelectTrigger className="">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectItem value="1G">1 GB (Minimal)</SelectItem>
                      <SelectItem value="2G">2 GB (Small)</SelectItem>
                      <SelectItem value="5G">5 GB (Recommended)</SelectItem>
                      <SelectItem value="10G">10 GB (Large)</SelectItem>
                      <SelectItem value="20G">20 GB (Maximum)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Performance Information */}
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Zap className="text-orange-400 mt-1" size={16} />
              <div className="text-sm">
                <h5 className="font-medium text-orange-400 mb-2">Performance Tips</h5>
                <ul className="text-slate-300 space-y-1 text-xs">
                  <li>• Use -O2 for best balance of performance and compilation time</li>
                  <li>• Enable ccache to significantly speed up incremental builds</li>
                  <li>• LTO can improve performance but increases build time</li>
                  <li>• Clang often compiles faster but GCC may produce better optimized code</li>
                  <li>• Disable debug info for production builds to reduce size</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}