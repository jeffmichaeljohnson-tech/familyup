#!/bin/bash
# Setup script for Claude Code configuration

set -e

echo "🚀 Setting up Claude Code for FamilyUp..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .claude/settings.json exists
if [ ! -f ".claude/settings.json" ]; then
    echo "${YELLOW}Creating .claude/settings.json from template...${NC}"
    cp .claude/settings.json.example .claude/settings.json
    echo "${GREEN}✓ Created .claude/settings.json${NC}"
    echo "${YELLOW}⚠️  Please edit .claude/settings.json and add your API keys${NC}"
else
    echo "${GREEN}✓ .claude/settings.json already exists${NC}"
fi

# Check if .mcp.json exists
if [ ! -f ".mcp.json" ]; then
    echo "${YELLOW}Creating .mcp.json from template...${NC}"
    cp .mcp.json.example .mcp.json
    echo "${GREEN}✓ Created .mcp.json${NC}"
    echo "${YELLOW}⚠️  Please edit .mcp.json and add your API keys${NC}"
else
    echo "${GREEN}✓ .mcp.json already exists${NC}"
fi

# Get absolute path for SQLite database
PROJECT_DIR=$(pwd)
DB_PATH="$PROJECT_DIR/familyup.db"

# Update database path in config files
if [ -f ".claude/settings.json" ]; then
    # Use sed to replace the placeholder path
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|/path/to/familyup/familyup.db|$DB_PATH|g" .claude/settings.json
    else
        # Linux
        sed -i "s|/path/to/familyup/familyup.db|$DB_PATH|g" .claude/settings.json
    fi
    echo "${GREEN}✓ Updated database path in .claude/settings.json${NC}"
fi

if [ -f ".mcp.json" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|/path/to/familyup/familyup.db|$DB_PATH|g" .mcp.json
    else
        sed -i "s|/path/to/familyup/familyup.db|$DB_PATH|g" .mcp.json
    fi
    echo "${GREEN}✓ Updated database path in .mcp.json${NC}"
fi

echo ""
echo "${GREEN}✅ Claude Code setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .claude/settings.json and/or .mcp.json"
echo "2. Add your GITHUB_PERSONAL_ACCESS_TOKEN"
echo "3. Add your BRAVE_API_KEY (if using Brave Search)"
echo "4. Run 'claude' in this directory to start Claude Code"
echo ""
