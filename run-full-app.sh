#!/bin/bash

# This script runs both backend and frontend servers

echo "Starting Android Kernel Customizer..."

# Start backend server
echo "Starting backend server on port 5000..."
NODE_ENV=development tsx server/index.ts &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server on port 5173..."
npx vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo ""
echo "✅ Android Kernel Customizer is running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID