import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Shield, Key, Scan, RefreshCw } from "lucide-react";

interface SecurityConfigProps {
  config: {
    kernelSigning: {
      enableSigning: boolean;
      keyPath: string;
      certPath: string;
      algorithm: string;
    };
    securityPatches: {
      enablePatching: boolean;
      patchLevel: string;
      customPatches: string[];
    };
    vulnerabilityScanning: {
      enableScanning: boolean;
      scanTools: string[];
    };
    buildReproducibility: {
      enableReproducible: boolean;
      timestamp: string;
      buildId: string;
    };
  };
  onConfigChange: (config: SecurityConfigProps["config"]) => void;
}

export default function SecurityConfig({ config, onConfigChange }: SecurityConfigProps) {
  const handleToggleChange = (section: keyof typeof config, field: string) => (checked: boolean) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [field]: checked,
      },
    });
  };

  const handleSelectChange = (section: keyof typeof config, field: string) => (value: string) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [field]: value,
      },
    });
  };

  const handleInputChange = (section: keyof typeof config, field: string) => (value: string) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [field]: value,
      },
    });
  };

  const addPatch = () => {
    onConfigChange({
      ...config,
      securityPatches: {
        ...config.securityPatches,
        customPatches: [...config.securityPatches.customPatches, ""],
      },
    });
  };

  const updatePatch = (index: number, value: string) => {
    const newPatches = [...config.securityPatches.customPatches];
    newPatches[index] = value;
    onConfigChange({
      ...config,
      securityPatches: {
        ...config.securityPatches,
        customPatches: newPatches,
      },
    });
  };

  const removePatch = (index: number) => {
    const newPatches = config.securityPatches.customPatches.filter((_, i) => i !== index);
    onConfigChange({
      ...config,
      securityPatches: {
        ...config.securityPatches,
        customPatches: newPatches,
      },
    });
  };

  const addScanTool = () => {
    onConfigChange({
      ...config,
      vulnerabilityScanning: {
        ...config.vulnerabilityScanning,
        scanTools: [...config.vulnerabilityScanning.scanTools, ""],
      },
    });
  };

  const updateScanTool = (index: number, value: string) => {
    const newTools = [...config.vulnerabilityScanning.scanTools];
    newTools[index] = value;
    onConfigChange({
      ...config,
      vulnerabilityScanning: {
        ...config.vulnerabilityScanning,
        scanTools: newTools,
      },
    });
  };

  const removeScanTool = (index: number) => {
    const newTools = config.vulnerabilityScanning.scanTools.filter((_, i) => i !== index);
    onConfigChange({
      ...config,
      vulnerabilityScanning: {
        ...config.vulnerabilityScanning,
        scanTools: newTools,
      },
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <Shield className="text-red-400" size={20} />
          </div>
          <div>
            <CardTitle className="text-white">Security Configuration</CardTitle>
            <CardDescription>Kernel signing, patches, and security validation</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Kernel Signing */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Key className="text-blue-400" size={20} />
              <h3 className="text-sm font-medium text-slate-300">Kernel Signing</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Key className="text-blue-400" size={16} />
                  <div>
                    <span className="text-white text-sm font-medium">Enable Kernel Signing</span>
                    <p className="text-xs text-slate-400">Sign kernel modules and image for verification</p>
                  </div>
                </div>
                <Switch
                  checked={config.kernelSigning.enableSigning}
                  onCheckedChange={handleToggleChange("kernelSigning", "enableSigning")}
                />
              </div>

              {config.kernelSigning.enableSigning && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-300 mb-2 block">Private Key Path</Label>
                      <Input
                        value={config.kernelSigning.keyPath}
                        onChange={(e) => handleInputChange("kernelSigning", "keyPath")(e.target.value)}
                        placeholder="/path/to/kernel-signing-key.pem"
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 font-mono text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-300 mb-2 block">Certificate Path</Label>
                      <Input
                        value={config.kernelSigning.certPath}
                        onChange={(e) => handleInputChange("kernelSigning", "certPath")(e.target.value)}
                        placeholder="/path/to/kernel-signing-cert.pem"
                        className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 font-mono text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">Signing Algorithm</Label>
                    <Select 
                      value={config.kernelSigning.algorithm} 
                      onValueChange={handleSelectChange("kernelSigning", "algorithm")}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="sha256">SHA-256 (Recommended)</SelectItem>
                        <SelectItem value="sha384">SHA-384</SelectItem>
                        <SelectItem value="sha512">SHA-512</SelectItem>
                        <SelectItem value="sha1">SHA-1 (Legacy)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Patches */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="text-green-400" size={20} />
              <h3 className="text-sm font-medium text-muted-foreground">Security Patches</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="text-primary" size={16} />
                  <div>
                    <span className="text-accent-foreground text-sm font-medium">Enable Security Patching</span>
                    <p className="text-xs text-muted-foreground">Apply latest security patches automatically</p>
                  </div>
                </div>
                <Switch
                  checked={config.securityPatches.enablePatching}
                  onCheckedChange={handleToggleChange("securityPatches", "enablePatching")}
                />
              </div>

              {config.securityPatches.enablePatching && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">Security Patch Level</Label>
                    <Select 
                      value={config.securityPatches.patchLevel} 
                      onValueChange={handleSelectChange("securityPatches", "patchLevel")}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="latest">Latest (Recommended)</SelectItem>
                        <SelectItem value="2024-12">December 2024</SelectItem>
                        <SelectItem value="2024-11">November 2024</SelectItem>
                        <SelectItem value="2024-10">October 2024</SelectItem>
                        <SelectItem value="custom">Custom Patch Set</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-slate-300">Custom Security Patches</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPatch}
                        className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Patch
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {config.securityPatches.customPatches.map((patch, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={patch}
                            onChange={(e) => updatePatch(index, e.target.value)}
                            placeholder="CVE-2024-XXXXX.patch"
                            className="flex-1 bg-input border-border text-foreground placeholder-muted-foreground font-mono text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePatch(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vulnerability Scanning */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Scan className="text-purple-400" size={20} />
              <h3 className="text-sm font-medium text-slate-300">Vulnerability Scanning</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Scan className="text-purple-400" size={16} />
                  <div>
                    <span className="text-white text-sm font-medium">Enable Vulnerability Scanning</span>
                    <p className="text-xs text-slate-400">Scan kernel for known vulnerabilities</p>
                  </div>
                </div>
                <Switch
                  checked={config.vulnerabilityScanning.enableScanning}
                  onCheckedChange={handleToggleChange("vulnerabilityScanning", "enableScanning")}
                />
              </div>

              {config.vulnerabilityScanning.enableScanning && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-300">Scanning Tools</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addScanTool}
                      className="bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Tool
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {config.vulnerabilityScanning.scanTools.map((tool, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={tool}
                          onChange={(e) => updateScanTool(index, e.target.value)}
                          placeholder="cve-scanner"
                          className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-500 font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeScanTool(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Available scanning tools:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><code className="bg-slate-700 px-1 rounded">kscope</code> - Kernel security scanner</li>
                      <li><code className="bg-slate-700 px-1 rounded">smatch</code> - Static analysis tool</li>
                      <li><code className="bg-slate-700 px-1 rounded">sparse</code> - Semantic parser</li>
                      <li><code className="bg-slate-700 px-1 rounded">coverity</code> - Commercial scanner</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Build Reproducibility */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <RefreshCw className="text-yellow-400" size={20} />
              <h3 className="text-sm font-medium text-slate-300">Build Reproducibility</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="text-yellow-400" size={16} />
                  <div>
                    <span className="text-white text-sm font-medium">Enable Reproducible Builds</span>
                    <p className="text-xs text-slate-400">Generate deterministic build outputs</p>
                  </div>
                </div>
                <Switch
                  checked={config.buildReproducibility.enableReproducible}
                  onCheckedChange={handleToggleChange("buildReproducibility", "enableReproducible")}
                />
              </div>

              {config.buildReproducibility.enableReproducible && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">Fixed Timestamp</Label>
                    <Input
                      value={config.buildReproducibility.timestamp}
                      onChange={(e) => handleInputChange("buildReproducibility", "timestamp")(e.target.value)}
                      placeholder="2024-01-01 00:00:00 UTC"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">Build ID</Label>
                    <Input
                      value={config.buildReproducibility.buildId}
                      onChange={(e) => handleInputChange("buildReproducibility", "buildId")(e.target.value)}
                      placeholder="kernel-build-v1.0"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Information */}
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="text-red-400 mt-1" size={16} />
              <div className="text-sm">
                <h5 className="font-medium text-red-400 mb-2">Security Best Practices</h5>
                <ul className="text-slate-300 space-y-1 text-xs">
                  <li>• Always enable kernel signing for production builds</li>
                  <li>• Keep security patches up to date to prevent exploits</li>
                  <li>• Use vulnerability scanning to identify potential issues</li>
                  <li>• Enable reproducible builds for supply chain security</li>
                  <li>• Store signing keys securely and limit access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}