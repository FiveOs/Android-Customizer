import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wifi, Usb, Keyboard, Radio, Shield, Bluetooth, Nfc, Cpu, Activity, Settings, Wrench, Zap, Eye, Smartphone, Terminal } from "lucide-react";

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
  {
    title: "ROM & Recovery Options",
    description: "Custom ROM base, recovery options, and system integrations",
    features: [
      {
        key: "lineageosBase" as const,
        title: "LineageOS Base",
        description: "Build with LineageOS as ROM foundation",
        details: "Uses LineageOS source tree for enhanced compatibility",
        icon: Shield,
        color: "orange",
      },
      {
        key: "nethunterOS" as const,
        title: "NetHunter OS",
        description: "Complete NetHunter ROM (OnePlus devices)",
        details: "Full NetHunter OS ROM for supported OnePlus devices",
        icon: Shield,
        color: "red",
      },
      {
        key: "twrpCustomization" as const,
        title: "TWRP Recovery",
        description: "Custom TWRP with themes and encryption",
        details: "TeamWin Recovery Project with custom themes",
        icon: Settings,
        color: "blue",
      },
      {
        key: "busyboxIncluded" as const,
        title: "BusyBox Integration",
        description: "Essential Unix utilities for Android",
        details: "BusyBox provides essential command-line tools",
        icon: Terminal,
        color: "green",
      },
      {
        key: "gappsSupport" as const,
        title: "Google Apps Support",
        description: "OpenGApps integration support",
        details: "Support for various GApps packages (Pico to Full)",
        icon: Smartphone,
        color: "cyan",
      },
      {
        key: "customBootAnimation" as const,
        title: "Custom Boot Animation",
        description: "NetHunter-themed boot animation",
        details: "Custom boot animation with NetHunter branding",
        icon: Eye,
        color: "purple",
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
    <div className="space-y-8">
      <div className="text-center relative mb-8">
        <div className="inline-flex items-center space-x-3 p-6 bg-slate-900/80 rounded-lg border-2 border-emerald-500/30">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center border-2 border-emerald-500/40">
            <Shield className="text-emerald-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">NetHunter Features</h2>
            <p className="text-emerald-400/80">Configure security features and capabilities for your custom kernel</p>
          </div>
        </div>
      </div>
      
      {featureGroups.map((group, groupIndex) => {
        const groupColors = {
          "NetHunter Core Features": "#FFD700",
          "Advanced NetHunter Features": "#FF7043", 
          "Wireless Drivers": "#4FC3F7",
          "Root & Security": "#9C27B0",
          "Performance & Debugging": "#00E676",
          "Custom Recovery Support": "#FF5722",
          "ROM & Recovery Options": "#FF6900"
        };
        const groupColor = groupColors[group.title as keyof typeof groupColors] || "#4FC3F7";
        
        return (
          <div key={group.title} className="form-section interactive-card">
            <div className="form-section-header">
              <Shield size={18} style={{color: groupColor}} />
              <span style={{color: groupColor}}>{group.title}</span>
              <div className="ml-auto text-xs text-slate-400">
                {group.features.filter(f => features[f.key]).length}/{group.features.length} enabled
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4 -mt-2">{group.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.features.map((feature, featureIndex) => {
                const Icon = feature.icon;
                const isEnabled = features[feature.key];
                
                return (
                  <div
                    key={feature.key}
                    className={`p-4 rounded-lg border-2 cursor-pointer ${
                      isEnabled 
                        ? 'bg-slate-600/50 border-emerald-500/50' 
                        : 'bg-slate-700/40 border-slate-600/60 hover:border-slate-500'
                    }`}
                    onClick={() => handleFeatureChange(feature.key)(!isEnabled)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-200 flex-shrink-0 mt-0.5 ${
                          isEnabled
                            ? `border-emerald-500/50`
                            : `border-slate-500/30`
                        }`} style={{backgroundColor: isEnabled ? `${groupColor}20` : 'rgba(71, 85, 105, 0.3)'}}>
                          <Icon 
                            className={isEnabled ? 'text-emerald-400' : 'text-slate-400'} 
                            size={16}
                            style={{color: isEnabled ? groupColor : undefined}}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white mb-1">{feature.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                      <Switch
                        id={feature.key}
                        checked={isEnabled}
                        onCheckedChange={handleFeatureChange(feature.key)}
                        className="data-[state=checked]:bg-emerald-600 ml-2 flex-shrink-0"
                      />
                    </div>
                    <div className={`text-xs leading-relaxed transition-colors duration-200 ${
                      isEnabled ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {feature.details}
                    </div>
                    {isEnabled && (
                      <div className="mt-2 flex items-center text-xs font-medium" style={{color: groupColor}}>
                        <div className="w-1.5 h-1.5 rounded-full mr-1.5" style={{backgroundColor: groupColor}}></div>
                        Active
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
