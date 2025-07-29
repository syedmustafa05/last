#!/bin/bash

# ProcureEase Quick Start Script

echo "🚀 ProcureEase - Complete ERP Procurement Management System"
echo "============================================================"
echo ""

# Check if we're in the correct directory
if [ ! -f "start-backend.sh" ] || [ ! -f "start-frontend.sh" ]; then
    echo "❌ Error: Please run this script from the ProcureEase-Complete directory"
    exit 1
fi

echo "📋 This script will:"
echo "   1. Set up and start the Laravel backend server"
echo "   2. Set up and start the frontend development server"
echo "   3. Open the application in your default browser"
echo ""

read -p "🤔 Do you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled."
    exit 1
fi

echo ""
echo "🔧 Setting up ProcureEase..."

# Make scripts executable
chmod +x start-backend.sh start-frontend.sh

# Check if PHP is available
if ! command -v php &> /dev/null; then
    echo "❌ Error: PHP is not installed. Please install PHP 8.1+ to continue."
    exit 1
fi

# Check if Composer is available
if ! command -v composer &> /dev/null; then
    echo "❌ Error: Composer is not installed. Please install Composer to continue."
    exit 1
fi

echo "✅ Prerequisites check passed!"
echo ""

# Function to open browser
open_browser() {
    sleep 5
    echo "🌐 Opening application in browser..."
    
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:3000/pages/login.html
    elif command -v open > /dev/null; then
        open http://localhost:3000/pages/login.html
    elif command -v start > /dev/null; then
        start http://localhost:3000/pages/login.html
    else
        echo "📍 Please open http://localhost:3000/pages/login.html in your browser"
    fi
}

# Start backend in background
echo "🔧 Starting backend server..."
./start-backend.sh &
BACKEND_PID=$!

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 10

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend failed to start. Please check the error messages above."
    exit 1
fi

echo "✅ Backend is running!"

# Start frontend in background
echo "🌐 Starting frontend server..."
./start-frontend.sh &
FRONTEND_PID=$!

# Wait for frontend to be ready
sleep 3

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Frontend failed to start. Please check the error messages above."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend is running!"
echo ""

# Open browser in background
open_browser &

echo "🎉 ProcureEase is now running!"
echo ""
echo "📍 Application URLs:"
echo "   Frontend: http://localhost:3000/pages/login.html"
echo "   Backend:  http://localhost:8000"
echo "   API:      http://localhost:8000/api"
echo ""
echo "👤 Demo Login Credentials:"
echo "   Email:    admin@procureease.com"
echo "   Password: admin123"
echo ""
echo "⌨️  Commands:"
echo "   Press Ctrl+C to stop both servers"
echo "   Check README.md for detailed documentation"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped. Goodbye!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
echo "🔄 Servers are running... Press Ctrl+C to stop"
wait