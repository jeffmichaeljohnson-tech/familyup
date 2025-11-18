/**
 * Service for managing and searching skills
 */
import { loadAllSkills } from './skillLoader.js';
export class SkillRegistry {
    skills = {};
    initialized = false;
    /**
     * Initialize the registry by loading all skills
     */
    async initialize() {
        if (this.initialized) {
            return;
        }
        const loadedSkills = await loadAllSkills();
        for (const skill of loadedSkills) {
            this.skills[skill.metadata.name] = skill;
        }
        this.initialized = true;
    }
    /**
     * Get all skills
     */
    getAllSkills() {
        return Object.values(this.skills);
    }
    /**
     * Get a skill by name
     */
    getSkill(name) {
        return this.skills[name];
    }
    /**
     * Search skills by query string
     */
    searchSkills(query) {
        const queryLower = query.toLowerCase();
        const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 0);
        const results = [];
        for (const skill of Object.values(this.skills)) {
            let relevanceScore = 0;
            const matchedTerms = [];
            // Check name match (highest weight)
            if (skill.metadata.name.toLowerCase().includes(queryLower)) {
                relevanceScore += 10;
                matchedTerms.push('name');
            }
            // Check description match
            if (skill.metadata.description.toLowerCase().includes(queryLower)) {
                relevanceScore += 5;
                matchedTerms.push('description');
            }
            // Check category match
            if (skill.metadata.category?.toLowerCase().includes(queryLower)) {
                relevanceScore += 8;
                matchedTerms.push('category');
            }
            // Check tag matches
            if (skill.metadata.tags) {
                for (const tag of skill.metadata.tags) {
                    if (tag.toLowerCase().includes(queryLower)) {
                        relevanceScore += 6;
                        if (!matchedTerms.includes('tag')) {
                            matchedTerms.push('tag');
                        }
                    }
                }
            }
            // Check content match (lower weight)
            const contentLower = skill.fullContent.toLowerCase();
            for (const term of queryTerms) {
                const matches = (contentLower.match(new RegExp(term, 'g')) || []).length;
                relevanceScore += Math.min(matches * 0.5, 5);
                if (matches > 0 && !matchedTerms.includes('content')) {
                    matchedTerms.push('content');
                }
            }
            // Check exact term matches in name (bonus)
            for (const term of queryTerms) {
                if (skill.metadata.name.toLowerCase() === term) {
                    relevanceScore += 15;
                }
            }
            if (relevanceScore > 0) {
                results.push({
                    skill,
                    relevanceScore,
                    matchedTerms: [...new Set(matchedTerms)],
                });
            }
        }
        // Sort by relevance score (descending)
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        return results;
    }
    /**
     * Search skills by category
     */
    searchByCategory(category) {
        const categoryLower = category.toLowerCase();
        return Object.values(this.skills).filter(skill => skill.metadata.category?.toLowerCase() === categoryLower);
    }
    /**
     * Search skills by tags
     */
    searchByTags(tags) {
        const tagsLower = tags.map(tag => tag.toLowerCase());
        return Object.values(this.skills).filter(skill => {
            if (!skill.metadata.tags)
                return false;
            return tagsLower.some(tag => skill.metadata.tags.some(skillTag => skillTag.toLowerCase() === tag));
        });
    }
    /**
     * Get skills count
     */
    getSkillsCount() {
        return Object.keys(this.skills).length;
    }
    /**
     * Get all categories
     */
    getCategories() {
        const categories = new Set();
        for (const skill of Object.values(this.skills)) {
            if (skill.metadata.category) {
                categories.add(skill.metadata.category);
            }
        }
        return Array.from(categories).sort();
    }
    /**
     * Get all tags
     */
    getAllTags() {
        const tags = new Set();
        for (const skill of Object.values(this.skills)) {
            if (skill.metadata.tags) {
                for (const tag of skill.metadata.tags) {
                    tags.add(tag);
                }
            }
        }
        return Array.from(tags).sort();
    }
}
//# sourceMappingURL=skillRegistry.js.map