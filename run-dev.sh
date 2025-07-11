#!/bin/bash

echo "Starting Android Kernel Customizer development servers..."

# Kill any existing processes
echo "Cleaning up existing processes..."
pkill -f "tsx server/index.ts" || true
pkill -f vite || true
sleep 2

# Start API server
echo "Starting API server on port 5000..."
cd /home/runner/workspace
NODE_ENV=development tsx server/index.ts &
API_PID=$!
sleep 3

# Check if API server started
if ps -p $API_PID > /dev/null; then
    echo "✓ API server started successfully on port 5000"
else
    echo "✗ Failed to start API server"
    exit 1
fi

# Start Vite dev server
echo "Starting Vite frontend server on port 5173..."
npx vite --host 0.0.0.0 --port 5173 &
VITE_PID=$!
sleep 5

# Check if Vite started
if ps -p $VITE_PID > /dev/null; then
    echo "✓ Vite server started successfully on port 5173"
else
    echo "✗ Failed to start Vite server"
fi

echo ""
echo "Android Kernel Customizer is running!"
echo "- Frontend: http://localhost:5173"
echo "- API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Keep the script running
wait