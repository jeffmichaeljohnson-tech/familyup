/**
 * Service for analyzing context and recommending skills using 3D thinking
 */
export class ContextAnalyzer {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    /**
     * Analyze context from multiple dimensions (3D thinking)
     */
    analyzeContext(userQuery, codeContext, projectType) {
        const queryLower = userQuery.toLowerCase();
        const codeLower = codeContext?.toLowerCase() || '';
        // Technical Dimension Analysis
        const technicalDimension = this.analyzeTechnicalDimension(queryLower, codeLower);
        // Architectural Dimension Analysis
        const architecturalDimension = this.analyzeArchitecturalDimension(queryLower, codeLower, projectType);
        // Performance Dimension Analysis
        const performanceDimension = this.analyzePerformanceDimension(queryLower, codeLower);
        // Find relevant skills based on all dimensions
        const recommendedSkills = this.findRelevantSkills(technicalDimension, architecturalDimension, performanceDimension, queryLower);
        return {
            technicalDimension,
            architecturalDimension,
            performanceDimension,
            recommendedSkills,
        };
    }
    /**
     * Analyze technical dimension
     */
    analyzeTechnicalDimension(query, code) {
        const technologies = [];
        const patterns = [];
        let complexity = 'medium';
        // Detect technologies
        const techKeywords = {
            react: 'react',
            typescript: 'typescript',
            javascript: 'javascript',
            python: 'python',
            node: 'nodejs',
            fastapi: 'fastapi',
            postgres: 'postgresql',
            sql: 'sql',
            mongodb: 'mongodb',
            docker: 'docker',
            kubernetes: 'k8s',
            terraform: 'terraform',
            github: 'github',
            aws: 'aws',
            azure: 'azure',
            gcp: 'gcp',
            solidity: 'solidity',
            web3: 'web3',
            nft: 'nft',
            defi: 'defi',
        };
        for (const [keyword, tech] of Object.entries(techKeywords)) {
            if (query.includes(keyword) || code.includes(keyword)) {
                technologies.push(tech);
            }
        }
        // Detect patterns
        const patternKeywords = {
            'microservice': 'microservices',
            'api': 'api-design',
            'auth': 'authentication',
            'test': 'testing',
            'migrate': 'database-migration',
            'deploy': 'deployment',
            'monorepo': 'monorepo',
            'rag': 'rag',
            'langchain': 'langchain',
            'prompt': 'prompt-engineering',
            'error': 'error-handling',
            'debug': 'debugging',
            'optimize': 'performance-optimization',
            'cost': 'cost-optimization',
            'security': 'security',
            'async': 'async-patterns',
        };
        for (const [keyword, pattern] of Object.entries(patternKeywords)) {
            if (query.includes(keyword) || code.includes(keyword)) {
                patterns.push(pattern);
            }
        }
        // Determine complexity
        const complexityIndicators = [
            'complex', 'complicated', 'difficult', 'challenging',
            'enterprise', 'scalable', 'distributed', 'microservices',
        ];
        const hasComplexityIndicators = complexityIndicators.some(indicator => query.includes(indicator) || code.includes(indicator));
        if (hasComplexityIndicators || technologies.length > 5) {
            complexity = 'high';
        }
        else if (technologies.length <= 2 && patterns.length <= 1) {
            complexity = 'low';
        }
        return {
            technologies: [...new Set(technologies)],
            patterns: [...new Set(patterns)],
            complexity,
        };
    }
    /**
     * Analyze architectural dimension
     */
    analyzeArchitecturalDimension(query, code, projectType) {
        const patterns = [];
        const concerns = [];
        let scale = 'medium';
        // Detect architectural patterns
        if (query.includes('microservice') || code.includes('microservice')) {
            patterns.push('microservices');
        }
        if (query.includes('monorepo') || code.includes('monorepo')) {
            patterns.push('monorepo');
        }
        if (query.includes('api') || code.includes('api')) {
            patterns.push('api-design');
        }
        if (query.includes('database') || query.includes('db') || code.includes('database')) {
            patterns.push('database-design');
        }
        // Detect architectural concerns
        if (query.includes('scale') || query.includes('scalability')) {
            concerns.push('scalability');
        }
        if (query.includes('security') || query.includes('auth')) {
            concerns.push('security');
        }
        if (query.includes('performance') || query.includes('optimize')) {
            concerns.push('performance');
        }
        if (query.includes('deploy') || query.includes('ci/cd')) {
            concerns.push('deployment');
        }
        if (query.includes('test') || query.includes('testing')) {
            concerns.push('testing');
        }
        if (query.includes('monitor') || query.includes('observability')) {
            concerns.push('observability');
        }
        // Determine scale
        if (query.includes('enterprise') || query.includes('large') || projectType === 'enterprise') {
            scale = 'large';
        }
        else if (query.includes('small') || query.includes('simple') || projectType === 'small') {
            scale = 'small';
        }
        return {
            patterns: [...new Set(patterns)],
            concerns: [...new Set(concerns)],
            scale,
        };
    }
    /**
     * Analyze performance dimension
     */
    analyzePerformanceDimension(query, code) {
        const concerns = [];
        const optimizations = [];
        const bottlenecks = [];
        // Detect performance concerns
        if (query.includes('slow') || query.includes('performance') || query.includes('optimize')) {
            concerns.push('general-performance');
        }
        if (query.includes('memory') || query.includes('leak')) {
            concerns.push('memory');
            bottlenecks.push('memory-leaks');
        }
        if (query.includes('database') || query.includes('query') || query.includes('sql')) {
            concerns.push('database-performance');
            bottlenecks.push('slow-queries');
        }
        if (query.includes('network') || query.includes('api') || query.includes('http')) {
            concerns.push('network-performance');
            bottlenecks.push('network-latency');
        }
        if (query.includes('render') || query.includes('react') || query.includes('frontend')) {
            concerns.push('rendering-performance');
            bottlenecks.push('re-renders');
        }
        // Detect optimization strategies
        if (query.includes('cache') || code.includes('cache')) {
            optimizations.push('caching');
        }
        if (query.includes('lazy') || query.includes('code-split')) {
            optimizations.push('lazy-loading');
        }
        if (query.includes('memo') || query.includes('memoize')) {
            optimizations.push('memoization');
        }
        if (query.includes('index') || query.includes('database')) {
            optimizations.push('database-indexing');
        }
        return {
            concerns: [...new Set(concerns)],
            optimizations: [...new Set(optimizations)],
            bottlenecks: [...new Set(bottlenecks)],
        };
    }
    /**
     * Find relevant skills based on analysis
     */
    findRelevantSkills(technical, architectural, performance, query) {
        const searchTerms = [];
        // Add technology-based search terms
        searchTerms.push(...technical.technologies);
        searchTerms.push(...technical.patterns);
        // Add architectural search terms
        searchTerms.push(...architectural.patterns);
        searchTerms.push(...architectural.concerns);
        // Add performance search terms
        searchTerms.push(...performance.concerns);
        searchTerms.push(...performance.optimizations);
        // Combine all search terms
        const combinedQuery = [...new Set(searchTerms)].join(' ');
        // If no specific terms, use the original query
        const finalQuery = combinedQuery || query;
        // Search skills
        const results = this.registry.searchSkills(finalQuery);
        // Boost relevance for exact matches
        return results.map(result => {
            let boostedScore = result.relevanceScore;
            // Boost if technology matches
            for (const tech of technical.technologies) {
                if (result.skill.metadata.tags?.some(tag => tag.toLowerCase().includes(tech))) {
                    boostedScore += 5;
                }
            }
            // Boost if pattern matches
            for (const pattern of technical.patterns) {
                if (result.skill.metadata.name.toLowerCase().includes(pattern)) {
                    boostedScore += 8;
                }
            }
            return {
                ...result,
                relevanceScore: boostedScore,
            };
        }).sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10);
    }
    /**
     * Get skill recommendations with reasoning
     */
    recommendSkills(userQuery, codeContext, projectType) {
        const analysis = this.analyzeContext(userQuery, codeContext, projectType);
        return analysis.recommendedSkills.map(result => {
            const applicableDimensions = [];
            let reasoning = '';
            // Determine which dimensions apply
            if (result.skill.metadata.category === 'frontend' ||
                result.skill.metadata.tags?.some(tag => ['react', 'javascript', 'typescript'].includes(tag))) {
                applicableDimensions.push('technical');
            }
            if (result.skill.metadata.tags?.some(tag => ['architecture', 'design', 'patterns'].includes(tag))) {
                applicableDimensions.push('architectural');
            }
            if (result.skill.metadata.tags?.some(tag => ['performance', 'optimization'].includes(tag))) {
                applicableDimensions.push('performance');
            }
            // Generate reasoning
            const reasons = [];
            if (result.matchedTerms.includes('name')) {
                reasons.push(`Skill name matches query`);
            }
            if (result.matchedTerms.includes('category')) {
                reasons.push(`Category matches: ${result.skill.metadata.category}`);
            }
            if (result.matchedTerms.includes('tag')) {
                reasons.push(`Tags match: ${result.skill.metadata.tags?.join(', ')}`);
            }
            if (applicableDimensions.length > 0) {
                reasons.push(`Applicable to: ${applicableDimensions.join(', ')} dimensions`);
            }
            reasoning = reasons.join('. ');
            return {
                skill: result.skill,
                confidence: Math.min(result.relevanceScore / 20, 1), // Normalize to 0-1
                reasoning,
                applicableDimensions: applicableDimensions.length > 0 ? applicableDimensions : ['general'],
            };
        });
    }
}
//# sourceMappingURL=contextAnalyzer.js.map