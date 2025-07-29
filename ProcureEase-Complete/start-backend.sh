#!/bin/bash

# ProcureEase Backend Startup Script

echo "🚀 Starting ProcureEase Backend..."

# Check if we're in the correct directory
if [ ! -f "backend/artisan" ]; then
    echo "❌ Error: Please run this script from the ProcureEase-Complete directory"
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📋 Creating .env file from .env.example..."
    cp .env.example .env
fi

# Install dependencies if vendor directory doesn't exist
if [ ! -d "vendor" ]; then
    echo "📦 Installing Composer dependencies..."
    composer install
fi

# Generate application key if not set
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Generating application key..."
    php artisan key:generate
fi

# Create database file if it doesn't exist
if [ ! -f "database/database.sqlite" ]; then
    echo "🗄️  Creating SQLite database..."
    touch database/database.sqlite
fi

# Run migrations
echo "🔄 Running database migrations..."
php artisan migrate --force

# Seed the database
echo "🌱 Seeding database with sample data..."
php artisan db:seed --force

# Clear cache
echo "🧹 Clearing application cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear

echo "✅ Backend setup complete!"
echo ""
echo "🌐 Starting Laravel development server..."
echo "📍 Backend will be available at: http://localhost:8000"
echo "📍 API endpoints available at: http://localhost:8000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
php artisan serve --host=0.0.0.0 --port=8000