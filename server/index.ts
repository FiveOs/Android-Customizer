// Temporarily using native HTTP server instead of Express due to path-to-regexp conflicts
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { storage } from './storage';
import { db } from './db';
import { WebSocketServer, WebSocket } from 'ws';
import { KernelBuilderService } from './services/kernel-builder';
import { AndroidToolService } from './services/android-tool';
import { createServer as createViteServer } from 'vite';

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

  // Set CORS headers - allow from Vite dev server
  const origin = req.headers.origin || 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Remove restrictive security headers that might block requests
  // res.setHeader('X-Frame-Options', 'DENY');
  // res.setHeader('X-XSS-Protection', '1; mode=block');

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
      try {
        const configurations = await storage.getKernelConfigurations();
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(configurations));
      } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Failed to fetch configurations' }));
      }
      return;
    }

    if (pathname === '/api/configurations' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const configuration = await storage.createKernelConfiguration(body);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(201);
        res.end(JSON.stringify(configuration));
      } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Invalid configuration data' }));
      }
      return;
    }

    if (pathname.startsWith('/api/configurations/') && method === 'GET') {
      const id = parseInt(pathname.split('/')[3]);
      if (isNaN(id)) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Invalid configuration ID' }));
        return;
      }
      try {
        const configuration = await storage.getKernelConfiguration(id);
        if (!configuration) {
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(404);
          res.end(JSON.stringify({ message: 'Configuration not found' }));
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(configuration));
      } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Failed to fetch configuration' }));
      }
      return;
    }

    // Build Jobs API
    if (pathname === '/api/builds' && method === 'GET') {
      try {
        const builds = await storage.getBuildJobs();
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(builds));
      } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Failed to fetch builds' }));
      }
      return;
    }

    if (pathname === '/api/builds' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const buildJob = await storage.createBuildJob(body);
        
        // Start the actual build process
        const configuration = await storage.getKernelConfiguration(buildJob.configurationId);
        if (configuration) {
          kernelBuilderService.startBuild(buildJob, configuration);
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(201);
        res.end(JSON.stringify(buildJob));
      } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Invalid build data' }));
      }
      return;
    }

    if (pathname.match(/^\/api\/builds\/\d+$/) && method === 'DELETE') {
      const id = parseInt(pathname.split('/')[3]);
      try {
        await kernelBuilderService.cancelBuild(id);
        const success = await storage.deleteBuildJob(id);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(success ? 200 : 404);
        res.end(JSON.stringify({ success }));
      } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Failed to cancel build' }));
      }
      return;
    }

    // Device presets API
    if (pathname === '/api/device-presets' && method === 'GET') {
      const { devicePresets } = await import('../shared/schema');
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify(devicePresets));
      return;
    }

    if (pathname === '/api/user' && method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(401);
      res.end(JSON.stringify({ message: 'Authentication system being migrated' }));
      return;
    }

    // Frontend fallback - in dev, proxy to Vite
    if (pathname === '/' || !pathname.startsWith('/api')) {
      if (process.env.NODE_ENV === 'development') {
        // Proxy to Vite dev server
        const http = await import('http');
        const options = {
          hostname: 'localhost',
          port: 5173,
          path: req.url,
          method: req.method,
          headers: req.headers
        };
        
        const proxyReq = http.request(options, (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
          proxyRes.pipe(res);
        });
        
        proxyReq.on('error', () => {
          // If Vite is not running, serve fallback
          res.setHeader('Content-Type', 'text/html');
          res.writeHead(200);
          res.end(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Android Kernel Customizer</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: sans-serif; text-align: center; padding: 50px; }
                  .status { color: green; }
                  .warning { color: orange; background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 600px; }
                </style>
              </head>
              <body>
                <h1>🔧 Android Kernel Customizer</h1>
                <p class="status">✅ API Server is running on port 5000</p>
                <div class="warning">
                  <h3>⚠️ Frontend Development Server Starting...</h3>
                  <p>The React frontend is starting up. Please wait a moment and refresh this page.</p>
                  <p>If the issue persists, the Vite dev server may need to be started.</p>
                </div>
                <p>API Status: <a href="/api/health">/api/health</a></p>
              </body>
            </html>
          `);
        });
        
        req.pipe(proxyReq);
      } else {
        // In production, serve built files
        try {
          const filePath = pathname === '/' ? '/index.html' : pathname;
          const fullPath = join(process.cwd(), 'dist', filePath);
          const content = await readFile(fullPath);
          
          // Set appropriate content type
          const ext = filePath.split('.').pop();
          const contentTypes: Record<string, string> = {
            'html': 'text/html',
            'js': 'application/javascript',
            'css': 'text/css',
            'json': 'application/json',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'svg': 'image/svg+xml'
          };
          
          res.setHeader('Content-Type', contentTypes[ext || 'html'] || 'application/octet-stream');
          res.writeHead(200);
          res.end(content);
        } catch {
          // Serve index.html for client-side routing
          try {
            const indexPath = join(process.cwd(), 'dist', 'index.html');
            const indexContent = await readFile(indexPath);
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            res.end(indexContent);
          } catch {
            res.writeHead(404);
            res.end('Not Found');
          }
        }
      }
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

// WebSocket server for real-time updates
const wss = new WebSocketServer({ server });
const kernelBuilderService = new KernelBuilderService(wss);
const androidToolService = new AndroidToolService(wss);

wss.on('connection', (ws: WebSocket) => {
  log('WebSocket client connected', 'ws');
  
  ws.on('message', async (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      log(`WebSocket message: ${data.type}`, 'ws');
      
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });
  
  ws.on('close', () => {
    log('WebSocket client disconnected', 'ws');
  });
});

const port = 5000;
server.listen(port, '0.0.0.0', async () => {
  log(`Android Kernel Customizer server running on port ${port}`);
  log('Migrated to native HTTP server - Express dependency issues resolved');
  log('WebSocket server ready for real-time updates', 'ws');
  
  // Start Vite dev server in development
  if (process.env.NODE_ENV === 'development') {
    try {
      const vite = await createViteServer({
        server: { host: '0.0.0.0', port: 5173 },
      });
      await vite.listen();
      log('Vite dev server running on port 5173');
    } catch (error) {
      log('Failed to start Vite dev server, continuing without it');
    }
  }
});
