import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Settings, Plus, History, LogOut, Smartphone, Hammer, Code, Shield, Cpu, Wifi, Package } from "lucide-react";
import logoPath from "@assets/ChatGPT Image Jul 12, 2025, 06_41_01 AM_1752273692249.png";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={logoPath} alt="Android Kernel Customizer" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Android Kernel Customizer
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">by FiveO</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={(user as any)?.profileImageUrl} />
                  <AvatarFallback>
                    {(user as any)?.firstName?.[0]?.toUpperCase() || (user as any)?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.location.href = '/api/logout';
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <img src={logoPath} alt="Android Kernel Customizer" className="w-32 h-32 mx-auto mb-6 object-contain" />
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Android Kernel Customizer
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Build custom Android kernels with advanced security features, NetHunter patches, and performance optimizations.
            Designed for security researchers and Android enthusiasts.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Hammer className="w-5 h-5 mr-2" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/kernel-builder">
              <Button className="w-full h-24 flex flex-col items-center justify-center space-y-2" variant="default">
                <Plus className="w-8 h-8" />
                <span className="text-sm font-medium">New Kernel Build</span>
              </Button>
            </Link>
            <Link href="/configurations">
              <Button className="w-full h-24 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Settings className="w-8 h-8" />
                <span className="text-sm font-medium">Saved Configs</span>
              </Button>
            </Link>
            <Link href="/build-history">
              <Button className="w-full h-24 flex flex-col items-center justify-center space-y-2" variant="outline">
                <History className="w-8 h-8" />
                <span className="text-sm font-medium">Build History</span>
              </Button>
            </Link>
            <Link href="/android-tool">
              <Button className="w-full h-24 flex flex-col items-center justify-center space-y-2" variant="outline">
                <Smartphone className="w-8 h-8" />
                <span className="text-sm font-medium">Device Tool</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Categories */}
        <Tabs defaultValue="kernel" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kernel">Kernel Building</TabsTrigger>
            <TabsTrigger value="security">Security Features</TabsTrigger>
            <TabsTrigger value="device">Device Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kernel" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle>Custom Kernel Configuration</CardTitle>
                      <CardDescription>Build kernels for 40+ supported devices</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• OnePlus, Nothing Phone, Fairphone, PinePhone</li>
                    <li>• GCC and Clang compiler support</li>
                    <li>• Link Time Optimization (LTO)</li>
                    <li>• ccache integration for faster builds</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle>Build Output Options</CardTitle>
                      <CardDescription>Multiple output formats available</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Boot image generation</li>
                    <li>• Kernel-only builds</li>
                    <li>• Module packages</li>
                    <li>• Full installation packages</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle>NetHunter Security Features</CardTitle>
                      <CardDescription>Advanced security research capabilities</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• WiFi monitor mode & packet injection</li>
                    <li>• BadUSB & HID attack support</li>
                    <li>• NFC hacking capabilities</li>
                    <li>• SDR & RF analysis tools</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                      <Wifi className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <CardTitle>Wireless Driver Support</CardTitle>
                      <CardDescription>Extensive hardware compatibility</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• RTL8812AU, RT2800USB</li>
                    <li>• ATH9K, MT7601U</li>
                    <li>• Bluetooth arsenal</li>
                    <li>• Custom driver injection</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="device" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <Smartphone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle>Direct Device Control</CardTitle>
                      <CardDescription>Real-time ADB/Fastboot operations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Live kernel parameter tweaking</li>
                    <li>• TWRP & custom recovery flashing</li>
                    <li>• Magisk installation & management</li>
                    <li>• Device unbrick solutions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                      <Cpu className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <CardTitle>Root Solutions</CardTitle>
                      <CardDescription>Multiple root method support</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• KernelSU with manager app</li>
                    <li>• Magisk with Zygisk support</li>
                    <li>• Root hiding & deny lists</li>
                    <li>• Boot image patching</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Activity & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest kernel builds and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent builds</p>
                  <p className="text-sm mt-2">Start your first kernel build to see activity here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="w-5 h-5 mr-2" />
                System Status
              </CardTitle>
              <CardDescription>Current build environment and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">WSL Environment</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Checking...</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Build Queue</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">0 jobs</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Disk Space</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">100GB required</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Ready to build custom Android kernels
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}