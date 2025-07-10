#!/bin/bash

# Start Vite dev server in background
echo "Starting Vite dev server..."
npx vite &
VITE_PID=$!

# Wait a moment for Vite to start
sleep 3

# Start our HTTP server
echo "Starting API server..."
NODE_ENV=development tsx server/index.ts

# Kill Vite when script exits
trap "kill $VITE_PID" EXIT