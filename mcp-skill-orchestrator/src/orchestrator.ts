import { ContextAnalyzer, ContextAnalysis } from './contextAnalyzer.js';
import { SkillMatcher, SkillMatch, SkillMatchConfig } from './skillMatcher.js';
import { SkillOrchestratorDB, SkillInvocation } from './database.js';

export interface OrchestrationResult {
  context: ContextAnalysis;
  autoInvoke: SkillMatch[];
  suggestions: SkillMatch[];
  reasoning: string;
  timestamp: number;
}

export interface OrchestrationConfig {
  matcherConfig?: Partial<SkillMatchConfig>;
  enableLearning?: boolean;
  enableAutoInvoke?: boolean;
}

export class SkillOrchestrator {
  private contextAnalyzer: ContextAnalyzer;
  private skillMatcher: SkillMatcher;
  private db: SkillOrchestratorDB;
  private config: Required<OrchestrationConfig>;

  constructor(dbPath?: string, config?: OrchestrationConfig) {
    this.db = new SkillOrchestratorDB(dbPath);
    this.contextAnalyzer = new ContextAnalyzer();
    this.skillMatcher = new SkillMatcher(this.db, config?.matcherConfig);

    this.config = {
      matcherConfig: config?.matcherConfig || {},
      enableLearning: config?.enableLearning !== false,
      enableAutoInvoke: config?.enableAutoInvoke !== false
    };
  }

  /**
   * Main orchestration method - analyze context and match skills
   */
  async orchestrate(
    userPrompt: string,
    assistantReasoning?: string,
    projectContext?: any
  ): Promise<OrchestrationResult> {
    const timestamp = Date.now();

    // Analyze user prompt
    const userContext = this.contextAnalyzer.analyze(userPrompt);

    // Analyze assistant reasoning if available
    let combinedContext = userContext;
    if (assistantReasoning) {
      const reasoningContext = this.contextAnalyzer.analyze(assistantReasoning);
      combinedContext = this.contextAnalyzer.combineContexts([
        userContext,
        reasoningContext
      ]);
    }

    // Get available skills (this would be populated from MCP skills server)
    const cachedSkills = this.db.getAllSkills();

    // Match skills to context
    const matches = await this.skillMatcher.matchSkills(
      combinedContext,
      cachedSkills.length > 0 ? cachedSkills : undefined
    );

    // Categorize matches
    const { autoInvoke, suggestions } = this.skillMatcher.categorizeMatches(matches);

    // Generate reasoning
    const reasoning = this.generateOrchestrationReasoning(
      combinedContext,
      autoInvoke,
      suggestions
    );

    // Record in database for learning
    if (this.config.enableLearning) {
      this.recordOrchestration(userPrompt, assistantReasoning || '', combinedContext, [...autoInvoke, ...suggestions]);
    }

    return {
      context: combinedContext,
      autoInvoke: this.config.enableAutoInvoke ? autoInvoke : [],
      suggestions,
      reasoning,
      timestamp
    };
  }

  /**
   * Analyze a single text input for context
   */
  analyzeContext(text: string): ContextAnalysis {
    return this.contextAnalyzer.analyze(text);
  }

  /**
   * Update skills cache from external source (e.g., MCP skills server)
   */
  updateSkillsCache(skills: any[]) {
    this.skillMatcher.updateSkillsCache(skills);

    // Also cache in database
    skills.forEach(skill => {
      this.db.cacheSkillMetadata({
        name: skill.name,
        category: skill.category || '',
        tags: JSON.stringify(skill.tags || []),
        description: skill.description || '',
        invocationCount: 0,
        successCount: 0,
        lastInvoked: 0
      });
    });
  }

