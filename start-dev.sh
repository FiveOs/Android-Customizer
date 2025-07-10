#!/bin/bash

# Start the API server in the background
echo "Starting API server on port 5000..."
NODE_ENV=development tsx server/index.ts &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Start Vite dev server
echo "Starting Vite dev server on port 5173..."
npx vite --host 0.0.0.0 --port 5173

# Cleanup on exit
trap "kill $SERVER_PID" EXIT