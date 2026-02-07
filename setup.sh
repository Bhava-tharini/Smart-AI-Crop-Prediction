#!/bin/bash
# CropAI Quick Start Script
# Run this to set up and start the application

echo "🌱 CropAI - Smart Crop Disease Predictor"
echo "========================================="
echo ""

# Check Python installation
echo "✓ Checking Python..."
python --version

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
    echo "✓ Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "✓ Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "✓ Installing Python dependencies..."
pip install -r requirements.txt

# Setup frontend
echo "✓ Installing frontend dependencies..."
cd frontend/cropai-ui
npm install
cd ../..

echo ""
echo "========================================="
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Terminal 1 - Start backend:"
echo "   python app.py"
echo ""
echo "2. Terminal 2 - Start frontend:"
echo "   cd frontend/cropai-ui"
echo "   npm run dev"
echo ""
echo "3. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "4. Create account and start using CropAI!"
echo ""
echo "========================================="
