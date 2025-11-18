# FamilyUp - Claude Code MCP Configuration

## Setup

**First time setup:**

Run the setup script to create your local configuration files:

```bash
./scripts/setup-claude.sh
```

This will:
1. Create `.claude/settings.json` from the template
2. Create `.mcp.json` from the template
3. Update database paths automatically

After running the setup script, edit the created files and add your API keys:
- `GITHUB_PERSONAL_ACCESS_TOKEN` - Your GitHub personal access token
- `BRAVE_API_KEY` - Your Brave Search API key (optional)

**Manual setup:**

If you prefer to set up manually:
1. Copy `.claude/settings.json.example` to `.claude/settings.json`
2. Copy `.mcp.json.example` to `.mcp.json`
3. Edit both files and add your API keys
4. Update the SQLite database path to your project location

## MCP Servers Configured

This project has the following Model Context Protocol (MCP) servers configured:

### 1. **GitHub** (`github`)
- **Purpose**: GitHub repository operations, issues, PRs, code management
- **Tools Available**:
  - Create/update files
  - Create issues and pull requests
  - Search repositories and code
  - Manage branches and commits
  - Review pull requests

### 2. **Brave Search** (`brave-search`)
- **Purpose**: Web and local search capabilities
- **Tools Available**:
  - Web search for general information
  - Local business and place search
  - Recent news and articles

### 3. **Railway** (`railway`)
- **Purpose**: Deployment and environment management
- **Tools Available**:
  - Deploy applications
  - Manage environments and services
  - View logs and deployments
  - Set environment variables
  - Generate domains

### 4. **SQLite** (`sqlite`)
- **Purpose**: Local database operations
- **Database**: `/Users/computer/jeffmichaeljohnson-tech/projects/familyup/familyup.db`
- **Tools Available**:
  - Query database
  - Create/read/update/delete records
  - Manage table schemas

## Configuration Files

- `.mcp.json` - Project-level MCP server configuration (auto-loaded by Claude Code)
- `.claude/settings.json` - Additional Claude Code settings and MCP configuration

## Security

**IMPORTANT**: The MCP configuration files contain sensitive API keys and tokens:
- GitHub Personal Access Token
- Brave Search API Key

These files are added to `.gitignore` to prevent accidental commits. Do NOT commit these files to version control.

## Usage

When you start Claude Code in this directory, it will automatically:
1. Load the MCP server configurations from `.mcp.json`
2. Connect to all configured MCP servers
3. Make all MCP tools available during the conversation

You can use commands like `/mcp` to view and manage MCP servers during your session.

## Customization

To add or modify MCP servers, edit `.mcp.json` or `.claude/settings.json` following the MCP server configuration format.

For more information on MCP and Claude Code, visit:
https://docs.claude.com/en/docs/claude-code/mcp
