import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Cpu, 
  HardDrive, 
  Smartphone, 
  History, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield
} from "lucide-react";

const navigationItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/kernel-builder", label: "Kernel Builder", icon: Cpu },
  { path: "/twrp-customizer", label: "TWRP Customizer", icon: HardDrive },
  { path: "/android-tool", label: "Android Tool", icon: Smartphone },
  { path: "/build-history", label: "Build History", icon: History },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-full bg-slate-900 border-r border-slate-800 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-emerald-400" />
              <h1 className="font-bold text-sm text-emerald-400">
                Android Kernel Customizer
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left transition-colors",
                    collapsed && "px-2",
                    isActive 
                      ? "bg-emerald-900/50 text-emerald-400 border border-emerald-500/20" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Status Indicator */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400">Online</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}