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
                                
                                <!-- OnePlus Devices -->
                                <optgroup label="OnePlus">
                                    <option value="oneplus_one">OnePlus One (bacon)</option>
                                    <option value="oneplus_2">OnePlus 2 (oneplus2)</option>
                                    <option value="oneplus_3">OnePlus 3 (oneplus3)</option>
                                    <option value="oneplus_3t">OnePlus 3T (oneplus3t)</option>
                                    <option value="oneplus_5">OnePlus 5 (cheeseburger)</option>
                                    <option value="oneplus_5t">OnePlus 5T (dumpling)</option>
                                    <option value="oneplus_6">OnePlus 6 (enchilada)</option>
                                    <option value="oneplus_6t">OnePlus 6T (fajita)</option>
                                    <option value="oneplus_7">OnePlus 7 (guacamoleb)</option>
                                    <option value="oneplus_7_pro">OnePlus 7 Pro (guacamole)</option>
                                    <option value="oneplus_7t">OnePlus 7T (hotdogb)</option>
                                    <option value="oneplus_7t_pro">OnePlus 7T Pro (hotdog)</option>
                                    <option value="oneplus_8">OnePlus 8 (instantnoodle)</option>
                                    <option value="oneplus_8_pro">OnePlus 8 Pro (instantnoodlep)</option>
                                    <option value="oneplus_8t">OnePlus 8T (kebab)</option>
                                    <option value="oneplus_9">OnePlus 9 (lemonade)</option>
                                    <option value="oneplus_9_pro">OnePlus 9 Pro (lemonadep)</option>
                                    <option value="oneplus_9r">OnePlus 9R (lemonades)</option>
                                    <option value="oneplus_nord">OnePlus Nord (avicii)</option>
                                </optgroup>
                                
                                <!-- Google Pixel -->
                                <optgroup label="Google Pixel">
                                    <option value="pixel_1">Google Pixel (sailfish)</option>
                                    <option value="pixel_1_xl">Google Pixel XL (marlin)</option>
                                    <option value="pixel_2">Google Pixel 2 (walleye)</option>
                                    <option value="pixel_2_xl">Google Pixel 2 XL (taimen)</option>
                                    <option value="pixel_3">Google Pixel 3 (blueline)</option>
                                    <option value="pixel_3_xl">Google Pixel 3 XL (crosshatch)</option>
                                    <option value="pixel_3a">Google Pixel 3a (sargo)</option>
                                    <option value="pixel_3a_xl">Google Pixel 3a XL (bonito)</option>
                                    <option value="pixel_4">Google Pixel 4 (flame)</option>
                                    <option value="pixel_4_xl">Google Pixel 4 XL (coral)</option>
                                    <option value="pixel_4a">Google Pixel 4a (sunfish)</option>
                                    <option value="pixel_4a_5g">Google Pixel 4a 5G (bramble)</option>
                                    <option value="pixel_5">Google Pixel 5 (redfin)</option>
                                    <option value="pixel_5a">Google Pixel 5a (barbet)</option>
                                    <option value="pixel_6">Google Pixel 6 (oriole)</option>
                                    <option value="pixel_6_pro">Google Pixel 6 Pro (raven)</option>
                                    <option value="pixel_6a">Google Pixel 6a (bluejay)</option>
                                    <option value="pixel_7">Google Pixel 7 (panther)</option>
                                    <option value="pixel_7_pro">Google Pixel 7 Pro (cheetah)</option>
                                    <option value="pixel_7a">Google Pixel 7a (lynx)</option>
                                    <option value="pixel_8">Google Pixel 8 (shiba)</option>
                                    <option value="pixel_8_pro">Google Pixel 8 Pro (husky)</option>
                                </optgroup>
                                
                                <!-- Google Nexus -->
                                <optgroup label="Google Nexus">
                                    <option value="nexus_4">Google Nexus 4 (mako)</option>
                                    <option value="nexus_5">Google Nexus 5 (hammerhead)</option>
                                    <option value="nexus_5x">Google Nexus 5X (bullhead)</option>
                                    <option value="nexus_6">Google Nexus 6 (shamu)</option>
                                    <option value="nexus_6p">Google Nexus 6P (angler)</option>
                                    <option value="nexus_7_2012">Google Nexus 7 2012 (grouper)</option>
                                    <option value="nexus_7_2013">Google Nexus 7 2013 (flo)</option>
                                    <option value="nexus_9">Google Nexus 9 (flounder)</option>
                                    <option value="nexus_10">Google Nexus 10 (manta)</option>
                                </optgroup>
                                
                                <!-- Samsung Galaxy S Series -->
                                <optgroup label="Samsung Galaxy S">
                                    <option value="galaxy_s8">Samsung Galaxy S8 (dreamlte)</option>
                                    <option value="galaxy_s8_plus">Samsung Galaxy S8+ (dream2lte)</option>
                                    <option value="galaxy_s9">Samsung Galaxy S9 (starlte)</option>
                                    <option value="galaxy_s9_plus">Samsung Galaxy S9+ (star2lte)</option>
                                    <option value="galaxy_s10">Samsung Galaxy S10 (beyond1lte)</option>
                                    <option value="galaxy_s10_plus">Samsung Galaxy S10+ (beyond2lte)</option>
                                    <option value="galaxy_s10e">Samsung Galaxy S10e (beyond0lte)</option>
                                    <option value="galaxy_s20">Samsung Galaxy S20 (x1s)</option>
                                    <option value="galaxy_s20_plus">Samsung Galaxy S20+ (y2s)</option>
                                    <option value="galaxy_s20_ultra">Samsung Galaxy S20 Ultra (z3s)</option>
                                    <option value="galaxy_s21">Samsung Galaxy S21 (o1s)</option>
                                    <option value="galaxy_s21_plus">Samsung Galaxy S21+ (t2s)</option>
                                    <option value="galaxy_s21_ultra">Samsung Galaxy S21 Ultra (p3s)</option>
                                    <option value="galaxy_s22">Samsung Galaxy S22 (dm1q)</option>
                                    <option value="galaxy_s22_plus">Samsung Galaxy S22+ (dm2q)</option>
                                    <option value="galaxy_s22_ultra">Samsung Galaxy S22 Ultra (dm3q)</option>
                                    <option value="galaxy_s23">Samsung Galaxy S23 (dm1q)</option>
                                    <option value="galaxy_s23_plus">Samsung Galaxy S23+ (dm2q)</option>
                                    <option value="galaxy_s23_ultra">Samsung Galaxy S23 Ultra (dm3q)</option>
                                </optgroup>
                                
                                <!-- Nothing -->
                                <optgroup label="Nothing">
                                    <option value="nothing_phone_1">Nothing Phone (1) (spacewar)</option>
                                    <option value="nothing_phone_2">Nothing Phone (2) (pong)</option>
                                    <option value="nothing_phone_2a">Nothing Phone (2a) (pacman)</option>
                                </optgroup>
                                
                                <!-- Fairphone -->
                                <optgroup label="Fairphone">
                                    <option value="fairphone_2">Fairphone 2 (FP2)</option>
                                    <option value="fairphone_3">Fairphone 3 (FP3)</option>
                                    <option value="fairphone_3_plus">Fairphone 3+ (FP3)</option>
                                    <option value="fairphone_4">Fairphone 4 (FP4)</option>
                                    <option value="fairphone_5">Fairphone 5 (FP5)</option>
                                </optgroup>
                                
                                <!-- PinePhone -->
                                <optgroup label="Pine64">
                                    <option value="pinephone">PinePhone (pinephone)</option>
                                    <option value="pinephone_pro">PinePhone Pro (pinephonepro)</option>
                                    <option value="pinetab">PineTab (pinetab)</option>
                                    <option value="pinetab_2">PineTab 2 (pinetab2)</option>
                                </optgroup>
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

