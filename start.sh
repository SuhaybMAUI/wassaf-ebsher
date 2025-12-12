#!/bin/bash

# Wassaf Startup Script
# سكريبت تشغيل وصّاف

echo "🚀 Starting Wassaf Services..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Start ML Service
echo -e "${YELLOW}Starting ML Service...${NC}"
cd ml-service
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install torch --index-url https://download.pytorch.org/whl/cpu
    pip install fastapi uvicorn transformers peft accelerate sentencepiece protobuf python-multipart pydantic
else
    source venv/bin/activate
fi

python3 main.py &
ML_PID=$!
cd ..

# Wait for ML service to start
echo "Waiting for ML service to start..."
sleep 5

# Check if ML service is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ML Service running on http://localhost:8000${NC}"
else
    echo "⏳ ML Service is loading model (may take 1-2 minutes on first run)..."
fi

# Start Next.js
echo -e "${YELLOW}Starting Next.js...${NC}"
npm run dev &
NEXT_PID=$!

# Wait for Next.js to start
sleep 5

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Wassaf is running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "🌐 Web App:    http://localhost:3000"
echo "🤖 ML Service: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"

# Handle shutdown
trap "echo ''; echo 'Stopping services...'; kill $ML_PID $NEXT_PID 2>/dev/null; exit 0" SIGINT SIGTERM

# Keep script running
wait
