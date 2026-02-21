#!/bin/bash
# Kill vite server
pkill -f vite

# Clear vite cache
rm -rf node_modules/.vite

# Clear build cache
rm -rf dist

echo "✅ Cache cleared!"
echo "🚀 Starting fresh dev server..."

# Start dev server
npm run dev
