# Skill Orchestrator MCP Server

Autonomous skill orchestration system that analyzes context, recognizes patterns, and automatically invokes relevant skills without human intervention.

## Features

### 🧠 **Autonomous Context Analysis**
- Extracts keywords, technical terms, and intent from user prompts
- Analyzes assistant reasoning and thoughts
- Detects technical domains (frontend, backend, database, etc.)
- Assesses task complexity automatically

### 🎯 **Intelligent Skill Matching**
- Multi-dimensional scoring (keywords, domains, intent, technical terms)
- Confidence-based auto-invocation (>85% = auto-invoke)
- Smart suggestions for medium-confidence matches (60-85%)
- Historical pattern learning for improved matching

### 📚 **Pattern Learning Database**
- Records all invocations with outcomes
- Learns keyword → skill associations
- Tracks success rates and patterns
- Builds contextual memory over time

### ⚡ **Automatic Skill Invocation**
- High-confidence skills are invoked automatically
- No manual skill selection needed
- Learns from feedback to improve future matches
- Configurable thresholds and behavior

## Installation

```bash
cd mcp-skill-orchestrator
npm install
npm run build
```

## Configuration

Add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "skill-orchestrator": {
      "command": "node",
      "args": [
        "/Users/computer/jeffmichaeljohnson-tech/projects/familyup/mcp-skill-orchestrator/dist/index.js"
      ]
    }
  }
}
```

## Usage

### Primary Tool: `orchestrate_skills`

**Call this on EVERY user interaction for autonomous orchestration:**

```typescript
// Example 1: Simple user prompt
{
  "user_prompt": "optimize my React app for performance"
}

// Example 2: With assistant reasoning
{
  "user_prompt": "fix the authentication bug",
  "assistant_reasoning": "I'm thinking this might be related to JWT token expiration. Need to check the auth middleware and session handling."
}

// Example 3: With project context
{
  "user_prompt": "deploy to production",
  "assistant_reasoning": "Need to verify CI/CD pipeline and run tests first",
  "project_context": {
    "git_branch": "main",
    "modified_files": ["src/api/auth.ts", "tests/auth.test.ts"]
  }
}
```

**Returns:**
```json
{
  "context": {
    "keywords": ["optimize", "react", "performance"],
    "domains": ["frontend", "performance"],
    "intent": "optimize",
    "complexity": "medium"
  },
  "autoInvoke": [
    {
      "skillName": "react-development",
      "confidenceScore": 0.92,
      "reasoning": ["Matches keywords: react, optimize", "High confidence match"]
    }
  ],
  "suggestions": [
    {
      "skillName": "frontend-design",
      "confidenceScore": 0.75,
      "reasoning": ["Relevant to domains: frontend"]
    }
  ]
}
```

### Other Tools

#### `analyze_context`
Analyze text for keywords, intent, and domains:
```json
{
  "text": "I need to implement OAuth2 authentication with JWT tokens"
}
```

#### `sync_skills_cache`
Update orchestrator with latest skills from skills server:
```json
{
  "skills": [/* array from mcp__skills__skills_list */]
}
```

#### `record_skill_feedback`
Improve learning by recording outcomes:
```json
{
  "skill_name": "react-development",
  "outcome": "success",
  "feedback": "Successfully optimized React components"
}
```

#### `get_orchestrator_stats`
View performance metrics:
```json
{}
```

Returns success rates, top skills, recent activity.

#### `configure_orchestrator`
Adjust thresholds and behavior:
```json
{
  "auto_invoke_threshold": 0.90,
  "suggestion_threshold": 0.70,
  "enable_auto_invoke": true
}
```

## How It Works

### 1. Context Analysis
```
User: "optimize my database queries"
        ↓
Analyzer extracts:
- Keywords: optimize, database, queries
- Intent: optimize
- Domains: database, performance
- Complexity: medium
```

### 2. Skill Matching
```
Context → Matcher → Scores:
- sql-optimization-patterns: 0.94 ✓ (auto-invoke)
- database-migration: 0.72 (suggest)
- postgresql-table-design: 0.68 (suggest)
```

### 3. Learning & Feedback
```
Invocation → Outcome → Learning:
- Records: context + skill + result
- Updates: keyword mappings
- Learns: successful patterns
- Improves: future matching
```

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `auto_invoke_threshold` | 0.85 | Confidence required for auto-invoke (0-1) |
| `suggestion_threshold` | 0.60 | Confidence required for suggestions (0-1) |
| `max_suggestions` | 5 | Maximum number of suggestions |
| `enable_learning` | true | Learn from invocation outcomes |
| `enable_auto_invoke` | true | Automatically invoke high-confidence skills |

## Database Schema

### `skill_invocations`
Records every skill invocation with context and outcome.

### `context_patterns`
Learned patterns mapping contexts to successful skills.

### `keyword_skill_mapping`
Fast lookup of skills by keywords.

### `skill_metadata`
Cached skill information and performance metrics.

## Integration with Claude Code

The orchestrator is designed to work seamlessly with Claude Code:

1. **On every user message**: Call `orchestrate_skills`
2. **Parse results**: Auto-invoke high-confidence skills
3. **Show suggestions**: Present medium-confidence options to user
4. **Record feedback**: After task completion, record success/failure
5. **Continuous learning**: System improves over time

## Example Workflow

```typescript
// 1. User asks something
const userPrompt = "create a new React component with authentication";

// 2. Orchestrate (call MCP tool)
const result = await orchestrate_skills({
  user_prompt: userPrompt,
  assistant_reasoning: "This requires React knowledge and auth patterns"
});

// 3. Auto-invoke high-confidence skills
for (const skill of result.autoInvoke) {
  await invokeSkill(skill.skillName);
}

// 4. Suggest medium-confidence skills
console.log("Also consider:", result.suggestions);

// 5. After completion, record feedback
await record_skill_feedback({
  skill_name: "react-development",
  outcome: "success"
});
```

## Future Enhancements

- [ ] Multi-agent swarm coordination
- [ ] Real-time confidence adjustment
- [ ] Cross-session pattern recognition
- [ ] Natural language feedback parsing
- [ ] Skill dependency graphs
- [ ] A/B testing for threshold optimization
- [ ] Integration with Hooks Automation skill
- [ ] Visual dashboard for orchestration metrics

## License

MIT
