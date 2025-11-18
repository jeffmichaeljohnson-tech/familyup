# FamilyUp - Claude Code MCP Configuration

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
- **Purpose**: Local database operations + **Memory System**
- **Database**: `/Users/computer/jeffmichaeljohnson-tech/projects/familyup/familyup.db`
- **Tools Available**:
  - Query database
  - Create/read/update/delete records
  - Manage table schemas
  - **Access memory system (short-term & long-term)**

### 5. **Skills** (`skills`) ⭐ NEW
- **Purpose**: Dynamic skill loading and context-aware skill recommendations
- **Location**: `mcp-skills-server/dist/index.js`
- **Tools Available**:
  - `skills_search` - Search skills by query
  - `skills_get` - Get skill documentation
  - `skills_list` - List all skills with filters
  - `skills_analyze_context` - 3D thinking analysis (technical, architectural, performance)
  - `skills_get_categories` - Get all categories
  - `skills_get_tags` - Get all tags
- **Skills Directory**: `.claude/Skills/` (60+ skills available)

## Memory System

**IMPORTANT**: This project includes a comprehensive memory system for Cursor agents, Claude Code, and Claude Desktop.

### Features
- **Short-term memory**: Session-based context retention
- **Long-term memory**: Persistent knowledge across sessions
- **Project knowledge**: Project-specific persistent knowledge
- **User preferences**: Agent-specific or global preferences
- **Cross-session context**: Shared context between sessions

### Tables
- `sessions` - Active session tracking
- `session_context` - Session-specific context
- `session_memory` - Temporary session memories
- `long_term_memory` - Persistent memories
- `project_knowledge` - Project-specific knowledge
- `user_preferences` - User preferences
- `cross_session_context` - Shared context

### Usage
See `.claude/MEMORY_SYSTEM.md` for complete documentation.

**Quick Example**:
```typescript
import {
    createOrUpdateSession,
    storeLongTermMemory,
    getLongTermMemory,
} from './src/utils/memorySystem';

// Create session
createOrUpdateSession('session-123', 'cursor', process.cwd());

// Store memory
storeLongTermMemory('user_preference', 'preferred_style', 'functional', 'coding', 0.8);

// Retrieve memory
const memories = getLongTermMemory('user_preference', 'coding');
```

## Agent Rules & Automatic Skill Usage ⭐ NEW

**CRITICAL**: See `.claude/AGENT_RULES.md` for complete agent rules.

### Core Principle: Human-Less Intuition

**The agent MUST automatically draw upon relevant skills from `.claude/Skills/` when context, keywords, or problem domain matches, WITHOUT being explicitly asked.**

### Key Rules:
1. **Context-Based Activation** - Automatically use skills when technologies, patterns, or problems match
2. **3D Thinking** - Analyze problems from technical, architectural, and performance dimensions
3. **Proactive Usage** - Don't wait to be asked - use skills automatically
4. **Skill Integration** - Apply skill knowledge in planning, design, implementation, debugging, optimization

### Examples:
- React/JSX → Automatically use `react-development` skill
- Performance issues → Automatically use `debugging-strategies` and `performance-optimization`
- API design → Automatically use `api-design-principles`
- Database migration → Automatically use `database-migration`

**See `.claude/AGENT_RULES.md` for complete rules and examples.**

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
1. Load the MCP server configurations from `.mcp.json` or `.claude/settings.json`
2. Connect to all configured MCP servers
3. Make all MCP tools available during the conversation
4. **Access the memory system via SQLite MCP server**
5. **Access skills via Skills MCP server**
6. **Automatically apply agent rules for skill usage**

You can use commands like `/mcp` to view and manage MCP servers during your session.

## Customization

To add or modify MCP servers, edit `.mcp.json` or `.claude/settings.json` following the MCP server configuration format.

---

## Terminal History Context

**IMPORTANT**: This project has full access to terminal command history (~13,000+ commands) for context-aware assistance.

### Available Functions

Located in `src/utils/terminalSession.ts`:

- `getAllTerminalHistory()` - Get complete history (~13,000 commands)
- `getTerminalSession(limit)` - Get recent commands
- `searchTerminalHistory(pattern, limit)` - Search all history by pattern
- `getRecentWorkflowContext(lookback)` - Analyze recent workflow patterns
- `getProjectContext(projectName, limit)` - Get commands for a specific project
- `searchByKeywords(keywords[], limit)` - Multi-keyword search

### Usage

```typescript
import { getRecentWorkflowContext, searchTerminalHistory } from './src/utils/terminalSession';

// Understand recent workflow
const workflow = getRecentWorkflowContext(100);

// Search for specific commands
const gitCommands = searchTerminalHistory('git', 50);
```

**See `.claude/TERMINAL_HISTORY_CONTEXT.md` for complete documentation.**

### When to Use

- ✅ Understanding what the user has been working on
- ✅ Finding how they've solved similar problems
- ✅ Discovering setup/configuration patterns
- ✅ Getting context about projects or tools
- ✅ Understanding workflow patterns

**The terminal history is a powerful context tool - use it proactively when you need more information!**

For more information on MCP and Claude Code, visit:
https://docs.claude.com/en/docs/claude-code/mcp
