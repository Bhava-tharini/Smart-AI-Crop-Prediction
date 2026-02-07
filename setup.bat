@echo off
REM CropAI Quick Start Script for Windows
REM Run this to set up and start the application

echo 🌱 CropAI - Smart Crop Disease Predictor
echo =========================================
echo.

REM Check Python installation
echo ✓ Checking Python...
python --version

REM Create virtual environment if not exists
if not exist "venv" (
    echo ✓ Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo ✓ Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo ✓ Installing Python dependencies...
pip install -r requirements.txt

REM Setup frontend
echo ✓ Installing frontend dependencies...
cd frontend\cropai-ui
call npm install
cd ..\..

echo.
echo =========================================
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo.
echo 1. Terminal 1 - Start backend:
echo    python app.py
echo.
echo 2. Terminal 2 - Start frontend:
echo    cd frontend\cropai-ui
echo    npm run dev
echo.
echo 3. Open browser:
echo    http://localhost:5173
echo.
echo 4. Create account and start using CropAI!
echo.
echo =========================================
pause
