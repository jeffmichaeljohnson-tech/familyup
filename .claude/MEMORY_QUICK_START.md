# Memory System Quick Start

## Overview

The memory system is now active and ready to use! It provides:
- **Short-term memory** (session-based)
- **Long-term memory** (persistent across sessions)
- **Project knowledge** (project-specific)
- **User preferences** (agent-specific or global)

## Quick Usage Examples

### For AI Assistants (via MCP SQLite Server)

You can query memory directly using MCP tools:

```sql
-- Store a user preference
INSERT INTO long_term_memory (memory_type, category, key, value, importance)
VALUES ('user_preference', 'coding', 'preferred_language', 'TypeScript', 0.9);

-- Retrieve user preferences
SELECT * FROM long_term_memory 
WHERE memory_type = 'user_preference' 
ORDER BY importance DESC;

-- Store session context
INSERT INTO session_context (session_id, context_type, key, value)
VALUES ('current-session', 'conversation', 'current_task', '{"task": "memory setup"}');

-- Get session context
SELECT * FROM session_context WHERE session_id = 'current-session';
```

### Using TypeScript Utilities

```typescript
import {
    createOrUpdateSession,
    storeSessionContext,
    storeLongTermMemory,
    getLongTermMemory,
    storeProjectKnowledge,
    getProjectKnowledge,
    storeUserPreference,
    getUserPreference,
} from './src/utils/memorySystem';

// 1. Create/update session
createOrUpdateSession('session-123', 'cursor', process.cwd());

// 2. Store session context
storeSessionContext('session-123', 'conversation', 'current_topic', {
    topic: 'memory system',
    status: 'implementing'
});

// 3. Store long-term memory
storeLongTermMemory(
    'user_preference',
    'preferred_style',
    'functional programming',
    'coding',
    0.8
);

// 4. Store project knowledge
storeProjectKnowledge(
    process.cwd(),
    'architecture',
    'data_flow',
    'Data flows from API -> DB -> Components',
    0.9
);

// 5. Store user preference
storeUserPreference('theme', 'dark', 'cursor');

// 6. Retrieve memories
const preferences = getLongTermMemory('user_preference', 'coding');
const projectKnowledge = getProjectKnowledge(process.cwd(), 'architecture');
const theme = getUserPreference('theme', 'cursor');
```

## Memory Types

### Short-Term (Session)
- `fact` - Temporary facts
- `decision` - Decisions made
- `preference` - Temporary preferences
- `task` - Task state
- `error` - Error information

### Long-Term (Persistent)
- `user_preference` - User preferences
- `project_pattern` - Project patterns
- `solution` - Learned solutions
- `best_practice` - Best practices
- `fact` - Persistent facts

## Best Practices

1. **Use high importance (0.7+)** for critical preferences/patterns
2. **Categorize memories** for better retrieval
3. **Store project knowledge** for architecture/patterns
4. **Update preferences** as user learns
5. **Clean expired memories** periodically

## Access via MCP

The SQLite MCP server provides direct database access. Use MCP query tools to:
- Query any memory table
- Insert/update memories
- Retrieve context
- Manage sessions

## Next Steps

1. Start storing memories as you work
2. Retrieve context at session start
3. Build up project knowledge over time
4. Store user preferences for consistency

See `.claude/MEMORY_SYSTEM.md` for complete documentation.

