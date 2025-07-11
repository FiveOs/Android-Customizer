#!/usr/bin/env node

const concurrently = require('concurrently');

console.log('🚀 Starting Android Kernel Customizer Development Servers...\n');

const { result } = concurrently([
  {
    command: 'NODE_ENV=development tsx server/index.ts',
    name: 'backend',
    prefixColor: 'blue'
  },
  {
    command: 'REPL_ID="" npx vite --host 0.0.0.0 --port 5173',
    name: 'frontend',
    prefixColor: 'green'
  }
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
});

result.then(
  () => console.log('All servers stopped'),
  (error) => console.error('Server error:', error)
);