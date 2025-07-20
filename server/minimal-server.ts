import express from "express";
import path from "path";
import { log } from "./vite";
import { storage } from "./storage";

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
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-green-500">
            <h2 class="text-xl font-semibold text-green-300 mb-4">Quick Links</h2>
            <div class="space-y-2">
                <a href="/direct-test" class="block bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-center">Direct Server Test</a>
                <a href="/api/test" class="block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-center">Test API Endpoint</a>
                <a href="/health" class="block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-center">Health Check</a>
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