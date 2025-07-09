import express from "express";
import { createServer } from "http";
import { setupVite, log } from "./vite";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

(async () => {
  try {
    const server = createServer(app);

    // Setup Vite in development
    if (process.env.NODE_ENV === 'development') {
      await setupVite(app, server);
    }

    // Start server
    const port = 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
})();