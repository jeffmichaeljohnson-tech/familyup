/**
 * Service for analyzing context and recommending skills using 3D thinking
 */
import { ContextAnalysis, SkillRecommendation } from '../types/index.js';
import { SkillRegistry } from './skillRegistry.js';
export declare class ContextAnalyzer {
    private registry;
    constructor(registry: SkillRegistry);
    /**
     * Analyze context from multiple dimensions (3D thinking)
     */
    analyzeContext(userQuery: string, codeContext?: string, projectType?: string): ContextAnalysis;
    /**
     * Analyze technical dimension
     */
    private analyzeTechnicalDimension;
    /**
     * Analyze architectural dimension
     */
    private analyzeArchitecturalDimension;
    /**
     * Analyze performance dimension
     */
    private analyzePerformanceDimension;
    /**
     * Find relevant skills based on analysis
     */
    private findRelevantSkills;
    /**
     * Get skill recommendations with reasoning
     */
    recommendSkills(userQuery: string, codeContext?: string, projectType?: string): SkillRecommendation[];
}
//# sourceMappingURL=contextAnalyzer.d.ts.map