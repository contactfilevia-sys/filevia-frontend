#!/bin/bash

# Document Converter Backend Startup Script

echo "🚀 Starting Document Converter Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if LibreOffice is installed
if ! command -v libreoffice &> /dev/null && ! command -v soffice &> /dev/null; then
    echo "⚠️  Warning: LibreOffice not found. Document conversions may fail."
    echo "   Install LibreOffice: sudo apt-get install libreoffice"
fi

# Check if poppler-utils is installed (for PDF to image)
if ! command -v pdftoppm &> /dev/null; then
    echo "⚠️  Warning: poppler-utils not found. PDF to image conversion may fail."
    echo "   Install poppler-utils: sudo apt-get install poppler-utils"
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please configure it before starting."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create temp directories
mkdir -p tmp/uploads tmp/outputs

# Start the server
echo "✅ Starting server..."
npm start
