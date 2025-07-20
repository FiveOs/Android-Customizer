import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Wifi, Bluetooth, Radio, Usb } from "lucide-react";

interface NetHunterFeaturesProps {
  configuration: any;
  onConfigurationChange: (config: any) => void;
}

const featureGroups = [
  {
    title: "Wireless Security",
    icon: Wifi,
    color: "text-blue-400",
    features: [
      {
        key: "wifiMonitor",
        label: "WiFi Monitor Mode",
        description: "Enable monitor mode for WiFi packet capture",
        advanced: false,
      },
      {
        key: "packetInjection", 
        label: "Packet Injection",
        description: "Inject custom packets into wireless networks",
        advanced: false,
      },
      {
        key: "wirelessDrivers",
        label: "Wireless Drivers",
        description: "RTL8812AU, RT2800USB, ATH9K drivers",
        advanced: false,
      },
    ],
  },
  {
    title: "Hardware Attacks",
    icon: Usb,
    color: "text-red-400",
    features: [
      {
        key: "badUsb",
        label: "BadUSB Support",
        description: "USB Human Interface Device attacks",
        advanced: true,
      },
      {
        key: "hidSupport",
        label: "HID Support",
        description: "Advanced HID device emulation",
        advanced: true,
      },
    ],
  },
  {
    title: "Communication",
    icon: Bluetooth,
    color: "text-purple-400",
    features: [
      {
        key: "bluetoothArsenal",
        label: "Bluetooth Arsenal",
        description: "Bluetooth Low Energy and classic attacks",
        advanced: true,
      },
      {
        key: "nfcHacking",
        label: "NFC Hacking",
        description: "Near Field Communication tools",
        advanced: true,
      },
    ],
  },
  {
    title: "Radio Frequency",
    icon: Radio,
    color: "text-green-400",
    features: [
      {
        key: "sdrSupport",
        label: "SDR Support",
        description: "Software Defined Radio integration",
        advanced: true,
      },
    ],
  },
];

export default function NetHunterFeatures({
  configuration,
  onConfigurationChange,
}: NetHunterFeaturesProps) {
  const handleFeatureChange = (featureKey: string, enabled: boolean) => {
    onConfigurationChange({
      ...configuration,
      netHunterFeatures: {
        ...configuration.netHunterFeatures,
        [featureKey]: enabled,
      },
    });
  };

  return (
    <Card className="bg-slate-900 border-red-500 border-2">
      <CardHeader>
        <CardTitle className="text-red-300 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          NetHunter Security Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {featureGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.title} className="space-y-4">
              <div className="flex items-center space-x-2">
                <Icon className={`h-5 w-5 ${group.color}`} />
                <h3 className="font-semibold text-white">{group.title}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.features.map((feature) => (
                  <div
                    key={feature.key}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={feature.key} className="font-medium text-white">
                          {feature.label}
                        </Label>
                        {feature.advanced && (
                          <Badge variant="secondary" className="text-xs">
                            Advanced
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {feature.description}
                      </p>
                    </div>
                    <Switch
                      id={feature.key}
                      checked={configuration.netHunterFeatures[feature.key]}
                      onCheckedChange={(checked) =>
                        handleFeatureChange(feature.key, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Root Solution Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Root Solution</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: "none", label: "No Root", description: "Stock kernel without root access" },
              { value: "kernelsu", label: "KernelSU", description: "Kernel-level root solution" },
              { value: "magisk", label: "Magisk", description: "Systemless root with modules" },
            ].map((option) => (
              <div
                key={option.value}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  configuration.rootSolution === option.value
                    ? "border-emerald-500 bg-emerald-900/20"
                    : "border-slate-700 bg-slate-800 hover:border-slate-600"
                }`}
                onClick={() =>
                  onConfigurationChange({
                    ...configuration,
                    rootSolution: option.value,
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      configuration.rootSolution === option.value
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-400"
                    }`}
                  />
                  <h4 className="font-medium text-white">{option.label}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-2">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}