# Skills MCP Server - Implementation Guide

## Overview

This MCP server implements a sophisticated skill management system that dynamically loads skills from zip files and provides context-aware recommendations using 3D thinking (technical, architectural, and performance dimensions).

## Architecture

### Core Components

1. **SkillLoader** (`src/services/skillLoader.ts`)
   - Extracts skills from zip files
   - Parses frontmatter metadata
   - Loads SKILL.md, README.md, and EXAMPLES.md content

2. **SkillRegistry** (`src/services/skillRegistry.ts`)
   - Manages loaded skills in memory
   - Provides search functionality
   - Filters by category and tags

3. **ContextAnalyzer** (`src/services/contextAnalyzer.ts`)
   - Implements 3D thinking analysis
   - Analyzes technical, architectural, and performance dimensions
   - Recommends skills based on context

4. **SkillTools** (`src/tools/skillTools.ts`)
   - Defines MCP tools for skill discovery
   - Provides search, retrieval, and analysis capabilities

## 3D Thinking System

### Technical Dimension

Analyzes:
- **Technologies**: React, TypeScript, Python, Node.js, etc.
- **Patterns**: Microservices, API design, authentication, etc.
- **Complexity**: Low, medium, or high based on indicators

**Detection Logic:**
- Scans query and code context for technology keywords
- Identifies patterns from query terms
- Assesses complexity based on indicators and technology count

### Architectural Dimension

Analyzes:
- **Patterns**: Microservices, monorepo, API design, database design
- **Concerns**: Scalability, security, deployment, testing, observability
- **Scale**: Small, medium, or large based on project type and indicators

**Detection Logic:**
- Identifies architectural patterns from query
- Detects concerns (scale, security, performance, deployment)
- Determines scale from project type and query indicators

### Performance Dimension

Analyzes:
- **Concerns**: General performance, memory, database, network, rendering
- **Optimizations**: Caching, lazy loading, memoization, database indexing
- **Bottlenecks**: Memory leaks, slow queries, network latency, re-renders

**Detection Logic:**
- Identifies performance-related keywords
- Detects optimization strategies mentioned
- Identifies potential bottlenecks

## Skill Recommendation Algorithm

1. **Multi-Dimensional Analysis**
   - Analyzes query from all three dimensions
   - Extracts technologies, patterns, and concerns

2. **Search Term Generation**
   - Combines detected technologies, patterns, and concerns
   - Creates comprehensive search query

3. **Skill Matching**
   - Searches skills using generated terms
   - Calculates relevance scores

4. **Score Boosting**
   - Boosts scores for exact technology matches
   - Boosts scores for pattern matches
   - Normalizes confidence scores (0-1)

5. **Recommendation Formatting**
   - Includes reasoning for each recommendation
   - Identifies applicable dimensions
   - Provides confidence scores

## Usage Examples

### Example 1: React Performance Issue

**Query:** "React app is slow, too many re-renders"

**Analysis:**
- Technical: React (technology), frontend patterns
- Architectural: Rendering performance concern
- Performance: Rendering performance, re-renders bottleneck

**Recommended Skills:**
- react-development (high confidence)
- performance-optimization (high confidence)
- debugging-strategies (medium confidence)

### Example 2: Database Migration

**Query:** "Need to migrate PostgreSQL database schema"

**Analysis:**
- Technical: PostgreSQL, SQL (technologies), database-migration (pattern)
- Architectural: Database design concern
- Performance: Database performance concern

**Recommended Skills:**
- database-migration (high confidence)
- postgresql-table-design (high confidence)
- sql-optimization-patterns (medium confidence)

### Example 3: Microservices API Design

**Query:** "Designing REST API for microservices architecture"

**Analysis:**
- Technical: API design (pattern), microservices (pattern)
- Architectural: Microservices pattern, API design concern, scalability concern
- Performance: Network performance concern

**Recommended Skills:**
- api-design-principles (high confidence)
- microservices-patterns (high confidence)
- deployment-pipeline-design (medium confidence)

## Skill Format

Skills are stored as zip files containing:

```
skill-name.zip
├── SKILL.md          # Main documentation with frontmatter metadata
├── README.md         # Overview and quick start
└── EXAMPLES.md       # Usage examples (optional)
```

### Frontmatter Format

```yaml
---
name: skill-name
description: Skill description
category: frontend
tags: [react, hooks, components]
version: 1.0.0
context7_library: /reactjs/react.dev
context7_trust_score: 10
---
```

## Integration with Claude

The MCP server integrates with Claude Desktop or other MCP clients:

1. **Configuration**: Add server to MCP client config
2. **Tool Discovery**: Claude automatically discovers available tools
3. **Context Analysis**: Use `skills_analyze_context` to analyze problems
4. **Skill Retrieval**: Use `skills_get` to retrieve skill documentation
5. **Search**: Use `skills_search` to find relevant skills

## Best Practices

### When to Use Skills

1. **During Problem Analysis**
   - Use `skills_analyze_context` to understand problem dimensions
   - Get recommendations for relevant skills

2. **During Implementation**
   - Use `skills_get` to retrieve skill documentation
   - Reference examples and best practices

3. **During Planning**
   - Use `skills_list` to explore available skills
   - Filter by category or tags

### Skill Recognition Triggers

The system recognizes situations to call skills when:

1. **Technology Mentioned**: Query mentions specific technology (React, Python, etc.)
2. **Pattern Mentioned**: Query mentions pattern (microservices, API design, etc.)
3. **Problem Type**: Query describes problem (performance, migration, etc.)
4. **Code Context**: Code context contains relevant patterns

### 3D Thinking Application

Think about problems from three dimensions:

1. **Technical**: What technologies and patterns are involved?
2. **Architectural**: What are the architectural concerns and scale?
3. **Performance**: What are the performance implications?

This multi-dimensional analysis ensures comprehensive skill recommendations.

## Extending the System

### Adding New Skills

1. Create skill zip file with SKILL.md, README.md, EXAMPLES.md
2. Add frontmatter metadata
3. Place in `.claude/Skills/` directory
4. Server automatically loads on startup

### Customizing Analysis

Modify `ContextAnalyzer` to:
- Add new technology detection
- Add new pattern recognition
- Adjust complexity assessment
- Customize recommendation algorithm

### Adding New Tools

Add new tools in `src/tools/skillTools.ts`:
1. Define Zod schema for input
2. Register tool with `server.registerTool`
3. Implement handler function
4. Return structured content

## Performance Considerations

- Skills are loaded once at startup
- Search uses in-memory indexing
- Context analysis is lightweight (keyword matching)
- Recommendations are cached per query

## Security Considerations

- Skills are loaded from local directory only
- No external network requests
- Input validation via Zod schemas
- Read-only operations (no modifications)

## Troubleshooting

### Skills Not Loading

- Check `.claude/Skills/` directory exists
- Verify zip files are valid
- Check console for error messages

### Poor Recommendations

- Ensure query includes relevant keywords
- Provide code context if available
- Specify project type for better analysis

### Build Errors

- Run `npm install` to install dependencies
- Check TypeScript version compatibility
- Verify Node.js version >= 18

## Future Enhancements

Potential improvements:

1. **Machine Learning**: Use ML models for better skill matching
2. **Usage Tracking**: Track which skills are most useful
3. **Skill Ratings**: Allow users to rate skill usefulness
4. **Dynamic Updates**: Hot-reload skills without restart
5. **Skill Dependencies**: Track skill dependencies and relationships
6. **Advanced Search**: Full-text search with ranking algorithms
7. **Skill Compositions**: Combine multiple skills for complex problems

