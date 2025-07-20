import express from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./replitAuth";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Trust proxy for Replit
app.set("trust proxy", 1);

async function startServer() {
  const server = await registerRoutes(app);

  // Set up authentication
  await setupAuth(app);

  // EMERGENCY FIX: Skip Vite entirely if SKIP_VITE=1
  if (process.env.SKIP_VITE === "1") {
    log("🚨 VITE BYPASSED - Serving static content only", "express");
    app.get('*', (req, res) => {
      res.send(`
        <html>
        <head><title>Vite Bypassed</title><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="min-h-screen bg-slate-900 text-emerald-100 p-8">
          <h1 class="text-4xl text-center text-emerald-400">Vite Bypassed Successfully</h1>
          <p class="text-center mt-4">Direct Express server working without Vite websocket issues</p>
          <div class="text-center mt-8">
            <a href="http://0.0.0.0:3001/direct-test" class="bg-emerald-600 px-6 py-2 rounded">
              Test Direct Server (Port 3001)
            </a>
          </div>
        </body>
        </html>
      `);
    });
  } else if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = parseInt(process.env.PORT || "5000", 10);
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`, "express");
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});