import express from "express";
import { createServer } from "http";

const app = express();

// Basic middleware
app.use(express.json());

// Simple test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running without Vite' });
});

// Test route
app.get('/', (req, res) => {
  res.send('<h1>Server is working!</h1><p>This is a test without Vite</p>');
});

const server = createServer(app);
const port = 5000;

server.listen(port, "0.0.0.0", () => {
  console.log(`Test server running on port ${port}`);
});