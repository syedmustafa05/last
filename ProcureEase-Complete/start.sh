#!/bin/bash

echo "🚀 Starting ProcureEase ERP System..."
echo "======================================"

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 8.1 or higher."
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "⚠️  Composer not found. Installing Composer..."
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer
fi

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Install dependencies
if [ ! -d "vendor" ]; then
    echo "Installing PHP dependencies..."
    composer install --no-dev --optimize-autoloader
fi

# Create database if it doesn't exist
if [ ! -f "database/database.sqlite" ]; then
    echo "Creating SQLite database..."
    touch database/database.sqlite
fi

# Run migrations (if Laravel is properly set up)
echo "Running database migrations..."
php artisan migrate --force 2>/dev/null || echo "⚠️  Migrations skipped (Laravel not fully configured)"

# Start backend server
echo "🌐 Starting backend server on http://localhost:8000"
php -S localhost:8000 -t public/ &
BACKEND_PID=$!

# Frontend setup
echo "🎨 Setting up frontend..."
cd ../frontend

# Start frontend server
echo "🌐 Starting frontend server on http://localhost:3000"
python3 -m http.server 3000 2>/dev/null || python -m http.server 3000 2>/dev/null || php -S localhost:3000 &
FRONTEND_PID=$!

echo ""
echo "✅ ProcureEase is now running!"
echo "======================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8000"
echo ""
echo "🔐 Demo Credentials:"
echo "   Email: john@example.com"
echo "   Password: password"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait