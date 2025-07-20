import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Copy, Plus, Search } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import BackButton from "@/components/back-button";

export default function ConfigurationsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: configurations = [], isLoading } = useQuery({
    queryKey: ["/api/configurations"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/configurations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/configurations"] });
      toast({
        title: "Configuration deleted",
        description: "The configuration has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete the configuration.",
        variant: "destructive",
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (config: any) => {
      const newConfig = {
        ...config,
        name: `${config.name} (Copy)`,
      };
      delete newConfig.id;
      delete newConfig.createdAt;
      delete newConfig.updatedAt;
      
      const res = await apiRequest("POST", "/api/configurations", newConfig);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/configurations"] });
      toast({
        title: "Configuration duplicated",
        description: "A copy of the configuration has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Duplicate failed",
        description: "Failed to duplicate the configuration.",
        variant: "destructive",
      });
    },
  });

  const filteredConfigurations = configurations.filter((config: any) =>
    config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.codename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <BackButton to="/" label="Home" className="mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Kernel Configurations
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your saved kernel configurations and build templates
              </p>
            </div>
            <Link href="/kernel-builder">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Configuration
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search configurations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredConfigurations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 dark:text-gray-400">
                {searchTerm ? (
                  <>
                    <p className="text-lg font-medium mb-2">No configurations found</p>
                    <p>Try adjusting your search terms or create a new configuration.</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium mb-2">No configurations yet</p>
                    <p>Create your first kernel configuration to get started.</p>
                    <Link href="/kernel-builder">
                      <Button className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Configuration
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConfigurations.map((config: any) => (
              <Card key={config.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {config.device} ({config.codename})
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateMutation.mutate(config)}
                        disabled={duplicateMutation.isPending}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(config.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {config.features?.wifiMonitorMode && (
                        <Badge variant="secondary">WiFi Monitor</Badge>
                      )}
                      {config.features?.usbGadget && (
                        <Badge variant="secondary">USB Gadget</Badge>
                      )}
                      {config.features?.kernelSU && (
                        <Badge variant="secondary">KernelSU</Badge>
                      )}
                      {config.features?.magiskIntegration && (
                        <Badge variant="secondary">Magisk</Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Kernel: {config.kernelBranch}</p>
                      <p>Arch: {config.kernelArch}</p>
                      <p>Created: {new Date(config.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex space-x-2 pt-3">
                      <Link href={`/kernel-builder?edit=${config.id}`}>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/kernel-builder?clone=${config.id}`}>
                        <Button size="sm" className="flex-1">
                          Build
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}