// This wrapper starts both backend and frontend servers
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

console.log('🚀 Starting Android Kernel Customizer (Full Stack)...\n');

// Start the actual backend server
import('./index.js');

// Start frontend after a delay
setTimeout(() => {
  console.log('[Frontend] Starting Vite dev server on port 5173...');
  
  const frontend = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
    env: { ...process.env, REPL_ID: '', NODE_ENV: 'development' },
    stdio: 'inherit',
    cwd: rootDir
  });

  frontend.on('error', (err) => {
    console.error('[Frontend] Error:', err);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n⏹️  Stopping frontend server...');
    frontend.kill();
    process.exit(0);
  });
}, 3000);

console.log('\n✅ Starting both servers...');
console.log('   Backend: http://localhost:5000');
console.log('   Frontend: http://localhost:5173\n');