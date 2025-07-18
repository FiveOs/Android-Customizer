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
    <div className="space-y-6 slide-in-effect">
      <div className="text-center relative mb-8">
        <div className="inline-flex items-center space-x-3 p-4 bg-slate-900/50 rounded-xl border border-emerald-500/20 float-effect">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 pulse-glow-effect">
            <Shield className="text-emerald-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">NetHunter Features</h2>
            <p className="text-emerald-400/80">Configure security features and capabilities for your custom kernel</p>
          </div>
        </div>
      </div>
      
      {featureGroups.map((group, groupIndex) => (
        <Card key={group.title} className="bg-slate-800/90 border-emerald-500/20 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300 slide-in-effect" style={{animationDelay: `${groupIndex * 0.1}s`}}>
          <CardHeader className="border-b border-emerald-500/20 bg-slate-900/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                <Shield className="text-emerald-400" size={20} />
              </div>
              <div>
                <CardTitle className="text-white text-xl">{group.title}</CardTitle>
                <CardDescription className="text-emerald-400/70">{group.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.features.map((feature, featureIndex) => {
                const Icon = feature.icon;
                const isEnabled = features[feature.key];
                
                return (
                  <div
                    key={feature.key}
                    className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer ${
                      isEnabled 
                        ? 'bg-emerald-900/30 border-emerald-500/40 glow-effect' 
                        : 'bg-slate-700/50 border-slate-600 hover:border-emerald-500/30'
                    }`}
                    style={{animationDelay: `${(groupIndex * 0.1) + (featureIndex * 0.05)}s`}}
                    onClick={() => handleFeatureChange(feature.key)(!isEnabled)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                          isEnabled
                            ? `bg-emerald-500/30 border-emerald-500/50`
                            : `bg-slate-600/30 border-slate-500/50`
                        }`}>
                          <Icon className={isEnabled ? 'text-emerald-400' : 'text-slate-400'} size={18} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{feature.title}</h4>
                          <p className="text-sm text-slate-400">{feature.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={feature.key}
                          checked={isEnabled}
                          onCheckedChange={handleFeatureChange(feature.key)}
                          className="data-[state=checked]:bg-emerald-600"
                        />
                        <Label htmlFor={feature.key} className="sr-only">
                          {feature.title}
                        </Label>
                      </div>
                    </div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isEnabled ? 'text-emerald-400/80' : 'text-slate-500'
                    }`}>
                      {feature.details}
                    </div>
                    {isEnabled && (
                      <div className="mt-2 text-xs text-emerald-400 font-medium">
                        ✓ Enabled
                      </div>
                    )}
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
