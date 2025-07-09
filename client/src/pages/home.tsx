import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Settings, Plus, History, LogOut, Smartphone } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Android Kernel Customizer <span className="text-sm font-normal text-gray-500 dark:text-gray-400">by FiveO</span>
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {(user as any)?.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {(user as any)?.username || 'User'}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  await fetch('/api/logout', { method: 'POST' });
                  window.location.reload();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/kernel-builder">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <CardTitle>New Kernel Build</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create a new Android kernel configuration with NetHunter patches and custom features
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/configurations">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <CardTitle>Saved Configurations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View and manage your saved kernel configurations and build templates
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/build-history">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <History className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <CardTitle>Build History</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Review past kernel builds, download outputs, and check build logs
                </CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/android-tool">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  <CardTitle>Android Device Tool</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Direct device management, kernel tweaking, recovery flashing, and Magisk operations
                </CardDescription>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest kernel builds and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">OnePlus 7 Pro NetHunter</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Built 2 hours ago</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                    Success
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Pixel 6 Custom</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Built yesterday</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                    Failed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current build environment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">WSL Environment</span>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                    Not Available
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Build Queue</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                    Empty
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Storage Space</span>
                  <span className="text-gray-700 dark:text-gray-300">24.5 GB available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}