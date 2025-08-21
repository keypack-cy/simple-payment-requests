@echo off
title Simple Payment Request System
color 0A

echo.
echo ========================================
echo    Simple Payment Request System
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    echo After installing Node.js, run this script again.
    echo.
    pause
    exit /b 1
)

echo Node.js found ✓
echo.

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Dependencies ready ✓
echo.

echo Creating output folder...
if not exist "output" mkdir output
echo Output folder ready ✓
echo.

echo Starting the application...
echo.
echo The application will open at: http://localhost:3001
echo.
echo To stop the application, press Ctrl+C
echo.
echo ========================================
echo.

npm run frontend

echo.
echo Application stopped.
pause
