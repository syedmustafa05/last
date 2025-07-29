#!/bin/bash

# ProcureEase Frontend Startup Script

echo "🌐 Starting ProcureEase Frontend..."

# Check if we're in the correct directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the ProcureEase-Complete directory"
    exit 1
fi

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
else
    echo "❌ Error: Python is not installed. Please install Python to run the frontend server."
    exit 1
fi

echo "✅ Frontend setup complete!"
echo ""
echo "🌐 Starting frontend development server..."
echo "📍 Frontend will be available at: http://localhost:3000"
echo "📍 Make sure the backend is running at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Navigate to frontend directory and start server
cd frontend
$PYTHON_CMD -m http.server 3000