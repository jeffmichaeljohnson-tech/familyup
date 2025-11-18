# Skills MCP Server

An MCP (Model Context Protocol) server that dynamically loads skills from zip files and provides context-aware skill recognition using 3D thinking (technical, architectural, performance dimensions).

## Features

- **Dynamic Skill Loading**: Automatically loads skills from `.claude/Skills/*.zip` files
- **Skill Discovery**: Search skills by name, description, category, tags, or content
- **Context-Aware Analysis**: Uses 3D thinking to analyze problems from multiple dimensions:
  - **Technical Dimension**: Identifies technologies, patterns, and complexity
  - **Architectural Dimension**: Identifies patterns, concerns, and scale
  - **Performance Dimension**: Identifies concerns, optimizations, and bottlenecks
- **Intelligent Recommendations**: Recommends relevant skills based on context analysis

## Installation

```bash
cd mcp-skills-server
npm install
npm run build
```

## Usage

### Running the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### MCP Client Configuration

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "skills": {
      "command": "node",
      "args": ["/path/to/familyup/mcp-skills-server/dist/index.js"]
    }
  }
}
```

## Available Tools

### `skills_search`
Search for skills by query string.

**Parameters:**
- `query` (string): Search query
- `limit` (number, default: 10): Maximum results

**Example:**
```json
{
  "query": "react performance",
  "limit": 5
}
```

### `skills_get`
Get full documentation for a specific skill.

**Parameters:**
- `name` (string): Skill name
- `format` (enum: 'full' | 'metadata' | 'skill' | 'readme' | 'examples', default: 'full')

**Example:**
```json
{
  "name": "react-development",
  "format": "full"
}
```

### `skills_list`
List all available skills, optionally filtered.

**Parameters:**
- `category` (string, optional): Filter by category
- `tags` (string[], optional): Filter by tags
- `limit` (number, default: 50): Maximum results

**Example:**
```json
{
  "category": "frontend",
  "tags": ["react"],
  "limit": 20
}
```

### `skills_analyze_context`
Analyze context using 3D thinking and recommend skills.

**Parameters:**
- `query` (string): User query or problem description
- `code_context` (string, optional): Code context
- `project_type` (string, optional): Project type

**Example:**
```json
{
  "query": "React app is slow, too many re-renders",
  "code_context": "function Component() { ... }",
  "project_type": "web"
}
```

### `skills_get_categories`
Get all available skill categories.

### `skills_get_tags`
Get all available skill tags.

## Architecture

### Skill Loading
- Skills are loaded from `.claude/Skills/*.zip` files
- Each skill zip contains:
  - `SKILL.md`: Main skill documentation with frontmatter metadata
  - `README.md`: Overview and quick start guide
  - `EXAMPLES.md`: Usage examples (optional)

### 3D Thinking Analysis

The context analyzer examines problems from three dimensions:

1. **Technical Dimension**
   - Detects technologies (React, TypeScript, Python, etc.)
   - Identifies patterns (microservices, API design, etc.)
   - Assesses complexity (low/medium/high)

2. **Architectural Dimension**
   - Identifies architectural patterns
   - Detects concerns (scalability, security, deployment, etc.)
   - Assesses scale (small/medium/large)

3. **Performance Dimension**
   - Identifies performance concerns
   - Suggests optimizations
   - Detects bottlenecks

### Skill Recommendation

Skills are recommended based on:
- Relevance score from search
- Match with detected technologies/patterns
- Applicability to identified dimensions
- Confidence score (0-1)

## Development

### Project Structure

```
mcp-skills-server/
├── src/
│   ├── index.ts              # Main entry point
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── services/
│   │   ├── skillLoader.ts    # Load skills from zip files
│   │   ├── skillRegistry.ts  # Manage and search skills
│   │   └── contextAnalyzer.ts # 3D thinking analysis
│   └── tools/
│       └── skillTools.ts     # MCP tool definitions
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Testing

Test with MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## License

MIT

