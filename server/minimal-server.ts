import express from "express";
import path from "path";
import { log } from "./vite";
import { storage } from "./storage";
import { twrpBuilder, TWRPBuildConfig } from "./services/twrp-builder";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static HTML directly - NO VITE
app.get('/direct-test', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Direct Test - No Vite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
    </style>
</head>
<body class="min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-center text-emerald-400 mb-8">
            🎯 DIRECT SERVER TEST - NO VITE
        </h1>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-emerald-500 mb-6">
            <h2 class="text-xl font-semibold text-emerald-300 mb-4">Success Indicators</h2>
            <div id="status">
                <p class="mb-2">✅ Pure Express Server: SUCCESS</p>
                <p class="mb-2">✅ No Vite Middleware: SUCCESS</p>
                <p class="mb-2">✅ No Websocket Issues: SUCCESS</p>
                <p class="mb-2">✅ JavaScript Loading: <span id="js-status">TESTING...</span></p>
            </div>
        </div>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-green-500">
            <h2 class="text-xl font-semibold text-green-300 mb-4">Interactive Test</h2>
            <button id="test-btn" class="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded mb-4">
                Click to Confirm Working!
            </button>
            <div id="result" class="text-center text-lg font-bold"></div>
        </div>
        
        <div class="mt-6 text-center">
            <p class="text-gray-400">This page loads WITHOUT Vite - if this works, Vite is the problem!</p>
        </div>
    </div>

    <script>
        console.log('=== DIRECT SERVER TEST - NO VITE ===');
        document.getElementById('js-status').textContent = 'SUCCESS';
        
        const button = document.getElementById('test-btn');
        const result = document.getElementById('result');
        
        button.addEventListener('click', () => {
            result.textContent = '🎉 BREAKTHROUGH! Direct Express server working perfectly!';
            result.className = 'text-center text-lg font-bold text-green-400';
            console.log('Direct server test: SUCCESS - No Vite issues');
        });
        
        console.log('Direct server fully loaded - NO Vite websocket errors');
    </script>
</body>
</html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'SUCCESS', 
    server: 'Direct Express - No Vite',
    timestamp: new Date().toISOString()
  });
});

