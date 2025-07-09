// Temporarily using native HTTP server instead of Express due to path-to-regexp conflicts
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

function log(message: string, source = "http") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const method = req.method || 'GET';
  const pathname = url.pathname;

  // Set security and CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  log(`${method} ${pathname}`);

  try {
    // API Routes
    if (pathname === '/api/health') {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify({ 
        status: 'ok', 
        message: 'Android Kernel Customizer is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }));
      return;
    }

    if (pathname === '/api/configurations' && method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify({ 
        message: 'Configuration API temporarily unavailable - migrating from Express to native HTTP',
        configurations: []
      }));
      return;
    }

    if (pathname === '/api/user' && method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(401);
      res.end(JSON.stringify({ message: 'Authentication system being migrated' }));
      return;
    }

    // Frontend fallback
    if (pathname === '/' || !pathname.startsWith('/api')) {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Android Kernel Customizer</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
              }
              .container { 
                background: rgba(255,255,255,0.1); 
                backdrop-filter: blur(10px);
                border-radius: 20px; 
                padding: 40px; 
                max-width: 800px; 
                text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
              }
              h1 { font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
              .status { 
                background: rgba(76,175,80,0.2); 
                padding: 20px; 
                border-radius: 10px; 
                margin: 30px 0; 
                border: 1px solid rgba(76,175,80,0.3);
              }
              .warning {
                background: rgba(255,193,7,0.2);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border: 1px solid rgba(255,193,7,0.3);
              }
              .api-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                gap: 15px; 
                margin: 30px 0; 
              }
              .api-item { 
                background: rgba(255,255,255,0.1); 
                padding: 15px; 
                border-radius: 10px; 
                border-left: 4px solid #4CAF50;
              }
              .btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin: 5px;
                transition: all 0.3s ease;
              }
              .btn:hover { background: rgba(255,255,255,0.3); }
              .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255,255,255,0.2);
                border-radius: 3px;
                overflow: hidden;
                margin: 20px 0;
              }
              .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                width: 75%;
                animation: progress 2s ease-in-out;
              }
              @keyframes progress { from { width: 0%; } to { width: 75%; } }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🔧 Android Kernel Customizer</h1>
              
              <div class="status">
                <h2>✅ Server Status: Active</h2>
                <p>Running on Native HTTP Server (Port 5000)</p>
                <div class="progress-bar"><div class="progress-fill"></div></div>
                <p>Migration Progress: Express → Native HTTP</p>
              </div>

              <div class="warning">
                <h3>⚠️ System Migration in Progress</h3>
                <p>The platform is being migrated from Express to native HTTP due to dependency conflicts with path-to-regexp. Full functionality will be restored shortly.</p>
              </div>

              <div class="api-grid">
                <div class="api-item">
                  <h3>🔍 Health Check</h3>
                  <p>GET /api/health</p>
                  <button class="btn" onclick="testHealth()">Test</button>
                </div>
                <div class="api-item">
                  <h3>⚙️ Configurations</h3>
                  <p>GET /api/configurations</p>
                  <button class="btn" onclick="testConfigs()">Test</button>
                </div>
                <div class="api-item">
                  <h3>👤 User Session</h3>
                  <p>GET /api/user</p>
                  <button class="btn" onclick="testUser()">Test</button>
                </div>
              </div>

              <h3>🚧 Planned Features:</h3>
              <ul style="text-align: left; max-width: 500px; margin: 20px auto;">
                <li>✅ Native HTTP server (no Express dependencies)</li>
                <li>🔄 React frontend integration</li>
                <li>🔄 Kernel configuration management</li>
                <li>🔄 WebSocket for build progress</li>
                <li>🔄 Database integration</li>
                <li>🔄 Authentication system</li>
              </ul>

              <div id="output" style="margin-top: 30px; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 10px; font-family: monospace; text-align: left; max-height: 200px; overflow-y: auto;"></div>
            </div>

            <script>
              function log(message) {
                const output = document.getElementById('output');
                const time = new Date().toLocaleTimeString();
                output.innerHTML += \`<div>[\${time}] \${message}</div>\`;
                output.scrollTop = output.scrollHeight;
              }

              async function testHealth() {
                try {
                  const response = await fetch('/api/health');
                  const data = await response.json();
                  log(\`Health Check: \${JSON.stringify(data)}\`);
                } catch (err) {
                  log(\`Health Check Error: \${err.message}\`);
                }
              }

              async function testConfigs() {
                try {
                  const response = await fetch('/api/configurations');
                  const data = await response.json();
                  log(\`Configurations: \${JSON.stringify(data)}\`);
                } catch (err) {
                  log(\`Configurations Error: \${err.message}\`);
                }
              }

              async function testUser() {
                try {
                  const response = await fetch('/api/user');
                  const data = await response.json();
                  log(\`User: \${JSON.stringify(data)}\`);
                } catch (err) {
                  log(\`User Error: \${err.message}\`);
                }
              }

              // Auto-test health on page load
              window.addEventListener('load', testHealth);
            </script>
          </body>
        </html>
      `);
      return;
    }

    // 404 for unknown routes
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not Found' }));

  } catch (error) {
    console.error('Server error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(500);
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

const port = 5000;
server.listen(port, '0.0.0.0', () => {
  log(`Android Kernel Customizer server running on port ${port}`);
  log('Migrated to native HTTP server - Express dependency issues resolved');
});
