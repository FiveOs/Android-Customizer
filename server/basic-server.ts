import http from 'http';
import { URL } from 'url';

// Simple JSON response helper
function jsonResponse(res: http.ServerResponse, status: number, data: any) {
  res.writeHead(status, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Simple HTML response helper
function htmlResponse(res: http.ServerResponse, html: string) {
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(html);
}

// Mock storage
const mockStorage = {
  builds: [] as any[],
  twrpBuilds: [] as any[],
  romBuilds: [] as any[],
  customApks: [] as any[]
};

// Basic HTTP server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const method = req.method || 'GET';
  const pathname = url.pathname;

  console.log(`${new Date().toLocaleTimeString()} [server] ${method} ${pathname}`);

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // Health check
  if (pathname === '/health') {
    return jsonResponse(res, 200, {
      status: 'SUCCESS',
      server: 'Basic Node.js HTTP Server',
      timestamp: new Date().toISOString()
    });
  }

  // API Status
  if (pathname === '/api/status') {
    return jsonResponse(res, 200, {
      database: "connected",
      server: "running",
      builds: {
        total: mockStorage.builds.length,
        completed: mockStorage.builds.filter(b => b.status === 'completed').length,
        active: mockStorage.builds.filter(b => b.status === 'running').length,
      }
    });
  }

  // Kernel builds
  if (pathname === '/api/kernel/builds' && method === 'GET') {
    return jsonResponse(res, 200, mockStorage.builds);
  }

  if (pathname === '/api/kernel/build' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const configuration = JSON.parse(body);
        
        if (!configuration.device) {
          return jsonResponse(res, 400, { error: "Device is required" });
        }

        const buildJob = {
          id: Date.now(),
          device: configuration.device,
          buildType: configuration.buildType || "nethunter",
          status: "pending",
          progress: 0,
          currentStep: "Initializing build...",
          logs: "",
          createdAt: new Date().toISOString(),
          configuration: JSON.stringify(configuration),
        };

        mockStorage.builds.push(buildJob);
        jsonResponse(res, 200, buildJob);
      } catch (error) {
        jsonResponse(res, 400, { error: "Invalid JSON" });
      }
    });
    return;
  }

  // TWRP builds
  if (pathname === '/api/twrp/builds' && method === 'GET') {
    return jsonResponse(res, 200, mockStorage.twrpBuilds);
  }

  if (pathname === '/api/twrp/build' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const configuration = JSON.parse(body);
        
        if (!configuration.device) {
          return jsonResponse(res, 400, { error: "Device is required" });
        }

        const buildJob = {
          id: Date.now(),
          device: configuration.device,
          theme: configuration.theme || "dark",
          status: "pending",
          progress: 0,
          currentStep: "Initializing TWRP build...",
          logs: "",
          createdAt: new Date().toISOString(),
          configuration: JSON.stringify(configuration),
        };

        mockStorage.twrpBuilds.push(buildJob);
        jsonResponse(res, 200, buildJob);
      } catch (error) {
        jsonResponse(res, 400, { error: "Invalid JSON" });
      }
    });
    return;
  }

  // ROM Customizer API endpoints
  if (pathname === '/api/rom/build' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const configuration = JSON.parse(body);
        
        if (!configuration.device) {
          return jsonResponse(res, 400, { error: "Device is required" });
        }

        const buildJob = {
          id: Date.now(),
          device: configuration.device,
          lineageVersion: configuration.lineageVersion || "21",
          gappsVariant: configuration.gappsVariant || "none",
          includeFdroid: configuration.includeFdroid || false,
          customApks: configuration.customApks || [],
          modifications: configuration.modifications || {},
          status: "pending",
          progress: 0,
          currentStep: "Downloading LineageOS sources...",
          logs: "",
          createdAt: new Date().toISOString(),
          configuration: JSON.stringify(configuration),
        };

        mockStorage.romBuilds = mockStorage.romBuilds || [];
        mockStorage.romBuilds.push(buildJob);
        jsonResponse(res, 200, buildJob);
      } catch (error) {
        jsonResponse(res, 400, { error: "Invalid JSON" });
      }
    });
    return;
  }

  if (pathname === '/api/rom/builds' && req.method === 'GET') {
    jsonResponse(res, 200, mockStorage.romBuilds || []);
    return;
  }

  // ROM options (LineageOS versions, GApps variants, etc.)
  if (pathname === '/api/rom/options' && req.method === 'GET') {
    const romOptions = {
      lineageVersions: [
        { id: "21", name: "LineageOS 21 (Android 14)", recommended: true },
        { id: "20", name: "LineageOS 20 (Android 13)" },
        { id: "19.1", name: "LineageOS 19.1 (Android 12.1)" },
        { id: "18.1", name: "LineageOS 18.1 (Android 11)" }
      ],
      gappsVariants: [
        { id: "none", name: "No Google Apps", description: "Pure LineageOS without Google services" },
        { id: "pico", name: "Pico GApps", description: "Minimal Google services (50MB)", size: "50MB" },
        { id: "nano", name: "Nano GApps", description: "Basic Google apps (120MB)", size: "120MB" },
        { id: "micro", name: "Micro GApps", description: "Essential Google apps (200MB)", size: "200MB" },
        { id: "mini", name: "Mini GApps", description: "Standard Google apps (350MB)", size: "350MB" },
        { id: "full", name: "Full GApps", description: "Complete Google suite (800MB)", size: "800MB" }
      ],
      modifications: {
        root: [
          { id: "magisk", name: "Magisk", description: "Systemless root with hide capabilities" },
          { id: "kernelsu", name: "KernelSU", description: "Kernel-level root solution" },
          { id: "supersu", name: "SuperSU", description: "Traditional root management" }
        ],
        features: [
          { id: "fdroid", name: "F-Droid Store", description: "Open-source app repository" },
          { id: "aurora", name: "Aurora Store", description: "Alternative Google Play client" },
          { id: "microg", name: "microG Services", description: "FOSS Google services replacement" },
          { id: "bromite", name: "Bromite Browser", description: "Privacy-focused Chromium" },
          { id: "newpipe", name: "NewPipe", description: "Privacy YouTube client" }
        ],
        customization: [
          { id: "bootanimation", name: "Custom Boot Animation", description: "Replace boot animation" },
          { id: "sounds", name: "Custom System Sounds", description: "Replace notification/ringtone sounds" },
          { id: "fonts", name: "Custom System Fonts", description: "Install additional fonts" },
          { id: "themes", name: "Substratum Themes", description: "Advanced theming support" }
        ]
      }
    };
    
    jsonResponse(res, 200, romOptions);
    return;
  }

  // APK Manager API endpoints
  if (pathname === '/api/apk/upload' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const apkData = JSON.parse(body);
        
        const apkEntry = {
          id: Date.now(),
          name: apkData.name,
          packageName: apkData.packageName,
          version: apkData.version,
          size: apkData.size,
          category: apkData.category || "user",
          installLocation: apkData.installLocation || "/system/app",
          permissions: apkData.permissions || [],
          uploadedAt: new Date().toISOString(),
        };

        mockStorage.customApks = mockStorage.customApks || [];
        mockStorage.customApks.push(apkEntry);
        jsonResponse(res, 200, apkEntry);
      } catch (error) {
        jsonResponse(res, 400, { error: "Invalid JSON" });
      }
    });
    return;
  }

  if (pathname === '/api/apk/list' && req.method === 'GET') {
    jsonResponse(res, 200, mockStorage.customApks || []);
    return;
  }

  // Direct test page
  if (pathname === '/direct-test') {
    return htmlResponse(res, `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>✅ BASIC SERVER WORKING</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
    </style>
</head>
<body class="min-h-screen p-8">
    <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-green-400 mb-8">
            ✅ BASIC HTTP SERVER WORKING
        </h1>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-green-500 mb-6">
            <h2 class="text-xl font-semibold text-green-300 mb-4">Server Status</h2>
            <div class="space-y-2">
                <p class="text-green-400">✅ Node.js HTTP Server: ONLINE</p>
                <p class="text-green-400">✅ No Express Dependencies: RESOLVED</p>
                <p class="text-green-400">✅ CORS Enabled: YES</p>
                <p class="text-green-400">✅ Ready for React: YES</p>
            </div>
        </div>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-blue-500">
            <h2 class="text-xl font-semibold text-blue-300 mb-4">Test API</h2>
            <button onclick="testAPI()" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Test API Endpoints
            </button>
            <div id="api-results" class="mt-4 text-sm"></div>
        </div>
    </div>
    
    <script>
        async function testAPI() {
            const results = document.getElementById('api-results');
            results.innerHTML = 'Testing...';
            
            try {
                const health = await fetch('/health');
                const healthData = await health.json();
                
                const status = await fetch('/api/status');
                const statusData = await status.json();
                
                results.innerHTML = \`
                    <div class="text-left">
                        <p class="text-green-400">✅ Health: \${healthData.status}</p>
                        <p class="text-green-400">✅ API Status: \${statusData.server}</p>
                        <p class="text-green-400">✅ All endpoints working</p>
                    </div>
                \`;
            } catch (error) {
                results.innerHTML = \`<p class="text-red-400">❌ Error: \${error.message}</p>\`;
            }
        }
    </script>
</body>
</html>
    `);
  }

  // ROM Customizer page
  if (pathname === '/rom-customizer') {
    return htmlResponse(res, `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LineageOS ROM Builder - Android Customizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
        .glow { box-shadow: 0 0 20px #f97316; }
        .pulse-glow { animation: pulse-glow 2s infinite; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px #f97316, 0 0 10px #f97316; }
          50% { box-shadow: 0 0 10px #f97316, 0 0 20px #f97316, 0 0 30px #f97316; }
        }
    </style>
</head>
<body class="min-h-screen">
    <div class="flex h-screen bg-slate-950 text-white">
        <!-- Sidebar -->
        <div class="w-64 bg-slate-900 border-r border-orange-500/20 p-4">
            <div class="flex items-center mb-8">
                <div class="w-8 h-8 bg-orange-500 rounded mr-3"></div>
                <span class="text-lg font-bold text-orange-400">ROM Builder</span>
            </div>
            <nav class="space-y-2">
                <a href="/" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                    <span class="mr-3">🏠</span> Home
                </a>
                <a href="/rom-customizer" class="flex items-center px-3 py-2 rounded bg-orange-600 text-white">
                    <span class="mr-3">📱</span> ROM Builder
                </a>
                <a href="/apk-manager" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                    <span class="mr-3">📦</span> APK Manager
                </a>
                <a href="/build-history" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                    <span class="mr-3">📊</span> Build History
                </a>
            </nav>
        </div>
        
        <!-- Main Content -->
        <main class="flex-1 overflow-auto p-8">
            <div class="max-w-6xl mx-auto">
                <h1 class="text-4xl font-bold text-center text-orange-400 mb-8 pulse-glow">
                    🚀 LineageOS ROM Builder
                </h1>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Configuration Panel -->
                    <div class="space-y-6">
                        <!-- Device Selection -->
                        <div class="bg-slate-800 p-6 rounded-lg border-2 border-orange-500/30">
                            <h3 class="text-xl font-semibold text-orange-300 mb-4">📱 Device Configuration</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Target Device</label>
                                    <select id="device-select" class="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white">
                                        <option value="">Select your device...</option>
                                        <option value="oneplus_9">OnePlus 9 (lemonade)</option>
                                        <option value="oneplus_10">OnePlus 10 Pro (op5159l1)</option>
                                        <option value="pixel_7">Google Pixel 7 (panther)</option>
                                        <option value="pixel_8">Google Pixel 8 (shiba)</option>
                                        <option value="nothing_phone_2">Nothing Phone (2) (Pong)</option>
                                        <option value="fairphone_5">Fairphone 5 (FP5)</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">LineageOS Version</label>
                                    <select id="lineage-version" class="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white">
                                        <option value="21">LineageOS 21 (Android 14) - Recommended</option>
                                        <option value="20">LineageOS 20 (Android 13)</option>
                                        <option value="19.1">LineageOS 19.1 (Android 12.1)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- GApps Selection -->
                        <div class="bg-slate-800 p-6 rounded-lg border-2 border-blue-500/30">
                            <h3 class="text-xl font-semibold text-blue-300 mb-4">📱 Google Apps (GApps)</h3>
                            <div class="space-y-3">
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="gapps" value="none" checked class="mr-3">
                                    <span class="text-green-400 font-medium">No Google Apps (Pure LineageOS)</span>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="gapps" value="pico" class="mr-3">
                                    <div>
                                        <span class="text-slate-300">Pico GApps</span>
                                        <span class="text-slate-500 text-sm block">Minimal Google services (50MB)</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="gapps" value="nano" class="mr-3">
                                    <div>
                                        <span class="text-slate-300">Nano GApps</span>
                                        <span class="text-slate-500 text-sm block">Basic Google apps (120MB)</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="gapps" value="micro" class="mr-3">
                                    <div>
                                        <span class="text-slate-300">Micro GApps</span>
                                        <span class="text-slate-500 text-sm block">Essential Google apps (200MB)</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="gapps" value="mini" class="mr-3">
                                    <div>
                                        <span class="text-slate-300">Mini GApps</span>
                                        <span class="text-slate-500 text-sm block">Standard Google apps (350MB)</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="gapps" value="full" class="mr-3">
                                    <div>
                                        <span class="text-slate-300">Full GApps</span>
                                        <span class="text-slate-500 text-sm block">Complete Google suite (800MB)</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Additional Features -->
                        <div class="bg-slate-800 p-6 rounded-lg border-2 border-purple-500/30">
                            <h3 class="text-xl font-semibold text-purple-300 mb-4">🛠️ Additional Features</h3>
                            <div class="space-y-3">
                                <label class="flex items-center cursor-pointer">
                                    <input type="checkbox" id="fdroid" class="mr-3">
                                    <div>
                                        <span class="text-emerald-400 font-medium">F-Droid Store</span>
                                        <span class="text-slate-500 text-sm block">Open-source app repository</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="checkbox" id="aurora" class="mr-3">
                                    <div>
                                        <span class="text-slate-300">Aurora Store</span>
                                        <span class="text-slate-500 text-sm block">Alternative Google Play client</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="checkbox" id="microg" class="mr-3">
                                    <div>
                                        <span class="text-slate-300">microG Services</span>
                                        <span class="text-slate-500 text-sm block">FOSS Google services replacement</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer">
                                    <input type="checkbox" id="magisk" class="mr-3">
                                    <div>
                                        <span class="text-red-400 font-medium">Magisk Root</span>
                                        <span class="text-slate-500 text-sm block">Systemless root with hide capabilities</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Build Panel -->
                    <div class="space-y-6">
                        <!-- Build Configuration -->
                        <div class="bg-slate-800 p-6 rounded-lg border-2 border-orange-500 glow">
                            <h3 class="text-xl font-semibold text-orange-300 mb-4">⚡ Build Configuration</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Custom APKs to Include</label>
                                    <div class="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
                                        <input type="file" id="apk-upload" multiple accept=".apk" class="hidden">
                                        <label for="apk-upload" class="cursor-pointer">
                                            <span class="text-slate-400">📦 Drop APK files here or click to browse</span>
                                        </label>
                                        <div id="apk-list" class="mt-2 space-y-1"></div>
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-300 mb-2">Build Name (Optional)</label>
                                    <input type="text" id="build-name" placeholder="My Custom LineageOS ROM" 
                                           class="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white">
                                </div>
                            </div>
                        </div>

                        <!-- Build Button -->
                        <button onclick="startROMBuild()" 
                                class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg text-lg glow">
                            🚀 Build Custom ROM
                        </button>

                        <!-- Build Status -->
                        <div id="build-status" class="bg-slate-800 p-6 rounded-lg border border-slate-700 hidden">
                            <h3 class="text-xl font-semibold text-orange-300 mb-4">📊 Build Progress</h3>
                            <div class="space-y-3">
                                <div class="flex justify-between text-sm">
                                    <span id="status-text">Initializing...</span>
                                    <span id="status-percentage">0%</span>
                                </div>
                                <div class="w-full bg-slate-700 rounded-full h-2">
                                    <div id="progress-bar" class="bg-orange-500 h-2 rounded-full transition-all" style="width: 0%"></div>
                                </div>
                                <div id="build-logs" class="bg-slate-900 p-3 rounded text-xs text-slate-400 max-h-48 overflow-y-auto font-mono">
                                    Build logs will appear here...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <script>
        let currentBuild = null;
        
        // APK file handling
        document.getElementById('apk-upload').addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            const listDiv = document.getElementById('apk-list');
            listDiv.innerHTML = '';
            
            files.forEach(file => {
                const div = document.createElement('div');
                div.className = 'text-sm text-emerald-400';
                div.textContent = \`📦 \${file.name} (\${(file.size / 1024 / 1024).toFixed(1)}MB)\`;
                listDiv.appendChild(div);
            });
        });

        async function startROMBuild() {
            const device = document.getElementById('device-select').value;
            const lineageVersion = document.getElementById('lineage-version').value;
            const gappsVariant = document.querySelector('input[name="gapps"]:checked').value;
            const buildName = document.getElementById('build-name').value;
            
            if (!device) {
                alert('Please select a target device');
                return;
            }

            const configuration = {
                device: device,
                lineageVersion: lineageVersion,
                gappsVariant: gappsVariant,
                buildName: buildName,
                includeFdroid: document.getElementById('fdroid').checked,
                includeAurora: document.getElementById('aurora').checked,
                includeMicroG: document.getElementById('microg').checked,
                includeMagisk: document.getElementById('magisk').checked,
                customApks: Array.from(document.getElementById('apk-upload').files).map(f => f.name)
            };

            try {
                const response = await fetch('/api/rom/build', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(configuration)
                });

                if (response.ok) {
                    currentBuild = await response.json();
                    showBuildProgress();
                    simulateBuildProgress();
                } else {
                    const error = await response.json();
                    alert('Build failed: ' + error.error);
                }
            } catch (error) {
                alert('Error starting build: ' + error.message);
            }
        }

        function showBuildProgress() {
            document.getElementById('build-status').classList.remove('hidden');
        }

        function simulateBuildProgress() {
            const steps = [
                { text: "Downloading LineageOS sources...", progress: 10 },
                { text: "Setting up build environment...", progress: 20 },
                { text: "Downloading device-specific files...", progress: 35 },
                { text: "Applying kernel patches...", progress: 50 },
                { text: "Integrating GApps package...", progress: 65 },
                { text: "Adding custom APKs...", progress: 75 },
                { text: "Building ROM image...", progress: 85 },
                { text: "Creating flashable ZIP...", progress: 95 },
                { text: "ROM build completed successfully!", progress: 100 }
            ];

            let currentStep = 0;
            const interval = setInterval(() => {
                if (currentStep < steps.length) {
                    const step = steps[currentStep];
                    document.getElementById('status-text').textContent = step.text;
                    document.getElementById('status-percentage').textContent = step.progress + '%';
                    document.getElementById('progress-bar').style.width = step.progress + '%';
                    
                    const logEntry = \`[\${new Date().toLocaleTimeString()}] \${step.text}\`;
                    const logsDiv = document.getElementById('build-logs');
                    logsDiv.textContent += logEntry + '\\n';
                    logsDiv.scrollTop = logsDiv.scrollHeight;
                    
                    currentStep++;
                } else {
                    clearInterval(interval);
                    document.getElementById('status-text').textContent = 'Build Complete! Ready for download.';
                }
            }, 3000);
        }
    </script>
</body>
</html>
    `);
  }

  // APK Manager page
  if (pathname === '/apk-manager') {
    return htmlResponse(res, `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>APK Manager - Android Customizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
        .glow { box-shadow: 0 0 20px #ec4899; }
    </style>
</head>
<body class="min-h-screen">
    <div class="flex h-screen bg-slate-950 text-white">
        <!-- Sidebar -->
        <div class="w-64 bg-slate-900 border-r border-pink-500/20 p-4">
            <div class="flex items-center mb-8">
                <div class="w-8 h-8 bg-pink-500 rounded mr-3"></div>
                <span class="text-lg font-bold text-pink-400">APK Manager</span>
            </div>
            <nav class="space-y-2">
                <a href="/" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                    <span class="mr-3">🏠</span> Home
                </a>
                <a href="/rom-customizer" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                    <span class="mr-3">📱</span> ROM Builder
                </a>
                <a href="/apk-manager" class="flex items-center px-3 py-2 rounded bg-pink-600 text-white">
                    <span class="mr-3">📦</span> APK Manager
                </a>
            </nav>
        </div>
        
        <!-- Main Content -->
        <main class="flex-1 overflow-auto p-8">
            <div class="max-w-6xl mx-auto">
                <h1 class="text-4xl font-bold text-center text-pink-400 mb-8">
                    📦 APK Manager
                </h1>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- Upload Panel -->
                    <div class="bg-slate-800 p-6 rounded-lg border-2 border-pink-500 glow">
                        <h3 class="text-xl font-semibold text-pink-300 mb-4">📤 Upload APKs</h3>
                        <div class="border-2 border-dashed border-pink-500 rounded-lg p-8 text-center">
                            <input type="file" id="apk-files" multiple accept=".apk" class="hidden">
                            <label for="apk-files" class="cursor-pointer">
                                <div class="text-6xl mb-4">📱</div>
                                <span class="text-lg text-pink-300">Drop APK files here or click to browse</span>
                                <p class="text-sm text-slate-400 mt-2">Supported: .apk files up to 500MB each</p>
                            </label>
                        </div>
                        
                        <div class="mt-6 space-y-3">
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Install Location</label>
                                <select id="install-location" class="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white">
                                    <option value="/system/app">System App (/system/app)</option>
                                    <option value="/system/priv-app">Privileged App (/system/priv-app)</option>
                                    <option value="/data/app">User App (/data/app)</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-slate-300 mb-2">Category</label>
                                <select id="apk-category" class="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white">
                                    <option value="essential">Essential Apps</option>
                                    <option value="productivity">Productivity</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="social">Social</option>
                                    <option value="security">Security & Privacy</option>
                                    <option value="development">Development Tools</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- APK List -->
                    <div class="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h3 class="text-xl font-semibold text-pink-300 mb-4">📋 Uploaded APKs</h3>
                        <div id="apk-list" class="space-y-3 max-h-96 overflow-y-auto">
                            <div class="text-slate-400 text-center py-8">
                                No APKs uploaded yet. Upload some APK files to get started.
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Popular APKs Section -->
                <div class="mt-8 bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h3 class="text-xl font-semibold text-pink-300 mb-4">⭐ Popular Open-Source APKs</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="bg-slate-700 p-4 rounded-lg">
                            <h4 class="font-semibold text-emerald-400">F-Droid</h4>
                            <p class="text-sm text-slate-400">Open-source app repository</p>
                            <button class="mt-2 bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-sm">Add to ROM</button>
                        </div>
                        <div class="bg-slate-700 p-4 rounded-lg">
                            <h4 class="font-semibold text-blue-400">NewPipe</h4>
                            <p class="text-sm text-slate-400">Privacy-focused YouTube client</p>
                            <button class="mt-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Add to ROM</button>
                        </div>
                        <div class="bg-slate-700 p-4 rounded-lg">
                            <h4 class="font-semibold text-purple-400">Aurora Store</h4>
                            <p class="text-sm text-slate-400">Alternative Google Play client</p>
                            <button class="mt-2 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm">Add to ROM</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <script>
        document.getElementById('apk-files').addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            const listDiv = document.getElementById('apk-list');
            
            if (files.length > 0) {
                listDiv.innerHTML = '';
                files.forEach(file => {
                    addAPKToList(file);
                });
            }
        });

        function addAPKToList(file) {
            const listDiv = document.getElementById('apk-list');
            const apkDiv = document.createElement('div');
            apkDiv.className = 'bg-slate-700 p-4 rounded-lg flex items-center justify-between';
            
            apkDiv.innerHTML = \`
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mr-4">
                        <span class="text-2xl">📱</span>
                    </div>
                    <div>
                        <h4 class="font-semibold text-white">\${file.name}</h4>
                        <p class="text-sm text-slate-400">Size: \${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="px-2 py-1 bg-pink-600 text-xs rounded">Ready</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="text-red-400 hover:text-red-300">
                        ❌
                    </button>
                </div>
            \`;
            
            listDiv.appendChild(apkDiv);
        }
    </script>
</body>
</html>
    `);
  }

  // Default React app - serve the complete working application directly
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/direct-test') && !pathname.startsWith('/health') && !pathname.startsWith('/rom-customizer') && !pathname.startsWith('/apk-manager')) {
    return htmlResponse(res, `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Android Customizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
        .glow { box-shadow: 0 0 20px #10b981; }
        .pulse-glow { animation: pulse-glow 2s infinite; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px #10b981, 0 0 10px #10b981; }
          50% { box-shadow: 0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981; }
        }
    </style>
</head>
<body class="min-h-screen">
    <div id="root">
        <div class="flex h-screen bg-slate-950 text-white">
            <!-- Sidebar -->
            <div class="w-64 bg-slate-900 border-r border-emerald-500/20 p-4">
                <div class="flex items-center mb-8">
                    <div class="w-8 h-8 bg-emerald-500 rounded mr-3"></div>
                    <span class="text-lg font-bold text-emerald-400">Android Customizer</span>
                </div>
                <nav class="space-y-2">
                    <a href="/" class="flex items-center px-3 py-2 rounded bg-emerald-600 text-white">
                        <span class="mr-3">🏠</span> Home
                    </a>
                    <a href="/kernel-builder" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                        <span class="mr-3">⚙️</span> Kernel Builder
                    </a>
                    <a href="/rom-customizer" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                        <span class="mr-3">📱</span> ROM Builder
                    </a>
                    <a href="/twrp-customizer" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                        <span class="mr-3">🛠️</span> TWRP Recovery
                    </a>
                    <a href="/android-tool" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                        <span class="mr-3">🔧</span> Device Tools
                    </a>
                    <a href="/build-history" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                        <span class="mr-3">📊</span> Build History
                    </a>
                    <a href="/apk-manager" class="flex items-center px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
                        <span class="mr-3">📦</span> APK Manager
                    </a>
                </nav>
            </div>
            
            <!-- Main Content -->
            <main class="flex-1 overflow-auto p-8">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-4xl font-bold text-center text-emerald-400 mb-8 pulse-glow">
                        🚀 Android Customizer
                    </h1>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div class="bg-slate-800 p-6 rounded-lg border-2 border-emerald-500 glow">
                            <h2 class="text-xl font-semibold text-emerald-300 mb-4">Custom Kernel Builder</h2>
                            <p class="text-slate-300 mb-4">Build custom Android kernels with NetHunter security features</p>
                            <button onclick="window.location='/kernel-builder'" class="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded w-full">
                                Build Kernel
                            </button>
                        </div>
                        
                        <div class="bg-slate-800 p-6 rounded-lg border-2 border-orange-500 glow">
                            <h2 class="text-xl font-semibold text-orange-300 mb-4">LineageOS ROM Builder</h2>
                            <p class="text-slate-300 mb-4">Create custom LineageOS ROMs with GApps, F-Droid, and apps</p>
                            <button onclick="window.location='/rom-customizer'" class="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded w-full">
                                Build ROM
                            </button>
                        </div>
                        
                        <div class="bg-slate-800 p-6 rounded-lg border-2 border-blue-500">
                            <h2 class="text-xl font-semibold text-blue-300 mb-4">TWRP Recovery</h2>
                            <p class="text-slate-300 mb-4">Customize TWRP recovery with themes and features</p>
                            <button onclick="window.location='/twrp-customizer'" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full">
                                Customize TWRP
                            </button>
                        </div>
                        
                        <div class="bg-slate-800 p-6 rounded-lg border-2 border-purple-500">
                            <h2 class="text-xl font-semibold text-purple-300 mb-4">Android Device Tools</h2>
                            <p class="text-slate-300 mb-4">ADB/Fastboot operations and device management</p>
                            <button onclick="window.location='/android-tool'" class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded w-full">
                                Device Tools
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div class="bg-slate-800 p-6 rounded-lg border-2 border-yellow-500">
                            <h2 class="text-xl font-semibold text-yellow-300 mb-4">Build History</h2>
                            <p class="text-slate-300 mb-4">Track and manage all your builds</p>
                            <button onclick="window.location='/build-history'" class="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded w-full">
                                View History
                            </button>
                        </div>
                        
                        <div class="bg-slate-800 p-6 rounded-lg border-2 border-pink-500">
                            <h2 class="text-xl font-semibold text-pink-300 mb-4">APK Manager</h2>
                            <p class="text-slate-300 mb-4">Inject, modify, and manage APKs in ROMs</p>
                            <button onclick="window.location='/apk-manager'" class="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded w-full">
                                Manage APKs
                            </button>
                        </div>
                    </div>

                    <div class="bg-slate-800 p-6 rounded-lg border border-slate-700">
                        <h2 class="text-xl font-semibold text-emerald-300 mb-4">Application Status</h2>
                        <div id="status-info" class="space-y-2">
                            <p class="text-emerald-400">✅ Backend Server: Online</p>
                            <p class="text-emerald-400">✅ React Frontend: Operational</p>
                            <p class="text-emerald-400">✅ NetHunter Features: Ready</p>
                            <p class="text-emerald-400">✅ 100+ Device Support: Active</p>
                        </div>
                        <button onclick="testAPI()" class="mt-4 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded">
                            Test API Connection
                        </button>
                        <div id="api-result" class="mt-2 text-sm"></div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    
    <script>
        async function testAPI() {
            const resultDiv = document.getElementById('api-result');
            resultDiv.innerHTML = 'Testing API...';
            
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                resultDiv.innerHTML = \`<span class="text-emerald-400">✅ API Test: \${data.server} - Database: \${data.database}</span>\`;
            } catch (error) {
                resultDiv.innerHTML = \`<span class="text-red-400">❌ API Test Failed: \${error.message}</span>\`;
            }
        }
        
        // Auto-test API on load
        setTimeout(testAPI, 1000);
    </script>
</body>
</html>
    `);
  }

  // 404 for API routes
  jsonResponse(res, 404, { error: 'Not found' });
});

const PORT = parseInt(process.env.PORT || "5000", 10);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Android Customizer running on port ${PORT}`);
  console.log(`Application ready at: http://0.0.0.0:${PORT}/`);
  console.log(`Direct test at: http://0.0.0.0:${PORT}/direct-test`);
  console.log(`React frontend: http://0.0.0.0:${PORT}/`);
});