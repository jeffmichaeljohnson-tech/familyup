/**
 * Type definitions for the Skills MCP Server
 */
export interface SkillMetadata {
    name: string;
    description: string;
    category?: string;
    tags?: string[];
    version?: string;
    context7_library?: string;
    context7_trust_score?: number;
}
export interface SkillDocumentation {
    metadata: SkillMetadata;
    skillMarkdown?: string;
    readmeMarkdown?: string;
    examplesMarkdown?: string;
    fullContent: string;
}
export interface SkillIndex {
    [skillName: string]: SkillDocumentation;
}
export interface SkillSearchResult {
    skill: SkillDocumentation;
    relevanceScore: number;
    matchedTerms: string[];
}
export interface ContextAnalysis {
    technicalDimension: {
        technologies: string[];
        patterns: string[];
        complexity: 'low' | 'medium' | 'high';
    };
    architecturalDimension: {
        patterns: string[];
        concerns: string[];
        scale: 'small' | 'medium' | 'large';
    };
    performanceDimension: {
        concerns: string[];
        optimizations: string[];
        bottlenecks: string[];
    };
    recommendedSkills: SkillSearchResult[];
}
export interface SkillRecommendation {
    skill: SkillDocumentation;
    confidence: number;
    reasoning: string;
    applicableDimensions: string[];
}
//# sourceMappingURL=index.d.ts.map