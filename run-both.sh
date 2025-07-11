#!/bin/bash

# Start both servers for Android Kernel Customizer

echo "🚀 Starting Android Kernel Customizer (Full Stack)..."
echo ""

# Kill any existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f vite 2>/dev/null || true

# Wait a moment
sleep 2

# Start backend with environment variable to trigger frontend
echo "Starting servers..."
START_FRONTEND=true NODE_ENV=development tsx server/index.ts