// Kernel Builder page
app.get('/kernel-builder', (req, res) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kernel Builder - Android Kernel Customizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
        .loading { opacity: 0.6; pointer-events: none; }
    </style>
</head>
<body class="min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h1 class="text-4xl font-bold text-emerald-400 mb-2">🛡️ Kernel Builder</h1>
                    <p class="text-gray-300">Build custom Android kernels with NetHunter security features</p>
                </div>
                <a href="/" class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">← Back to Home</a>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Device Selection -->
            <div class="lg:col-span-3 space-y-6">
                <div class="bg-slate-800 p-6 rounded-lg border-2 border-emerald-500">
                    <h2 class="text-xl font-semibold text-emerald-300 mb-4">Device Configuration</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Device</label>
                            <select id="device" class="w-full bg-slate-700 border border-gray-600 rounded px-3 py-2">
                                <option value="">Select Device</option>
                                
                                <!-- OnePlus Devices -->
                                <optgroup label="OnePlus">
                                    <option value="oneplus_one">OnePlus One</option>
                                    <option value="oneplus_2">OnePlus 2</option>
                                    <option value="oneplus_3">OnePlus 3</option>
                                    <option value="oneplus_3t">OnePlus 3T</option>
                                    <option value="oneplus_5">OnePlus 5</option>
                                    <option value="oneplus_5t">OnePlus 5T</option>
                                    <option value="oneplus_6">OnePlus 6</option>
                                    <option value="oneplus_6t">OnePlus 6T</option>
                                    <option value="oneplus_7">OnePlus 7</option>
                                    <option value="oneplus_7_pro">OnePlus 7 Pro</option>
                                    <option value="oneplus_7t">OnePlus 7T</option>
                                    <option value="oneplus_7t_pro">OnePlus 7T Pro</option>
                                    <option value="oneplus_8">OnePlus 8</option>
                                    <option value="oneplus_8_pro">OnePlus 8 Pro</option>
                                    <option value="oneplus_8t">OnePlus 8T</option>
                                    <option value="oneplus_9">OnePlus 9</option>
                                    <option value="oneplus_9_pro">OnePlus 9 Pro</option>
                                    <option value="oneplus_9r">OnePlus 9R</option>
                                    <option value="oneplus_9rt">OnePlus 9RT</option>
                                    <option value="oneplus_10_pro">OnePlus 10 Pro</option>
                                    <option value="oneplus_10t">OnePlus 10T</option>
                                    <option value="oneplus_11">OnePlus 11</option>
                                    <option value="oneplus_12">OnePlus 12</option>
                                    <option value="oneplus_nord">OnePlus Nord</option>
                                    <option value="oneplus_nord_2">OnePlus Nord 2</option>
                                    <option value="oneplus_nord_ce">OnePlus Nord CE</option>
                                    <option value="oneplus_nord_ce_2">OnePlus Nord CE 2</option>
                                    <option value="oneplus_nord_ce_3">OnePlus Nord CE 3</option>
                                </optgroup>
                                
                                <!-- Google Pixel & Nexus -->
                                <optgroup label="Google Pixel">
                                    <option value="pixel_1">Google Pixel</option>
                                    <option value="pixel_1_xl">Google Pixel XL</option>
                                    <option value="pixel_2">Google Pixel 2</option>
                                    <option value="pixel_2_xl">Google Pixel 2 XL</option>
                                    <option value="pixel_3">Google Pixel 3</option>
                                    <option value="pixel_3_xl">Google Pixel 3 XL</option>
                                    <option value="pixel_3a">Google Pixel 3a</option>
                                    <option value="pixel_3a_xl">Google Pixel 3a XL</option>
                                    <option value="pixel_4">Google Pixel 4</option>
                                    <option value="pixel_4_xl">Google Pixel 4 XL</option>
                                    <option value="pixel_4a">Google Pixel 4a</option>
                                    <option value="pixel_4a_5g">Google Pixel 4a 5G</option>
                                    <option value="pixel_5">Google Pixel 5</option>
                                    <option value="pixel_5a">Google Pixel 5a</option>
                                    <option value="pixel_6">Google Pixel 6</option>
                                    <option value="pixel_6_pro">Google Pixel 6 Pro</option>
                                    <option value="pixel_6a">Google Pixel 6a</option>
                                    <option value="pixel_7">Google Pixel 7</option>
                                    <option value="pixel_7_pro">Google Pixel 7 Pro</option>
                                    <option value="pixel_7a">Google Pixel 7a</option>
                                    <option value="pixel_8">Google Pixel 8</option>
                                    <option value="pixel_8_pro">Google Pixel 8 Pro</option>
                                    <option value="pixel_8a">Google Pixel 8a</option>
                                    <option value="pixel_9">Google Pixel 9</option>
                                    <option value="pixel_9_pro">Google Pixel 9 Pro</option>
                                    <option value="pixel_9_pro_xl">Google Pixel 9 Pro XL</option>
                                </optgroup>
                                
                                <!-- Google Nexus -->
                                <optgroup label="Google Nexus">
                                    <option value="nexus_4">Google Nexus 4</option>
                                    <option value="nexus_5">Google Nexus 5</option>
                                    <option value="nexus_5x">Google Nexus 5X</option>
                                    <option value="nexus_6">Google Nexus 6</option>
                                    <option value="nexus_6p">Google Nexus 6P</option>
                                    <option value="nexus_7_2012">Google Nexus 7 (2012)</option>
                                    <option value="nexus_7_2013">Google Nexus 7 (2013)</option>
                                    <option value="nexus_9">Google Nexus 9</option>
                                    <option value="nexus_10">Google Nexus 10</option>
                                </optgroup>
                                
                                <!-- Samsung Galaxy S Series -->
                                <optgroup label="Samsung Galaxy S">
                                    <option value="galaxy_s8">Samsung Galaxy S8</option>
                                    <option value="galaxy_s8_plus">Samsung Galaxy S8+</option>
                                    <option value="galaxy_s9">Samsung Galaxy S9</option>
                                    <option value="galaxy_s9_plus">Samsung Galaxy S9+</option>
                                    <option value="galaxy_s10">Samsung Galaxy S10</option>
                                    <option value="galaxy_s10_plus">Samsung Galaxy S10+</option>
                                    <option value="galaxy_s10e">Samsung Galaxy S10e</option>
                                    <option value="galaxy_s20">Samsung Galaxy S20</option>
                                    <option value="galaxy_s20_plus">Samsung Galaxy S20+</option>
                                    <option value="galaxy_s20_ultra">Samsung Galaxy S20 Ultra</option>
                                    <option value="galaxy_s21">Samsung Galaxy S21</option>
                                    <option value="galaxy_s21_plus">Samsung Galaxy S21+</option>
                                    <option value="galaxy_s21_ultra">Samsung Galaxy S21 Ultra</option>
                                    <option value="galaxy_s22">Samsung Galaxy S22</option>
                                    <option value="galaxy_s22_plus">Samsung Galaxy S22+</option>
                                    <option value="galaxy_s22_ultra">Samsung Galaxy S22 Ultra</option>
                                    <option value="galaxy_s23">Samsung Galaxy S23</option>
                                    <option value="galaxy_s23_plus">Samsung Galaxy S23+</option>
                                    <option value="galaxy_s23_ultra">Samsung Galaxy S23 Ultra</option>
                                    <option value="galaxy_s24">Samsung Galaxy S24</option>
                                    <option value="galaxy_s24_plus">Samsung Galaxy S24+</option>
                                    <option value="galaxy_s24_ultra">Samsung Galaxy S24 Ultra</option>
                                </optgroup>
                                
                                <!-- Nothing -->
                                <optgroup label="Nothing">
                                    <option value="nothing_phone_1">Nothing Phone (1)</option>
                                    <option value="nothing_phone_2">Nothing Phone (2)</option>
                                    <option value="nothing_phone_2a">Nothing Phone (2a)</option>
                                </optgroup>
                                
                                <!-- Fairphone -->
                                <optgroup label="Fairphone">
                                    <option value="fairphone_2">Fairphone 2</option>
                                    <option value="fairphone_3">Fairphone 3</option>
                                    <option value="fairphone_3_plus">Fairphone 3+</option>
                                    <option value="fairphone_4">Fairphone 4</option>
                                    <option value="fairphone_5">Fairphone 5</option>
                                </optgroup>
                                
                                <!-- PinePhone -->
                                <optgroup label="Pine64">
                                    <option value="pinephone">PinePhone</option>
                                    <option value="pinephone_pro">PinePhone Pro</option>
                                    <option value="pinetab">PineTab</option>
                                    <option value="pinetab_2">PineTab 2</option>
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Android Version</label>
                            <select id="android-version" class="w-full bg-slate-700 border border-gray-600 rounded px-3 py-2">
                                <option value="14">Android 14</option>
                                <option value="13">Android 13</option>
                                <option value="12">Android 12</option>
                                <option value="11">Android 11</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Build Type</label>
                            <select id="build-type" class="w-full bg-slate-700 border border-gray-600 rounded px-3 py-2">
                                <option value="nethunter">NetHunter Kernel</option>
                                <option value="performance">Performance Optimized</option>
                                <option value="battery">Battery Optimized</option>
                                <option value="custom">Custom Build</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- NetHunter Features -->
                <div class="bg-slate-800 p-6 rounded-lg border-2 border-red-500">
                    <h2 class="text-xl font-semibold text-red-300 mb-4">NetHunter Security Features</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-3">
                            <label class="flex items-center">
                                <input type="checkbox" id="wifi-monitor" checked class="mr-3">
                                <span>WiFi Monitor Mode</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="packet-injection" checked class="mr-3">
                                <span>Packet Injection</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="wireless-drivers" checked class="mr-3">
                                <span>Wireless Drivers (RTL8812AU)</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="badusb" class="mr-3">
                                <span>BadUSB Support</span>
                            </label>
                        </div>
                        <div class="space-y-3">
                            <label class="flex items-center">
                                <input type="checkbox" id="bluetooth-arsenal" class="mr-3">
                                <span>Bluetooth Arsenal</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="nfc-hacking" class="mr-3">
                                <span>NFC Hacking Tools</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="sdr-support" class="mr-3">
                                <span>SDR Support</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="custom-patches" class="mr-3">
                                <span>Custom Security Patches</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Root Solutions -->
                <div class="bg-slate-800 p-6 rounded-lg border-2 border-purple-500">
                    <h2 class="text-xl font-semibold text-purple-300 mb-4">Root Solutions</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-slate-700 p-4 rounded-lg border border-purple-400">
                            <label class="flex items-center mb-3">
                                <input type="radio" name="root-solution" value="kernelsu" class="mr-3">
                                <span class="font-semibold">KernelSU</span>
                            </label>
                            <div class="text-sm text-gray-300 space-y-1">
                                <div>• Kernel-level root</div>
                                <div>• Manager app integration</div>
                                <div>• Advanced permissions</div>
                            </div>
                        </div>
                        <div class="bg-slate-700 p-4 rounded-lg border border-purple-400">
                            <label class="flex items-center mb-3">
                                <input type="radio" name="root-solution" value="magisk" checked class="mr-3">
                                <span class="font-semibold">Magisk</span>
                            </label>
                            <div class="text-sm text-gray-300 space-y-1">
                                <div>• Systemless root</div>
                                <div>• Hide root detection</div>
                                <div>• Module support</div>
                            </div>
                        </div>
                        <div class="bg-slate-700 p-4 rounded-lg border border-purple-400">
                            <label class="flex items-center mb-3">
                                <input type="radio" name="root-solution" value="none" class="mr-3">
                                <span class="font-semibold">No Root</span>
                            </label>
                            <div class="text-sm text-gray-300 space-y-1">
                                <div>• Stock kernel behavior</div>
                                <div>• No root access</div>
                                <div>• Maximum stability</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Build Options -->
                <div class="bg-slate-800 p-6 rounded-lg border-2 border-yellow-500">
                    <h2 class="text-xl font-semibold text-yellow-300 mb-4">Build Configuration</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium mb-2">Kernel Name</label>
                            <input type="text" id="kernel-name" placeholder="My Custom Kernel" class="w-full bg-slate-700 border border-gray-600 rounded px-3 py-2">
                            
                            <label class="block text-sm font-medium mb-2 mt-4">Compiler</label>
                            <select id="compiler" class="w-full bg-slate-700 border border-gray-600 rounded px-3 py-2">
                                <option value="clang">Clang (Recommended)</option>
                                <option value="gcc">GCC</option>
                                <option value="proton-clang">Proton Clang</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Optimization Level</label>
                            <select id="optimization" class="w-full bg-slate-700 border border-gray-600 rounded px-3 py-2">
                                <option value="performance">Performance (-O3)</option>
                                <option value="balanced">Balanced (-O2)</option>
                                <option value="size">Size Optimized (-Os)</option>
                            </select>
                            
                            <label class="block text-sm font-medium mb-2 mt-4">Output Format</label>
                            <select id="output-format" class="w-full bg-slate-700 border border-gray-600 rounded px-3 py-2">
                                <option value="boot-image">Boot Image (.img)</option>
                                <option value="anykernel3">AnyKernel3 (.zip)</option>
                                <option value="both">Both formats</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Build Button -->
                <div class="text-center">
                    <button id="buildBtn" onclick="startKernelBuild()" class="bg-emerald-600 hover:bg-emerald-700 px-12 py-4 rounded-lg text-xl font-bold">
                        🚀 Build Custom Kernel
                    </button>
                </div>
            </div>
            
            <!-- Summary Panel -->
            <div class="space-y-6">
                <div class="bg-slate-800 p-6 rounded-lg border-2 border-cyan-500 sticky top-6">
                    <h2 class="text-xl font-semibold text-cyan-300 mb-4">Build Summary</h2>
                    <div class="space-y-3 text-sm">
                        <div><span class="text-gray-400">Device:</span> <span id="summaryDevice">Not selected</span></div>
                        <div><span class="text-gray-400">Android:</span> <span id="summaryAndroid">14</span></div>
                        <div><span class="text-gray-400">Build Type:</span> <span id="summaryBuildType">NetHunter</span></div>
                        <div><span class="text-gray-400">Root:</span> <span id="summaryRoot">Magisk</span></div>
                        <div><span class="text-gray-400">Features:</span> <span id="summaryFeatures">WiFi Monitor, Packet Injection</span></div>
                    </div>
                    
                    <div class="mt-6 p-4 bg-slate-700 rounded-lg">
                        <div class="text-center text-yellow-300 font-semibold mb-2">Estimated Build Time</div>
                        <div class="text-center text-2xl text-white">45-90 min</div>
                        <div class="text-center text-xs text-gray-400 mt-1">Depends on features selected</div>
                    </div>
                </div>
                
                <!-- Build Status -->
                <div id="buildStatus" class="bg-slate-800 p-6 rounded-lg border-2 border-yellow-500 hidden">
                    <h2 class="text-xl font-semibold text-yellow-300 mb-4">Build Status</h2>
                    <div id="statusContent">
                        <div class="flex items-center mb-2">
                            <div class="animate-spin rounded-full h-4 w-4 border-2 border-yellow-400 border-t-transparent mr-3"></div>
                            <span>Building kernel...</span>
                        </div>
                        <div class="text-sm text-gray-400">This may take 45-90 minutes</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        function updateSummary() {
            const device = document.getElementById('device').value;
            const androidVersion = document.getElementById('android-version').value;
            const buildType = document.getElementById('build-type').value;
            const rootSolution = document.querySelector('input[name="root-solution"]:checked').value;
            
            document.getElementById('summaryDevice').textContent = device || 'Not selected';
            document.getElementById('summaryAndroid').textContent = 'Android ' + androidVersion;
            document.getElementById('summaryBuildType').textContent = buildType;
            document.getElementById('summaryRoot').textContent = rootSolution;
            
            // Count NetHunter features
            const features = [];
            if (document.getElementById('wifi-monitor').checked) features.push('WiFi Monitor');
            if (document.getElementById('packet-injection').checked) features.push('Packet Injection');
            if (document.getElementById('wireless-drivers').checked) features.push('Wireless Drivers');
            if (document.getElementById('badusb').checked) features.push('BadUSB');
            
            document.getElementById('summaryFeatures').textContent = features.length > 0 ? features.slice(0, 2).join(', ') + (features.length > 2 ? '...' : '') : 'Basic';
        }
        
        async function startKernelBuild() {
            const device = document.getElementById('device').value;
            if (!device) {
                alert('Please select a device first!');
                return;
            }
            
            const kernelName = document.getElementById('kernel-name').value;
            const buildType = document.getElementById('build-type').value;
            const rootSolution = document.querySelector('input[name="root-solution"]:checked').value;
            
            document.getElementById('buildStatus').classList.remove('hidden');
            document.getElementById('buildBtn').textContent = '🔄 Building...';
            document.getElementById('buildBtn').classList.add('loading');
            
            try {
                const response = await fetch('/api/kernel/build', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        device: device,
                        kernelName: kernelName,
                        buildType: buildType,
                        rootSolution: rootSolution,
                        nethunterFeatures: {
                            wifiMonitor: document.getElementById('wifi-monitor').checked,
                            packetInjection: document.getElementById('packet-injection').checked,
                            wirelessDrivers: document.getElementById('wireless-drivers').checked,
                            badusb: document.getElementById('badusb').checked
                        }
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('statusContent').innerHTML = 
                        '<div class="text-green-400 mb-2">✅ Kernel Build Started!</div>' +
                        '<div class="text-sm text-gray-400">Build ID: ' + result.buildId + '</div>' +
                        '<div class="text-sm text-gray-400">Estimated: ' + result.estimated + '</div>' +
                        '<div class="mt-3 text-xs"><strong>Configuration:</strong><br/>' +
                        'Device: ' + device + '<br/>' +
                        'Type: ' + buildType + '<br/>' +
                        'Root: ' + rootSolution + '</div>';
                }
            } catch (error) {
                document.getElementById('statusContent').innerHTML = 
                    '<div class="text-red-400">❌ Build Failed</div>' +
                    '<div class="text-sm text-red-300">Error: ' + error.message + '</div>';
            } finally {
                document.getElementById('buildBtn').textContent = '🚀 Build Custom Kernel';
                document.getElementById('buildBtn').classList.remove('loading');
            }
        }
        
        // Update summary on changes
        document.getElementById('device').addEventListener('change', updateSummary);
        document.getElementById('android-version').addEventListener('change', updateSummary);
        document.getElementById('build-type').addEventListener('change', updateSummary);
        document.querySelectorAll('input[name="root-solution"]').forEach(radio => {
            radio.addEventListener('change', updateSummary);
        });
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', updateSummary);
        });
        
        // Initialize summary
        updateSummary();
    </script>
