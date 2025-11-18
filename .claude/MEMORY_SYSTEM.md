# Memory System Documentation

## Overview

This project uses a SQLite-based memory system accessible via the MCP SQLite server to provide **short-term** (session-based) and **long-term** (persistent) memory for Cursor agents, Claude Code, and Claude Desktop.

## Architecture

### Short-Term Memory (Session-based)
- **Purpose**: Retain context within a single session
- **Storage**: `session_context`, `session_memory` tables
- **Lifetime**: Session duration (can expire)
- **Use Cases**: 
  - Current conversation context
  - Active task state
  - Temporary decisions
  - Session-specific preferences

### Long-Term Memory (Persistent)
- **Purpose**: Retain knowledge across all sessions
- **Storage**: `long_term_memory`, `project_knowledge`, `user_preferences` tables
- **Lifetime**: Permanent (until explicitly deleted)
- **Use Cases**:
  - User preferences
  - Project patterns and architecture
  - Learned solutions
  - Best practices
  - Project-specific knowledge

### Cross-Session Context
- **Purpose**: Share state between concurrent sessions
- **Storage**: `cross_session_context` table
- **Use Cases**:
  - Ongoing tasks
  - Shared project status
  - Multi-session workflows

## Database Schema

### Tables

1. **sessions** - Active session tracking
2. **session_context** - Session-specific context (conversation, code, state)
3. **session_memory** - Temporary session memories
4. **long_term_memory** - Persistent memories across sessions
5. **project_knowledge** - Project-specific persistent knowledge
6. **user_preferences** - User preferences (agent-specific or global)
7. **cross_session_context** - Shared context between sessions

## Usage

### For AI Assistants (Cursor, Claude Code, Claude Desktop)

The memory system is accessible via the SQLite MCP server. You can use MCP tools to:

1. **Store Session Context**:
   ```sql
   INSERT INTO session_context (session_id, context_type, key, value)
   VALUES ('session-123', 'conversation', 'current_topic', '{"topic": "memory system"}');
   ```

2. **Store Long-Term Memory**:
   ```sql
   INSERT INTO long_term_memory (memory_type, category, key, value, importance)
   VALUES ('user_preference', 'coding', 'preferred_language', 'TypeScript', 0.9);
   ```

3. **Retrieve Context**:
   ```sql
   SELECT * FROM session_context WHERE session_id = 'session-123';
   SELECT * FROM long_term_memory WHERE memory_type = 'user_preference';
   ```

### Using TypeScript Utilities

Import from `src/utils/memorySystem.ts`:

```typescript
import {
    createOrUpdateSession,
    storeSessionContext,
    storeLongTermMemory,
    getSessionContext,
    getLongTermMemory,
    storeProjectKnowledge,
    getProjectKnowledge,
    storeUserPreference,
    getUserPreference,
} from './src/utils/memorySystem';

// Create session
createOrUpdateSession('session-123', 'cursor', '/path/to/project');

// Store session context
storeSessionContext('session-123', 'conversation', 'current_task', {
    task: 'implement memory system',
    status: 'in_progress'
});

// Store long-term memory
storeLongTermMemory(
    'user_preference',
    'preferred_style',
    'functional programming',
    'coding',
    0.8
);

// Get memories
const memories = getLongTermMemory('user_preference', 'coding');
const context = getSessionContext('session-123', 'conversation');
```

## Memory Types

### Session Memory Types
- `fact` - Temporary facts
- `decision` - Decisions made in session
- `preference` - Temporary preferences
- `task` - Task state
- `error` - Error information

### Long-Term Memory Types
- `user_preference` - User preferences
- `project_pattern` - Project-specific patterns
- `solution` - Learned solutions
- `best_practice` - Best practices
- `fact` - Persistent facts

## Context Types

- `conversation` - Conversation history/context
- `code_context` - Code-related context
- `user_preference` - User preferences
- `task_state` - Current task state
- `shared_state` - Shared between sessions
- `ongoing_task` - Ongoing multi-session tasks
- `project_status` - Project status

## Best Practices

1. **Session Management**:
   - Always create/update session at start
   - Store important context immediately
   - Clean expired memories periodically

2. **Long-Term Memory**:
   - Use high importance (0.7+) for critical preferences
   - Categorize memories for better retrieval
   - Update access counts automatically

3. **Project Knowledge**:
   - Store project-specific patterns and architecture
   - Keep knowledge organized by type
   - Update when patterns change

4. **User Preferences**:
   - Store agent-specific preferences
   - Use consistent keys
   - Update preferences as user learns

## MCP Integration

The SQLite MCP server provides direct database access. Use MCP tools to:

- Query memory tables
- Insert/update memories
- Retrieve context
- Manage sessions

Example MCP query:
```
Query SQLite: SELECT * FROM long_term_memory WHERE memory_type = 'user_preference' ORDER BY importance DESC LIMIT 10
```

## Initialization

Run the initialization script:

```bash
npx tsx scripts/initialize-memory.ts
```

Or manually execute the SQL:

```bash
sqlite3 familyup.db < scripts/setup-memory-system.sql
```

## Statistics

Get memory statistics:

```typescript
import { getMemoryStats } from './src/utils/memorySystem';
const stats = getMemoryStats();
console.log(stats);
```

## Maintenance

### Clean Expired Memories

```typescript
import { cleanExpiredMemories } from './src/utils/memorySystem';
const deleted = cleanExpiredMemories();
console.log(`Cleaned ${deleted} expired memories`);
```

### Query Examples

```sql
-- Get all high-importance long-term memories
SELECT * FROM long_term_memory WHERE importance >= 0.7 ORDER BY last_accessed DESC;

-- Get project knowledge
SELECT * FROM project_knowledge WHERE project_path = '/path/to/project';

-- Get user preferences for specific agent
SELECT * FROM user_preferences WHERE agent_type = 'cursor';

-- Get active sessions
SELECT * FROM sessions WHERE last_activity > datetime('now', '-1 hour');
```

## Security & Privacy

- All memory is stored locally in `familyup.db`
- No external services required
- Project-specific isolation via project_path
- Session-based isolation via session_id
- User preferences can be agent-specific

## Future Enhancements

- Vector search for semantic memory retrieval
- Memory compression/archival
- Memory importance decay over time
- Memory relationships/graph structure
- Export/import memory capabilities

