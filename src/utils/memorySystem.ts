/**
 * Memory System for SQLite MCP Server
 * Provides short-term (session) and long-term (persistent) memory management
 * 
 * This system enables:
 * - Session-based context retention (short-term)
 * - Persistent knowledge across sessions (long-term)
 * - Project-specific knowledge storage
 * - User preference management
 * - Cross-session context sharing
 */

import Database from 'better-sqlite3';
import path from 'path';
import { readFileSync } from 'fs';

const dbPath = path.join(process.cwd(), 'familyup.db');
const db = new Database(dbPath);

// ============================================
// Types
// ============================================

export type AgentType = 'cursor' | 'claude-code' | 'claude-desktop';
export type MemoryType = 'fact' | 'decision' | 'preference' | 'task' | 'error' | 'user_preference' | 'project_pattern' | 'solution' | 'best_practice';
export type ContextType = 'conversation' | 'code_context' | 'user_preference' | 'task_state' | 'shared_state' | 'ongoing_task' | 'project_status';

export interface SessionMemory {
    id: number;
    session_id: string;
    memory_type: MemoryType;
    content: string;
    importance: number;
    expires_at: string | null;
    created_at: string;
}

export interface LongTermMemory {
    id: number;
    memory_type: MemoryType;
    category: string | null;
    key: string;
    value: string;
    importance: number;
    access_count: number;
    last_accessed: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectKnowledge {
    id: number;
    project_path: string;
    knowledge_type: string;
    key: string;
    value: string;
    importance: number;
    access_count: number;
    last_accessed: string | null;
    created_at: string;
    updated_at: string;
}

// ============================================
// SHORT-TERM MEMORY (Session-based)
// ============================================

/**
 * Create or update a session
 */
export function createOrUpdateSession(
    sessionId: string,
    agentType: AgentType,
    projectPath?: string,
    metadata?: Record<string, any>
): void {
    const stmt = db.prepare(`
        INSERT INTO sessions (session_id, agent_type, project_path, metadata, last_activity)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(session_id) DO UPDATE SET
            last_activity = CURRENT_TIMESTAMP,
            metadata = COALESCE(?, metadata)
    `);
    
    stmt.run(
        sessionId,
        agentType,
        projectPath || null,
        metadata ? JSON.stringify(metadata) : null,
        metadata ? JSON.stringify(metadata) : null
    );
}

/**
 * Store session context
 */
export function storeSessionContext(
    sessionId: string,
    contextType: ContextType,
    key: string,
    value: any
): void {
    const stmt = db.prepare(`
        INSERT INTO session_context (session_id, context_type, key, value)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(session_id, context_type, key) DO UPDATE SET
            value = ?,
            created_at = CURRENT_TIMESTAMP
    `);
    
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    stmt.run(sessionId, contextType, key, valueStr, valueStr);
}

/**
 * Get session context
 */
export function getSessionContext(
    sessionId: string,
    contextType?: ContextType,
    key?: string
): any[] {
    let query = `
        SELECT session_id, context_type, key, value, created_at
        FROM session_context
        WHERE session_id = ?
    `;
    const params: any[] = [sessionId];
    
    if (contextType) {
        query += ' AND context_type = ?';
        params.push(contextType);
    }
    
    if (key) {
        query += ' AND key = ?';
        params.push(key);
    }
    
    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as any[];
    
    return rows.map(row => ({
        ...row,
        value: tryParseJSON(row.value)
    }));
}

/**
 * Store session memory
 */
export function storeSessionMemory(
    sessionId: string,
    memoryType: MemoryType,
    content: string,
    importance: number = 0.5,
    expiresAt?: Date
): number {
    const stmt = db.prepare(`
        INSERT INTO session_memory (session_id, memory_type, content, importance, expires_at)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
        sessionId,
        memoryType,
        content,
        importance,
        expiresAt ? expiresAt.toISOString() : null
    );
    
    return result.lastInsertRowid as number;
}

/**
 * Get session memories
 */
export function getSessionMemories(
    sessionId: string,
    memoryType?: MemoryType,
    minImportance: number = 0.0
): SessionMemory[] {
    let query = `
        SELECT * FROM session_memory
        WHERE session_id = ?
        AND importance >= ?
        AND (expires_at IS NULL OR expires_at > datetime('now'))
        ORDER BY importance DESC, created_at DESC
    `;
    const params: any[] = [sessionId, minImportance];
    
    if (memoryType) {
        query = query.replace('ORDER BY', 'AND memory_type = ? ORDER BY');
        params.splice(1, 0, memoryType);
    }
    
    const stmt = db.prepare(query);
    return stmt.all(...params) as SessionMemory[];
}

/**
 * Clean expired session memories
 */
export function cleanExpiredMemories(): number {
    const stmt = db.prepare(`
        DELETE FROM session_memory
        WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
    `);
    return stmt.run().changes;
}

// ============================================
// LONG-TERM MEMORY (Persistent)
// ============================================

/**
 * Store long-term memory
 */
export function storeLongTermMemory(
    memoryType: MemoryType,
    key: string,
    value: any,
    category?: string,
    importance: number = 0.5
): void {
    const stmt = db.prepare(`
        INSERT INTO long_term_memory (memory_type, category, key, value, importance)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(memory_type, category, key) DO UPDATE SET
            value = ?,
            importance = ?,
            updated_at = CURRENT_TIMESTAMP
    `);
    
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    stmt.run(
        memoryType,
        category || null,
        key,
        valueStr,
        importance,
        valueStr,
        importance
    );
}

/**
 * Get long-term memory
 */
export function getLongTermMemory(
    memoryType?: MemoryType,
    category?: string,
    key?: string,
    minImportance: number = 0.0
): LongTermMemory[] {
    let query = `
        SELECT * FROM long_term_memory
        WHERE importance >= ?
    `;
    const params: any[] = [minImportance];
    
    if (memoryType) {
        query += ' AND memory_type = ?';
        params.push(memoryType);
    }
    
    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }
    
    if (key) {
        query += ' AND key = ?';
        params.push(key);
    }
    
    query += ' ORDER BY importance DESC, last_accessed DESC, created_at DESC';
    
    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as LongTermMemory[];
    
    // Update access count
    if (rows.length > 0) {
        const updateStmt = db.prepare(`
            UPDATE long_term_memory
            SET access_count = access_count + 1, last_accessed = CURRENT_TIMESTAMP
            WHERE id IN (${rows.map(() => '?').join(',')})
        `);
        updateStmt.run(...rows.map(r => r.id));
    }
    
    return rows.map(row => ({
        ...row,
        value: tryParseJSON(row.value)
    }));
}

/**
 * Store project-specific knowledge
 */
export function storeProjectKnowledge(
    projectPath: string,
    knowledgeType: string,
    key: string,
    value: any,
    importance: number = 0.5
): void {
    const stmt = db.prepare(`
        INSERT INTO project_knowledge (project_path, knowledge_type, key, value, importance)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(project_path, knowledge_type, key) DO UPDATE SET
            value = ?,
            importance = ?,
            updated_at = CURRENT_TIMESTAMP
    `);
    
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    stmt.run(
        projectPath,
        knowledgeType,
        key,
        valueStr,
        importance,
        valueStr,
        importance
    );
}

/**
 * Get project knowledge
 */
export function getProjectKnowledge(
    projectPath: string,
    knowledgeType?: string,
    key?: string
): ProjectKnowledge[] {
    let query = `
        SELECT * FROM project_knowledge
        WHERE project_path = ?
    `;
    const params: any[] = [projectPath];
    
    if (knowledgeType) {
        query += ' AND knowledge_type = ?';
        params.push(knowledgeType);
    }
    
    if (key) {
        query += ' AND key = ?';
        params.push(key);
    }
    
    query += ' ORDER BY importance DESC, last_accessed DESC';
    
    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as ProjectKnowledge[];
    
    // Update access count
    if (rows.length > 0) {
        const updateStmt = db.prepare(`
            UPDATE project_knowledge
            SET access_count = access_count + 1, last_accessed = CURRENT_TIMESTAMP
            WHERE id IN (${rows.map(() => '?').join(',')})
        `);
        updateStmt.run(...rows.map(r => r.id));
    }
    
    return rows.map(row => ({
        ...row,
        value: tryParseJSON(row.value)
    }));
}

/**
 * Store user preference
 */
export function storeUserPreference(
    key: string,
    value: any,
    agentType?: AgentType
): void {
    const stmt = db.prepare(`
        INSERT INTO user_preferences (preference_key, preference_value, agent_type)
        VALUES (?, ?, ?)
        ON CONFLICT(preference_key) DO UPDATE SET
            preference_value = excluded.preference_value,
            agent_type = COALESCE(excluded.agent_type, user_preferences.agent_type),
            updated_at = CURRENT_TIMESTAMP
    `);
    
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    stmt.run(key, valueStr, agentType || null);
}

/**
 * Get user preference
 */
export function getUserPreference(key: string, agentType?: AgentType): any {
    let query = `
        SELECT preference_value FROM user_preferences
        WHERE preference_key = ?
    `;
    const params: any[] = [key];
    
    if (agentType) {
        query += ' AND (agent_type = ? OR agent_type IS NULL)';
        params.push(agentType);
    }
    
    const stmt = db.prepare(query);
    const row = stmt.get(...params) as { preference_value: string } | undefined;
    
    return row ? tryParseJSON(row.preference_value) : null;
}

/**
 * Store cross-session context
 */
export function storeCrossSessionContext(
    contextKey: string,
    contextValue: any,
    contextType: ContextType,
    relatedProject?: string,
    expiresAt?: Date
): void {
    const stmt = db.prepare(`
        INSERT INTO cross_session_context (context_key, context_value, context_type, related_project, expires_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(context_key) DO UPDATE SET
            context_value = ?,
            context_type = ?,
            expires_at = COALESCE(?, expires_at),
            updated_at = CURRENT_TIMESTAMP
    `);
    
    const valueStr = typeof contextValue === 'string' ? contextValue : JSON.stringify(contextValue);
    stmt.run(
        contextKey,
        valueStr,
        contextType,
        relatedProject || null,
        expiresAt ? expiresAt.toISOString() : null,
        valueStr,
        contextType,
        expiresAt ? expiresAt.toISOString() : null
    );
}

/**
 * Get cross-session context
 */
export function getCrossSessionContext(contextKey: string): any {
    const stmt = db.prepare(`
        SELECT context_value, context_type, expires_at
        FROM cross_session_context
        WHERE context_key = ?
        AND (expires_at IS NULL OR expires_at > datetime('now'))
    `);
    
    const row = stmt.get(contextKey) as { context_value: string; context_type: string; expires_at: string | null } | undefined;
    return row ? tryParseJSON(row.context_value) : null;
}

// ============================================
// Utility Functions
// ============================================

function tryParseJSON(str: string): any {
    try {
        return JSON.parse(str);
    } catch {
        return str;
    }
}

/**
 * Initialize memory system (run SQL setup)
 */
export function initializeMemorySystem(): void {
    const sqlPath = path.join(process.cwd(), 'scripts', 'setup-memory-system.sql');
    const sql = readFileSync(sqlPath, 'utf-8');
    
    // Execute SQL statements
    db.exec(sql);
    console.log('✓ Memory system initialized');
}

/**
 * Get memory statistics
 */
export function getMemoryStats(): {
    sessions: number;
    sessionMemories: number;
    longTermMemories: number;
    projectKnowledge: number;
    userPreferences: number;
    crossSessionContexts: number;
} {
    const getCount = (table: string): number => {
        const result = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
        return result.count;
    };
    
    return {
        sessions: getCount('sessions'),
        sessionMemories: getCount('session_memory'),
        longTermMemories: getCount('long_term_memory'),
        projectKnowledge: getCount('project_knowledge'),
        userPreferences: getCount('user_preferences'),
        crossSessionContexts: getCount('cross_session_context'),
    };
}

