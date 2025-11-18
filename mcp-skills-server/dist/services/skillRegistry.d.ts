/**
 * Service for managing and searching skills
 */
import { SkillDocumentation, SkillSearchResult } from '../types/index.js';
export declare class SkillRegistry {
    private skills;
    private initialized;
    /**
     * Initialize the registry by loading all skills
     */
    initialize(): Promise<void>;
    /**
     * Get all skills
     */
    getAllSkills(): SkillDocumentation[];
    /**
     * Get a skill by name
     */
    getSkill(name: string): SkillDocumentation | undefined;
    /**
     * Search skills by query string
     */
    searchSkills(query: string): SkillSearchResult[];
    /**
     * Search skills by category
     */
    searchByCategory(category: string): SkillDocumentation[];
    /**
     * Search skills by tags
     */
    searchByTags(tags: string[]): SkillDocumentation[];
    /**
     * Get skills count
     */
    getSkillsCount(): number;
    /**
     * Get all categories
     */
    getCategories(): string[];
    /**
     * Get all tags
     */
    getAllTags(): string[];
}
//# sourceMappingURL=skillRegistry.d.ts.map