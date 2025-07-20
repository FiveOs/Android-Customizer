import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Zap, Cpu } from "lucide-react";

interface TabbedDeviceSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface DeviceGroup {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  devices: Array<{
    value: string;
    label: string;
    emoji: string;
    specs: string;
  }>;
}

const deviceGroups: DeviceGroup[] = [
  {
    id: "oneplus",
    name: "OnePlus",
    icon: Zap,
    color: "#FF7043",
    devices: [
      { value: "oneplus_one", label: "OnePlus One ⭐", emoji: "🥇", specs: "SD 801 • 3GB • NetHunter OS" },
      { value: "oneplus_7", label: "OnePlus 7 ⭐", emoji: "⚡", specs: "SD 855 • 8GB • NetHunter OS" },
      { value: "oneplus_7_pro", label: "OnePlus 7 Pro ⭐", emoji: "👑", specs: "SD 855 • 12GB • NetHunter OS" },
      { value: "oneplus_nord", label: "OnePlus Nord ⭐", emoji: "🔥", specs: "SD 765G • 12GB • NetHunter OS" },
      { value: "oneplus_2", label: "OnePlus 2", emoji: "📱", specs: "SD 810 • 4GB" },
      { value: "oneplus_3", label: "OnePlus 3", emoji: "📱", specs: "SD 820 • 6GB" },
      { value: "oneplus_3t", label: "OnePlus 3T", emoji: "📱", specs: "SD 821 • 6GB" },
      { value: "oneplus_5", label: "OnePlus 5", emoji: "📱", specs: "SD 835 • 8GB" },
      { value: "oneplus_5t", label: "OnePlus 5T", emoji: "📱", specs: "SD 835 • 8GB" },
      { value: "oneplus_6", label: "OnePlus 6", emoji: "📱", specs: "SD 845 • 8GB" },
      { value: "oneplus_6t", label: "OnePlus 6T", emoji: "📱", specs: "SD 845 • 8GB" },
      { value: "oneplus_7t", label: "OnePlus 7T", emoji: "📱", specs: "SD 855+ • 8GB" },
      { value: "oneplus_7t_pro", label: "OnePlus 7T Pro", emoji: "📱", specs: "SD 855+ • 12GB" },
      { value: "oneplus_8", label: "OnePlus 8", emoji: "📱", specs: "SD 865 • 12GB" },
      { value: "oneplus_8_pro", label: "OnePlus 8 Pro", emoji: "📱", specs: "SD 865 • 12GB" },
      { value: "oneplus_8t", label: "OnePlus 8T", emoji: "📱", specs: "SD 865 • 12GB" },
      { value: "oneplus_9", label: "OnePlus 9", emoji: "📱", specs: "SD 888 • 12GB" },
      { value: "oneplus_9_pro", label: "OnePlus 9 Pro", emoji: "📱", specs: "SD 888 • 12GB" },
      { value: "oneplus_10_pro", label: "OnePlus 10 Pro", emoji: "🚀", specs: "SD 8 Gen 1 • 12GB" },
      { value: "oneplus_11", label: "OnePlus 11", emoji: "💫", specs: "SD 8 Gen 2 • 16GB" }
    ]
  },
  {
    id: "google",
    name: "Google Pixel",
    icon: Smartphone,
    color: "#4285F4",
    devices: [
      { value: "pixel_7", label: "Pixel 7", emoji: "📱", specs: "Tensor G2 • 8GB" },
      { value: "pixel_7_pro", label: "Pixel 7 Pro", emoji: "👑", specs: "Tensor G2 • 12GB" },
      { value: "pixel_6", label: "Pixel 6", emoji: "📱", specs: "Tensor • 8GB" },
      { value: "pixel_6_pro", label: "Pixel 6 Pro", emoji: "👑", specs: "Tensor • 12GB" },
      { value: "pixel_5", label: "Pixel 5", emoji: "📱", specs: "SD 765G • 8GB" },
      { value: "pixel_4", label: "Pixel 4", emoji: "📱", specs: "SD 855 • 6GB" },
      { value: "pixel_4_xl", label: "Pixel 4 XL", emoji: "📱", specs: "SD 855 • 6GB" },
      { value: "nexus_6p", label: "Nexus 6P", emoji: "📱", specs: "SD 810 • 3GB" },
      { value: "nexus_5x", label: "Nexus 5X", emoji: "📱", specs: "SD 808 • 2GB" }
    ]
  },
  {
    id: "samsung",
    name: "Samsung Galaxy",
    icon: Smartphone,
    color: "#1428A0",
    devices: [
      { value: "galaxy_s21", label: "Galaxy S21", emoji: "📱", specs: "Exynos 2100 • 8GB" },
      { value: "galaxy_s21_ultra", label: "Galaxy S21 Ultra", emoji: "👑", specs: "Exynos 2100 • 16GB" },
      { value: "galaxy_s20", label: "Galaxy S20", emoji: "📱", specs: "Exynos 990 • 12GB" },
      { value: "galaxy_s10", label: "Galaxy S10", emoji: "📱", specs: "Exynos 9820 • 8GB" },
      { value: "galaxy_s9", label: "Galaxy S9", emoji: "📱", specs: "Exynos 9810 • 4GB" },
      { value: "galaxy_note_20", label: "Galaxy Note 20", emoji: "📝", specs: "Exynos 990 • 8GB" }
    ]
  },
  {
    id: "nothing",
    name: "Nothing",
    icon: Smartphone,
    color: "#4FC3F7",
    devices: [
      { value: "nothing_phone_1", label: "Phone (1)", emoji: "✨", specs: "SD 778G+ • 12GB" },
      { value: "nothing_phone_2", label: "Phone (2)", emoji: "💎", specs: "SD 8+ Gen 1 • 12GB" },
      { value: "nothing_phone_2a", label: "Phone (2a)", emoji: "🌟", specs: "Dimensity 7200 • 12GB" }
    ]
  },
  {
    id: "fairphone",
    name: "Fairphone",
    icon: Cpu,
    color: "#00C851",
    devices: [
      { value: "fairphone_5", label: "Fairphone 5", emoji: "♻️", specs: "QCM6490 • 8GB" },
      { value: "fairphone_4", label: "Fairphone 4", emoji: "🌱", specs: "SD 750G • 8GB" },
      { value: "fairphone_3", label: "Fairphone 3", emoji: "🌿", specs: "SD 632 • 4GB" }
    ]
  },
  {
    id: "pine64",
    name: "Pine64",
    icon: Cpu,
    color: "#8BC34A",
    devices: [
      { value: "pinephone_pro", label: "PinePhone Pro", emoji: "🍍", specs: "RK3399S • 4GB" },
      { value: "pinephone", label: "PinePhone", emoji: "🍍", specs: "A64 • 3GB" }
    ]
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    icon: Smartphone,
    color: "#FF6900",
    devices: [
      { value: "mi_11", label: "Mi 11", emoji: "📱", specs: "SD 888 • 12GB" },
      { value: "redmi_note_11", label: "Redmi Note 11", emoji: "📱", specs: "SD 695 • 8GB" },
      { value: "poco_f3", label: "POCO F3", emoji: "🚀", specs: "SD 870 • 8GB" }
    ]
  },
  {
    id: "other",
    name: "Others",
    icon: Smartphone,
    color: "#9E9E9E",
    devices: [
      { value: "essential_ph1", label: "Essential PH-1", emoji: "📱", specs: "SD 835 • 4GB" },
      { value: "moto_g_power", label: "Moto G Power", emoji: "🔋", specs: "SD 665 • 4GB" },
      { value: "xperia_1_iii", label: "Xperia 1 III", emoji: "📱", specs: "SD 888 • 12GB" },
      { value: "lg_g8", label: "LG G8", emoji: "📱", specs: "SD 855 • 6GB" },
      { value: "htc_u11", label: "HTC U11", emoji: "📱", specs: "SD 835 • 6GB" },
      { value: "zenfone_8", label: "ZenFone 8", emoji: "📱", specs: "SD 888 • 16GB" },
      { value: "rog_phone_5", label: "ROG Phone 5", emoji: "🎮", specs: "SD 888 • 18GB" }
    ]
  }
];

