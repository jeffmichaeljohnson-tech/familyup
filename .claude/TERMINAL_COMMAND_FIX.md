# Terminal Command Fix - Claude Code Launch

## Issue Fixed

The `claude` terminal command was starting the MCP server but **not launching Claude Code**.

## Solution

Updated the `claude()` function in `~/.zshrc` to:

1. ✅ Start the MCP server (as before)
2. ✅ **Launch Claude Code** using `open -a "Claude"` on macOS
3. ✅ Open the project directory automatically
4. ✅ Provide helpful error messages if Claude Code not found

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
    
    # Launch Claude Code
    if [ -d "/Applications/Claude.app" ]; then
        echo "📝 Launching Claude Code..."
        open -a "Claude" "$PROJECT_DIR"
        echo "✅ Claude Code launched with project: $PROJECT_DIR"
    elif command -v claude-code > /dev/null 2>&1; then
        echo "📝 Starting Claude Code..."
        claude-code "$PROJECT_DIR" &
    else
        echo "⚠️  Claude Code not found. Please install Claude Code."
        echo "   Expected location: /Applications/Claude.app"
    fi
}
```

## Changes Made

1. **Added Claude Code launch** using `open -a "Claude"` for macOS
2. **Added project directory** as argument to open project automatically
3. **Added SKILLS_DIR export** for proper server configuration
4. **Improved error handling** with helpful messages
5. **Suppressed server output** (`> /dev/null 2>&1`) for cleaner terminal

## Usage

Now when you type:
```bash
claude
```

or

```bash
Claude
```

It will:
1. ✅ Check if MCP server is running (start if not)
2. ✅ Launch Claude Code
3. ✅ Open the project directory automatically
4. ✅ MCP server will connect automatically (via `.mcp.json`)

## Testing

To test:
```bash
# Reload shell config
source ~/.zshrc

# Run command
claude
```

Expected output:
```
✅ Skills MCP Server is already running
   PID: 12345
📝 Launching Claude Code...
✅ Claude Code launched with project: /Users/computer/jeffmichaeljohnson-tech/projects/familyup
```

## Troubleshooting

**Claude Code doesn't launch?**
- Check if `/Applications/Claude.app` exists
- Verify you have permission to launch apps
- Try manually: `open -a "Claude"`

**MCP server doesn't start?**
- Check if `node` is available: `which node`
- Verify server file exists: `ls mcp-skills-server/dist/index.js`
- Check server logs for errors

---

**✅ Fixed! The `claude` command now launches both the MCP server AND Claude Code!**

