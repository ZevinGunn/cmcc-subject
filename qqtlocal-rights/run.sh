#!/bin/bash
cd "$(dirname "$0")"

# Check Python environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install -r backend/requirements.txt
    ./venv/bin/pip install aiohttp
fi

# Setup JS Utils
if [ -d "backend/js_utils" ]; then
    echo "Setting up JS Utils..."
    cd backend/js_utils
    npm install
    cd ../..
fi

# Build Go worker if needed
if [ ! -f "go-worker/worker" ]; then
    echo "Building Go worker..."
    cd go-worker
    go build -o worker main.go
    cd ..
fi

# Build Java worker if needed
if [ ! -f "java-worker/target/worker-1.0-SNAPSHOT-shaded.jar" ]; then
    if command -v java >/dev/null 2>&1 && java -version >/dev/null 2>&1; then
        echo "Building Java worker..."
        cd java-worker
        if [ -x "./mvnw" ]; then
            ./mvnw clean package -q
        elif command -v mvn >/dev/null 2>&1; then
            mvn clean package -q
        else
            echo "Maven not found and mvnw is unavailable; skipping Java worker build."
        fi
        cd ..
    else
        echo "Java runtime not available; skipping Java worker build. Install JDK 11+ to enable Java executor."
    fi
fi

echo "Starting server..."
HOST="${QQT_HOST:-127.0.0.1}"
PORT="${QQT_PORT:-8899}"
echo "Listening on ${HOST}:${PORT}"
./venv/bin/python3 -m uvicorn backend.app:app --host "$HOST" --port "$PORT"
