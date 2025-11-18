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
3. ✅ Run in **foreground** (no `&`) for interactive use - CLI tools need to run in foreground to be interactive
4. ✅ Provide helpful error messages if CLI not found

**Important**: Claude Code CLI is an **interactive** tool that requires foreground execution. Running it in background (`&`) prevents user interaction.

## Updated Function

```bash
claude() {
    local PROJECT_DIR="/Users/computer/jeffmichaeljohnson-tech/projects/familyup"
    local SERVER_PATH="$PROJECT_DIR/mcp-skills-server/dist/index.js"
    
    # Check if server is already running
    if pgrep -f "mcp-skills-server" > /dev/null; then
        echo "[OK] Skills MCP Server is already running (PID: $(pgrep -f 'mcp-skills-server'))"
    else
        echo "[START] Starting Skills MCP Server in background..."
        cd "$PROJECT_DIR" || return 1
        export SKILLS_DIR="$PROJECT_DIR/.claude/Skills"
        node "$SERVER_PATH" > /dev/null 2>&1 &
        sleep 1
        if pgrep -f "mcp-skills-server" > /dev/null; then
            echo "[OK] Skills MCP Server started (PID: $(pgrep -f 'mcp-skills-server'))"
        else
            echo "[ERROR] Failed to start Skills MCP Server"
            return 1
        fi
    fi
    
    # Launch Claude Code CLI in foreground (interactive)
    if command -v node > /dev/null 2>&1 && [ -f "/usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js" ]; then
        echo "[LAUNCH] Launching Claude Code CLI (interactive mode)..."
        echo "[INFO] MCP Skills Server is connected via .mcp.json"
        echo ""
        cd "$PROJECT_DIR" || return 1
        # Run in foreground - no & at the end! Interactive CLI needs foreground execution
        node /usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js "$PROJECT_DIR"
    elif [ -d "/Applications/Claude.app" ]; then
        echo "[WARN] Claude Desktop found, but Claude Code CLI not installed."
        echo "       Install: npm install -g @anthropic-ai/claude-code"
    else
        echo "[WARN] Claude Code not found. Install with:"
        echo "       npm install -g @anthropic-ai/claude-code"
    fi
}
```

## Changes Made

1. **Changed launch method**: From `open -a "Claude"` to `node cli.js`
2. **Check for CLI first**: Verifies Claude Code CLI exists before trying Desktop
3. **Foreground execution**: Runs CLI in foreground (no `&`) for interactive use
4. **Better error messages**: Distinguishes between Desktop and CLI

**Key Distinction**:

- **MCP Server**: Runs in background (`&`) - it's a daemon/service
- **Claude Code CLI**: Runs in foreground (no `&`) - it's an interactive tool

## How It Works Now

1. ✅ Checks/starts MCP Skills Server (runs in background with `&`)
2. ✅ Launches **Claude Code CLI** (not Desktop) in foreground for interaction
3. ✅ CLI runs interactively - you can use it directly in the terminal
4. ✅ Shows status messages before launching CLI

## Testing

Run:

```bash
claude
```

Expected output:

```text
[OK] Skills MCP Server is already running (PID: 52013)
[LAUNCH] Launching Claude Code CLI (interactive mode)...
[INFO] MCP Skills Server is connected via .mcp.json

[Claude Code CLI interactive session starts here - you can now interact with it]
```

**Note**: The CLI will take over the terminal for interactive use. When you exit the CLI, you'll return to your shell prompt.

## Key Differences

- **Before**: `open -a "Claude"` → Opens Claude Desktop app
- **After**: `node cli.js` → Launches Claude Code CLI in terminal (foreground, interactive)

## Important Notes

1. **MCP Server** runs in background (`&`) - this is correct for a daemon/service
2. **Claude Code CLI** runs in foreground (no `&`) - this is required for interactive tools
3. The CLI will take control of the terminal - this is expected behavior for interactive CLI tools
4. When you exit Claude Code CLI, you'll return to your shell prompt

---

**Status**: ✅ Fixed! Now launches Claude Code (CLI) in foreground for proper interactive use!
