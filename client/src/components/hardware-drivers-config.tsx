import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Camera, Monitor, Cpu, Volume2, Radar } from "lucide-react";

interface HardwareDriversConfigProps {
  config: {
    cameraDrivers: {
      enableCamera: boolean;
      drivers: string[];
      customConfigs: string[];
    };
    displayDrivers: {
      enableDisplay: boolean;
      panelType: string;
      resolution: string;
      refreshRate: number;
    };
    sensorDrivers: {
      enableSensors: boolean;
      accelerometer: boolean;
      gyroscope: boolean;
      magnetometer: boolean;
      proximity: boolean;
      ambient: boolean;
    };
    audioDrivers: {
      enableAudio: boolean;
      codecType: string;
      customConfigs: string[];
    };
  };
  onConfigChange: (config: HardwareDriversConfigProps["config"]) => void;
}

export default function HardwareDriversConfig({ config, onConfigChange }: HardwareDriversConfigProps) {
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

  const handleInputChange = (section: keyof typeof config, field: string) => (value: string | number) => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        [field]: value,
      },
    });
  };

  const addDriver = (section: "cameraDrivers" | "audioDrivers") => {
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        drivers: [...(config[section].drivers || []), ""],
      },
    });
  };

  const updateDriver = (section: "cameraDrivers" | "audioDrivers", index: number, value: string) => {
    const newDrivers = [...(config[section].drivers || [])];
    newDrivers[index] = value;
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        drivers: newDrivers,
      },
    });
  };

  const removeDriver = (section: "cameraDrivers" | "audioDrivers", index: number) => {
    const newDrivers = (config[section].drivers || []).filter((_, i) => i !== index);
    onConfigChange({
      ...config,
      [section]: {
        ...config[section],
        drivers: newDrivers,
      },
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
            <Cpu className="text-cyan-400" size={20} />
          </div>
          <div>
            <CardTitle className="text-white">Hardware Drivers Configuration</CardTitle>
            <CardDescription>Device-specific hardware driver settings</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* Camera Drivers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Camera className="text-blue-400" size={20} />
                <h3 className="text-sm font-medium text-slate-300">Camera Drivers</h3>
              </div>
              <Switch
                checked={config.cameraDrivers.enableCamera}
                onCheckedChange={handleToggleChange("cameraDrivers", "enableCamera")}
              />
            </div>

            {config.cameraDrivers.enableCamera && (
              <div className="space-y-4 ml-8">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-300">Camera Driver Modules</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addDriver("cameraDrivers")}
                    className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Driver
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {config.cameraDrivers.drivers.map((driver, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={driver}
                        onChange={(e) => updateDriver("cameraDrivers", index, e.target.value)}
                        placeholder="camera_module_name"
                        className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-500 font-mono text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDriver("cameraDrivers", index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-slate-500">
                  Common camera drivers: ov13855, imx519, s5k3m3, ov8856
                </div>
              </div>
            )}
          </div>

          {/* Display Drivers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Monitor className="text-green-400" size={20} />
                <h3 className="text-sm font-medium text-slate-300">Display Drivers</h3>
              </div>
              <Switch
                checked={config.displayDrivers.enableDisplay}
                onCheckedChange={handleToggleChange("displayDrivers", "enableDisplay")}
              />
            </div>

            {config.displayDrivers.enableDisplay && (
              <div className="space-y-4 ml-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">Panel Type</Label>
                    <Select 
                      value={config.displayDrivers.panelType} 
                      onValueChange={handleSelectChange("displayDrivers", "panelType")}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select panel" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="samsung_s6e3fa7">Samsung S6E3FA7 (AMOLED)</SelectItem>
                        <SelectItem value="samsung_sofef00">Samsung SOFEF00 (AMOLED)</SelectItem>
                        <SelectItem value="lg_sw49408">LG SW49408 (OLED)</SelectItem>
                        <SelectItem value="boe_nt37800">BOE NT37800 (LCD)</SelectItem>
                        <SelectItem value="tianma_nt36672a">Tianma NT36672A (LCD)</SelectItem>
                        <SelectItem value="custom">Custom Panel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">Resolution</Label>
                    <Select 
                      value={config.displayDrivers.resolution} 
                      onValueChange={handleSelectChange("displayDrivers", "resolution")}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="1080x2400">1080x2400 (FHD+)</SelectItem>
                        <SelectItem value="1440x3168">1440x3168 (QHD+)</SelectItem>
                        <SelectItem value="1080x2340">1080x2340 (FHD+)</SelectItem>
                        <SelectItem value="720x1600">720x1600 (HD+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">Refresh Rate (Hz)</Label>
                    <Input
                      type="number"
                      value={config.displayDrivers.refreshRate}
                      onChange={(e) => handleInputChange("displayDrivers", "refreshRate")(parseInt(e.target.value) || 60)}
                      placeholder="60"
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sensor Drivers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Radar className="text-purple-400" size={20} />
                <h3 className="text-sm font-medium text-slate-300">Sensor Drivers</h3>
              </div>
              <Switch
                checked={config.sensorDrivers.enableSensors}
                onCheckedChange={handleToggleChange("sensorDrivers", "enableSensors")}
              />
            </div>

            {config.sensorDrivers.enableSensors && (
              <div className="space-y-3 ml-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-white text-sm">Accelerometer</span>
                    <Switch
                      checked={config.sensorDrivers.accelerometer}
                      onCheckedChange={handleToggleChange("sensorDrivers", "accelerometer")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-white text-sm">Gyroscope</span>
                    <Switch
                      checked={config.sensorDrivers.gyroscope}
                      onCheckedChange={handleToggleChange("sensorDrivers", "gyroscope")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-white text-sm">Magnetometer</span>
                    <Switch
                      checked={config.sensorDrivers.magnetometer}
                      onCheckedChange={handleToggleChange("sensorDrivers", "magnetometer")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-white text-sm">Proximity Sensor</span>
                    <Switch
                      checked={config.sensorDrivers.proximity}
                      onCheckedChange={handleToggleChange("sensorDrivers", "proximity")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-white text-sm">Ambient Light</span>
                    <Switch
                      checked={config.sensorDrivers.ambient}
                      onCheckedChange={handleToggleChange("sensorDrivers", "ambient")}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Audio Drivers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Volume2 className="text-orange-400" size={20} />
                <h3 className="text-sm font-medium text-slate-300">Audio Drivers</h3>
              </div>
              <Switch
                checked={config.audioDrivers.enableAudio}
                onCheckedChange={handleToggleChange("audioDrivers", "enableAudio")}
              />
            </div>

            {config.audioDrivers.enableAudio && (
              <div className="space-y-4 ml-8">
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-2 block">Audio Codec</Label>
                  <Select 
                    value={config.audioDrivers.codecType} 
                    onValueChange={handleSelectChange("audioDrivers", "codecType")}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select codec" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="wcd9340">WCD9340 (Qualcomm)</SelectItem>
                      <SelectItem value="wcd9370">WCD9370 (Qualcomm)</SelectItem>
                      <SelectItem value="wcd9380">WCD9380 (Qualcomm)</SelectItem>
                      <SelectItem value="cs35l41">CS35L41 (Cirrus Logic)</SelectItem>
                      <SelectItem value="rt5682">RT5682 (Realtek)</SelectItem>
                      <SelectItem value="custom">Custom Codec</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Information Panel */}
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Cpu className="text-cyan-400 mt-1" size={16} />
              <div className="text-sm">
                <h5 className="font-medium text-cyan-400 mb-2">Hardware Driver Notes</h5>
                <ul className="text-slate-300 space-y-1 text-xs">
                  <li>• Camera drivers must match the exact sensor modules in your device</li>
                  <li>• Display panel type affects color calibration and power consumption</li>
                  <li>• Sensor drivers enable motion detection and environmental monitoring</li>
                  <li>• Audio codec selection impacts sound quality and power efficiency</li>
                  <li>• Incorrect drivers may cause hardware malfunction or boot failures</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}