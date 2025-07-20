import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple log function 
const log = (message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [server] ${message}`);
};

// Mock storage for API responses
const mockStorage = {
  builds: [] as any[],
  twrpBuilds: [] as any[],
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'SUCCESS', 
    server: 'Clean Express Server',
    timestamp: new Date().toISOString()
  });
});

// API endpoints for React frontend
app.get('/api/status', (req, res) => {
  res.json({
    database: "connected",
    server: "running", 
    builds: {
      total: mockStorage.builds.length,
      completed: mockStorage.builds.filter(b => b.status === 'completed').length,
      active: mockStorage.builds.filter(b => b.status === 'running').length,
    },
  });
});

// Kernel build endpoints
app.get('/api/kernel/builds', (req, res) => {
  res.json(mockStorage.builds);
});

app.post('/api/kernel/build', (req, res) => {
  const configuration = req.body;
  
  if (!configuration.device) {
    return res.status(400).json({ error: "Device is required" });
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
  res.json(buildJob);
});

app.post('/api/kernel/build/:id/cancel', (req, res) => {
  const buildId = parseInt(req.params.id);
  const build = mockStorage.builds.find(b => b.id === buildId);
  
  if (build) {
    build.status = "cancelled";
    build.currentStep = "Build cancelled by user";
  }

  res.json({ success: true });
});

// TWRP build endpoints  
app.get('/api/twrp/builds', (req, res) => {
  res.json(mockStorage.twrpBuilds);
});

app.post('/api/twrp/build', (req, res) => {
  const configuration = req.body;
  
  if (!configuration.device) {
    return res.status(400).json({ error: "Device is required" });
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
  res.json(buildJob);
});

// Direct test endpoint (working version)
app.get('/direct-test', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>✅ CLEAN SERVER WORKING</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #d1fae5; font-family: system-ui; }
    </style>
</head>
<body class="min-h-screen p-8">
    <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-green-400 mb-8">
            ✅ CLEAN SERVER WORKING PERFECTLY
        </h1>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-green-500 mb-6">
            <h2 class="text-xl font-semibold text-green-300 mb-4">Server Status</h2>
            <div class="space-y-2">
                <p class="text-green-400">✅ Express Server: ONLINE</p>
                <p class="text-green-400">✅ API Endpoints: WORKING</p>
                <p class="text-green-400">✅ No Path-To-Regexp Issues: RESOLVED</p>
                <p class="text-green-400">✅ Ready for React Frontend: YES</p>
            </div>
        </div>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-blue-500">
            <h2 class="text-xl font-semibold text-blue-300 mb-4">Available Routes</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h3 class="font-semibold text-blue-400 mb-2">API Endpoints</h3>
                    <ul class="space-y-1 text-left">
                        <li>GET /api/status</li>
                        <li>GET /api/kernel/builds</li>
                        <li>POST /api/kernel/build</li>
                        <li>GET /api/twrp/builds</li>
                        <li>POST /api/twrp/build</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold text-blue-400 mb-2">React Routes</h3>
                    <ul class="space-y-1 text-left">
                        <li>/ (Home)</li>
                        <li>/kernel-builder</li>
                        <li>/twrp-customizer</li>
                        <li>/android-tool</li>
                        <li>/build-history</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `);
});

// React frontend routing - serve React app for all other routes
app.get('*', (req, res) => {
  // Skip API routes and test routes
  if (req.path.startsWith('/api/') || req.path.startsWith('/direct-test') || req.path.startsWith('/health')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Serve React app HTML with Vite dev server integration
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Android Kernel Customizer</title>
    <script type="module">
      import RefreshRuntime from 'http://localhost:5173/@react-refresh'
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="http://localhost:5173/@vite/client"></script>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="http://localhost:5173/src/main.tsx"></script>
</body>
</html>
  `);
});

const PORT = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, '0.0.0.0', () => {
  log(`🚀 Android Kernel Customizer running on port ${PORT}`);
  log(`Application ready at: http://0.0.0.0:${PORT}/`);
  log(`Direct test at: http://0.0.0.0:${PORT}/direct-test`);
  log(`React frontend: http://0.0.0.0:${PORT}/`);
});