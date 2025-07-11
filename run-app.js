const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Android Kernel Customizer...\n');

// Start backend server
const backend = spawn('tsx', ['server/index.ts'], {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit'
});

// Start frontend server
const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
  env: { ...process.env, REPL_ID: '', NODE_ENV: 'development' },
  stdio: 'inherit',
  cwd: path.resolve(__dirname)
});

console.log('\n✅ Android Kernel Customizer is starting!');
console.log('Backend: http://localhost:5000');
console.log('Frontend: http://localhost:5173\n');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});

backend.on('error', (err) => {
  console.error('Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('Frontend error:', err);
});