import { spawn } from 'child_process';
import { createServer } from 'vite';

async function startDev() {
  console.log('Starting development servers...');
  
  // Start Vite dev server
  try {
    const vite = await createServer({
      server: {
        host: '0.0.0.0',
        port: 5173,
      },
    });
    await vite.listen();
    console.log('✅ Vite dev server running on http://localhost:5173');
  } catch (error) {
    console.error('Failed to start Vite:', error);
  }
  
  // Import and start the main server
  await import('./index.js');
}

startDev().catch(console.error);