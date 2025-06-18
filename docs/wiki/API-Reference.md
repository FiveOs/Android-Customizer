# API Reference

Complete REST API documentation for Android Kernel Customizer backend integration.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently no authentication required for local development. Production deployments should implement proper authentication.

## Kernel Configurations

### List All Configurations
```http
GET /api/kernel-configurations
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "OnePlus Nord NetHunter",
    "device": "oneplus_nord",
    "codename": "avicii",
    "kernelRepo": "https://github.com/OnePlusOSS/android_kernel_oneplus_sm7250.git",
    "kernelBranch": "oneplus/SM7250_R_11.0",
    "features": {
      "wifiMonitorMode": true,
      "packetInjection": true,
      "kernelSU": true
    },
    "createdAt": "2025-06-18T21:00:00.000Z"
  }
]
```

### Get Configuration by ID
```http
GET /api/configurations/{id}
```

### Create New Configuration
```http
POST /api/kernel-configurations
Content-Type: application/json

{
  "name": "Custom Build",
  "device": "oneplus_nord",
  "codename": "avicii",
  "kernelRepo": "https://github.com/OnePlusOSS/android_kernel_oneplus_sm7250.git",
  "kernelBranch": "oneplus/SM7250_R_11.0",
  "nethunterPatchesRepo": "https://gitlab.com/kalilinux/nethunter/build-scripts/kali-nethunter-project.git",
  "nethunterPatchesBranch": "master",
  "features": {
    "wifiMonitorMode": true,
    "usbGadget": true,
    "packetInjection": true,
    "kernelSU": true
  },
  "customKernelConfigs": [
    "CONFIG_PACKET=y",
    "CONFIG_CFG80211_WEXT=y"
  ],
  "wslDistroName": "ubuntu-22.04"
}
```

### Update Configuration
```http
PUT /api/configurations/{id}
Content-Type: application/json

{
  "name": "Updated Build Name",
  "features": {
    "wifiMonitorMode": true,
    "bluetoothArsenal": true
  }
}
```

### Delete Configuration
```http
DELETE /api/configurations/{id}
```

## Build Jobs

### List All Build Jobs
```http
GET /api/build-jobs
```

**Response:**
```json
[
  {
    "id": 1,
    "configurationId": 1,
    "status": "completed",
    "currentStep": "Build completed successfully",
    "progress": 100,
    "startedAt": "2025-06-18T21:30:00.000Z",
    "completedAt": "2025-06-18T22:15:00.000Z",
    "outputFiles": [
      "boot.img",
      "Image.gz-dtb",
      "build.log"
    ]
  }
]
```

### Create Build Job
```http
POST /api/build-jobs
Content-Type: application/json

{
  "configurationId": 1,
  "status": "pending"
}
```

### Get Build Job Status
```http
GET /api/builds/{id}
```

### Start Build
```http
POST /api/builds/{id}/start
```

**Response:**
```json
{
  "message": "Build started",
  "buildId": 1
}
```

### Cancel Build
```http
POST /api/builds/{id}/cancel
```

## WSL Integration

### Check WSL Status
```http
GET /api/wsl/status
```

**Response:**
```json
{
  "available": true,
  "distros": [
    "Ubuntu-22.04",
    "kali-linux"
  ],
  "message": "WSL2 is properly configured"
}
```

## WebSocket API

