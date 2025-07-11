// Minimal HTTP server to bypass Express path-to-regexp issues
import http from 'http';
import url from 'url';
import { setupVite, serveStatic, log } from "./vite";

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url || '/', true);
  const pathname = parsedUrl.pathname || '/';
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API routes
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    
    if (pathname === '/api/test') {
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Android Kernel Customizer API is running!' }));
      return;
    }
    
    if (pathname === '/api/configurations') {
      res.writeHead(200);
      res.end(JSON.stringify([]));
      return;
    }
    
    if (pathname === '/api/builds') {
      res.writeHead(200);
      res.end(JSON.stringify([]));
      return;
    }
    
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'API endpoint not found' }));
    return;
  }
  
  // Serve static files for the root path
  if (pathname === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Android Kernel Customizer</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .status {
            background: #e8f5e8;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #4caf50;
          }
          .api-test {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
          }
          .developer {
            margin-top: 10px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔧 Android Kernel Customizer</h1>
          <div class="status">
            <strong>✅ Server Status:</strong> Running successfully!
          </div>
          <div class="api-test">
            <strong>🚀 API Status:</strong> Ready to serve kernel customization requests
          </div>
          <p>Welcome to the Android Kernel Customizer platform. This comprehensive web-based tool helps you build custom Android kernels with NetHunter security features.</p>
          
          <h3>🎯 Key Features:</h3>
          <ul>
            <li>40+ preconfigured device support</li>
            <li>NetHunter security patches integration</li>
            <li>Real-time build progress monitoring</li>
            <li>WSL2 integration for Windows users</li>
            <li>KernelSU and Magisk support</li>
            <li>Advanced toolchain configuration</li>
          </ul>
          
          <div class="footer">
            <div class="developer">
              <strong>Developer:</strong> FiveO<br>
              <strong>GitHub:</strong> <a href="https://github.com/FiveOs/android-kernel-customizer" target="_blank">https://github.com/FiveOs/android-kernel-customizer</a>
            </div>
          </div>
        </div>
        
        <script>
          // Test API connectivity
          fetch('/api/test')
            .then(response => response.json())
            .then(data => {
              console.log('API Test:', data);
            })
            .catch(error => {
              console.error('API Test failed:', error);
            });
        </script>
      </body>
      </html>
    `);
    return;
  }
  
  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  log(`Android Kernel Customizer server running at http://0.0.0.0:${PORT}`);
  log('Developed by FiveO - https://github.com/FiveOs/android-kernel-customizer');
});

// Skip Vite integration for now due to Express dependency issues
// TODO: Fix Vite integration once Express issues are resolved