import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [http] ${message}`);
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

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

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
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', message: 'Server is running without Express' }));
      return;
    }

    if (pathname === '/api/test') {
      const body = await parseBody(req);
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Test endpoint working', receivedData: body }));
      return;
    }

    // Frontend fallback
    if (pathname === '/' || !pathname.startsWith('/api')) {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Android Kernel Customizer</title>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              .container { max-width: 800px; margin: 0 auto; }
              .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .api-list { background: #f5f5f5; padding: 15px; border-radius: 5px; }
              h1 { color: #333; }
              h2 { color: #666; }
              ul { list-style-type: none; padding: 0; }
              li { background: white; margin: 5px 0; padding: 10px; border-radius: 3px; border-left: 3px solid #007acc; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🔧 Android Kernel Customizer</h1>
              
              <div class="status">
                <strong>✅ Server Status:</strong> Running successfully on Native HTTP!<br>
                <strong>🚀 Port:</strong> 5000<br>
                <strong>⚡ Mode:</strong> Development
              </div>

              <p>Welcome to the Android Kernel Customizer platform. The server is running using native Node.js HTTP without Express to bypass dependency conflicts.</p>
              
              <div class="api-list">
                <h2>📡 Available API Endpoints:</h2>
                <ul>
                  <li><strong>GET /api/health</strong> - Server health check</li>
                  <li><strong>POST /api/test</strong> - Test endpoint with JSON body</li>
                </ul>
              </div>

              <h2>🔧 Next Steps:</h2>
              <ol>
                <li>Resolve Express/path-to-regexp dependency conflicts</li>
                <li>Integrate React frontend with proper routing</li>
                <li>Add kernel configuration API endpoints</li>
                <li>Implement WebSocket for build progress</li>
              </ol>
            </div>

            <script>
              // Test the API
              fetch('/api/health')
                .then(r => r.json())
                .then(data => console.log('Health check:', data))
                .catch(err => console.error('API Error:', err));
            </script>
          </body>
        </html>
      `);
      return;
    }

    // 404 for unknown routes
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not Found' }));

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
});

const port = 5000;
server.listen(port, '0.0.0.0', () => {
  log(`Android Kernel Customizer server running on port ${port}`);
  log('Using native HTTP server to bypass Express dependency issues');
});