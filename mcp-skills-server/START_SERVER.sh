#!/bin/bash
# Skills MCP Server Startup Script
# This script starts the Skills MCP server

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_PATH="$PROJECT_DIR/mcp-skills-server/dist/index.js"
SKILLS_DIR="$PROJECT_DIR/.claude/Skills"

# Check if server is already running
if pgrep -f "mcp-skills-server" > /dev/null; then
    echo "✅ Skills MCP Server is already running"
    echo "   PID: $(pgrep -f 'mcp-skills-server')"
    exit 0
fi

# Check if server file exists
if [ ! -f "$SERVER_PATH" ]; then
    echo "❌ Error: Server file not found at $SERVER_PATH"
    echo "   Please run: cd mcp-skills-server && npm run build"
    exit 1
fi

# Check if skills directory exists
if [ ! -d "$SKILLS_DIR" ]; then
    echo "⚠️  Warning: Skills directory not found at $SKILLS_DIR"
fi

# Start the server
echo "🚀 Starting Skills MCP Server..."
echo "   Project: $PROJECT_DIR"
echo "   Server: $SERVER_PATH"
echo "   Skills: $SKILLS_DIR"

cd "$PROJECT_DIR" || exit 1
export SKILLS_DIR="$SKILLS_DIR"
node "$SERVER_PATH" &

# Wait a moment and check if it started
sleep 1
if pgrep -f "mcp-skills-server" > /dev/null; then
    echo "✅ Skills MCP Server started successfully"
    echo "   PID: $(pgrep -f 'mcp-skills-server')"
    echo ""
    echo "💡 The server is now running in the background"
    echo "💡 It will automatically connect when Claude Code starts"
    echo ""
    echo "To stop the server: pkill -f mcp-skills-server"
else
    echo "❌ Failed to start Skills MCP Server"
    exit 1
fi

