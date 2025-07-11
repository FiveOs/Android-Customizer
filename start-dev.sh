#!/bin/bash

# Kill any existing Vite processes
pkill -f vite || true

# Start Vite in the background
cd /home/runner/workspace
echo "Starting Vite development server..."
npx vite --host 0.0.0.0 --port 5173 &

# Wait a moment for Vite to start
sleep 2

# Check if Vite is running
if ps aux | grep -v grep | grep vite > /dev/null; then
    echo "Vite dev server started successfully on port 5173"
else
    echo "Failed to start Vite dev server"
fi