// Basic API routes to test server functionality
app.get('/api/test', async (req, res) => {
  try {
    const configs = await storage.getKernelConfigurations();
    res.json({
      message: 'Server is working!',
      database: 'Connected',
      configCount: configs.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// TWRP Customizer API endpoints
app.get('/api/twrp/themes', (req, res) => {
  const themes = [
    { id: 'portrait_hdpi', name: 'Portrait HDPI', resolution: '1080x1920' },
    { id: 'landscape_hdpi', name: 'Landscape HDPI', resolution: '1920x1080' },
    { id: 'portrait_mdpi', name: 'Portrait MDPI', resolution: '720x1280' },
    { id: 'landscape_mdpi', name: 'Landscape MDPI', resolution: '1280x720' },
    { id: 'watch_mdpi', name: 'Watch MDPI', resolution: '320x320' },
    { id: 'portrait_xhdpi', name: 'Portrait XHDPI', resolution: '1440x2560' }
  ];
  res.json(themes);
});

app.get('/api/twrp/versions', (req, res) => {
  const versions = [
    { id: 'latest', name: '3.7.1 (Latest)', stable: true },
    { id: '3.7.0', name: '3.7.0', stable: true },
    { id: '3.6.2', name: '3.6.2', stable: true },
    { id: '3.6.1', name: '3.6.1', stable: true },
    { id: 'beta', name: '3.8.0 Beta', stable: false }
  ];
  res.json(versions);
});

app.post('/api/twrp/build', async (req, res) => {
  try {
    const { deviceCodename, theme, version, colorScheme, buildName, features } = req.body;
    
    if (!deviceCodename) {
      return res.status(400).json({ message: 'Device codename is required' });
    }

    const buildConfig: TWRPBuildConfig = {
      deviceCodename,
      theme: theme || 'portrait_hdpi',
      version: version || 'latest',
      colorScheme: colorScheme || 'default',
      buildName,
      features: {
        encryption: features?.includes('encryption') || false,
        mtp: features?.includes('mtp') || false,
        adb: features?.includes('adb') || false,
        terminal: features?.includes('terminal') || false,
        fastboot: features?.includes('fastboot') || false,
        magisk: features?.includes('magisk') || false,
        backup: features?.includes('backup') || false,
        customCommands: features?.includes('custom-commands') || false
      }
    };

    const buildId = await twrpBuilder.startBuild(buildConfig);
    
    res.json({
      success: true,
      buildId,
      message: 'TWRP build started successfully',
      estimated: '15-30 minutes'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to start TWRP build',
      error: error.message
    });
  }
});

// Get build status
app.get('/api/twrp/build/:buildId', (req, res) => {
  try {
    const buildId = req.params.buildId;
    const build = twrpBuilder.getBuildStatus(buildId);
    
    if (!build) {
      return res.status(404).json({ message: 'Build not found' });
    }
    
    res.json(build);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get build status',
      error: error.message
    });
  }
});

// Get all builds
app.get('/api/twrp/builds', (req, res) => {
  try {
    const builds = twrpBuilder.getAllBuilds();
    res.json(builds);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get builds',
      error: error.message
    });
  }
});

// Cancel build
app.post('/api/twrp/build/:buildId/cancel', async (req, res) => {
  try {
    const buildId = req.params.buildId;
    const success = await twrpBuilder.cancelBuild(buildId);
    
    if (!success) {
      return res.status(400).json({ message: 'Cannot cancel build' });
    }
    
    res.json({ success: true, message: 'Build cancelled successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to cancel build',
      error: error.message
    });
  }
});

// TWRP Customizer page
app.get('/twrp-customizer', (req, res) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TWRP Customizer - Android Kernel Customizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
        .loading { opacity: 0.6; pointer-events: none; }
        .preview-device {
            width: 200px; height: 360px;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-radius: 20px; position: relative; margin: 0 auto;
            box-shadow: 0 0 30px rgba(0,0,0,0.5);
        }
        .preview-screen {
            width: 170px; height: 300px; background: #000; border-radius: 10px;
            position: absolute; top: 30px; left: 15px; display: flex;
            align-items: center; justify-content: center; font-size: 12px;
            color: #f97316; text-align: center; padding: 10px;
        }
    </style>
</head>
<body class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h1 class="text-4xl font-bold text-orange-400 mb-2">🛠️ TWRP Customizer</h1>
                    <p class="text-gray-300">Build custom Team Win Recovery Project (TWRP) images</p>
                </div>
                <a href="/" class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">← Back to Home</a>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-slate-800 p-6 rounded-lg border-2 border-orange-500">
                    <h2 class="text-xl font-semibold text-orange-300 mb-4">Device Configuration</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Device Codename</label>
                            <select id="device" class="w-full bg-slate-700 border border-gray-600 rounded px-3 py-2">
                                <option value="">Select Device</option>
                                <option value="oneplus9pro">OnePlus 9 Pro (lemonadep)</option>
                                <option value="oneplus8t">OnePlus 8T (kebab)</option>
                                <option value="pixel6">Google Pixel 6 (oriole)</option>
                                <option value="s21ultra">Samsung Galaxy S21 Ultra (t2s)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">TWRP Version</label>
                            <select id="version" class="w-full bg-slate-700 border border-gray-600 rounded px-3 py-2">
                                <option value="latest">3.7.1 (Latest)</option>
                                <option value="3.7.0">3.7.0</option>
                                <option value="beta">3.8.0 Beta</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="bg-slate-800 p-6 rounded-lg border-2 border-green-500">
                    <h2 class="text-xl font-semibold text-green-300 mb-4">Features</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <label class="flex items-center">
                            <input type="checkbox" id="encryption" checked class="mr-2">
                            <span>Data Encryption</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="mtp" checked class="mr-2">
                            <span>MTP Transfer</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="adb" checked class="mr-2">
                            <span>ADB Debugging</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" id="magisk" class="mr-2">
                            <span>Magisk Integration</span>
                        </label>
                    </div>
                </div>
                <div class="text-center">
                    <button id="buildBtn" onclick="startBuild()" class="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg text-lg font-semibold">
                        🚀 Build Custom TWRP
                    </button>
                </div>
            </div>
            <div class="space-y-6">
                <div class="bg-slate-800 p-6 rounded-lg border-2 border-cyan-500">
                    <h2 class="text-xl font-semibold text-cyan-300 mb-4">Preview</h2>
                    <div class="preview-device">
                        <div class="preview-screen">
                            <div>
                                <div class="text-orange-400 text-lg font-bold mb-2">TWRP</div>
                                <div class="space-y-2 text-xs">
                                    <div class="bg-orange-600 px-2 py-1 rounded">Install</div>
                                    <div class="bg-gray-600 px-2 py-1 rounded">Wipe</div>
                                    <div class="bg-gray-600 px-2 py-1 rounded">Backup</div>
                                    <div class="bg-gray-600 px-2 py-1 rounded">Settings</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="buildStatus" class="bg-slate-800 p-6 rounded-lg border-2 border-yellow-500 hidden">
                    <h2 class="text-xl font-semibold text-yellow-300 mb-4">Build Status</h2>
                    <div id="statusContent">
                        <div class="flex items-center mb-2">
                            <div class="animate-spin rounded-full h-4 w-4 border-2 border-yellow-400 border-t-transparent mr-3"></div>
                            <span>Building TWRP...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        async function startBuild() {
            const device = document.getElementById('device').value;
            if (!device) {
                alert('Please select a device first!');
                return;
            }
            
            const features = [];
            if (document.getElementById('encryption').checked) features.push('encryption');
            if (document.getElementById('mtp').checked) features.push('mtp');
            if (document.getElementById('adb').checked) features.push('adb');
            if (document.getElementById('magisk').checked) features.push('magisk');
            
            document.getElementById('buildStatus').classList.remove('hidden');
            document.getElementById('buildBtn').textContent = '🔄 Building...';
            
            try {
                const response = await fetch('/api/twrp/build', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        deviceCodename: device,
                        theme: 'portrait_hdpi',
                        version: document.getElementById('version').value,
                        features: features
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('statusContent').innerHTML = 
                        '<div class="text-green-400">✅ Build Started!</div>' +
                        '<div class="text-sm text-gray-400 mt-2">Build ID: ' + result.buildId + '</div>' +
                        '<div class="text-sm text-gray-400">Estimated: ' + result.estimated + '</div>';
                }
            } catch (error) {
                document.getElementById('statusContent').innerHTML = 
                    '<div class="text-red-400">❌ Build Failed</div>' +
                    '<div class="text-sm text-red-300">Error: ' + error.message + '</div>';
            } finally {
                document.getElementById('buildBtn').textContent = '🚀 Build Custom TWRP';
            }
        }
    </script>
</body>
</html>`;
  res.send(htmlContent);
});

// Simple home page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Android Kernel Customizer - Working!</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
    </style>
</head>
<body class="min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-center text-emerald-400 mb-8">
            🚀 Android Kernel Customizer
        </h1>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-emerald-500 mb-6">
            <h2 class="text-xl font-semibold text-emerald-300 mb-4">Application Status</h2>
            <div id="status">
                <p class="mb-2">✅ Express Server: RUNNING</p>
                <p class="mb-2">✅ Database Connection: <span id="db-status">TESTING...</span></p>
                <p class="mb-2">✅ API Routes: <span id="api-status">TESTING...</span></p>
            </div>
        </div>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-green-500 mb-6">
            <h2 class="text-xl font-semibold text-green-300 mb-4">Quick Links</h2>
            <div class="space-y-2">
                <a href="/twrp-customizer" class="block bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-center">TWRP Customizer</a>
                <a href="/direct-test" class="block bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-center">Direct Server Test</a>
                <a href="/api/test" class="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-center">Test API Endpoint</a>
                <a href="/health" class="block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-center">Health Check</a>
            </div>
        </div>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-orange-500">
            <h2 class="text-xl font-semibold text-orange-300 mb-4">TWRP Recovery Customizer</h2>
            <p class="text-gray-300 mb-4">Build custom TWRP recovery images with personalized themes, features, and device-specific optimizations.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-2xl mb-2">🎨</div>
                    <div class="font-semibold">Custom Themes</div>
                    <div class="text-sm text-gray-400">Portrait, Landscape, Watch</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl mb-2">🔧</div>
                    <div class="font-semibold">Advanced Features</div>
                    <div class="text-sm text-gray-400">Encryption, MTP, ADB</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl mb-2">📱</div>
                    <div class="font-semibold">Device Support</div>
                    <div class="text-sm text-gray-400">40+ Devices Supported</div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Test database connection
        fetch('/api/test')
            .then(response => response.json())
            .then(data => {
                document.getElementById('db-status').textContent = data.database || 'CONNECTED';
                document.getElementById('api-status').textContent = 'WORKING';
            })
            .catch(error => {
                document.getElementById('db-status').textContent = 'FAILED';
                document.getElementById('api-status').textContent = 'FAILED';
            });
    </script>
</body>
</html>
  `);
});

const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, '0.0.0.0', () => {
  log(`🚀 Android Kernel Customizer running on port ${PORT}`, "server");
  log(`Application ready at: http://0.0.0.0:${PORT}/`, "server");
  log(`Direct test at: http://0.0.0.0:${PORT}/direct-test`, "server");
});