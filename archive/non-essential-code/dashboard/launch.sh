#!/bin/bash

# Infinite Idol Desktop Dashboard Launcher

echo "🎯 Launching Infinite Idol Command Center..."

cd "$(dirname "$0")"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not found"
    echo "Please install Python 3 from python.org"
    exit 1
fi

# Launch the desktop app
python3 desktop_app.py
