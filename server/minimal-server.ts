import express from "express";
import path from "path";
import { log } from "./vite";

const app = express();

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

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  log(`🚀 DIRECT SERVER (No Vite) running on port ${PORT}`, "direct-server");
  log(`Test at: http://0.0.0.0:${PORT}/direct-test`, "direct-server");
});