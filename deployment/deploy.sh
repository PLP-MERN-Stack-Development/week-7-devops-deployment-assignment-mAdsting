#!/bin/bash

# MERN Bug Tracker Deployment Script
# This script helps automate the deployment process

echo "🚀 MERN Bug Tracker Deployment Script"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "client/package.json" ] && [ ! -f "server/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Function to run tests
run_tests() {
    echo "🧪 Running tests..."
    
    echo "Testing backend..."
    cd server
    if npm test; then
        echo "✅ Backend tests passed"
    else
        echo "❌ Backend tests failed"
        exit 1
    fi
    cd ..
    
    echo "Testing frontend..."
    cd client
    if npm test; then
        echo "✅ Frontend tests passed"
    else
        echo "❌ Frontend tests failed"
        exit 1
    fi
    cd ..
}

# Function to build application
build_application() {
    echo "🔨 Building application..."
    
    echo "Building frontend..."
    cd client
    if npm run build; then
        echo "✅ Frontend build successful"
    else
        echo "❌ Frontend build failed"
        exit 1
    fi
    cd ..
    
    echo "✅ Application build completed"
}

# Function to check environment variables
check_env() {
    echo "🔐 Checking environment variables..."
    
    if [ ! -f ".env" ]; then
        echo "⚠️  Warning: .env file not found"
        echo "   Please copy env.example to .env and fill in your values"
    else
        echo "✅ .env file found"
    fi
    
    if [ ! -f "server/.env" ]; then
        echo "⚠️  Warning: server/.env file not found"
        echo "   Please create server/.env with your MongoDB connection string"
    else
        echo "✅ server/.env file found"
    fi
}

# Function to show deployment status
show_status() {
    echo "📊 Deployment Status"
    echo "==================="
    echo "Backend: Ready for deployment to Render"
    echo "Frontend: Ready for deployment to Vercel"
    echo ""
    echo "Next steps:"
    echo "1. Deploy backend to Render (see deployment/README.md)"
    echo "2. Deploy frontend to Vercel (see deployment/README.md)"
    echo "3. Set up GitHub secrets for CI/CD"
    echo "4. Test your deployed application"
}

# Main menu
case "${1:-}" in
    "test")
        run_tests
        ;;
    "build")
        build_application
        ;;
    "check")
        check_env
        ;;
    "status")
        show_status
        ;;
    "all")
        run_tests
        build_application
        check_env
        show_status
        ;;
    *)
        echo "Usage: $0 {test|build|check|status|all}"
        echo ""
        echo "Commands:"
        echo "  test   - Run all tests"
        echo "  build  - Build the application"
        echo "  check  - Check environment variables"
        echo "  status - Show deployment status"
        echo "  all    - Run all checks and builds"
        echo ""
        echo "Examples:"
        echo "  $0 test    # Run tests only"
        echo "  $0 all     # Run everything"
        ;;
esac

echo ""
echo "🎉 Deployment script completed!"
