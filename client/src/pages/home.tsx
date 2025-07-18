import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  GitBranch, 
  Package, 
  Settings, 
  History, 
  Smartphone,
  Book,
  Star,
  GitFork,
  Plus
} from "lucide-react";
import GitHubHeader from "@/components/github-header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <GitHubHeader />

      {/* NetHunter-style Sub Navigation */}
      <div className="bg-card border-b border-border sticky top-0">
        <div className="px-6">
          <nav className="flex h-12 items-center text-[14px]">
            <Link href="/" className="flex items-center space-x-2 px-4 py-2 border-b-2 border-primary text-foreground font-semibold">
              <Book className="w-4 h-4" />
              <span>Overview</span>
            </Link>
            <Link href="/kernel-builder" className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-accent">
              <Package className="w-4 h-4" />
              <span>Kernels</span>
            </Link>
            <Link href="/android-tool" className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-accent">
              <Smartphone className="w-4 h-4" />
              <span>Devices</span>
            </Link>
            <Link href="/build-history" className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-accent">
              <History className="w-4 h-4" />
              <span>Builds</span>
            </Link>
            <Link href="/configurations" className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-accent">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* NetHunter Main Content */}
      <div className="px-6 py-6">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* NetHunter Command Terminal Style */}
            <div className="border border-border rounded-[6px] bg-card">
              <div className="px-4 py-2 border-b border-border bg-muted">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Book className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[14px] font-semibold text-foreground">README.md</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h1 className="text-[32px] font-semibold text-foreground pb-2 mb-4 border-b border-border">
                  Android Kernel Customizer
                </h1>
                <p className="text-[16px] text-muted-foreground mb-6">
                  Build custom Android kernels with NetHunter patches, security features, and performance optimizations.
                </p>
                <div className="flex space-x-2 mb-8">
                  <Link href="/kernel-builder">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-8 px-3 text-[14px] font-medium">
                      <GitBranch className="w-4 h-4 mr-2" />
                      New Kernel Build
                    </Button>
                  </Link>
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border border-border h-8 px-3 text-[14px] font-medium">
                    <Book className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                </div>
                
                <h2 className="text-[24px] font-semibold text-foreground mb-4">Features</h2>
                <div className="space-y-4 text-[16px]">
                  <div>
                    <h3 className="text-[20px] font-semibold mb-2 text-primary">🔒 NetHunter Integration</h3>
                    <p className="text-muted-foreground">Full Kali NetHunter patches with WiFi injection, HID attacks, and more</p>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-semibold mb-2 text-primary">📱 40+ Device Support</h3>
                    <p className="text-muted-foreground">OnePlus, Nothing Phone, Fairphone, PinePhone and many more</p>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-semibold mb-2 text-primary">⚡ Advanced Toolchains</h3>
                    <p className="text-muted-foreground">GCC/Clang compilers with LTO, ccache, and optimization options</p>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-semibold mb-2 text-primary">🛠️ Device Management</h3>
                    <p className="text-muted-foreground">Live kernel tweaking, recovery flashing, and unbrick solutions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity - NetHunter Style */}
            <div className="mt-6 border border-border rounded-[6px] bg-card">
              <div className="px-4 py-3 border-b border-border bg-muted">
                <h3 className="text-[14px] font-semibold text-foreground">Recent builds</h3>
              </div>
              <div className="p-6 text-center">
                <History className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-[14px] text-muted-foreground">No recent kernel builds</p>
                <p className="text-[12px] text-muted-foreground mt-1">Start building to see your activity here</p>
              </div>
            </div>
          </div>

          {/* NetHunter-style Sidebar */}
          <div className="lg:col-span-1">
            {/* About Section */}
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold text-foreground mb-3">About</h3>
              <p className="text-[14px] text-muted-foreground mb-4">
                Professional Android kernel customization platform with NetHunter patches and security features
              </p>
              <div className="space-y-2 text-[14px]">
                <div className="flex items-center space-x-2">
                  <Book className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">MIT License</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">0 stars</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GitFork className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">0 forks</span>
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold text-foreground mb-3">Resources</h3>
              <div className="space-y-2">
                <Link href="/kernel-builder" className="flex items-center space-x-2 text-[14px] text-primary hover:underline">
                  <GitBranch className="w-4 h-4" />
                  <span>New kernel build</span>
                </Link>
                <Link href="/configurations" className="flex items-center space-x-2 text-[14px] text-primary hover:underline">
                  <Settings className="w-4 h-4" />
                  <span>Browse configurations</span>
                </Link>
                <Link href="/android-tool" className="flex items-center space-x-2 text-[14px] text-primary hover:underline">
                  <Smartphone className="w-4 h-4" />
                  <span>Device tools</span>
                </Link>
              </div>
            </div>

            {/* Languages Section */}
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold text-foreground mb-3">Languages</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                  <span className="text-[12px] text-muted-foreground">TypeScript 65.2%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className="text-[12px] text-muted-foreground">Python 25.8%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  <span className="text-[12px] text-muted-foreground">HTML 9.0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}