# Skills MCP Server - Quick Start Guide

## What is This?

An MCP (Model Context Protocol) server that:
- Dynamically loads skills from `.claude/Skills/*.zip` files
- Provides intelligent skill search and discovery
- Uses **3D thinking** to analyze problems from multiple dimensions:
  - **Technical**: Technologies, patterns, complexity
  - **Architectural**: Patterns, concerns, scale
  - **Performance**: Concerns, optimizations, bottlenecks
- Recommends relevant skills based on context analysis

## Installation

```bash
cd mcp-skills-server
npm install
npm run build
```

## Running

```bash
npm start
```

## MCP Client Configuration

Add to your Claude Desktop config (or other MCP client):

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "skills": {
      "command": "node",
      "args": ["/absolute/path/to/familyup/mcp-skills-server/dist/index.js"]
    }
  }
}
```

## Quick Examples

### 1. Search for Skills

**Query:** "Find skills related to React performance"

**Tool:** `skills_search`
```json
{
  "query": "react performance",
  "limit": 5
}
```

### 2. Get Skill Documentation

**Query:** "Show me the React development skill"

**Tool:** `skills_get`
```json
{
  "name": "react-development",
  "format": "full"
}
```

### 3. Analyze Context (3D Thinking)

**Query:** "My React app is slow with too many re-renders"

**Tool:** `skills_analyze_context`
```json
{
  "query": "React app is slow, too many re-renders",
  "code_context": "function Component() { const [state, setState] = useState(); ... }",
  "project_type": "web"
}
```

**Response includes:**
- Technical dimension analysis (React, frontend patterns)
- Architectural dimension analysis (rendering concerns)
- Performance dimension analysis (re-renders bottleneck)
- Recommended skills with confidence scores

### 4. List Skills by Category

**Query:** "Show me all frontend skills"

**Tool:** `skills_list`
```json
{
  "category": "frontend",
  "limit": 20
}
```

## How 3D Thinking Works

When you use `skills_analyze_context`, the system analyzes your problem from three dimensions:

### Technical Dimension
- **What technologies are involved?** (React, TypeScript, Python, etc.)
- **What patterns are used?** (Microservices, API design, etc.)
- **What's the complexity level?** (Low, Medium, High)

### Architectural Dimension
- **What architectural patterns?** (Microservices, Monorepo, etc.)
- **What are the concerns?** (Scalability, Security, Deployment, etc.)
- **What's the scale?** (Small, Medium, Large)

### Performance Dimension
- **What are the performance concerns?** (Memory, Database, Network, Rendering)
- **What optimizations are needed?** (Caching, Lazy loading, Memoization)
- **What are the bottlenecks?** (Memory leaks, Slow queries, Re-renders)

Based on this analysis, the system recommends the most relevant skills with confidence scores and reasoning.

## Available Tools

| Tool | Purpose |
|------|---------|
| `skills_search` | Search skills by query string |
| `skills_get` | Get full skill documentation |
| `skills_list` | List all skills (with filters) |
| `skills_analyze_context` | Analyze context using 3D thinking |
| `skills_get_categories` | Get all skill categories |
| `skills_get_tags` | Get all skill tags |

## Tips

1. **Use context analysis** when you have a problem but aren't sure which skill applies
2. **Provide code context** for better recommendations
3. **Specify project type** for more accurate scale assessment
4. **Search by keywords** when you know what you're looking for
5. **Filter by category/tags** to narrow down results

## Troubleshooting

**Skills not loading?**
- Check that `.claude/Skills/` directory exists
- Verify zip files are valid
- Check console output for errors

**Poor recommendations?**
- Include more context in your query
- Provide code context if available
- Specify project type

**Server not starting?**
- Run `npm install` first
- Check Node.js version (>= 18)
- Run `npm run build` to compile

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Read [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for architecture details
- Explore available skills using `skills_list`
- Try analyzing different types of problems with `skills_analyze_context`

