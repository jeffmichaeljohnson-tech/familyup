# Agent Rules & Policies - Automatic Skill Usage

## Core Principle: Human-Less Intuition

**You MUST automatically draw upon relevant skills from `.claude/Skills/` when the context, keywords, or problem domain matches, WITHOUT being explicitly asked.**

## Automatic Skill Recognition Rules

### 1. Context-Based Activation

When you encounter any of the following, automatically reference the relevant skill:

#### Technology Keywords → Skills
- **React/JSX/Components** → `react-development`, `react-modernization`
- **TypeScript** → `typescript-advanced-types`
- **Python/Async** → `async-python-patterns`, `fastapi-templates`
- **Node.js/Backend** → `nodejs-backend-patterns`
- **PostgreSQL/SQL** → `postgresql-table-design`, `sql-optimization-patterns`
- **Microservices** → `microservices-patterns`
- **API Design** → `api-design-principles`
- **Authentication** → `auth-implementation-patterns`
- **Testing** → `javascript-testing-patterns`, `bats-testing-patterns`, `web3-testing`
- **Database Migration** → `database-migration`
- **Deployment** → `deployment-pipeline-design`
- **GitHub** → `github-actions-templates`, `github-project-management`
- **Kubernetes** → `k8s-manifest-generator`, `k8s-security-policies`
- **Terraform** → `terraform-module-library`
- **Web3/DeFi** → `defi-protocol-templates`, `nft-standards`, `solidity-security`
- **LangChain** → `langchain-architecture`, `rag-implementation`
- **Error Handling** → `error-handling-patterns`
- **Debugging** → `debugging-strategies`
- **Performance** → `agentdb-performance-optimization`, `cost-optimization`
- **Memory/AgentDB** → `agentdb-memory-patterns`, `mem-search`
- **Monorepo** → `monorepo-management`
- **Code Review** → `code-review-excellence`
- **Documentation** → `docstring`
- **Secrets** → `secrets-management`
- **Distributed Systems** → `distributed-tracing`
- **Frontend Design** → `frontend-design`
- **Modern JavaScript** → `modern-javascript-patterns`

#### Problem Domain Keywords → Skills
- **"slow" / "performance" / "optimize"** → `agentdb-performance-optimization`, `performance-optimization`
- **"bug" / "error" / "debug"** → `debugging-strategies`, `error-handling-patterns`
- **"migrate" / "database"** → `database-migration`
- **"test" / "testing"** → Relevant testing skill based on technology
- **"deploy" / "ci/cd"** → `deployment-pipeline-design`, `github-actions-templates`
- **"security" / "auth"** → `auth-implementation-patterns`, `secrets-management`, `k8s-security-policies`
- **"scale" / "scalability"** → `microservices-patterns`, `performance-optimization`
- **"monorepo" / "workspace"** → `monorepo-management`
- **"api" / "endpoint"** → `api-design-principles`
- **"memory" / "context"** → `agentdb-memory-patterns`, `mem-search`
- **"cost" / "expensive"** → `cost-optimization`

### 2. 3D Thinking Application

When analyzing any problem, automatically think from three dimensions:

#### Technical Dimension
- What technologies are involved? → Load relevant technology skill
- What patterns are being used? → Load relevant pattern skill
- What's the complexity level? → Choose appropriate skill depth

#### Architectural Dimension
- What architectural patterns apply? → Load architecture skill
- What are the concerns? → Load relevant concern skill (security, scalability, etc.)
- What's the scale? → Adjust skill selection accordingly

#### Performance Dimension
- What are performance concerns? → Load performance skill
- What optimizations are needed? → Load optimization skill
- What are bottlenecks? → Load debugging/performance skill

### 3. Proactive Skill Usage Workflow

**ALWAYS follow this workflow when encountering a task:**

1. **Analyze Context** (automatic)
   - Extract technologies, patterns, problems from user query
   - Identify relevant skills using keyword matching
   - Apply 3D thinking analysis

2. **Load Relevant Skills** (automatic)
   - Reference skill documentation without being asked
   - Use skill knowledge in your solution
   - Apply skill patterns and best practices

3. **Apply Skill Knowledge** (automatic)
   - Use patterns from skills in your code
   - Follow best practices from skills
   - Reference examples from skills

4. **Document Skill Usage** (optional, but helpful)
   - Mention which skills informed your approach
   - Explain how skill knowledge was applied

### 4. Skill Selection Priority

When multiple skills might apply:

1. **Exact Match** - Skill name/tag exactly matches keyword
2. **Category Match** - Skill category matches problem domain
3. **Pattern Match** - Skill pattern matches problem pattern
4. **Related Match** - Skill is related to problem domain

### 5. Examples of Automatic Usage

#### Example 1: React Component
**User:** "Create a React component with state"

**You automatically:**
- Reference `react-development` skill for component patterns
- Use hooks patterns from the skill
- Apply best practices from the skill
- **Don't wait to be asked** - just use it

#### Example 2: Performance Issue
**User:** "My app is slow"

**You automatically:**
- Reference `debugging-strategies` for investigation
- Reference `agentdb-performance-optimization` for optimization
- Apply performance analysis patterns
- **Don't wait to be asked** - just use it

#### Example 3: API Design
**User:** "Design a REST API"

**You automatically:**
- Reference `api-design-principles` skill
- Apply REST best practices from the skill
- Use patterns from the skill
- **Don't wait to be asked** - just use it