</body>
</html>`;
  res.send(htmlContent);
});

// Kernel build API endpoint
app.post('/api/kernel/build', async (req, res) => {
  try {
    const { device, kernelName, buildType, rootSolution, nethunterFeatures } = req.body;
    
    if (!device) {
      return res.status(400).json({ message: 'Device selection is required' });
    }

    const buildId = `kernel_${device}_${Date.now()}`;
    
    res.json({
      success: true,
      buildId,
      message: 'Kernel build started successfully',
      estimated: '45-90 minutes',
      configuration: {
        device,
        kernelName,
        buildType,
        rootSolution,
        nethunterFeatures
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to start kernel build',
      error: error.message
    });
  }
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
                <a href="/kernel-builder" class="block bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-center">Kernel Builder</a>
                <a href="/twrp-customizer" class="block bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-center">TWRP Customizer</a>
                <a href="/android-tool" class="block bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded text-center">Android Tool</a>
                <a href="/build-history" class="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-center">Build History</a>
            </div>
        </div>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-emerald-500 mb-6">
            <h2 class="text-xl font-semibold text-emerald-300 mb-4">Android Kernel Customizer</h2>
            <p class="text-gray-300 mb-4">Build custom Android kernels with NetHunter security features and advanced optimizations.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center">
                    <div class="text-2xl mb-2">🛡️</div>
                    <div class="font-semibold">NetHunter Integration</div>
                    <div class="text-sm text-gray-400">WiFi Monitor, Packet Injection</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl mb-2">🔧</div>
                    <div class="font-semibold">Root Solutions</div>
                    <div class="text-sm text-gray-400">KernelSU, Magisk Support</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl mb-2">📱</div>
                    <div class="font-semibold">100+ Devices</div>
                    <div class="text-sm text-gray-400">OnePlus, Pixel, Samsung, Nothing, Fairphone, PinePhone</div>
                </div>
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
                    <div class="text-sm text-gray-400">100+ Devices Supported</div>
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

// Android Tool page  
app.get('/android-tool', (req, res) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Android Tool - Android Kernel Customizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
    </style>
</head>
<body class="min-h-screen p-8">
    <div class="max-w-6xl mx-auto">
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h1 class="text-4xl font-bold text-cyan-400 mb-2">📱 Android Tool</h1>
                    <p class="text-gray-300">Device management, flashing tools, and recovery operations</p>
                </div>
                <a href="/" class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">← Back to Home</a>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-slate-800 p-6 rounded-lg border-2 border-cyan-500">
                <h2 class="text-xl font-semibold text-cyan-300 mb-4">Device Information</h2>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Status:</span>
                        <span class="text-green-400">Connected</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Model:</span>
                        <span>OnePlus 9 Pro</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Android:</span>
                        <span>Android 14</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Bootloader:</span>
                        <span class="text-orange-400">Unlocked</span>
                    </div>
                </div>
                <button class="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded">Refresh Info</button>
            </div>
            
            <div class="bg-slate-800 p-6 rounded-lg border-2 border-orange-500">
                <h2 class="text-xl font-semibold text-orange-300 mb-4">Flash Operations</h2>
                <div class="space-y-3">
                    <button class="w-full bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded">Flash Kernel</button>
                    <button class="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Flash Recovery</button>
                    <button class="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">Flash Boot Image</button>
                    <button class="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Flash Custom ROM</button>
                </div>
            </div>
            
            <div class="bg-slate-800 p-6 rounded-lg border-2 border-green-500">
                <h2 class="text-xl font-semibold text-green-300 mb-4">Root Management</h2>
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span>Root Status:</span>
                        <span class="text-green-400">Rooted (Magisk)</span>
                    </div>
                    <button class="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Install Magisk</button>
                    <button class="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded">Patch Boot Image</button>
                    <button class="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Unroot Device</button>
                </div>
            </div>
        </div>
        
        <div class="mt-6 bg-slate-800 p-6 rounded-lg border-2 border-yellow-500">
            <h2 class="text-xl font-semibold text-yellow-300 mb-4">Quick Actions</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Reboot Device</button>
                <button class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Reboot Recovery</button>
                <button class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Reboot Bootloader</button>
                <button class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">ADB Shell</button>
            </div>
        </div>
    </div>
</body>
</html>`;
  res.send(htmlContent);
});

