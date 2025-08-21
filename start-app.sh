#!/bin/bash

echo "🚀 Starting Simple Payment Request System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    echo "After installing Node.js, run this script again."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Create output directory if it doesn't exist
if [ ! -d "output" ]; then
    echo "📁 Creating output folder..."
    mkdir -p output
    echo ""
fi

echo "✅ Starting the application..."
echo "🌐 Opening in your browser..."
echo ""
echo "The application will open at: http://localhost:3001"
echo ""
echo "To stop the application, press Ctrl+C"
echo ""

# Start the application
npm run frontend
