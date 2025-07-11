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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <GitHubHeader />

      {/* Sub Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8 h-12 items-center text-sm">
            <Link href="/" className="flex items-center space-x-2 text-gray-900 dark:text-gray-100 border-b-2 border-orange-500 pb-3">
              <Book className="w-4 h-4" />
              <span>Overview</span>
            </Link>
            <Link href="/kernel-builder" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <Package className="w-4 h-4" />
              <span>Kernels</span>
            </Link>
            <Link href="/android-tool" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <Smartphone className="w-4 h-4" />
              <span>Devices</span>
            </Link>
            <Link href="/build-history" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <History className="w-4 h-4" />
              <span>Builds</span>
            </Link>
            <Link href="/configurations" className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Welcome Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Android Kernel Customizer
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Build custom Android kernels with NetHunter patches, security features, and performance optimizations.
              </p>
              <div className="flex space-x-2">
                <Link href="/kernel-builder">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <GitBranch className="w-4 h-4 mr-2" />
                    New Kernel Build
                  </Button>
                </Link>
                <Button variant="outline">
                  <Book className="w-4 h-4 mr-2" />
                  Read Documentation
                </Button>
              </div>
            </div>

            {/* Pinned Features */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                Pinned Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      NetHunter Integration
                    </h4>
                    <Star className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Full Kali NetHunter patches with WiFi injection, HID attacks, and more
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                    <span className="inline-block w-3 h-3 bg-purple-400 rounded-full mr-2"></span>
                    Security
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      40+ Device Support
                    </h4>
                    <Star className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    OnePlus, Nothing Phone, Fairphone, PinePhone and many more
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                    Compatibility
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Advanced Toolchains
                    </h4>
                    <Star className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    GCC/Clang compilers with LTO, ccache, and optimization options
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                    <span className="inline-block w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                    Performance
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Device Management
                    </h4>
                    <Star className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Live kernel tweaking, recovery flashing, and unbrick solutions
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                    <span className="inline-block w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                    Tools
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                Recent Activity
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-8">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No recent kernel builds</p>
                  <p className="text-xs mt-1">Start building to see your activity here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link href="/kernel-builder">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Kernel Configuration
                  </Button>
                </Link>
                <Link href="/configurations">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <GitFork className="w-4 h-4 mr-2" />
                    Browse Templates
                  </Button>
                </Link>
                <Link href="/android-tool">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Connect Device
                  </Button>
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">WSL Environment</span>
                  <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                    Not Detected
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Build Queue</span>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                    Empty
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Storage</span>
                  <span className="text-gray-900 dark:text-gray-100">75% free</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  WSL2 with Ubuntu required for kernel builds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}