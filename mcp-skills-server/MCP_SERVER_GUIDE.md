# Skills MCP Server - Startup Guide

## ✅ Configuration Complete

The Skills MCP Server is now configured to auto-start with Claude Code!

## How It Works

### 1. Auto-Start with Claude Code

When you open Claude Code in this project directory, the MCP server will **automatically start** because it's configured in `.mcp.json`.

**No manual action needed** - just open Claude Code and the server will be available!

### 2. Terminal Command

You can also start the server manually using the terminal:

#### Option A: Using the `claude` function (Recommended)
```bash
claude
```
or
```bash
Claude
```

This will:
- ✅ Check if server is already running
- ✅ Start the server if needed
- ✅ Open Claude Code (if available)

#### Option B: Using the startup script
```bash
cd /Users/computer/jeffmichaeljohnson-tech/projects/familyup
./mcp-skills-server/START_SERVER.sh
```

#### Option C: Direct Node command
```bash
cd /Users/computer/jeffmichaeljohnson-tech/projects/familyup
node mcp-skills-server/dist/index.js
```

## Verifying the Server is Running

### Check if server is running:
```bash
pgrep -f mcp-skills-server
```

If you see a PID number, the server is running.

### Check server logs:
The server outputs to stderr, so you'll see messages like:
```
Initializing Skills MCP Server...
Loading skills from .claude/Skills directory...
Loaded 63 skills
Registered skill tools
Skills MCP Server running via stdio
```

## Stopping the Server

To stop the server:
```bash
pkill -f mcp-skills-server
```

## Troubleshooting

### Server not starting automatically?

1. **Check `.mcp.json` exists** in project root
2. **Verify path** in `.mcp.json` is correct
3. **Restart Claude Code** completely
4. **Check Claude Code logs** for MCP connection errors

### Server starts but tools not available?

1. **Check server is running**: `pgrep -f mcp-skills-server`
2. **Check Claude Code MCP panel**: Look for "skills" server
3. **Verify skills directory**: Should have 60+ zip files
4. **Check server logs** for errors

### Terminal command not working?

1. **Reload shell config**: `source ~/.zshrc`
2. **Check function exists**: `type claude`
3. **Verify paths** in function are correct

## Configuration Files

- **`.mcp.json`** - Claude Code MCP configuration (auto-loads server)
- **`.claude/settings.json`** - Alternative MCP configuration
- **`~/.zshrc`** - Shell function for terminal startup

## Next Steps

1. **Restart your terminal** (or run `source ~/.zshrc`)
2. **Open Claude Code** in this project directory
3. **Verify MCP server** is connected (check MCP panel)
4. **Test skills tools** are available

## Quick Test

Try this in Claude Code:
- Ask: "Search for React skills"
- The agent should use `skills_search` tool automatically
- Or manually use: `/mcp skills_search {"query": "react"}`

---

**The server is now fully automated!** 🎉

