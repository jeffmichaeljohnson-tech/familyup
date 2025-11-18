# Terminal Command Investigation - `claude`

## Summary

The `claude` terminal command is a shell function that:
1. ✅ **Starts the MCP Skills Server** (if not already running)
2. ✅ **Launches Claude Code** with the project directory

## Current Status

### Function Location
- **File**: `~/.zshrc`
- **Line**: 72
- **Status**: ✅ Function exists and is properly configured

### Function Implementation

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

# Alias for quick access
alias Claude=claude
```

## Verification Results

### ✅ MCP Skills Server
- **Server File**: `/Users/computer/jeffmichaeljohnson-tech/projects/familyup/mcp-skills-server/dist/index.js`
- **Status**: ✅ File exists
- **Current Status**: ✅ Server is running (PID: 52013)

### ✅ Skills Directory
- **Path**: `/Users/computer/jeffmichaeljohnson-tech/projects/familyup/.claude/Skills`
- **Status**: ✅ Directory exists

### ✅ Claude Code Application
- **Path**: `/Applications/Claude.app`
- **Status**: ✅ Application exists

### ✅ MCP Configuration
- **File**: `.mcp.json`
- **Status**: ✅ Configured with skills server
- **Configuration**:
  ```json
  {
    "skills": {
      "command": "node",
      "args": ["/Users/computer/jeffmichaeljohnson-tech/projects/familyup/mcp-skills-server/dist/index.js"],
      "env": {
        "SKILLS_DIR": "/Users/computer/jeffmichaeljohnson-tech/projects/familyup/.claude/Skills"
      }
    }
  }
  ```

## How It Works

### Step 1: MCP Server Check & Start
1. Checks if `mcp-skills-server` process is running using `pgrep`
2. If not running:
   - Changes to project directory
   - Exports `SKILLS_DIR` environment variable
   - Starts server in background: `node "$SERVER_PATH" > /dev/null 2>&1 &`
   - Waits 1 second and verifies server started
   - Reports success or failure

### Step 2: Claude Code Launch
1. Checks if `/Applications/Claude.app` exists
2. If found:
   - Launches Claude Code: `open -a "Claude" "$PROJECT_DIR"`
   - Opens project directory automatically
3. Fallback: Checks for `claude-code` command
4. Error handling: Reports if Claude Code not found

### Step 3: Automatic MCP Connection
When Claude Code launches:
1. Claude Code automatically loads `.mcp.json` from project root
2. MCP server configuration is read
3. Skills MCP server connects automatically via stdio
4. All MCP tools become available in Claude Code session

## Usage

### Basic Usage
```bash
claude
```

or

```bash
Claude
```

### Expected Output

**If server already running:**
```
✅ Skills MCP Server is already running
   PID: 52013
📝 Launching Claude Code...
✅ Claude Code launched with project: /Users/computer/jeffmichaeljohnson-tech/projects/familyup
```

**If server needs to start:**
```
🚀 Starting Skills MCP Server...
✅ Skills MCP Server started successfully
   Server PID: 52013
📝 Launching Claude Code...
✅ Claude Code launched with project: /Users/computer/jeffmichaeljohnson-tech/projects/familyup
```

## MCP Server Details

### Server Type
- **Protocol**: Model Context Protocol (MCP)
- **Transport**: stdio (standard input/output)
- **Mode**: Background process

### Server Capabilities
The MCP Skills Server provides:
- `skills_search` - Search skills by query
- `skills_get` - Get skill documentation
- `skills_list` - List all skills with filters
- `skills_analyze_context` - 3D thinking analysis (technical, architectural, performance)
- `skills_get_categories` - Get all categories
- `skills_get_tags` - Get all tags

### Skills Available
- **Location**: `.claude/Skills/` directory
- **Format**: ZIP files containing skill documentation
- **Count**: 60+ skills available

## Architecture

```
┌─────────────────┐
│   Terminal      │
│   `claude` cmd  │
└────────┬────────┘
         │
         ├─→ Check MCP Server Status
         │
         ├─→ Start Server (if needed)
         │   └─→ node mcp-skills-server/dist/index.js &
         │
         └─→ Launch Claude Code
             └─→ open -a "Claude" /path/to/project
                 │
                 └─→ Claude Code loads .mcp.json
                     │
                     └─→ Connects to MCP Skills Server
                         │
                         └─→ Tools available in session
```

## Troubleshooting

### Server Not Starting
```bash
# Check Node.js
which node
node --version

# Check server file
ls -la mcp-skills-server/dist/index.js

# Check if server is running
pgrep -f mcp-skills-server

# Manual start test
cd /Users/computer/jeffmichaeljohnson-tech/projects/familyup
node mcp-skills-server/dist/index.js
```

### Claude Code Not Launching
```bash
# Check if Claude.app exists
ls -la /Applications/Claude.app

# Manual launch test
open -a "Claude" /Users/computer/jeffmichaeljohnson-tech/projects/familyup
```

### Function Not Found
```bash
# Reload shell config
source ~/.zshrc

# Verify function
type claude

# Check function location
grep "^claude()" ~/.zshrc
```

### MCP Server Not Connecting
1. Check `.mcp.json` exists in project root
2. Verify path in `.mcp.json` is correct
3. Restart Claude Code completely
4. Check Claude Code MCP panel for connection status
5. Verify server is running: `pgrep -f mcp-skills-server`

## Related Files

- **Function Definition**: `~/.zshrc` (line 72)
- **Server Code**: `mcp-skills-server/dist/index.js`
- **MCP Config**: `.mcp.json`
- **Documentation**: 
  - `.claude/TERMINAL_COMMAND_USAGE.md`
  - `.claude/TERMINAL_COMMAND_FIX.md`
  - `mcp-skills-server/MCP_SERVER_GUIDE.md`
  - `mcp-skills-server/README.md`

## Conclusion

✅ **The `claude` terminal command is fully functional and properly configured.**

It successfully:
1. Manages the MCP Skills Server lifecycle
2. Launches Claude Code with the project
3. Enables automatic MCP server connection via `.mcp.json`

The command provides a seamless workflow for starting development sessions with full MCP tool access.