export default function TabbedDeviceSelector({ value, onChange }: TabbedDeviceSelectorProps) {
  const [activeTab, setActiveTab] = useState("oneplus");
  
  const currentGroup = deviceGroups.find(g => g.id === activeTab);
  const selectedDevice = deviceGroups.flatMap(g => g.devices).find(d => d.value === value);

  return (
    <div className="form-section interactive-card">
      <div className="form-section-header">
        <Smartphone size={18} style={{color: '#4FC3F7'}} />
        <span>Device Selection</span>
        <div className="ml-auto text-xs text-slate-400">
          Choose your target device
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4">
        {deviceGroups.map((group) => {
          const Icon = group.icon;
          return (
            <button
              key={group.id}
              className={`tab-button ${activeTab === group.id ? 'active' : ''}`}
              onClick={() => setActiveTab(group.id)}
              style={{
                borderBottomColor: activeTab === group.id ? group.color : 'transparent'
              }}
            >
              <Icon size={16} className="mr-2" style={{ color: group.color }} />
              {group.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {currentGroup && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="section-title">{currentGroup.name} Series</h4>
              <div className="text-xs text-slate-400">
                {currentGroup.devices.length} devices available
              </div>
            </div>
            
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="w-full min-h-[48px]">
                <SelectValue placeholder={`Select ${currentGroup.name} device`}>
                  {selectedDevice && (
                    <div className="flex items-center space-x-2">
                      <span>{selectedDevice.emoji}</span>
                      <span>{selectedDevice.label}</span>
                      <span className="text-xs text-slate-400">• {selectedDevice.specs}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {currentGroup.devices.map((device) => (
                  <SelectItem 
                    key={device.value} 
                    value={device.value}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span>{device.emoji}</span>
                        <span className="font-medium">{device.label}</span>
                      </div>
                      <div className="text-xs text-slate-400 ml-6">
                        {device.specs}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Device Preview */}
            {selectedDevice && (
              <div className="mt-3 p-3 bg-slate-600/30 rounded-lg border border-slate-500/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{selectedDevice.emoji}</span>
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{selectedDevice.label}</div>
                    <div className="text-xs text-slate-400">{selectedDevice.specs}</div>
                    <div className="text-xs text-emerald-400 mt-1">✓ NetHunter Compatible</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}