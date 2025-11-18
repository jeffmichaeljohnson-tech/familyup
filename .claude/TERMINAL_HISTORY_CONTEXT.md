# Terminal History Context - AI Assistant Guide

## Overview

This project has **full access to terminal command history** (~13,000+ commands) that can be used to understand user context, workflows, and past work.

## Quick Access

Import and use these functions from `src/utils/terminalSession.ts`:

```typescript
import {
  getAllTerminalHistory,
  getTerminalSession,
  searchTerminalHistory,
  getRecentWorkflowContext,
  getProjectContext,
  searchByKeywords,
} from './src/utils/terminalSession';
```

## When to Use Terminal History

**USE TERMINAL HISTORY WHEN:**
- ✅ You need to understand what the user has been working on
- ✅ You want to see how they've solved similar problems before
- ✅ You need to find setup/configuration commands
- ✅ You want to understand their workflow patterns
- ✅ You need context about a specific project or tool
- ✅ You're unsure about their environment or setup
- ✅ You want to provide suggestions based on their past commands

**DON'T USE WHEN:**
- ❌ The user explicitly asks you not to
- ❌ You already have sufficient context from the conversation
- ❌ The task is trivial and doesn't require context

## Common Patterns

### 1. Understanding Recent Workflow
```typescript
const context = getRecentWorkflowContext(100);
console.log('Projects:', context.projects);
console.log('Tools:', context.tools);
console.log('Common commands:', context.commonCommands);
```

###2. Finding Project-Specific Commands
```typescript
const projectCommands = getProjectContext('familyup', 30);
// Returns commands related to the familyup project
```

### 3. Searching for Specific Tools/Technologies
```typescript
// Find all git commands
const gitCommands = searchTerminalHistory('git', 50);

// Find npm/node commands
const nodeCommands = searchTerminalHistory('npm|yarn|node', 30);

// Find docker commands
const dockerCommands = searchTerminalHistory('docker', 20);
```

### 4. Multi-Keyword Search
```typescript
const results = searchByKeywords(['git', 'npm', 'docker'], 20);
// Returns commands grouped by keyword
```

### 5. Getting All History
```typescript
const allHistory = getAllTerminalHistory();
// Access to all ~13,000 commands
```

## History Statistics

- **Total Commands**: ~13,000
- **File Size**: ~450 KB
- **Unique Commands**: ~5,860 (after deduplication)
- **Growth**: Continuous (history not trimmed automatically)

## Best Practices

1. **Start with Recent Context**: Use `getRecentWorkflowContext()` first to understand current work
2. **Search Broadly**: Use `searchTerminalHistory()` with general terms before specific searches
3. **Respect Privacy**: Only use history to provide better assistance, not to invade privacy
4. **Cache Results**: If you're doing multiple searches, consider caching the full history
5. **Be Selective**: Don't overwhelm the user with too much history - filter and summarize

## Example Workflow

```typescript
// 1. Get recent workflow context
const workflow = getRecentWorkflowContext(100);

// 2. If working on a specific project, get project context
if (workflow.projects.includes('familyup')) {
  const projectCmds = getProjectContext('familyup', 30);
}

// 3. Search for specific patterns if needed
const setupCommands = searchTerminalHistory('install|setup|config', 20);

// 4. Use this context to provide better assistance
```

## Remember

**The terminal history is a powerful context tool. Use it proactively when you need more information about the user's workflow, environment, or past work!**

