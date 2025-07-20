// EMERGENCY SERVER - Pure Node.js (no TypeScript, no Vite)
const express = require('express');
const app = express();

console.log('🚨 EMERGENCY SERVER STARTING - NO TYPESCRIPT, NO VITE');

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Emergency Test - Pure Node.js</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { background: #0f172a; color: #d1fae5; }</style>
</head>
<body class="min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-center text-red-400 mb-8">
            🚨 EMERGENCY MODE: Pure Node.js Server
        </h1>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-red-500 mb-6">
            <h2 class="text-xl text-red-300 mb-4">Crisis Diagnostics</h2>
            <p class="mb-2">✅ Pure Node.js Express: WORKING</p>
            <p class="mb-2">❌ TypeScript: BYPASSED</p>
            <p class="mb-2">❌ Vite: COMPLETELY REMOVED</p>
            <p class="mb-2">❌ React: NOT LOADED</p>
            <p class="mb-2">✅ Basic HTTP Server: <span class="text-green-400">SUCCESS</span></p>
        </div>
        
        <div class="bg-slate-800 p-6 rounded-lg border-2 border-yellow-500">
            <h2 class="text-xl text-yellow-300 mb-4">Emergency Test</h2>
            <button onclick="test()" class="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded mb-4">
                EMERGENCY TEST
            </button>
            <div id="result" class="text-center text-lg font-bold"></div>
        </div>
        
        <div class="mt-6 bg-slate-800 p-4 rounded border-2 border-green-500">
            <p class="text-green-300 font-bold">CRITICAL DISCOVERY:</p>
            <p class="mt-2">If this page loads, the build system (TypeScript + Vite) is the problem.</p>
            <p class="mt-2">If this fails too, it's a deeper system/network issue.</p>
        </div>
    </div>

    <script>
        console.log('🚨 EMERGENCY MODE: Pure JavaScript running');
        function test() {
            document.getElementById('result').innerHTML = 
                '<span class="text-green-400">🎯 BREAKTHROUGH! Pure Node.js + Express working!</span>';
            console.log('Emergency test: SUCCESS');
        }
        console.log('Emergency mode fully loaded');
    </script>
</body>
</html>
  `);
});

app.get('/api/test', (req, res) => {
  res.json({
    status: 'EMERGENCY_SUCCESS',
    message: 'Pure Node.js server working without any build system',
    timestamp: new Date().toISOString(),
    tech_stack: {
      nodejs: process.version,
      express: 'working',
      typescript: 'bypassed',
      vite: 'not_loaded',
      react: 'not_loaded'
    }
  });
});

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚨 EMERGENCY SERVER running on port ${PORT}`);
  console.log(`🔗 Test at: http://0.0.0.0:${PORT}/`);
  console.log('📊 API test: http://0.0.0.0:${PORT}/api/test');
});