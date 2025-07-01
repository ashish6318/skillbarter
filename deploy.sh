#!/bin/bash

# Deployment Script for SkillBarter Platform
# This script prepares the application for deployment

echo "🚀 Preparing SkillBarter for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm ci

echo "📦 Installing backend dependencies..."
cd server
npm ci
cd ..

echo "🧪 Running frontend tests..."
npm test -- src/ --run

echo "🧪 Running backend tests..."
cd server
npm test
cd ..

echo "🏗️ Building frontend for production..."
npm run build

echo "✅ Build completed! Ready for deployment."
echo ""
echo "📋 Next steps:"
echo "1. Deploy backend to Render:"
echo "   - Go to https://dashboard.render.com/"
echo "   - Create new Web Service"
echo "   - Connect GitHub repository"
echo "   - Set root directory to 'server'"
echo "   - Add environment variables"
echo ""
echo "2. Deploy frontend to Vercel:"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Import GitHub repository"
echo "   - Set framework to Vite"
echo "   - Add environment variables"
echo ""
echo "3. Update environment variables with actual URLs"
echo ""
echo "🎉 Happy deploying!"
