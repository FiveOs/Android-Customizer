import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Smartphone } from "lucide-react";

interface DeviceConfigurationProps {
  configuration: any;
  onConfigurationChange: (config: any) => void;
}

const deviceGroups = [
  {
    label: "OnePlus",
    devices: [
      { value: "oneplus_one", label: "OnePlus One", codename: "bacon", emoji: "📱" },
      { value: "oneplus_2", label: "OnePlus 2", codename: "oneplus2", emoji: "📱" },
      { value: "oneplus_3", label: "OnePlus 3", codename: "oneplus3", emoji: "📱" },
      { value: "oneplus_3t", label: "OnePlus 3T", codename: "oneplus3t", emoji: "📱" },
      { value: "oneplus_5", label: "OnePlus 5", codename: "cheeseburger", emoji: "📱" },
      { value: "oneplus_5t", label: "OnePlus 5T", codename: "dumpling", emoji: "📱" },
      { value: "oneplus_6", label: "OnePlus 6", codename: "enchilada", emoji: "📱" },
      { value: "oneplus_6t", label: "OnePlus 6T", codename: "fajita", emoji: "📱" },
      { value: "oneplus_7", label: "OnePlus 7", codename: "guacamoleb", emoji: "📱" },
      { value: "oneplus_7_pro", label: "OnePlus 7 Pro", codename: "guacamole", emoji: "📱" },
      { value: "oneplus_7t", label: "OnePlus 7T", codename: "hotdogb", emoji: "📱" },
      { value: "oneplus_7t_pro", label: "OnePlus 7T Pro", codename: "hotdog", emoji: "📱" },
      { value: "oneplus_8", label: "OnePlus 8", codename: "instantnoodle", emoji: "📱" },
      { value: "oneplus_8_pro", label: "OnePlus 8 Pro", codename: "instantnoodlep", emoji: "📱" },
      { value: "oneplus_8t", label: "OnePlus 8T", codename: "kebab", emoji: "📱" },
      { value: "oneplus_9", label: "OnePlus 9", codename: "lemonade", emoji: "📱" },
      { value: "oneplus_9_pro", label: "OnePlus 9 Pro", codename: "lemonadep", emoji: "📱" },
      { value: "oneplus_9r", label: "OnePlus 9R", codename: "lemonades", emoji: "📱" },
      { value: "oneplus_nord", label: "OnePlus Nord", codename: "avicii", emoji: "📱" },
    ]
  },
  {
    label: "Google Pixel",
    devices: [
      { value: "pixel_1", label: "Google Pixel", codename: "sailfish", emoji: "📱" },
      { value: "pixel_1_xl", label: "Google Pixel XL", codename: "marlin", emoji: "📱" },
      { value: "pixel_2", label: "Google Pixel 2", codename: "walleye", emoji: "📱" },
      { value: "pixel_2_xl", label: "Google Pixel 2 XL", codename: "taimen", emoji: "📱" },
      { value: "pixel_3", label: "Google Pixel 3", codename: "blueline", emoji: "📱" },
      { value: "pixel_3_xl", label: "Google Pixel 3 XL", codename: "crosshatch", emoji: "📱" },
      { value: "pixel_3a", label: "Google Pixel 3a", codename: "sargo", emoji: "📱" },
      { value: "pixel_3a_xl", label: "Google Pixel 3a XL", codename: "bonito", emoji: "📱" },
      { value: "pixel_4", label: "Google Pixel 4", codename: "flame", emoji: "📱" },
      { value: "pixel_4_xl", label: "Google Pixel 4 XL", codename: "coral", emoji: "📱" },
      { value: "pixel_4a", label: "Google Pixel 4a", codename: "sunfish", emoji: "📱" },
      { value: "pixel_4a_5g", label: "Google Pixel 4a 5G", codename: "bramble", emoji: "📱" },
      { value: "pixel_5", label: "Google Pixel 5", codename: "redfin", emoji: "📱" },
      { value: "pixel_5a", label: "Google Pixel 5a", codename: "barbet", emoji: "📱" },
      { value: "pixel_6", label: "Google Pixel 6", codename: "oriole", emoji: "📱" },
      { value: "pixel_6_pro", label: "Google Pixel 6 Pro", codename: "raven", emoji: "📱" },
      { value: "pixel_6a", label: "Google Pixel 6a", codename: "bluejay", emoji: "📱" },
      { value: "pixel_7", label: "Google Pixel 7", codename: "panther", emoji: "📱" },
      { value: "pixel_7_pro", label: "Google Pixel 7 Pro", codename: "cheetah", emoji: "📱" },
      { value: "pixel_7a", label: "Google Pixel 7a", codename: "lynx", emoji: "📱" },
      { value: "pixel_8", label: "Google Pixel 8", codename: "shiba", emoji: "📱" },
      { value: "pixel_8_pro", label: "Google Pixel 8 Pro", codename: "husky", emoji: "📱" },
    ]
  },
  {
    label: "Google Nexus",
    devices: [
      { value: "nexus_4", label: "Google Nexus 4", codename: "mako", emoji: "📱" },
      { value: "nexus_5", label: "Google Nexus 5", codename: "hammerhead", emoji: "📱" },
      { value: "nexus_5x", label: "Google Nexus 5X", codename: "bullhead", emoji: "📱" },
      { value: "nexus_6", label: "Google Nexus 6", codename: "shamu", emoji: "📱" },
      { value: "nexus_6p", label: "Google Nexus 6P", codename: "angler", emoji: "📱" },
      { value: "nexus_7_2012", label: "Google Nexus 7 (2012)", codename: "grouper", emoji: "📱" },
      { value: "nexus_7_2013", label: "Google Nexus 7 (2013)", codename: "flo", emoji: "📱" },
      { value: "nexus_9", label: "Google Nexus 9", codename: "flounder", emoji: "📱" },
      { value: "nexus_10", label: "Google Nexus 10", codename: "manta", emoji: "📱" },
    ]
  },
  {
    label: "Samsung Galaxy S",
    devices: [
      { value: "galaxy_s8", label: "Samsung Galaxy S8", codename: "dreamlte", emoji: "📱" },
      { value: "galaxy_s8_plus", label: "Samsung Galaxy S8+", codename: "dream2lte", emoji: "📱" },
      { value: "galaxy_s9", label: "Samsung Galaxy S9", codename: "starlte", emoji: "📱" },
      { value: "galaxy_s9_plus", label: "Samsung Galaxy S9+", codename: "star2lte", emoji: "📱" },
      { value: "galaxy_s10", label: "Samsung Galaxy S10", codename: "beyond1lte", emoji: "📱" },
      { value: "galaxy_s10_plus", label: "Samsung Galaxy S10+", codename: "beyond2lte", emoji: "📱" },
      { value: "galaxy_s10e", label: "Samsung Galaxy S10e", codename: "beyond0lte", emoji: "📱" },
      { value: "galaxy_s20", label: "Samsung Galaxy S20", codename: "x1s", emoji: "📱" },
      { value: "galaxy_s20_plus", label: "Samsung Galaxy S20+", codename: "y2s", emoji: "📱" },
      { value: "galaxy_s20_ultra", label: "Samsung Galaxy S20 Ultra", codename: "z3s", emoji: "📱" },
      { value: "galaxy_s21", label: "Samsung Galaxy S21", codename: "o1s", emoji: "📱" },
      { value: "galaxy_s21_plus", label: "Samsung Galaxy S21+", codename: "t2s", emoji: "📱" },
      { value: "galaxy_s21_ultra", label: "Samsung Galaxy S21 Ultra", codename: "p3s", emoji: "📱" },
      { value: "galaxy_s22", label: "Samsung Galaxy S22", codename: "dm1q", emoji: "📱" },
      { value: "galaxy_s22_plus", label: "Samsung Galaxy S22+", codename: "dm2q", emoji: "📱" },
      { value: "galaxy_s22_ultra", label: "Samsung Galaxy S22 Ultra", codename: "dm3q", emoji: "📱" },
      { value: "galaxy_s23", label: "Samsung Galaxy S23", codename: "dm1q", emoji: "📱" },
      { value: "galaxy_s23_plus", label: "Samsung Galaxy S23+", codename: "dm2q", emoji: "📱" },
      { value: "galaxy_s23_ultra", label: "Samsung Galaxy S23 Ultra", codename: "dm3q", emoji: "📱" },
    ]
  },
  {
    label: "Nothing",
    devices: [
      { value: "nothing_phone_1", label: "Nothing Phone (1)", codename: "spacewar", emoji: "📱" },
      { value: "nothing_phone_2", label: "Nothing Phone (2)", codename: "pong", emoji: "📱" },
      { value: "nothing_phone_2a", label: "Nothing Phone (2a)", codename: "pacman", emoji: "📱" },
    ]
  },
  {
    label: "Fairphone",
    devices: [
      { value: "fairphone_2", label: "Fairphone 2", codename: "FP2", emoji: "📱" },
      { value: "fairphone_3", label: "Fairphone 3", codename: "FP3", emoji: "📱" },
      { value: "fairphone_3_plus", label: "Fairphone 3+", codename: "FP3", emoji: "📱" },
      { value: "fairphone_4", label: "Fairphone 4", codename: "FP4", emoji: "📱" },
      { value: "fairphone_5", label: "Fairphone 5", codename: "FP5", emoji: "📱" },
    ]
  },
  {
    label: "Pine64",
    devices: [
      { value: "pinephone", label: "PinePhone", codename: "pinephone", emoji: "📱" },
      { value: "pinephone_pro", label: "PinePhone Pro", codename: "pinephonepro", emoji: "📱" },
      { value: "pinetab", label: "PineTab", codename: "pinetab", emoji: "📱" },
      { value: "pinetab_2", label: "PineTab 2", codename: "pinetab2", emoji: "📱" },
    ]
  }
];

