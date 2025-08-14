#!/bin/bash

# Production Build Script for MERN Bug Tracker
# This script prepares the application for production deployment

set -e  # Exit on any error

echo "🚀 Production Build Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "client/package.json" ] || [ ! -f "server/package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf client/dist
rm -rf server/dist
print_status "Cleanup completed"

# Install dependencies
echo "📦 Installing dependencies..."

echo "Installing backend dependencies..."
cd server
npm ci --only=production
cd ..

echo "Installing frontend dependencies..."
cd client
npm ci
cd ..

print_status "Dependencies installed"

# Run tests
echo "🧪 Running tests..."

echo "Running backend tests..."
cd server
if npm test --silent; then
    print_status "Backend tests passed"
else
    print_error "Backend tests failed"
    exit 1
fi
cd ..

echo "Running frontend tests..."
cd client
if npm test --silent; then
    print_status "Frontend tests passed"
else
    print_error "Frontend tests failed"
    exit 1
fi
cd ..

# Build frontend
echo "🔨 Building frontend..."
cd client
if npm run build; then
    print_status "Frontend build successful"
    
    # Check build output
    if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
        print_status "Build output verified"
        echo "Build size: $(du -sh dist | cut -f1)"
    else
        print_error "Build output is empty or missing"
        exit 1
    fi
else
    print_error "Frontend build failed"
    exit 1
fi
cd ..

# Create production package
echo "📦 Creating production package..."
mkdir -p production
cp -r server/* production/backend/
cp -r client/dist production/frontend/
cp deployment/README.md production/
cp env.example production/

# Create production start script
cat > production/start.sh << 'EOF'
#!/bin/bash
echo "Starting MERN Bug Tracker in production mode..."
cd backend
npm start
EOF

chmod +x production/start.sh

print_status "Production package created"

# Show production package contents
echo "📋 Production package contents:"
ls -la production/

echo ""
print_status "Production build completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Deploy the 'production' folder to your hosting platform"
echo "2. Set environment variables in your hosting platform"
echo "3. Test your deployed application"
echo ""
echo "📚 See deployment/README.md for detailed deployment instructions"
