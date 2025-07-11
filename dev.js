#!/usr/bin/env node

// Simple dev script to run both servers
const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting Android Kernel Customizer Development Environment...\n');

// Use concurrently to run both servers
const command = `npx concurrently -k -p "[{name}]" -n "Backend,Frontend" -c "blue.bold,green.bold" "NODE_ENV=development tsx server/index.ts" "REPL_ID='' npx vite --host 0.0.0.0 --port 5173"`;

const proc = exec(command, { cwd: __dirname });

proc.stdout.on('data', (data) => {
  process.stdout.write(data);
});

proc.stderr.on('data', (data) => {
  process.stderr.write(data);
});

proc.on('exit', (code) => {
  process.exit(code);
});