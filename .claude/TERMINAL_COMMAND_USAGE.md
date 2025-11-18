# Terminal Command Usage - `claude`

## Quick Start

Type in terminal:
```bash
claude
```

or

```bash
Claude
```

## What It Does

1. ✅ **Checks MCP Server** - Verifies if Skills MCP server is running
2. ✅ **Starts MCP Server** - Starts server if not running (background process)
3. ✅ **Launches Claude Code** - Opens Claude Code application
4. ✅ **Opens Project** - Automatically opens the familyup project directory

## Expected Output

```
✅ Skills MCP Server is already running
   PID: 12345
📝 Launching Claude Code...
✅ Claude Code launched with project: /Users/computer/jeffmichaeljohnson-tech/projects/familyup
```

Or if server needs to start:

```
🚀 Starting Skills MCP Server...
✅ Skills MCP Server started successfully
   Server PID: 12345
📝 Launching Claude Code...
✅ Claude Code launched with project: /Users/computer/jeffmichaeljohnson-tech/projects/familyup
```

## How It Works

### MCP Server
- Checks if `mcp-skills-server` process is running
- If not, starts it in background with proper environment
- Server runs via stdio and connects to Claude Code automatically

### Claude Code Launch
- Uses macOS `open -a "Claude"` command
- Passes project directory as argument
- Claude Code automatically loads `.mcp.json` configuration
- MCP server connects automatically

## Troubleshooting

### Claude Code Doesn't Launch

**Check installation:**
```bash
ls -la /Applications/Claude.app
```

**Manual launch test:**
```bash
open -a "Claude" /Users/computer/jeffmichaeljohnson-tech/projects/familyup
```

### MCP Server Doesn't Start

**Check Node.js:**
```bash
which node
node --version
```

**Check server file:**
```bash
ls -la mcp-skills-server/dist/index.js
```

**Check server manually:**
```bash
cd /Users/computer/jeffmichaeljohnson-tech/projects/familyup
node mcp-skills-server/dist/index.js
```

### Function Not Found

**Reload shell config:**
```bash
source ~/.zshrc
```

**Verify function:**
```bash
type claude
```

**Check function location:**
```bash
grep "^claude()" ~/.zshrc
```

## Configuration

The function is defined in `~/.zshrc`:

- **Project Directory:** `/Users/computer/jeffmichaeljohnson-tech/projects/familyup`
- **Server Path:** `mcp-skills-server/dist/index.js`
- **Skills Directory:** `.claude/Skills`

## Benefits

✅ **One Command** - Start server and launch Claude Code  
✅ **Automatic** - No manual steps needed  
✅ **Project Ready** - Opens project directory automatically  
✅ **MCP Connected** - Server connects automatically via `.mcp.json`  
✅ **Background Server** - Server runs in background, doesn't block terminal  

---

**Just type `claude` and everything starts automatically!** 🚀