export default function DeviceConfiguration({
  configuration,
  onConfigurationChange,
}: DeviceConfigurationProps) {
  const selectedDevice = deviceGroups
    .flatMap(group => group.devices)
    .find(device => device.value === configuration.device);

  return (
    <Card className="bg-slate-900 border-emerald-500 border-2">
      <CardHeader>
        <CardTitle className="text-emerald-300 flex items-center">
          <Smartphone className="h-5 w-5 mr-2" />
          Device Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="device" className="text-sm font-medium text-slate-300">
              Device
            </Label>
            <Select
              value={configuration.device}
              onValueChange={(value) =>
                onConfigurationChange({ ...configuration, device: value })
              }
            >
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {deviceGroups.map((group) => (
                  <div key={group.label}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 bg-slate-900">
                      {group.label}
                    </div>
                    {group.devices.map((device) => (
                      <SelectItem
                        key={device.value}
                        value={device.value}
                        className="text-white hover:bg-slate-700"
                      >
                        <div className="flex items-center space-x-2">
                          <span>{device.emoji}</span>
                          <span>{device.label}</span>
                          <Badge variant="secondary" className="text-xs">
                            {device.codename}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            {selectedDevice && (
              <div className="text-xs text-slate-400">
                Codename: {selectedDevice.codename}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="android-version" className="text-sm font-medium text-slate-300">
              Android Version
            </Label>
            <Select
              value={configuration.androidVersion}
              onValueChange={(value) =>
                onConfigurationChange({ ...configuration, androidVersion: value })
              }
            >
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="14" className="text-white">Android 14</SelectItem>
                <SelectItem value="13" className="text-white">Android 13</SelectItem>
                <SelectItem value="12" className="text-white">Android 12</SelectItem>
                <SelectItem value="11" className="text-white">Android 11</SelectItem>
                <SelectItem value="10" className="text-white">Android 10</SelectItem>
                <SelectItem value="9" className="text-white">Android 9</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="build-type" className="text-sm font-medium text-slate-300">
              Build Type
            </Label>
            <Select
              value={configuration.buildType}
              onValueChange={(value) =>
                onConfigurationChange({ ...configuration, buildType: value })
              }
            >
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="nethunter" className="text-white">NetHunter Kernel</SelectItem>
                <SelectItem value="performance" className="text-white">Performance Optimized</SelectItem>
                <SelectItem value="battery" className="text-white">Battery Optimized</SelectItem>
                <SelectItem value="custom" className="text-white">Custom Build</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}