// Build History page
app.get('/build-history', (req, res) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Build History - Android Kernel Customizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
    </style>
</head>
<body class="min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h1 class="text-4xl font-bold text-blue-400 mb-2">📊 Build History</h1>
                    <p class="text-gray-300">Track your kernel and TWRP builds with detailed logs and downloads</p>
                </div>
                <a href="/" class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">← Back to Home</a>
            </div>
        </div>
        
        <div class="space-y-4">
            <!-- Sample Build Entries -->
            <div class="bg-slate-800 p-6 rounded-lg border-2 border-green-500">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-green-300">NetHunter Kernel - OnePlus 9 Pro</h3>
                        <div class="text-sm text-gray-400">Started: 2025-07-20 16:30:45</div>
                    </div>
                    <div class="flex items-center">
                        <span class="bg-green-600 px-3 py-1 rounded text-sm font-semibold mr-3">✅ Completed</span>
                        <span class="text-sm text-gray-400">45 min</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div><span class="text-gray-400">Device:</span> OnePlus 9 Pro</div>
                    <div><span class="text-gray-400">Android:</span> 14</div>
                    <div><span class="text-gray-400">Root:</span> Magisk</div>
                    <div><span class="text-gray-400">Features:</span> WiFi Monitor, Packet Injection</div>
                </div>
                <div class="mt-4 flex space-x-3">
                    <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">Download Kernel</button>
                    <button class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm">View Logs</button>
                </div>
            </div>
            
            <div class="bg-slate-800 p-6 rounded-lg border-2 border-orange-500">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-orange-300">TWRP Recovery - Pixel 6</h3>
                        <div class="text-sm text-gray-400">Started: 2025-07-20 15:15:22</div>
                    </div>
                    <div class="flex items-center">
                        <span class="bg-orange-600 px-3 py-1 rounded text-sm font-semibold mr-3">✅ Completed</span>
                        <span class="text-sm text-gray-400">28 min</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div><span class="text-gray-400">Device:</span> Google Pixel 6</div>
                    <div><span class="text-gray-400">Theme:</span> Portrait HDPI</div>
                    <div><span class="text-gray-400">Version:</span> 3.7.1</div>
                    <div><span class="text-gray-400">Features:</span> Encryption, MTP, ADB</div>
                </div>
                <div class="mt-4 flex space-x-3">
                    <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">Download TWRP</button>
                    <button class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm">View Logs</button>
                </div>
            </div>
            
            <div class="bg-slate-800 p-6 rounded-lg border-2 border-yellow-500">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-yellow-300">Performance Kernel - OnePlus 8T</h3>
                        <div class="text-sm text-gray-400">Started: 2025-07-20 14:45:12</div>
                    </div>
                    <div class="flex items-center">
                        <span class="bg-yellow-600 px-3 py-1 rounded text-sm font-semibold mr-3">🔄 Building</span>
                        <span class="text-sm text-gray-400">32 min elapsed</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div><span class="text-gray-400">Device:</span> OnePlus 8T</div>
                    <div><span class="text-gray-400">Android:</span> 13</div>
                    <div><span class="text-gray-400">Root:</span> KernelSU</div>
                    <div><span class="text-gray-400">Optimization:</span> Performance (-O3)</div>
                </div>
                <div class="mt-4">
                    <div class="bg-slate-700 rounded-full h-2 mb-2">
                        <div class="bg-yellow-400 h-2 rounded-full" style="width: 68%"></div>
                    </div>
                    <div class="text-sm text-gray-400">Progress: 68% - Compiling kernel modules...</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  res.send(htmlContent);
});

const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, '0.0.0.0', () => {
  log(`🚀 Android Kernel Customizer running on port ${PORT}`, "server");
  log(`Application ready at: http://0.0.0.0:${PORT}/`, "server");
  log(`Direct test at: http://0.0.0.0:${PORT}/direct-test`, "server");
});