  /**
   * Record feedback on skill invocation
   */
  recordFeedback(
    skillName: string,
    outcome: 'success' | 'failure' | 'partial',
    feedback?: string
  ) {
    const recent = this.db.getRecentSuccesses(1)[0] as any;
    if (recent && recent.skill_name === skillName) {
      this.db.recordInvocation({
        timestamp: Date.now(),
        userPrompt: recent.user_prompt,
        assistantReasoning: recent.assistant_reasoning,
        extractedKeywords: recent.extracted_keywords,
        skillName,
        confidenceScore: recent.confidence_score,
        invocationType: recent.invocation_type as any,
        outcome,
        userFeedback: feedback
      });

      // Learn from this pattern
      if (this.config.enableLearning) {
        this.updatePatternLearning(recent, outcome);
      }
    }
  }

  /**
   * Get statistics and insights
   */
  getStatistics() {
    const recentInvocations = this.db.getRecentSuccesses(50);
    const allSkills = this.db.getAllSkills();

    const stats = {
      totalInvocations: recentInvocations.length,
      successRate: 0,
      topSkills: [] as any[],
      topPatterns: [] as any[],
      recentActivity: recentInvocations.slice(0, 10)
    };

    // Calculate success rate
    const successes = recentInvocations.filter((inv: any) => inv.outcome === 'success');
    stats.successRate = recentInvocations.length > 0
      ? successes.length / recentInvocations.length
      : 0;

    // Get top skills by invocation count
    stats.topSkills = allSkills
      .sort((a: any, b: any) => b.invocation_count - a.invocation_count)
      .slice(0, 10);

    return stats;
  }

  /**
   * Generate human-readable reasoning for orchestration
   */
  private generateOrchestrationReasoning(
    context: ContextAnalysis,
    autoInvoke: SkillMatch[],
    suggestions: SkillMatch[]
  ): string {
    const parts: string[] = [];

    // Context summary
    parts.push(`Detected context: ${context.intent.replace('_', ' ')}`);
    if (context.domains.length > 0) {
      parts.push(`Domains: ${context.domains.join(', ')}`);
    }
    if (context.complexity !== 'medium') {
      parts.push(`Complexity: ${context.complexity}`);
    }

    // Auto-invoke
    if (autoInvoke.length > 0) {
      parts.push(
        `\nAuto-invoking ${autoInvoke.length} skill(s): ${autoInvoke.map(s => s.skillName).join(', ')}`
      );
    }

    // Suggestions
    if (suggestions.length > 0) {
      parts.push(
        `\nSuggested ${suggestions.length} skill(s): ${suggestions.map(s => s.skillName).join(', ')}`
      );
    }

    return parts.join('\n');
  }

  /**
   * Record orchestration for learning
   */
  private recordOrchestration(
    userPrompt: string,
    assistantReasoning: string,
    context: ContextAnalysis,
    matches: SkillMatch[]
  ) {
    const keywords = context.keywords.join(', ');

    matches.forEach(match => {
      this.db.recordInvocation({
        timestamp: Date.now(),
        userPrompt,
        assistantReasoning,
        extractedKeywords: keywords,
        skillName: match.skillName,
        confidenceScore: match.confidenceScore,
        invocationType: match.confidenceScore >= 0.85 ? 'auto' : 'suggested',
        outcome: 'unknown'
      });

      // Update keyword mappings
      context.keywords.forEach(keyword => {
        this.db.updateKeywordMapping(
          keyword,
          match.skillName,
          match.confidenceScore
        );
      });
    });
  }

  /**
   * Update pattern learning based on outcomes
   */
  private updatePatternLearning(invocation: any, outcome: string) {
    const successRate = outcome === 'success' ? 1.0 : outcome === 'partial' ? 0.5 : 0.0;

    this.db.learnPattern({
      pattern: invocation.user_prompt.substring(0, 100), // First 100 chars as pattern
      keywords: invocation.extracted_keywords,
      skillNames: invocation.skill_name,
      successRate,
      invocationCount: 1,
      lastUsed: Date.now()
    });
  }

  /**
   * Search historical invocations
   */
  searchHistory(query: string, limit = 10) {
    // This would implement fuzzy search over historical invocations
    // For now, return recent successes
    return this.db.getRecentSuccesses(limit);
  }

  /**
   * Close database connection
   */
  close() {
    this.db.close();
  }
}
