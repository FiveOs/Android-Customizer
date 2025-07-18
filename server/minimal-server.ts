// Minimal HTTP server with Vite integration to bypass Express path-to-regexp issues
import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { log } from "./vite";
import viteConfig from "../vite.config";

const PORT = parseInt(process.env.PORT || '5000', 10);
const isDev = process.env.NODE_ENV !== 'production';

// Helper function to get content type from file extension
function getContentType(ext: string): string {
  const contentTypes: { [key: string]: string } = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

async function createServer() {
  let vite: any;

  // Create Vite server in middleware mode for development
  if (isDev) {
    vite = await createViteServer({
      ...viteConfig,
      configFile: false,
      server: {
        middlewareMode: true,
        fs: {
          strict: true,
          deny: ["**/.*"],
        },
        hmr: false, // Disable HMR due to WebSocket binding issues on Replit
        allowedHosts: [
          "3d602858-edd4-4e27-b15c-cfc964504eaf-00-t8m0c5omg1og.riker.replit.dev",
          ".replit.dev",
          ".replit.app",
          "localhost"
        ],
      },
    });
  }

  // Create HTTP server
  const server = http.createServer(async (req, res) => {
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
      
      // Authentication routes
      if (pathname === '/api/auth/user') {
        // For now, return a mock user to get the app working
        // TODO: Implement proper session handling without Express
        res.writeHead(200);
        res.end(JSON.stringify({
          id: "mock-user-id",
          email: "demo@example.com",
          firstName: "Demo",
          lastName: "User",
          profileImageUrl: null
        }));
        return;
      }
      
      if (pathname === '/api/login') {
        // Redirect to Replit OAuth
        const clientId = process.env.REPL_ID;
        const domain = req.headers.host || 'localhost:5000';
        const redirectUri = `https://${domain}/api/callback`;
        const authUrl = `https://replit.com/oidc/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile%20offline_access&prompt=login%20consent`;
        
        res.writeHead(302, { 'Location': authUrl });
        res.end();
        return;
      }
      
      if (pathname === '/api/callback') {
        // Handle OAuth callback
        const code = parsedUrl.query.code;
        if (code) {
          // For now, just redirect to home page
          // TODO: Exchange code for tokens and create session
          res.writeHead(302, { 'Location': '/' });
          res.end();
          return;
        }
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing authorization code' }));
        return;
      }
      
      if (pathname === '/api/logout') {
        // Logout and redirect
        const clientId = process.env.REPL_ID;
        const domain = req.headers.host || 'localhost:5000';
        const postLogoutUrl = `https://${domain}`;
        const logoutUrl = `https://replit.com/oidc/logout?client_id=${clientId}&post_logout_redirect_uri=${encodeURIComponent(postLogoutUrl)}`;
        
        res.writeHead(302, { 'Location': logoutUrl });
        res.end();
        return;
      }
      
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
      return;
    }
    
    // Handle non-API routes with Vite
    if (isDev && vite) {
      // Let Vite handle the request
      return new Promise((resolve) => {
        vite.middlewares(req, res, (err: any) => {
          if (err) {
            console.error('Vite middleware error:', err);
            res.writeHead(500);
            res.end('Internal Server Error');
          } else {
            // If Vite didn't handle the request, serve index.html
            if (!res.headersSent) {
              const template = fs.readFileSync(path.resolve('client', 'index.html'), 'utf-8');
              vite.transformIndexHtml(req.url || '/', template).then((html) => {
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200);
                res.end(html);
              }).catch((e) => {
                console.error('Vite transform error:', e);
                res.writeHead(500);
                res.end('Internal Server Error');
              });
            }
          }
          resolve(undefined);
        });
      });
    } else {
      // Production mode - serve static files
      const indexPath = path.join(process.cwd(), 'dist/public', 'index.html');
      
      // Check if this is a static asset request
      if (pathname !== '/' && pathname.includes('.')) {
        const assetPath = path.join(process.cwd(), 'dist/public', pathname);
        
        // Check if file exists
        if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
          const ext = path.extname(assetPath);
          const contentType = getContentType(ext);
          
          res.setHeader('Content-Type', contentType);
          res.writeHead(200);
          fs.createReadStream(assetPath).pipe(res);
          return;
        }
      }
      
      // Serve index.html for all other routes (React routing)
      if (fs.existsSync(indexPath)) {
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        fs.createReadStream(indexPath).pipe(res);
        return;
      }
      
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    log(`Android Kernel Customizer server running at http://0.0.0.0:${PORT}`, 'minimal-server');
    log('Developed by FiveO - https://github.com/FiveOs/android-kernel-customizer', 'minimal-server');
    if (isDev) {
      log('Development mode with Vite integration enabled', 'minimal-server');
    }
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});