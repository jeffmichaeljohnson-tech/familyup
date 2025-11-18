export class SkillMatcher {
    db;
    config;
    skillsCache = new Map();
    constructor(db, config) {
        this.db = db;
        this.config = {
            autoInvokeThreshold: 0.85,
            suggestionThreshold: 0.60,
            maxSuggestions: 5,
            learningEnabled: true,
            contextWindow: 20,
            ...config
        };
    }
    /**
     * Match skills to a given context analysis
     */
    async matchSkills(context, availableSkills) {
        const matches = [];
        // Get skills from cache or parameter
        const skills = availableSkills || Array.from(this.skillsCache.values());
        for (const skill of skills) {
            const score = this.calculateMatchScore(context, skill);
            if (score >= this.config.suggestionThreshold) {
                matches.push({
                    skillName: skill.name,
                    confidenceScore: score,
                    reasoning: this.generateReasoning(context, skill, score),
                    metadata: {
                        category: skill.category,
                        tags: skill.tags,
                        description: skill.description
                    }
                });
            }
        }
        // Sort by confidence score
        matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
        // Apply learning adjustments
        if (this.config.learningEnabled) {
            return this.applyLearningAdjustments(matches, context);
        }
        return matches.slice(0, this.config.maxSuggestions);
    }
    /**
     * Calculate match score between context and skill
     */
    calculateMatchScore(context, skill) {
        let score = 0;
        const weights = {
            keyword: 0.4,
            domain: 0.25,
            intent: 0.20,
            technical: 0.15
        };
        // Keyword matching
        const keywordScore = this.scoreKeywordMatch(context.keywords, skill.description, skill.tags);
        score += keywordScore * weights.keyword;
        // Domain matching
        const domainScore = this.scoreDomainMatch(context.domains, skill.category, skill.tags);
        score += domainScore * weights.domain;
        // Intent matching
        const intentScore = this.scoreIntentMatch(context.intent, context.actionVerbs, skill.description);
        score += intentScore * weights.intent;
        // Technical term matching
        const technicalScore = this.scoreTechnicalMatch(context.technicalTerms, skill.description, skill.name);
        score += technicalScore * weights.technical;
        return Math.min(score, 1.0);
    }
    /**
     * Score keyword matching
     */
    scoreKeywordMatch(keywords, description, tags) {
        if (!keywords.length)
            return 0;
        const descLower = (description || '').toLowerCase();
        const tagsLower = (tags || []).map((t) => t.toLowerCase());
        let matches = 0;
        keywords.forEach(keyword => {
            if (descLower.includes(keyword))
                matches++;
            if (tagsLower.some((tag) => tag.includes(keyword)))
                matches += 0.5;
        });
        return Math.min(matches / keywords.length, 1.0);
    }
    /**
     * Score domain matching
     */
    scoreDomainMatch(domains, category, tags) {
        if (!domains.length)
            return 0;
        const categoryLower = (category || '').toLowerCase();
        const tagsLower = (tags || []).map((t) => t.toLowerCase());
        let matches = 0;
        domains.forEach(domain => {
            if (categoryLower.includes(domain))
                matches += 1.5;
            if (tagsLower.some((tag) => tag.includes(domain)))
                matches++;
        });
        return Math.min(matches / domains.length, 1.0);
    }
    /**
     * Score intent matching
     */
    scoreIntentMatch(intent, actionVerbs, description) {
        const descLower = (description || '').toLowerCase();
        let score = 0;
        // Intent-based matching
        const intentKeywords = {
            fix_bug: ['debug', 'fix', 'bug', 'error', 'troubleshoot', 'solve'],
            create_feature: ['create', 'build', 'implement', 'develop', 'new'],
            optimize: ['optimize', 'performance', 'improve', 'faster', 'efficient'],
            testing: ['test', 'testing', 'coverage', 'validation', 'verify'],
            deployment: ['deploy', 'release', 'ci', 'cd', 'pipeline', 'build'],
            refactor: ['refactor', 'clean', 'reorganize', 'restructure', 'modernize'],
            migration: ['migrate', 'upgrade', 'update', 'version', 'transition'],
            security: ['security', 'auth', 'encrypt', 'vulnerability', 'secure'],
            architecture: ['design', 'architect', 'pattern', 'structure', 'system']
        };
        const relevantKeywords = intentKeywords[intent] || [];
        relevantKeywords.forEach(keyword => {
            if (descLower.includes(keyword))
                score += 0.2;
        });
        // Action verb matching
        actionVerbs.forEach(verb => {
            if (descLower.includes(verb))
                score += 0.15;
        });
        return Math.min(score, 1.0);
    }
    /**
     * Score technical term matching
     */
    scoreTechnicalMatch(technicalTerms, description, skillName) {
        if (!technicalTerms.length)
            return 0;
        const descLower = (description || '').toLowerCase();
        const nameLower = (skillName || '').toLowerCase();
        let matches = 0;
        technicalTerms.forEach(term => {
            if (descLower.includes(term))
                matches += 1;
            if (nameLower.includes(term))
                matches += 0.5;
        });
        return Math.min(matches / technicalTerms.length, 1.0);
    }
    /**
     * Generate human-readable reasoning for the match
     */
    generateReasoning(context, skill, score) {
        const reasoning = [];
        // Check keyword matches
        const matchingKeywords = context.keywords.filter(k => (skill.description || '').toLowerCase().includes(k));
        if (matchingKeywords.length > 0) {
            reasoning.push(`Matches keywords: ${matchingKeywords.slice(0, 3).join(', ')}`);
        }
        // Check domain matches
        const matchingDomains = context.domains.filter(d => (skill.category || '').toLowerCase().includes(d) ||
            (skill.tags || []).some((t) => t.toLowerCase().includes(d)));
        if (matchingDomains.length > 0) {
            reasoning.push(`Relevant to domains: ${matchingDomains.join(', ')}`);
        }
        // Check intent alignment
        if (context.intent !== 'general') {
            reasoning.push(`Aligns with intent: ${context.intent.replace('_', ' ')}`);
        }
        // Add confidence qualifier
        if (score >= 0.9) {
            reasoning.push('High confidence match');
        }
        else if (score >= 0.75) {
            reasoning.push('Strong match');
        }
        else if (score >= 0.6) {
            reasoning.push('Moderate match');
        }
        return reasoning;
    }
    /**
     * Apply learning adjustments based on historical data
     */
    applyLearningAdjustments(matches, context) {
        // Get historical patterns
        const patterns = this.db.findMatchingPatterns(context.keywords, 10);
        // Adjust scores based on historical success
        matches.forEach(match => {
            const relevantPatterns = patterns.filter((p) => p.skill_names.includes(match.skillName));
            if (relevantPatterns.length > 0) {
                const avgSuccessRate = relevantPatterns.reduce((sum, p) => sum + p.success_rate, 0) / relevantPatterns.length;
                // Boost score based on historical success
                match.confidenceScore = Math.min(match.confidenceScore * (1 + avgSuccessRate * 0.2), 1.0);
                match.reasoning.push(`Historical success rate: ${(avgSuccessRate * 100).toFixed(0)}%`);
            }
        });
        // Re-sort after adjustments
        matches.sort((a, b) => b.confidenceScore - a.confidenceScore);
        return matches.slice(0, this.config.maxSuggestions);
    }
    /**
     * Get auto-invoke and suggestion lists
     */
    categorizeMatches(matches) {
        return {
            autoInvoke: matches.filter(m => m.confidenceScore >= this.config.autoInvokeThreshold),
            suggestions: matches.filter(m => m.confidenceScore >= this.config.suggestionThreshold &&
                m.confidenceScore < this.config.autoInvokeThreshold)
        };
    }
    /**
     * Update skills cache
     */
    updateSkillsCache(skills) {
        this.skillsCache.clear();
        skills.forEach(skill => {
            this.skillsCache.set(skill.name, skill);
        });
    }
    /**
     * Update configuration
     */
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
