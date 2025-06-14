import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wifi, Usb, Keyboard, Radio } from "lucide-react";

interface FeatureTogglesProps {
  features: {
    wifiMonitorMode: boolean;
    usbGadget: boolean;
    hidSupport: boolean;
    rtl8812auDriver: boolean;
  };
  onFeaturesChange: (features: FeatureTogglesProps["features"]) => void;
}

const featureConfigs = [
  {
    key: "wifiMonitorMode" as const,
    title: "WiFi Monitor Mode",
    description: "Enable wireless packet capture",
    details: "Enables CONFIG_PACKET, CONFIG_CFG80211_WEXT, and related wireless monitoring capabilities.",
    icon: Wifi,
    color: "emerald",
  },
  {
    key: "usbGadget" as const,
    title: "USB Gadget Support",
    description: "Enable USB device emulation",
    details: "Enables CONFIG_USB_GADGET, CONFIG_USB_CONFIGFS for USB device mode functionality.",
    icon: Usb,
    color: "amber",
  },
  {
    key: "hidSupport" as const,
    title: "HID Support",
    description: "Human Interface Device emulation",
    details: "Enables CONFIG_USB_CONFIGFS_F_HID, CONFIG_UHID for keyboard/mouse emulation.",
    icon: Keyboard,
    color: "purple",
  },
  {
    key: "rtl8812auDriver" as const,
    title: "RTL8812AU Driver",
    description: "External WiFi adapter support",
    details: "Enables CONFIG_RTL8812AU for external USB WiFi adapters with monitor mode.",
    icon: Radio,
    color: "red",
  },
];

export default function FeatureToggles({ features, onFeaturesChange }: FeatureTogglesProps) {
  const handleFeatureChange = (key: keyof typeof features) => (checked: boolean) => {
    onFeaturesChange({
      ...features,
      [key]: checked,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-white">NetHunter Features</CardTitle>
        <CardDescription>Enable security testing and penetration testing capabilities</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureConfigs.map((feature) => {
            const Icon = feature.icon;
            const isEnabled = features[feature.key];
            
            return (
              <div
                key={feature.key}
                className="p-4 bg-slate-700/50 rounded-lg border border-slate-600"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 bg-${feature.color}-500/20 rounded-lg flex items-center justify-center`}>
                      <Icon className={`text-${feature.color}-400`} size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{feature.title}</h4>
                      <p className="text-xs text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={feature.key}
                      checked={isEnabled}
                      onCheckedChange={handleFeatureChange(feature.key)}
                    />
                    <Label htmlFor={feature.key} className="sr-only">
                      {feature.title}
                    </Label>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {feature.details}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
