#!/usr/bin/env node

// This script starts both backend and frontend servers for the Android Kernel Customizer

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Android Kernel Customizer...\n');

// Start backend server
console.log('[Backend] Starting API server on port 5000...');
const backend = spawn('tsx', ['server/index.ts'], {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: ['inherit', 'inherit', 'inherit'],
  cwd: process.cwd()
});

// Give backend time to start
setTimeout(() => {
  console.log('[Frontend] Starting Vite dev server on port 5173...');
  
  // Start frontend server with REPL_ID="" to bypass Replit plugins
  const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
    env: { ...process.env, REPL_ID: '', NODE_ENV: 'development' },
    stdio: ['inherit', 'inherit', 'inherit'],
    cwd: process.cwd()
  });

  frontend.on('error', (err) => {
    console.error('[Frontend] Error:', err);
    process.exit(1);
  });

  frontend.on('exit', (code) => {
    if (code !== 0) {
      console.error(`[Frontend] Exited with code ${code}`);
      backend.kill();
      process.exit(code);
    }
  });
}, 3000);

backend.on('error', (err) => {
  console.error('[Backend] Error:', err);
  process.exit(1);
});

backend.on('exit', (code) => {
  if (code !== 0) {
    console.error(`[Backend] Exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Stopping servers...');
  backend.kill();
  process.exit(0);
});

console.log('\n✅ Android Kernel Customizer starting...');
console.log('   Backend: http://localhost:5000');
console.log('   Frontend: http://localhost:5173\n');