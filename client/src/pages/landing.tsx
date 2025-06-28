import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Cpu, Zap, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Android Kernel Customizer
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
            Developed by FiveO
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional-grade Android kernel customization platform with NetHunter integration, 
            designed for security researchers and enthusiasts on Windows platforms.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-4"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
              <CardTitle>NetHunter Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Pre-configured NetHunter patches and wireless security tools integration
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Cpu className="w-12 h-12 mx-auto text-green-600 dark:text-green-400 mb-4" />
              <CardTitle>Device Library</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Extensive collection of device presets for popular Android devices
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="w-12 h-12 mx-auto text-yellow-600 dark:text-yellow-400 mb-4" />
              <CardTitle>WSL Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seamless Windows Subsystem for Linux integration for native build experience
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-purple-600 dark:text-purple-400 mb-4" />
              <CardTitle>Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Open source project with active community support and contributions
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Security & Penetration Testing
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• WiFi monitor mode and packet injection</li>
                <li>• USB HID support for BadUSB attacks</li>
                <li>• Wireless driver collection (RTL8812AU, RT2800USB)</li>
                <li>• Bluetooth and NFC hacking capabilities</li>
                <li>• SDR support for RF analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Advanced Customization
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• KernelSU and Magisk integration</li>
                <li>• Custom CPU governors and I/O schedulers</li>
                <li>• SELinux permissive mode options</li>
                <li>• Performance optimization settings</li>
                <li>• TWRP recovery support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}