# Terminal Command Fix - Claude Code (Not Desktop)

## Issue Fixed

The `claude` terminal command was launching **Claude Desktop** instead of **Claude Code**.

## Root Cause

- `open -a "Claude"` opens `/Applications/Claude.app` which is Claude Desktop
- Claude Code is actually the CLI tool from `@anthropic-ai/claude-code` npm package
- The CLI tool starts an interactive session in the terminal

## Solution

Updated the `claude()` function to:
1. ✅ Check for Claude Code CLI (`/usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js`)
2. ✅ Launch Claude Code CLI using `node cli.js` instead of `open -a "Claude"`
3. ✅ Run in background (`&`) so terminal stays active
4. ✅ Provide helpful error messages if CLI not found

## Updated Function

```bash
claude() {
    local PROJECT_DIR="/Users/computer/jeffmichaeljohnson-tech/projects/familyup"
    local SERVER_PATH="$PROJECT_DIR/mcp-skills-server/dist/index.js"
    
    # Check if server is already running
    if pgrep -f "mcp-skills-server" > /dev/null; then
        echo "✅ Skills MCP Server is already running"
        echo "   PID: $(pgrep -f 'mcp-skills-server')"
    else
        echo "🚀 Starting Skills MCP Server..."
        cd "$PROJECT_DIR" || return 1
        export SKILLS_DIR="$PROJECT_DIR/.claude/Skills"
        node "$SERVER_PATH" > /dev/null 2>&1 &
        sleep 1
        if pgrep -f "mcp-skills-server" > /dev/null; then
            echo "✅ Skills MCP Server started successfully"
            echo "   Server PID: $(pgrep -f 'mcp-skills-server')"
        else
            echo "❌ Failed to start Skills MCP Server"
            return 1
        fi
    fi
    
    # Launch Claude Code (using CLI, not Desktop app)
    if command -v node > /dev/null 2>&1 && [ -f "/usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js" ]; then
        echo "📝 Launching Claude Code..."
        cd "$PROJECT_DIR" || return 1
        node /usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js "$PROJECT_DIR" &
        sleep 0.5
        echo "✅ Claude Code launched with project: $PROJECT_DIR"
        echo "💡 MCP Skills Server will connect automatically via .mcp.json"
        echo "✨ Terminal is ready for your next command."
    elif [ -d "/Applications/Claude.app" ]; then
        echo "⚠️  Warning: Claude Desktop detected. Claude Code CLI not found."
        echo "   Install: npm install -g @anthropic-ai/claude-code"
        echo "   Or use: node /usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js"
    else
        echo "⚠️  Claude Code not found. Please install Claude Code."
        echo "   Install: npm install -g @anthropic-ai/claude-code"
    fi
}
```

## Changes Made

1. **Changed launch method**: From `open -a "Claude"` to `node cli.js`
2. **Check for CLI first**: Verifies Claude Code CLI exists before trying Desktop
3. **Proper background execution**: Uses `&` to run in background
4. **Better error messages**: Distinguishes between Desktop and CLI

## How It Works Now

1. ✅ Checks/starts MCP Skills Server
2. ✅ Launches **Claude Code CLI** (not Desktop)
3. ✅ Runs in background so terminal stays active
4. ✅ Shows completion messages

## Testing

Run:
```bash
claude
```

Expected output:
```
✅ Skills MCP Server is already running
   PID: 52013
📝 Launching Claude Code...
✅ Claude Code launched with project: /Users/computer/jeffmichaeljohnson-tech/projects/familyup
💡 MCP Skills Server will connect automatically via .mcp.json
✨ Terminal is ready for your next command.
```

## Key Difference

- **Before**: `open -a "Claude"` → Opens Claude Desktop app
- **After**: `node cli.js` → Launches Claude Code CLI in terminal

---

**Status**: ✅ Fixed! Now launches Claude Code (CLI) instead of Claude Desktop!

