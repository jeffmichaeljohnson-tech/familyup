-- Memory System Schema for SQLite MCP Server
-- Supports both short-term (session) and long-term (persistent) memory

-- ============================================
-- SHORT-TERM MEMORY (Session-based)
-- ============================================

-- Active sessions table
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    agent_type TEXT NOT NULL, -- 'cursor', 'claude-code', 'claude-desktop'
    project_path TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT -- JSON metadata
);

-- Session context (conversation history, current state)
CREATE TABLE IF NOT EXISTS session_context (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    context_type TEXT NOT NULL, -- 'conversation', 'code_context', 'user_preference', 'task_state'
    key TEXT NOT NULL,
    value TEXT NOT NULL, -- JSON or text
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    UNIQUE(session_id, context_type, key)
);

-- Session memory (temporary facts, decisions, state)
CREATE TABLE IF NOT EXISTS session_memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    memory_type TEXT NOT NULL, -- 'fact', 'decision', 'preference', 'task', 'error'
    content TEXT NOT NULL,
    importance REAL DEFAULT 0.5, -- 0.0 to 1.0
    expires_at DATETIME, -- NULL for session lifetime
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
);

-- ============================================
-- LONG-TERM MEMORY (Persistent across sessions)
-- ============================================

-- Long-term memories (persistent facts, learnings)
CREATE TABLE IF NOT EXISTS long_term_memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_type TEXT NOT NULL, -- 'user_preference', 'project_pattern', 'solution', 'best_practice', 'fact'
    category TEXT, -- 'coding', 'workflow', 'preferences', 'project_specific'
    key TEXT NOT NULL,
    value TEXT NOT NULL, -- JSON or text
    importance REAL DEFAULT 0.5,
    access_count INTEGER DEFAULT 0,
    last_accessed DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(memory_type, category, key)
);

-- Project-specific knowledge (persistent project context)
CREATE TABLE IF NOT EXISTS project_knowledge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_path TEXT NOT NULL,
    knowledge_type TEXT NOT NULL, -- 'architecture', 'patterns', 'dependencies', 'config', 'workflow'
    key TEXT NOT NULL,
    value TEXT NOT NULL, -- JSON or text
    importance REAL DEFAULT 0.5,
    access_count INTEGER DEFAULT 0,
    last_accessed DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_path, knowledge_type, key)
);

-- User preferences (persistent user-specific settings)
CREATE TABLE IF NOT EXISTS user_preferences (
    preference_key TEXT PRIMARY KEY,
    preference_value TEXT NOT NULL, -- JSON or text
    agent_type TEXT, -- 'cursor', 'claude-code', 'claude-desktop', NULL for all
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cross-session context (shared context between sessions)
CREATE TABLE IF NOT EXISTS cross_session_context (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    context_key TEXT NOT NULL UNIQUE,
    context_value TEXT NOT NULL, -- JSON or text
    context_type TEXT NOT NULL, -- 'shared_state', 'ongoing_task', 'project_status'
    related_project TEXT,
    expires_at DATETIME, -- NULL for permanent
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_session_context_session ON session_context(session_id, context_type);
CREATE INDEX IF NOT EXISTS idx_session_memory_session ON session_memory(session_id, memory_type);
CREATE INDEX IF NOT EXISTS idx_session_memory_expires ON session_memory(expires_at);
CREATE INDEX IF NOT EXISTS idx_long_term_memory_type ON long_term_memory(memory_type, category);
CREATE INDEX IF NOT EXISTS idx_long_term_memory_access ON long_term_memory(last_accessed);
CREATE INDEX IF NOT EXISTS idx_project_knowledge_project ON project_knowledge(project_path, knowledge_type);
CREATE INDEX IF NOT EXISTS idx_cross_session_expires ON cross_session_context(expires_at);

-- ============================================
-- TRIGGERS for Auto-updates
-- ============================================

-- Update last_accessed timestamp
CREATE TRIGGER IF NOT EXISTS update_long_term_memory_access
AFTER UPDATE OF access_count ON long_term_memory
BEGIN
    UPDATE long_term_memory SET last_accessed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_project_knowledge_access
AFTER UPDATE OF access_count ON project_knowledge
BEGIN
    UPDATE project_knowledge SET last_accessed = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_long_term_memory_timestamp
AFTER UPDATE ON long_term_memory
BEGIN
    UPDATE long_term_memory SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_project_knowledge_timestamp
AFTER UPDATE ON project_knowledge
BEGIN
    UPDATE project_knowledge SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_user_preferences_timestamp
AFTER UPDATE ON user_preferences
BEGIN
    UPDATE user_preferences SET updated_at = CURRENT_TIMESTAMP WHERE preference_key = NEW.preference_key;
END;

CREATE TRIGGER IF NOT EXISTS update_cross_session_timestamp
AFTER UPDATE ON cross_session_context
BEGIN
    UPDATE cross_session_context SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Update session last_activity
CREATE TRIGGER IF NOT EXISTS update_session_activity
AFTER INSERT ON session_context
BEGIN
    UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_id = NEW.session_id;
END;

CREATE TRIGGER IF NOT EXISTS update_session_activity_memory
AFTER INSERT ON session_memory
BEGIN
    UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_id = NEW.session_id;
END;

