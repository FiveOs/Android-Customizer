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
      { value: "oneplus_nord", label: "Nord", emoji: "🔥", specs: "SD 765G • 12GB" },
      { value: "oneplus_9", label: "OnePlus 9", emoji: "⚡", specs: "SD 888 • 12GB" },
      { value: "oneplus_10_pro", label: "OnePlus 10 Pro", emoji: "🚀", specs: "SD 8 Gen 1 • 12GB" },
      { value: "oneplus_11", label: "OnePlus 11", emoji: "💫", specs: "SD 8 Gen 2 • 16GB" }
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
    color: "#FFD700",
    devices: [
      { value: "fairphone_4", label: "Fairphone 4", emoji: "🌱", specs: "SD 750G • 8GB" },
      { value: "fairphone_5", label: "Fairphone 5", emoji: "♻️", specs: "QCM6490 • 8GB" }
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
              <SelectTrigger className="dropdown-animate bg-slate-700/60 border-slate-600 text-white h-10" style={{zIndex: 10}}>
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
              <SelectContent 
                className="dropdown-content border-slate-600" 
                style={{
                  zIndex: 9999,
                  backgroundColor: 'rgb(30, 41, 59)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 8px 16px rgba(0, 0, 0, 0.6)'
                }}
              >
                {currentGroup.devices.map((device) => (
                  <SelectItem 
                    key={device.value} 
                    value={device.value}
                    className="hover:bg-emerald-500/20 py-3"
                    style={{
                      backgroundColor: 'rgb(30, 41, 59)',
                      color: 'white'
                    }}
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