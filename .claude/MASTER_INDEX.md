# Master Index - Complete Skills Knowledge System

## Quick Navigation

### 🚀 Start Here
- **[MAXIMUM_AWARENESS_GUIDE.md](./MAXIMUM_AWARENESS_GUIDE.md)** - Complete guide to maximum awareness
- **[AGENT_RULES.md](./AGENT_RULES.md)** - Automatic skill usage rules
- **[knowledge/AGENT_INSTRUCTIONS.md](./knowledge/AGENT_INSTRUCTIONS.md)** - Complete agent instructions

### 📚 Knowledge Files (`.claude/knowledge/`)

1. **[TECHNOLOGY_MAPPING.md](./knowledge/TECHNOLOGY_MAPPING.md)** - Technology → Skills mapping
2. **[PROBLEM_SOLUTION_MAPPING.md](./knowledge/PROBLEM_SOLUTION_MAPPING.md)** - Problem → Solution mapping
3. **[QUICK_REFERENCE_CARDS.md](./knowledge/QUICK_REFERENCE_CARDS.md)** - Quick skill lookup
4. **[PATTERN_LIBRARY.md](./knowledge/PATTERN_LIBRARY.md)** - Patterns and architectures
5. **[USAGE_EXAMPLES.md](./knowledge/USAGE_EXAMPLES.md)** - Real-world examples
6. **[COMPREHENSIVE_KNOWLEDGE_BASE.md](./knowledge/COMPREHENSIVE_KNOWLEDGE_BASE.md)** - Full skill content
7. **[SEARCHABLE_INDEX.md](./knowledge/SEARCHABLE_INDEX.md)** - Keyword searchable index
8. **[README.md](./knowledge/README.md)** - Knowledge system guide

### 📁 Skill Files

- **Zip Files:** `.claude/Skills/*.zip` (63 skills - source of truth)
- **Extracted Skills:** `.claude/Skills/extracted/{skill-name}/` (regeneratable)
- **Skills Index:** `.claude/SKILLS_INDEX.md` (generated index)

### 🔧 Configuration

- **MCP Config:** `.mcp.json` (includes skills server)
- **Settings:** `.claude/settings.json` (MCP server config)
- **Agent Rules:** `.claude/AGENT_RULES.md` (automatic usage rules)

### 📖 Documentation

- **Main README:** `.claude/README.md` (MCP configuration)
- **Memory System:** `.claude/MEMORY_SYSTEM.md` (memory system docs)
- **Terminal History:** `.claude/TERMINAL_HISTORY_CONTEXT.md` (terminal context)

## Usage Workflow

### For Maximum Awareness:

1. **Read:** `MAXIMUM_AWARENESS_GUIDE.md` - Understand the system
2. **Reference:** `knowledge/AGENT_INSTRUCTIONS.md` - Get mappings
3. **Lookup:** Use knowledge files based on context
4. **Deep Dive:** Read skill files when needed
5. **Apply:** Use knowledge automatically

### Quick Lookups:

- **Technology?** → `knowledge/TECHNOLOGY_MAPPING.md`
- **Problem?** → `knowledge/PROBLEM_SOLUTION_MAPPING.md`
- **Pattern?** → `knowledge/PATTERN_LIBRARY.md`
- **Examples?** → `knowledge/USAGE_EXAMPLES.md`
- **Search?** → `knowledge/SEARCHABLE_INDEX.md`

## Maintenance

**Regenerate all knowledge files:**
```bash
npx tsx scripts/extract-skills-enhanced.ts
```

**Regenerate basic extraction:**
```bash
npx tsx scripts/extract-all-skills.ts
```

## Statistics

- **Total Skills:** 63
- **Knowledge Files:** 8
- **Extracted Files:** 63 skill directories
- **Total Knowledge:** Comprehensive coverage

---

**This master index gives you complete navigation of the skills knowledge system!**

