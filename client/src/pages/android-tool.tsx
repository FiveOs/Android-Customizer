import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import BackButton from "@/components/back-button";
import { 
  Smartphone, 
  Settings, 
  Download, 
  Upload, 
  Zap, 
  Shield, 
  Terminal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface DeviceInfo {
  model: string;
  androidVersion: string;
  buildId: string;
  securityPatch: string;
  kernelVersion: string;
  bootloader: string;
  isRooted: boolean;
  bootloaderUnlocked: boolean;
}

export default function AndroidToolPage() {
  const { toast } = useToast();
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeOperations, setActiveOperations] = useState<Set<string>>(new Set());
  const [operationLogs, setOperationLogs] = useState<Record<string, string[]>>({});
  
  // Kernel tweaking form state
  const [kernelParams, setKernelParams] = useState({
    cpuGovernor: "",
    ioScheduler: "",
    tcpCongestion: ""
  });

  // File paths state
  const [filePaths, setFilePaths] = useState({
    recoveryImage: "",
    bootImage: "",
    magiskBoot: "",
    magiskZip: ""
  });

  // WebSocket for real-time updates
  const { socket, isConnected: wsConnected } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "android_tool_update") {
          const { operationId, type: updateType, message, data: updateData } = data;
          
          setOperationLogs(prev => ({
            ...prev,
            [operationId]: [...(prev[operationId] || []), message || updateData]
          }));

          if (updateType === "success" || updateType === "error" || updateType === "cancelled") {
            setActiveOperations(prev => {
              const newSet = new Set(prev);
              newSet.delete(operationId);
              return newSet;
            });
          }
        }
      };
    }
  }, [socket]);

  const { data: connectivity, refetch: refetchConnectivity } = useQuery({
    queryKey: ["/api/android/device/connectivity"],
    refetchInterval: 5000,
  });

  const deviceInfoQuery = useQuery({
    queryKey: ["/api/android/device/info"],
    enabled: connectivity?.connected,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (connectivity?.connected) {
      setIsConnected(true);
      if (deviceInfoQuery.data) {
        setDeviceInfo(deviceInfoQuery.data);
      }
    } else {
      setIsConnected(false);
      setDeviceInfo(null);
    }
  }, [connectivity, deviceInfoQuery.data]);

  const tweakKernelMutation = useMutation({
    mutationFn: async (params: typeof kernelParams) => {
      const response = await apiRequest("POST", "/api/android/kernel/tweak", params);
      return response.json();
    },
    onSuccess: (data) => {
      setActiveOperations(prev => new Set(prev).add(data.operationId));
      toast({
        title: "Kernel tweaking started",
        description: "Real-time progress will be shown below.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to start kernel tweaking",
        variant: "destructive",
      });
    },
  });

  const flashRecoveryMutation = useMutation({
    mutationFn: async (recoveryImagePath: string) => {
      const response = await apiRequest("POST", "/api/android/recovery/flash", { recoveryImagePath });
      return response.json();
    },
    onSuccess: (data) => {
      setActiveOperations(prev => new Set(prev).add(data.operationId));
      toast({
        title: "Recovery flashing started",
        description: "Real-time progress will be shown below.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to start recovery flashing",
        variant: "destructive",
      });
    },
  });

  const patchBootMutation = useMutation({
    mutationFn: async (params: { bootImagePath: string; magiskBootPath: string }) => {
      const response = await apiRequest("POST", "/api/android/boot/patch", params);
      return response.json();
    },
    onSuccess: (data) => {
      setActiveOperations(prev => new Set(prev).add(data.operationId));
      toast({
        title: "Boot image patching started",
        description: "Real-time progress will be shown below.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to start boot patching",
        variant: "destructive",
      });
    },
  });

  const sideloadMagiskMutation = useMutation({
    mutationFn: async (magiskZipPath: string) => {
      const response = await apiRequest("POST", "/api/android/magisk/sideload", { magiskZipPath });
      return response.json();
    },
    onSuccess: (data) => {
      setActiveOperations(prev => new Set(prev).add(data.operationId));
      toast({
        title: "Magisk sideloading started",
        description: "Real-time progress will be shown below.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to start Magisk sideloading",
        variant: "destructive",
      });
    },
  });

  const dumpBootMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/android/boot/dump", {});
      return response.json();
    },
    onSuccess: (data) => {
      setActiveOperations(prev => new Set(prev).add(data.operationId));
      toast({
        title: "Boot image dumping started",
        description: "Real-time progress will be shown below.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to start boot dumping",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (isConnected: boolean) => {
    return isConnected ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <BackButton to="/" label="Home" className="mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Android Device Tool
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Direct device management, kernel tweaking, and ROM operations
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(isConnected)}
              <span className="text-sm">
                {isConnected ? "Device Connected" : "No Device"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchConnectivity()}
                disabled={deviceInfoQuery.isLoading}
              >
                {deviceInfoQuery.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                No Android Device Detected
              </CardTitle>
              <CardDescription>
                Please connect your Android device with USB debugging enabled and ADB drivers installed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Setup Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>Enable Developer Options on your Android device</li>
                    <li>Enable USB Debugging in Developer Options</li>
                    <li>Connect device via USB cable</li>
                    <li>Allow USB debugging when prompted on device</li>
                    <li>Install ADB drivers if needed</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Device Information Card */}
            {deviceInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Device Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Model</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{deviceInfo.model}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Android Version</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{deviceInfo.androidVersion}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Build ID</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{deviceInfo.buildId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Security Patch</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{deviceInfo.securityPatch}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Kernel Version</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{deviceInfo.kernelVersion}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Bootloader</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{deviceInfo.bootloader}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex gap-4">
                    <Badge variant={deviceInfo.isRooted ? "default" : "secondary"}>
                      {deviceInfo.isRooted ? "Rooted" : "Not Rooted"}
                    </Badge>
                    <Badge variant={deviceInfo.bootloaderUnlocked ? "default" : "secondary"}>
                      {deviceInfo.bootloaderUnlocked ? "Bootloader Unlocked" : "Bootloader Status Unknown"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Tool Tabs */}
            <Tabs defaultValue="kernel" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="kernel" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Kernel Tweaks
                </TabsTrigger>
                <TabsTrigger value="recovery" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Recovery
                </TabsTrigger>
                <TabsTrigger value="magisk" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Magisk
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Operation Logs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="kernel">
                <Card>
                  <CardHeader>
                    <CardTitle>Kernel Parameter Tweaking</CardTitle>
                    <CardDescription>
                      Modify live kernel parameters for performance optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cpuGovernor">CPU Governor</Label>
                        <Select value={kernelParams.cpuGovernor} onValueChange={(value) => setKernelParams(prev => ({ ...prev, cpuGovernor: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select governor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="powersave">Powersave</SelectItem>
                            <SelectItem value="ondemand">On Demand</SelectItem>
                            <SelectItem value="conservative">Conservative</SelectItem>
                            <SelectItem value="userspace">Userspace</SelectItem>
                            <SelectItem value="schedutil">Schedutil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ioScheduler">I/O Scheduler</Label>
                        <Select value={kernelParams.ioScheduler} onValueChange={(value) => setKernelParams(prev => ({ ...prev, ioScheduler: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select scheduler" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="noop">NOOP</SelectItem>
                            <SelectItem value="deadline">Deadline</SelectItem>
                            <SelectItem value="cfq">CFQ</SelectItem>
                            <SelectItem value="bfq">BFQ</SelectItem>
                            <SelectItem value="kyber">Kyber</SelectItem>
                            <SelectItem value="mq-deadline">MQ-Deadline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tcpCongestion">TCP Congestion Control</Label>
                        <Select value={kernelParams.tcpCongestion} onValueChange={(value) => setKernelParams(prev => ({ ...prev, tcpCongestion: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select algorithm" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cubic">Cubic</SelectItem>
                            <SelectItem value="reno">Reno</SelectItem>
                            <SelectItem value="bbr">BBR</SelectItem>
                            <SelectItem value="vegas">Vegas</SelectItem>
                            <SelectItem value="westwood">Westwood</SelectItem>
                            <SelectItem value="hybla">Hybla</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => tweakKernelMutation.mutate(kernelParams)}
                      disabled={tweakKernelMutation.isPending || !deviceInfo?.isRooted}
                      className="w-full"
                    >
                      {tweakKernelMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Applying Tweaks...
                        </>
                      ) : (
                        <>
                          <Settings className="w-4 h-4 mr-2" />
                          Apply Kernel Tweaks
                        </>
                      )}
                    </Button>
                    
                    {!deviceInfo?.isRooted && (
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        ⚠️ Root access required for kernel tweaking
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recovery">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Flash Custom Recovery</CardTitle>
                      <CardDescription>
                        Flash TWRP or other custom recovery images
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="recoveryImage">Recovery Image Path</Label>
                        <Input
                          id="recoveryImage"
                          placeholder="/path/to/recovery.img"
                          value={filePaths.recoveryImage}
                          onChange={(e) => setFilePaths(prev => ({ ...prev, recoveryImage: e.target.value }))}
                        />
                      </div>
                      
                      <Button 
                        onClick={() => flashRecoveryMutation.mutate(filePaths.recoveryImage)}
                        disabled={flashRecoveryMutation.isPending || !filePaths.recoveryImage}
                        className="w-full"
                      >
                        {flashRecoveryMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Flashing Recovery...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Flash Recovery
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dump Boot Image</CardTitle>
                      <CardDescription>
                        Extract boot image from your device for backup or modification
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => dumpBootMutation.mutate()}
                        disabled={dumpBootMutation.isPending || !deviceInfo?.isRooted}
                        className="w-full"
                      >
                        {dumpBootMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Dumping Boot Image...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Dump Boot Image
                          </>
                        )}
                      </Button>
                      
                      {!deviceInfo?.isRooted && (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                          ⚠️ Root access required for boot image dumping
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="magisk">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patch Boot Image with Magisk</CardTitle>
                      <CardDescription>
                        Use Magisk to patch a boot image for root access
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bootImage">Boot Image Path</Label>
                          <Input
                            id="bootImage"
                            placeholder="/path/to/boot.img"
                            value={filePaths.bootImage}
                            onChange={(e) => setFilePaths(prev => ({ ...prev, bootImage: e.target.value }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="magiskBoot">Magisk Boot Binary</Label>
                          <Input
                            id="magiskBoot"
                            placeholder="/path/to/magiskboot"
                            value={filePaths.magiskBoot}
                            onChange={(e) => setFilePaths(prev => ({ ...prev, magiskBoot: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => patchBootMutation.mutate({
                          bootImagePath: filePaths.bootImage,
                          magiskBootPath: filePaths.magiskBoot
                        })}
                        disabled={patchBootMutation.isPending || !filePaths.bootImage || !filePaths.magiskBoot}
                        className="w-full"
                      >
                        {patchBootMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Patching Boot Image...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Patch Boot Image
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sideload Magisk ZIP</CardTitle>
                      <CardDescription>
                        Install Magisk via recovery sideloading
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="magiskZip">Magisk ZIP Path</Label>
                        <Input
                          id="magiskZip"
                          placeholder="/path/to/Magisk-v25.2.zip"
                          value={filePaths.magiskZip}
                          onChange={(e) => setFilePaths(prev => ({ ...prev, magiskZip: e.target.value }))}
                        />
                      </div>
                      
                      <Button 
                        onClick={() => sideloadMagiskMutation.mutate(filePaths.magiskZip)}
                        disabled={sideloadMagiskMutation.isPending || !filePaths.magiskZip}
                        className="w-full"
                      >
                        {sideloadMagiskMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sideloading Magisk...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Sideload Magisk ZIP
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="logs">
                <Card>
                  <CardHeader>
                    <CardTitle>Operation Logs</CardTitle>
                    <CardDescription>
                      Real-time output from Android tool operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 w-full border rounded-lg p-4">
                      {Object.keys(operationLogs).length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No operations have been performed yet.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {Object.entries(operationLogs).map(([operationId, logs]) => (
                            <div key={operationId} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{operationId}</Badge>
                                {activeOperations.has(operationId) && (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                )}
                              </div>
                              <div className="space-y-1">
                                {logs.map((log, index) => (
                                  <p key={index} className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                    {log}
                                  </p>
                                ))}
                              </div>
                              <Separator />
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}