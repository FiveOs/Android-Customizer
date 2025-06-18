import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Zap, MemoryStick, HardDrive, Thermometer } from "lucide-react";

interface PerformanceConfigProps {
  config: {
    cpuGovernors: {
      defaultGovernor: string;
      availableGovernors: string[];
      customTuning: Record<string, any>;
    };
    memoryManagement: {
      enableZram: boolean;
      zramSize: string;
      swappiness: number;
      enableKsm: boolean;
    };
    ioScheduler: {
      defaultScheduler: string;
      availableSchedulers: string[];
      customTuning: Record<string, any>;
    };
    thermalManagement: {
      enableThermalControl: boolean;
      throttleTemps: Record<string, number>;
      customZones: string[];
    };
  };
  onConfigChange: (config: PerformanceConfigProps["config"]) => void;
}

export default function PerformanceConfig({ config, onConfigChange }: PerformanceConfigProps) {
  const handleSelectChange = (section: keyof typeof config, field: string) => (value: string) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [field]: value,
      },
    });
  };

  const handleToggleChange = (section: keyof typeof config, field: string) => (checked: boolean) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [field]: checked,
      },
    });
  };

  const handleSliderChange = (section: keyof typeof config, field: string) => (value: number[]) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [field]: value[0],
      },
    });
  };

  const addThermalZone = () => {
    onConfigChange({
      ...config,
      thermalManagement: {
        ...config.thermalManagement,
        customZones: [...config.thermalManagement.customZones, ""],
      },
    });
  };

  const updateThermalZone = (index: number, value: string) => {
    const newZones = [...config.thermalManagement.customZones];
    newZones[index] = value;
    onConfigChange({
      ...config,
      thermalManagement: {
        ...config.thermalManagement,
        customZones: newZones,
      },
    });
  };

  const removeThermalZone = (index: number) => {
    const newZones = config.thermalManagement.customZones.filter((_, i) => i !== index);
    onConfigChange({
      ...config,
      thermalManagement: {
        ...config.thermalManagement,
        customZones: newZones,
      },
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <Zap className="text-yellow-400" size={20} />
          </div>
          <div>
            <CardTitle className="text-white">Performance Optimization</CardTitle>
            <CardDescription>CPU, memory, I/O, and thermal management settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* CPU Governors */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Zap className="text-blue-400" size={20} />
              <h3 className="text-sm font-medium text-slate-300">CPU Frequency Governors</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">Default Governor</Label>
                <Select 
                  value={config.cpuGovernors.defaultGovernor} 
                  onValueChange={handleSelectChange("cpuGovernors", "defaultGovernor")}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="schedutil">Schedutil (Recommended)</SelectItem>
                    <SelectItem value="ondemand">OnDemand (Dynamic)</SelectItem>
                    <SelectItem value="performance">Performance (Max Speed)</SelectItem>
                    <SelectItem value="powersave">Powersave (Min Speed)</SelectItem>
                    <SelectItem value="conservative">Conservative (Gradual)</SelectItem>
                    <SelectItem value="interactive">Interactive (Responsive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-3 bg-slate-700/30 rounded-lg text-xs text-slate-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Schedutil:</strong> Modern scheduler-based governor
                  <br />
                  <strong>OnDemand:</strong> Scales based on CPU load
                  <br />
                  <strong>Performance:</strong> Always maximum frequency
                </div>
                <div>
                  <strong>Powersave:</strong> Always minimum frequency
                  <br />
                  <strong>Conservative:</strong> Gradual frequency changes
                  <br />
                  <strong>Interactive:</strong> Fast response to user input
                </div>
              </div>
            </div>
          </div>

          {/* Memory Management */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MemoryStick className="text-green-400" size={20} />
              <h3 className="text-sm font-medium text-slate-300">Memory Management</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MemoryStick className="text-green-400" size={16} />
                  <div>
                    <span className="text-white text-sm font-medium">Enable ZRAM</span>
                    <p className="text-xs text-slate-400">Compressed RAM for better memory utilization</p>
                  </div>
                </div>
                <Switch
                  checked={config.memoryManagement.enableZram}
                  onCheckedChange={handleToggleChange("memoryManagement", "enableZram")}
                />
              </div>

              {config.memoryManagement.enableZram && (
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">ZRAM Size</Label>
                  <Select 
                    value={config.memoryManagement.zramSize} 
                    onValueChange={handleSelectChange("memoryManagement", "zramSize")}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="512M">512 MB</SelectItem>
                      <SelectItem value="1G">1 GB (Recommended)</SelectItem>
                      <SelectItem value="2G">2 GB</SelectItem>
                      <SelectItem value="50%">50% of RAM</SelectItem>
                      <SelectItem value="75%">75% of RAM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">VM Swappiness: {config.memoryManagement.swappiness}</Label>
                <Slider
                  value={[config.memoryManagement.swappiness]}
                  onValueChange={handleSliderChange("memoryManagement", "swappiness")}
                  max={100}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-slate-400">
                  Controls how aggressively the kernel swaps memory pages (0=minimal, 100=aggressive)
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MemoryStick className="text-purple-400" size={16} />
                  <div>
                    <span className="text-white text-sm font-medium">Kernel Same-page Merging (KSM)</span>
                    <p className="text-xs text-slate-400">Merge identical memory pages to save RAM</p>
                  </div>
                </div>
                <Switch
                  checked={config.memoryManagement.enableKsm}
                  onCheckedChange={handleToggleChange("memoryManagement", "enableKsm")}
                />
              </div>
            </div>
          </div>

          {/* I/O Scheduler */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <HardDrive className="text-purple-400" size={20} />
              <h3 className="text-sm font-medium text-slate-300">I/O Scheduler</h3>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-300 mb-2 block">Default I/O Scheduler</Label>
              <Select 
                value={config.ioScheduler.defaultScheduler} 
                onValueChange={handleSelectChange("ioScheduler", "defaultScheduler")}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="mq-deadline">MQ-Deadline (Recommended)</SelectItem>
                  <SelectItem value="kyber">Kyber (Low Latency)</SelectItem>
                  <SelectItem value="bfq">BFQ (Desktop/Interactive)</SelectItem>
                  <SelectItem value="none">None (Direct)</SelectItem>
                  <SelectItem value="noop">NOOP (Simple)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-3 bg-slate-700/30 rounded-lg text-xs text-slate-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>MQ-Deadline:</strong> Multi-queue with deadlines
                  <br />
                  <strong>Kyber:</strong> Low latency for SSDs
                </div>
                <div>
                  <strong>BFQ:</strong> Budget Fair Queueing
                  <br />
                  <strong>NOOP/None:</strong> Minimal overhead
                </div>
              </div>
            </div>
          </div>

          {/* Thermal Management */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Thermometer className="text-red-400" size={20} />
              <h3 className="text-sm font-medium text-slate-300">Thermal Management</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Thermometer className="text-red-400" size={16} />
                  <div>
                    <span className="text-white text-sm font-medium">Enable Thermal Control</span>
                    <p className="text-xs text-slate-400">Advanced thermal throttling and monitoring</p>
                  </div>
                </div>
                <Switch
                  checked={config.thermalManagement.enableThermalControl}
                  onCheckedChange={handleToggleChange("thermalManagement", "enableThermalControl")}
                />
              </div>

              {config.thermalManagement.enableThermalControl && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-300">Custom Thermal Zones</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addThermalZone}
                      className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Zone
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {config.thermalManagement.customZones.map((zone, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={zone}
                          onChange={(e) => updateThermalZone(index, e.target.value)}
                          placeholder="cpu-thermal-zone"
                          className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-500 font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeThermalZone(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Performance Tips */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Zap className="text-yellow-400 mt-1" size={16} />
              <div className="text-sm">
                <h5 className="font-medium text-yellow-400 mb-2">Performance Optimization Tips</h5>
                <ul className="text-slate-300 space-y-1 text-xs">
                  <li>• Use schedutil governor for modern devices with good scheduler integration</li>
                  <li>• Enable ZRAM on devices with limited RAM (4GB or less)</li>
                  <li>• Set swappiness to 10-30 for better responsiveness</li>
                  <li>• Use MQ-Deadline scheduler for most storage devices</li>
                  <li>• Enable thermal control to prevent overheating and throttling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}