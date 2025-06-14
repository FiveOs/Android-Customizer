import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wifi, Usb, Keyboard, Radio, Shield, Bluetooth, Nfc, Cpu, Activity, Settings, Wrench, Zap, Eye } from "lucide-react";

interface FeatureTogglesProps {
  features: {
    // NetHunter Core Features
    wifiMonitorMode: boolean;
    usbGadget: boolean;
    hidSupport: boolean;
    rtl8812auDriver: boolean;
    
    // Advanced NetHunter Features
    packetInjection: boolean;
    badUSB: boolean;
    wirelessKeylogger: boolean;
    bluetoothArsenal: boolean;
    nfcHacking: boolean;
    sdrSupport: boolean;
    rfAnalyzer: boolean;
    
    // Wireless Drivers
    rtl88xxauDriver: boolean;
    rt2800usbDriver: boolean;
    rt73usbDriver: boolean;
    zd1211rwDriver: boolean;
    ath9kHtcDriver: boolean;
    
    // Root & Security
    kernelSU: boolean;
    magiskIntegration: boolean;
    selinuxPermissive: boolean;
    dmVerityDisable: boolean;
    
    // Performance & Debugging
    kprobeSupport: boolean;
    ftracingSupport: boolean;
    perfCounters: boolean;
    cpuGovernors: boolean;
    
    // Custom Recovery Support
    twrpSupport: boolean;
    recoveryRamdisk: boolean;
  };
  onFeaturesChange: (features: FeatureTogglesProps["features"]) => void;
}

const featureGroups = [
  {
    title: "NetHunter Core",
    description: "Essential penetration testing capabilities",
    features: [
      {
        key: "wifiMonitorMode" as const,
        title: "WiFi Monitor Mode",
        description: "Wireless packet capture",
        details: "CONFIG_PACKET, CONFIG_CFG80211_WEXT for packet monitoring",
        icon: Wifi,
        color: "emerald",
      },
      {
        key: "usbGadget" as const,
        title: "USB Gadget",
        description: "USB device emulation",
        details: "CONFIG_USB_GADGET, CONFIG_USB_CONFIGFS for device mode",
        icon: Usb,
        color: "amber",
      },
      {
        key: "hidSupport" as const,
        title: "HID Support",
        description: "Keyboard/mouse emulation",
        details: "CONFIG_USB_CONFIGFS_F_HID, CONFIG_UHID for HID gadgets",
        icon: Keyboard,
        color: "purple",
      },
      {
        key: "packetInjection" as const,
        title: "Packet Injection",
        description: "Advanced wireless attacks",
        details: "Enables frame injection capabilities for wireless interfaces",
        icon: Zap,
        color: "red",
      },
    ]
  },
  {
    title: "Advanced NetHunter",
    description: "Extended penetration testing tools",
    features: [
      {
        key: "badUSB" as const,
        title: "BadUSB",
        description: "USB attack payloads",
        details: "Enables BadUSB attack capabilities and payload execution",
        icon: Shield,
        color: "red",
      },
      {
        key: "bluetoothArsenal" as const,
        title: "Bluetooth Arsenal",
        description: "Bluetooth testing tools",
        details: "Enhanced Bluetooth stack for security testing",
        icon: Bluetooth,
        color: "blue",
      },
      {
        key: "nfcHacking" as const,
        title: "NFC Tools",
        description: "Near Field Communication",
        details: "NFC reader/writer capabilities for testing",
        icon: Nfc,
        color: "cyan",
      },
      {
        key: "sdrSupport" as const,
        title: "SDR Support",
        description: "Software Defined Radio",
        details: "Support for RTL-SDR and other radio hardware",
        icon: Radio,
        color: "purple",
      },
      {
        key: "wirelessKeylogger" as const,
        title: "Wireless Keylogger",
        description: "Remote keystroke capture",
        details: "Wireless keylogging capabilities for security testing",
        icon: Keyboard,
        color: "red",
      },
      {
        key: "rfAnalyzer" as const,
        title: "RF Analyzer",
        description: "Radio frequency analysis",
        details: "RF spectrum analysis and signal processing tools",
        icon: Activity,
        color: "purple",
      },
    ]
  },
  {
    title: "Wireless Drivers",
    description: "USB WiFi adapter support",
    features: [
      {
        key: "rtl8812auDriver" as const,
        title: "RTL8812AU",
        description: "Realtek 8812AU chipset",
        details: "CONFIG_RTL8812AU for AC1200 USB adapters",
        icon: Wifi,
        color: "green",
      },
      {
        key: "rtl88xxauDriver" as const,
        title: "RTL88XXAU",
        description: "Realtek 88XXAU series",
        details: "Extended Realtek driver support",
        icon: Wifi,
        color: "green",
      },
      {
        key: "rt2800usbDriver" as const,
        title: "RT2800USB",
        description: "Ralink RT2800 chipset",
        details: "CONFIG_RT2800USB for Ralink adapters",
        icon: Radio,
        color: "orange",
      },
      {
        key: "ath9kHtcDriver" as const,
        title: "ATH9K_HTC",
        description: "Atheros AR9271 chipset",
        details: "CONFIG_ATH9K_HTC for TP-Link AC600T1U",
        icon: Radio,
        color: "blue",
      },
    ]
  },
  {
    title: "Root & Security",
    description: "Root access and security modifications",
    features: [
      {
        key: "kernelSU" as const,
        title: "KernelSU",
        description: "Kernel-level root solution",
        details: "Modern kernel-based root with enhanced security",
        icon: Shield,
        color: "emerald",
      },
      {
        key: "magiskIntegration" as const,
        title: "Magisk Support",
        description: "Systemless root integration",
        details: "Kernel patches for Magisk compatibility",
        icon: Wrench,
        color: "blue",
      },
      {
        key: "selinuxPermissive" as const,
        title: "SELinux Permissive",
        description: "Disable SELinux enforcement",
        details: "Sets SELinux to permissive mode for testing",
        icon: Eye,
        color: "yellow",
      },
      {
        key: "dmVerityDisable" as const,
        title: "DM-Verity Disable",
        description: "Disable boot verification",
        details: "Disables Android Verified Boot for custom ROMs",
        icon: Settings,
        color: "red",
      },
    ]
  },
  {
    title: "Performance & Debug",
    description: "Kernel debugging and performance features",
    features: [
      {
        key: "kprobeSupport" as const,
        title: "Kprobe Support",
        description: "Dynamic kernel probes",
        details: "CONFIG_KPROBES for dynamic kernel instrumentation",
        icon: Activity,
        color: "purple",
      },
      {
        key: "ftracingSupport" as const,
        title: "Function Tracing",
        description: "Kernel function tracing",
        details: "CONFIG_FUNCTION_TRACER for performance analysis",
        icon: Eye,
        color: "cyan",
      },
      {
        key: "cpuGovernors" as const,
        title: "CPU Governors",
        description: "Performance scaling",
        details: "Additional CPU frequency governors",
        icon: Cpu,
        color: "orange",
      },
      {
        key: "perfCounters" as const,
        title: "Performance Counters",
        description: "Hardware performance monitoring",
        details: "CONFIG_PERF_EVENTS for performance profiling",
        icon: Activity,
        color: "green",
      },
    ]
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
    <div className="space-y-6">
      {featureGroups.map((group) => (
        <Card key={group.title} className="bg-slate-800 border-slate-700">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-white">{group.title}</CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.features.map((feature) => {
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
      ))}
    </div>
  );
}
