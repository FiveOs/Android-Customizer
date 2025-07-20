import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Cpu, 
  HardDrive, 
  Smartphone, 
  History, 
  Shield,
  Users,
  Download,
  Clock,
  CheckCircle
} from "lucide-react";

interface SystemStatus {
  database: string;
  server: string;
  builds: {
    total: number;
    completed: number;
    active: number;
  };
}

export default function HomePage() {
  const { data: status, isLoading } = useQuery<SystemStatus>({
    queryKey: ["/api/status"],
    refetchInterval: 5000,
  });

  const quickActions = [
    {
      title: "Kernel Builder",
      description: "Build custom Android kernels with NetHunter security features",
      icon: Cpu,
      href: "/kernel-builder",
      color: "emerald",
      features: ["NetHunter Integration", "Root Solutions", "100+ Devices"]
    },
    {
      title: "TWRP Customizer", 
      description: "Create custom TWRP recovery images with personalized themes",
      icon: HardDrive,
      href: "/twrp-customizer",
      color: "orange",
      features: ["Custom Themes", "Advanced Features", "Device Support"]
    },
    {
      title: "Android Tool",
      description: "Device management, flashing tools, and recovery operations",
      icon: Smartphone,
      href: "/android-tool",
      color: "blue",
      features: ["Flash Operations", "Root Management", "Quick Actions"]
    },
    {
      title: "Build History",
      description: "Track your kernel and TWRP builds with detailed progress",
      icon: History,
      href: "/build-history", 
      color: "purple",
      features: ["Progress Tracking", "Download Links", "Build Logs"]
    }
  ];

  const stats = [
    {
      title: "Active Builds",
      value: status?.builds.active || 0,
      icon: Clock,
      color: "yellow"
    },
    {
      title: "Completed Builds",
      value: status?.builds.completed || 0,
      icon: CheckCircle,
      color: "green"
    },
    {
      title: "Total Builds",
      value: status?.builds.total || 0,
      icon: Download,
      color: "blue"
    },
    {
      title: "Supported Devices",
      value: "100+",
      icon: Users,
      color: "purple"
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Android Kernel Customizer</h1>
            <p className="text-slate-400">
              Comprehensive platform for building custom Android kernels and recovery images
            </p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-emerald-400">System Status</CardTitle>
          <CardDescription>Current application health and connectivity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Database</span>
                <Badge variant={status?.database === "connected" ? "default" : "destructive"}>
                  {isLoading ? "Checking..." : status?.database || "Unknown"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Server</span>
                <Badge variant="default">Running</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">WebSocket</span>
                <Badge variant="default">Connected</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon className={cn(
                    "h-8 w-8",
                    stat.color === "yellow" && "text-yellow-400",
                    stat.color === "green" && "text-green-400", 
                    stat.color === "blue" && "text-blue-400",
                    stat.color === "purple" && "text-purple-400"
                  )} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={cn(
                        "h-6 w-6",
                        action.color === "emerald" && "text-emerald-400",
                        action.color === "orange" && "text-orange-400",
                        action.color === "blue" && "text-blue-400", 
                        action.color === "purple" && "text-purple-400"
                      )} />
                      <div>
                        <CardTitle className="text-white">{action.title}</CardTitle>
                        <CardDescription className="text-slate-400">
                          {action.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {action.features.map((feature, featureIndex) => (
                      <Badge key={featureIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Link href={action.href}>
                    <Button className={cn(
                      "w-full",
                      action.color === "emerald" && "bg-emerald-600 hover:bg-emerald-700",
                      action.color === "orange" && "bg-orange-600 hover:bg-orange-700",
                      action.color === "blue" && "bg-blue-600 hover:bg-blue-700",
                      action.color === "purple" && "bg-purple-600 hover:bg-purple-700"
                    )}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription>Latest builds and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded bg-slate-800">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <div className="flex-1">
                <p className="text-sm text-white">NetHunter Kernel build completed</p>
                <p className="text-xs text-slate-400">OnePlus 9 Pro • 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded bg-slate-800">
              <Clock className="h-4 w-4 text-yellow-400" />
              <div className="flex-1">
                <p className="text-sm text-white">TWRP build in progress</p>
                <p className="text-xs text-slate-400">Google Pixel 6 • 15 minutes ago</p>
                <Progress value={68} className="mt-2 h-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}