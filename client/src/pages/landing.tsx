import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, Cpu, Zap, Code, Smartphone, Lock } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Android Kernel Customizer
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Build custom Android kernels with NetHunter security features. 
            A comprehensive platform designed for Windows users with WSL integration.
          </p>
          <Button size="lg" onClick={handleLogin} className="px-8 py-6 text-lg">
            Sign in to Get Started
          </Button>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          <Card>
            <CardHeader>
              <Smartphone className="w-12 h-12 mb-2 text-blue-600" />
              <CardTitle>40+ Device Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Pre-configured support for OnePlus, Nothing Phone, Fairphone, 
                PinePhone and many more devices
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-12 h-12 mb-2 text-green-600" />
              <CardTitle>NetHunter Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete security toolkit with WiFi monitor mode, packet injection, 
                and wireless attack frameworks
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Cpu className="w-12 h-12 mb-2 text-purple-600" />
              <CardTitle>Advanced Toolchain</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                GCC and Clang support with optimization levels, ccache integration, 
                and Link Time Optimization
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="w-12 h-12 mb-2 text-red-600" />
              <CardTitle>Root Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                KernelSU and Magisk integration with hide root, Zygisk, 
                and deny list capabilities
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-12 h-12 mb-2 text-yellow-600" />
              <CardTitle>Real-time Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                WebSocket-powered build monitoring with live logs and 
                progress tracking
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="w-12 h-12 mb-2 text-indigo-600" />
              <CardTitle>WSL2 Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seamless Windows Subsystem for Linux integration for 
                native compilation performance
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />

      {/* NetHunter Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">NetHunter Capabilities</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Badge variant="secondary" className="p-3 justify-center">WiFi Monitor Mode</Badge>
            <Badge variant="secondary" className="p-3 justify-center">Packet Injection</Badge>
            <Badge variant="secondary" className="p-3 justify-center">BadUSB Support</Badge>
            <Badge variant="secondary" className="p-3 justify-center">HID Attacks</Badge>
            <Badge variant="secondary" className="p-3 justify-center">Bluetooth Arsenal</Badge>
            <Badge variant="secondary" className="p-3 justify-center">NFC Hacking</Badge>
            <Badge variant="secondary" className="p-3 justify-center">SDR Support</Badge>
            <Badge variant="secondary" className="p-3 justify-center">RF Analyzer</Badge>
            <Badge variant="secondary" className="p-3 justify-center">RTL8812AU Driver</Badge>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p className="mb-2">Developed by FiveO</p>
        <a 
          href="https://github.com/FiveOs/android-kernel-customizer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}