#### Example 4: Database Migration
**User:** "Need to migrate database schema"

**You automatically:**
- Reference `database-migration` skill
- Apply migration patterns from the skill
- Use best practices from the skill
- **Don't wait to be asked** - just use it

### 6. Skill Integration Points

Automatically use skills when:

- **Planning** - Use skills to inform architecture decisions
- **Designing** - Use skills to guide design patterns
- **Implementing** - Use skills to write code following best practices
- **Debugging** - Use skills to diagnose and fix issues
- **Optimizing** - Use skills to improve performance
- **Reviewing** - Use skills to evaluate code quality
- **Documenting** - Use skills to write better documentation

### 7. Memory Integration

Store skill usage patterns in long-term memory:
- Which skills are most useful for this project
- Which skills solve which types of problems
- User preferences for skill application

### 8. Continuous Learning

- Learn from successful skill applications
- Remember which skills work best for which contexts
- Adapt skill usage based on project patterns
- Build intuition about skill relevance

## Implementation

### How to Access Skills

1. **Via Knowledge System** (PRIMARY METHOD - Maximum Awareness):
   - **Agent Instructions**: Read `.claude/knowledge/AGENT_INSTRUCTIONS.md` for complete mappings
   - **Technology Mapping**: Read `.claude/knowledge/TECHNOLOGY_MAPPING.md` when technology mentioned
   - **Problem Mapping**: Read `.claude/knowledge/PROBLEM_SOLUTION_MAPPING.md` when problem described
   - **Quick Reference**: Read `.claude/knowledge/QUICK_REFERENCE_CARDS.md` for fast lookup
   - **Pattern Library**: Read `.claude/knowledge/PATTERN_LIBRARY.md` for patterns
   - **Usage Examples**: Read `.claude/knowledge/USAGE_EXAMPLES.md` for examples
   - **Comprehensive KB**: Read `.claude/knowledge/COMPREHENSIVE_KNOWLEDGE_BASE.md` for full content
   - **Searchable Index**: Read `.claude/knowledge/SEARCHABLE_INDEX.md` for keyword search
   - **Maximum Awareness Guide**: Read `.claude/MAXIMUM_AWARENESS_GUIDE.md` for complete system
   - **Always read these files proactively** when context matches - don't wait to be asked!

2. **Via Direct File Access** (Secondary - For Deep Dives):
   - **Skills Index**: Read `.claude/SKILLS_INDEX.md` to see all available skills
   - **Knowledge Base**: Read `.claude/SKILLS_KNOWLEDGE_BASE.md` for consolidated skill knowledge
   - **Extracted Skills**: Read `.claude/Skills/extracted/{skill-name}/SKILL.md` for full documentation

3. **Via MCP Server** (Tertiary - For Dynamic Queries):
   - Use `skills_search` to find relevant skills
   - Use `skills_get` to retrieve skill documentation
   - Use `skills_analyze_context` for 3D thinking analysis

4. **Via Memory System**:
   - Store frequently used skills in project knowledge
   - Cache skill patterns for quick access
   - Build skill usage patterns over time

### Automatic File Reading Protocol

**When you encounter keywords/context that match skills:**

1. **Technology Mentioned?**
   → Read `.claude/knowledge/TECHNOLOGY_MAPPING.md`
   → Find relevant skills instantly

2. **Problem Described?**
   → Read `.claude/knowledge/PROBLEM_SOLUTION_MAPPING.md`
   → Find solution skills

3. **Pattern Referenced?**
   → Read `.claude/knowledge/PATTERN_LIBRARY.md`
   → Find pattern skills

4. **Need Quick Overview?**
   → Read `.claude/knowledge/QUICK_REFERENCE_CARDS.md`
   → Get fast summary

5. **Need Examples?**
   → Read `.claude/knowledge/USAGE_EXAMPLES.md`
   → See real-world usage

6. **Deep Dive Needed?**
   → Read `.claude/Skills/extracted/{skill-name}/SKILL.md`
   → Get full documentation

7. **Apply Knowledge**
   → Use skill knowledge immediately in your solution
   → Don't wait - be proactive!

### Skill Application Checklist

When working on any task, automatically:

- [ ] Identify relevant technologies → Load technology skills
- [ ] Identify patterns → Load pattern skills
- [ ] Identify problems → Load problem-solving skills
- [ ] Apply 3D thinking → Analyze from all dimensions
- [ ] Use skill knowledge → Apply patterns and best practices
- [ ] Reference skill examples → Use examples as templates
- [ ] Document skill usage → Note which skills informed approach

## Enforcement

**This is not optional.** You MUST:
- ✅ Automatically recognize when skills apply
- ✅ Proactively use skills without being asked
- ✅ Apply skill knowledge in your solutions
- ✅ Think multi-dimensionally about problems
- ✅ Build intuition about skill relevance

**You MUST NOT:**
- ❌ Wait to be asked to use a skill
- ❌ Ignore relevant skills
- ❌ Skip skill application when context matches
- ❌ Work without considering available skills

## Success Criteria

You're successfully applying these rules when:
- You reference skills automatically in your responses
- Your solutions follow skill patterns and best practices
- You think about problems from multiple dimensions
- You build intuition about which skills apply when
- Users notice you're applying relevant knowledge without being asked

---

**Remember: The goal is human-less intuition - you should know which skills to use and apply them automatically, just like a human expert would draw upon their knowledge without being reminded.**

