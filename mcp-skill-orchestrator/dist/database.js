import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class SkillOrchestratorDB {
    db;
    constructor(dbPath) {
        const path = dbPath || join(__dirname, '../data/orchestrator.db');
        this.db = new Database(path);
        this.initialize();
    }
    initialize() {
        // Invocation history table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS skill_invocations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER NOT NULL,
        user_prompt TEXT NOT NULL,
        assistant_reasoning TEXT,
        extracted_keywords TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        confidence_score REAL NOT NULL,
        invocation_type TEXT NOT NULL,
        outcome TEXT DEFAULT 'unknown',
        user_feedback TEXT,
        UNIQUE(timestamp, skill_name)
      );
      CREATE INDEX IF NOT EXISTS idx_invocations_timestamp ON skill_invocations(timestamp);
      CREATE INDEX IF NOT EXISTS idx_invocations_skill ON skill_invocations(skill_name);
      CREATE INDEX IF NOT EXISTS idx_invocations_outcome ON skill_invocations(outcome);
    `);
        // Pattern learning table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS context_patterns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pattern TEXT NOT NULL UNIQUE,
        keywords TEXT NOT NULL,
        skill_names TEXT NOT NULL,
        success_rate REAL DEFAULT 0,
        invocation_count INTEGER DEFAULT 0,
        last_used INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_patterns_keywords ON context_patterns(keywords);
      CREATE INDEX IF NOT EXISTS idx_patterns_success ON context_patterns(success_rate);
    `);
        // Skill metadata cache
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS skill_metadata (
        name TEXT PRIMARY KEY,
        category TEXT,
        tags TEXT,
        description TEXT,
        invocation_count INTEGER DEFAULT 0,
        success_count INTEGER DEFAULT 0,
        last_invoked INTEGER
      );
    `);
        // Keyword to skill mapping (for fast lookup)
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS keyword_skill_mapping (
        keyword TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        weight REAL DEFAULT 1.0,
        PRIMARY KEY (keyword, skill_name)
      );
      CREATE INDEX IF NOT EXISTS idx_mapping_keyword ON keyword_skill_mapping(keyword);
    `);
    }
    // Record a skill invocation
    recordInvocation(invocation) {
        const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO skill_invocations
      (timestamp, user_prompt, assistant_reasoning, extracted_keywords, skill_name,
       confidence_score, invocation_type, outcome, user_feedback)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        return stmt.run(invocation.timestamp, invocation.userPrompt, invocation.assistantReasoning, invocation.extractedKeywords, invocation.skillName, invocation.confidenceScore, invocation.invocationType, invocation.outcome, invocation.userFeedback);
    }
    // Get skill performance metrics
    getSkillMetrics(skillName) {
        return this.db.prepare(`
      SELECT
        skill_name,
        COUNT(*) as total_invocations,
        SUM(CASE WHEN outcome = 'success' THEN 1 ELSE 0 END) as successes,
        AVG(confidence_score) as avg_confidence,
        MAX(timestamp) as last_invoked
      FROM skill_invocations
      WHERE skill_name = ?
      GROUP BY skill_name
    `).get(skillName);
    }
    // Learn pattern associations
    learnPattern(pattern) {
        const existing = this.db.prepare('SELECT * FROM context_patterns WHERE pattern = ?').get(pattern.pattern);
        if (existing) {
            // Update success rate and invocation count
            const newSuccessRate = (existing.successRate * existing.invocationCount + pattern.successRate) /
                (existing.invocationCount + 1);
            this.db.prepare(`
        UPDATE context_patterns
        SET success_rate = ?, invocation_count = invocation_count + 1, last_used = ?
        WHERE pattern = ?
      `).run(newSuccessRate, Date.now(), pattern.pattern);
        }
        else {
            this.db.prepare(`
        INSERT INTO context_patterns (pattern, keywords, skill_names, success_rate, invocation_count, last_used)
        VALUES (?, ?, ?, ?, 1, ?)
      `).run(pattern.pattern, pattern.keywords, pattern.skillNames, pattern.successRate, Date.now());
        }
    }
    // Find patterns matching keywords
    findMatchingPatterns(keywords, limit = 10) {
        const keywordConditions = keywords.map(() => 'keywords LIKE ?').join(' OR ');
        const params = keywords.map(k => `%${k}%`);
        return this.db.prepare(`
      SELECT * FROM context_patterns
      WHERE ${keywordConditions}
      ORDER BY success_rate DESC, invocation_count DESC
      LIMIT ?
    `).all(...params, limit);
    }
    // Update keyword-skill mappings
    updateKeywordMapping(keyword, skillName, weight) {
        this.db.prepare(`
      INSERT OR REPLACE INTO keyword_skill_mapping (keyword, skill_name, weight)
      VALUES (?, ?, ?)
    `).run(keyword, skillName, weight);
    }
    // Get skills for keywords
    getSkillsForKeywords(keywords, limit = 5) {
        const placeholders = keywords.map(() => '?').join(',');
        return this.db.prepare(`
      SELECT skill_name, SUM(weight) as total_weight
      FROM keyword_skill_mapping
      WHERE keyword IN (${placeholders})
      GROUP BY skill_name
      ORDER BY total_weight DESC
      LIMIT ?
    `).all(...keywords, limit);
    }
    // Get recent successful patterns
    getRecentSuccesses(limit = 20) {
        return this.db.prepare(`
      SELECT * FROM skill_invocations
      WHERE outcome = 'success'
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(limit);
    }
    // Cache skill metadata
    cacheSkillMetadata(metadata) {
        this.db.prepare(`
      INSERT OR REPLACE INTO skill_metadata
      (name, category, tags, description, invocation_count, success_count, last_invoked)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(metadata.name, metadata.category, metadata.tags, metadata.description, metadata.invocationCount, metadata.successCount, metadata.lastInvoked);
    }
    // Get all cached skills
    getAllSkills() {
        const skills = this.db.prepare('SELECT * FROM skill_metadata').all();
        // Parse tags from JSON string
        return skills.map(skill => ({
            ...skill,
            tags: skill.tags ? JSON.parse(skill.tags) : []
        }));
    }
    close() {
        this.db.close();
    }
}