### Connection
```javascript
const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${protocol}//${window.location.host}/ws`;
const socket = new WebSocket(wsUrl);
```

### Build Progress Updates
```javascript
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Build update:', data);
};
```

**Message Format:**
```json
{
  "type": "build_progress",
  "buildId": 1,
  "status": "running",
  "currentStep": "Applying NetHunter patches...",
  "progress": 45,
  "timestamp": "2025-06-18T21:45:00.000Z"
}
```

## Data Models

### KernelConfiguration Schema
```typescript
interface KernelConfiguration {
  id: number;
  name: string;
  device: string;
  codename: string;
  kernelRepo: string;
  kernelBranch: string;
  nethunterPatchesRepo: string;
  nethunterPatchesBranch: string;
  nethunterPatchesDirRelative: string;
  gitPatchLevel: string;
  outputDir: string;
  defconfigFilenameTemplate: string;
  kernelArch: string;
  kernelCrossCompile: string;
  kernelImageNamePatterns: string[];
  features: NetHunterFeatures;
  customKernelConfigs: string[];
  wslDistroName: string;
  skipOptions: SkipOptions;
  toolchainConfig?: ToolchainConfig;
  buildOutputConfig?: BuildOutputConfig;
  deviceTreeConfig?: DeviceTreeConfig;
  hardwareConfig?: HardwareConfig;
  performanceConfig?: PerformanceConfig;
  securityConfig?: SecurityConfig;
  kernelSUConfig?: KernelSUConfig;
  magiskConfig?: MagiskConfig;
  twrpConfig?: TWRPConfig;
  createdAt: string;
}
```

### NetHunter Features
```typescript
interface NetHunterFeatures {
  // Core Features
  wifiMonitorMode: boolean;
  usbGadget: boolean;
  hidSupport: boolean;
  rtl8812auDriver: boolean;
  
  // Advanced Features
  packetInjection: boolean;
  badUSB: boolean;
  wirelessKeylogger: boolean;
  bluetoothArsenal: boolean;
  nfcHacking: boolean;
  sdrSupport: boolean;
  
  // Wireless Drivers
  rtl88xxauDriver: boolean;
  rt2800usbDriver: boolean;
  ath9kHtcDriver: boolean;
  
  // Root & Security
  kernelSU: boolean;
  magiskIntegration: boolean;
  selinuxPermissive: boolean;
  dmVerityDisable: boolean;
  
  // Performance & Debugging
  kprobeSupport: boolean;
  ftracingSupport: boolean;
  perfCounters: boolean;
  cpuGovernors: boolean;
  
  // Recovery Support
  twrpSupport: boolean;
  recoveryRamdisk: boolean;
}
```

### Build Job Schema
```typescript
interface BuildJob {
  id: number;
  configurationId: number;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  currentStep: string;
  progress: number; // 0-100
  logs: string;
  errorMessage: string | null;
  outputFiles: string[];
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid configuration data",
    "details": {
      "field": "kernelRepo",
      "issue": "Invalid repository URL"
    }
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting
Currently no rate limiting implemented. Production deployments should implement appropriate limits.

## Examples

### Complete Build Workflow
```javascript
// 1. Create configuration
const config = await fetch('/api/kernel-configurations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'OnePlus Nord NetHunter',
    device: 'oneplus_nord',
    features: {
      wifiMonitorMode: true,
      packetInjection: true,
      kernelSU: true
    }
  })
});

// 2. Create build job
const build = await fetch('/api/build-jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    configurationId: config.id,
    status: 'pending'
  })
});

// 3. Start build
await fetch(`/api/builds/${build.id}/start`, {
  method: 'POST'
});

// 4. Monitor progress via WebSocket
const socket = new WebSocket('ws://localhost:5000/ws');
socket.onmessage = (event) => {
  const update = JSON.parse(event.data);
  if (update.buildId === build.id) {
    console.log(`Progress: ${update.progress}%`);
    console.log(`Step: ${update.currentStep}`);
  }
};
```

### Batch Configuration Management
```javascript
// Export configurations
const configs = await fetch('/api/kernel-configurations');
const backup = await configs.json();

// Import configurations
for (const config of backup) {
  delete config.id;
  delete config.createdAt;
  await fetch('/api/kernel-configurations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
}
```

## Development Notes

### Testing API Endpoints
```bash
# Test configuration creation
curl -X POST http://localhost:5000/api/kernel-configurations \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Build","device":"oneplus_nord"}'

# Test build job creation
curl -X POST http://localhost:5000/api/build-jobs \
  -H "Content-Type: application/json" \
  -d '{"configurationId":1,"status":"pending"}'
```

### WebSocket Testing
```javascript
// Browser console testing
const ws = new WebSocket('ws://localhost:5000/ws');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', JSON.parse(e.data));
```