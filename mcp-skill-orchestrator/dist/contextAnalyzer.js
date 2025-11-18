import natural from 'natural';
const { TfIdf, PorterStemmer, WordTokenizer } = natural;
export class ContextAnalyzer {
    tfidf;
    tokenizer;
    // Technical domain keywords
    domainKeywords = {
        frontend: ['react', 'vue', 'angular', 'component', 'jsx', 'tsx', 'ui', 'ux', 'css', 'html', 'dom', 'render', 'state', 'hook', 'props'],
        backend: ['api', 'server', 'endpoint', 'route', 'middleware', 'express', 'fastapi', 'node', 'database', 'query', 'orm'],
        database: ['sql', 'postgres', 'mysql', 'mongodb', 'schema', 'migration', 'index', 'table', 'query', 'transaction'],
        devops: ['deploy', 'ci', 'cd', 'docker', 'kubernetes', 'k8s', 'helm', 'pipeline', 'build', 'terraform', 'aws', 'gcp', 'azure'],
        testing: ['test', 'jest', 'vitest', 'mocha', 'cypress', 'playwright', 'unit', 'integration', 'e2e', 'mock', 'fixture'],
        security: ['auth', 'authentication', 'authorization', 'jwt', 'oauth', 'rbac', 'security', 'encrypt', 'decrypt', 'vulnerability'],
        ai: ['llm', 'gpt', 'claude', 'agent', 'prompt', 'embedding', 'vector', 'rag', 'langchain', 'model', 'training'],
        blockchain: ['solidity', 'smart contract', 'web3', 'ethereum', 'nft', 'defi', 'token', 'blockchain', 'wallet'],
        performance: ['optimize', 'performance', 'cache', 'latency', 'throughput', 'bottleneck', 'profile', 'memory', 'cpu'],
        monitoring: ['log', 'metric', 'trace', 'observability', 'grafana', 'prometheus', 'alert', 'dashboard', 'slo', 'sli']
    };
    // Action verbs that indicate intent
    actionVerbs = [
        'create', 'build', 'implement', 'design', 'develop', 'write',
        'fix', 'debug', 'solve', 'resolve', 'troubleshoot',
        'optimize', 'improve', 'enhance', 'refactor', 'upgrade',
        'test', 'validate', 'verify', 'check', 'audit',
        'deploy', 'release', 'publish', 'launch',
        'migrate', 'upgrade', 'update', 'modify', 'change',
        'analyze', 'investigate', 'review', 'examine',
        'configure', 'setup', 'install', 'initialize',
        'integrate', 'connect', 'link', 'merge'
    ];
    // Stop words to filter out
    stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'should', 'could', 'can', 'may', 'might', 'must', 'i', 'you', 'we',
        'they', 'it', 'this', 'that', 'these', 'those', 'my', 'your', 'our',
        'their', 'want', 'need', 'help', 'please', 'thanks', 'thank'
    ]);
    constructor() {
        this.tfidf = new TfIdf();
        this.tokenizer = new WordTokenizer();
    }
    /**
     * Analyze user prompt or assistant reasoning to extract context
     */
    analyze(text, previousContext) {
        const tokens = this.tokenize(text);
        const keywords = this.extractKeywords(text, tokens);
        const technicalTerms = this.extractTechnicalTerms(tokens);
        const intent = this.detectIntent(text, tokens);
        const complexity = this.assessComplexity(text, tokens);
        const domains = this.detectDomains(tokens);
        const actionVerbs = this.extractActionVerbs(tokens);
        return {
            keywords,
            technicalTerms,
            intent,
            complexity,
            domains,
            actionVerbs
        };
    }
    /**
     * Tokenize and clean text
     */
    tokenize(text) {
        const tokens = this.tokenizer.tokenize(text.toLowerCase()) || [];
        return tokens
            .filter(token => !this.stopWords.has(token))
            .filter(token => token.length > 2)
            .filter(token => /^[a-z0-9-]+$/.test(token));
    }
    /**
     * Extract important keywords using TF-IDF
     */
    extractKeywords(text, tokens) {
        this.tfidf.addDocument(tokens);
        const scores = [];
        this.tfidf.listTerms(0).forEach(item => {
            scores.push({ term: item.term, score: item.tfidf });
        });
        // Sort by TF-IDF score and take top keywords
        return scores
            .sort((a, b) => b.score - a.score)
            .slice(0, 15)
            .map(item => item.term);
    }
    /**
     * Extract technical terms (multi-word phrases and compound terms)
     */
    extractTechnicalTerms(tokens) {
        const terms = [];
        const text = tokens.join(' ');
        // Check for known technical phrases
        const technicalPhrases = [
            'smart contract', 'machine learning', 'api gateway', 'load balancer',
            'message queue', 'service mesh', 'data pipeline', 'ci/cd',
            'zero downtime', 'blue green', 'canary deployment', 'feature flag',
            'dependency injection', 'design pattern', 'error handling',
            'unit test', 'integration test', 'end to end', 'pull request',
            'code review', 'static analysis', 'type safety', 'memory leak'
        ];
        technicalPhrases.forEach(phrase => {
            if (text.includes(phrase.replace(/ /g, ' '))) {
                terms.push(phrase);
            }
        });
        // Check for compound terms with hyphens or underscores
        tokens.forEach(token => {
            if (token.includes('-') || token.includes('_')) {
                terms.push(token);
            }
        });
        return [...new Set(terms)];
    }
    /**
     * Detect user intent from text
     */
    detectIntent(text, tokens) {
        const lowerText = text.toLowerCase();
        // Check for specific intent patterns
        if (lowerText.match(/\b(fix|bug|error|issue|problem|broken)\b/)) {
            return 'fix_bug';
        }
        if (lowerText.match(/\b(create|build|implement|add|new)\b/)) {
            return 'create_feature';
        }
        if (lowerText.match(/\b(optimize|improve|performance|faster|slow)\b/)) {
            return 'optimize';
        }
        if (lowerText.match(/\b(test|testing|spec|coverage)\b/)) {
            return 'testing';
        }
        if (lowerText.match(/\b(deploy|release|publish|ci|cd)\b/)) {
            return 'deployment';
        }
        if (lowerText.match(/\b(refactor|clean|reorganize|restructure)\b/)) {
            return 'refactor';
        }
        if (lowerText.match(/\b(migrate|upgrade|update|version)\b/)) {
            return 'migration';
        }
        if (lowerText.match(/\b(security|auth|encrypt|vulnerability)\b/)) {
            return 'security';
        }
        if (lowerText.match(/\b(how|what|why|explain|understand)\b/)) {
            return 'learning';
        }
        if (lowerText.match(/\b(design|architect|plan|structure)\b/)) {
            return 'architecture';
        }
        return 'general';
    }
    /**
     * Assess complexity based on technical depth and scope
     */
    assessComplexity(text, tokens) {
        let score = 0;
        // Check for complexity indicators
        const complexityIndicators = {
            high: ['architecture', 'distributed', 'microservices', 'scalability', 'migration', 'refactor', 'redesign'],
            medium: ['implement', 'integrate', 'optimize', 'configure', 'setup'],
            low: ['fix', 'update', 'change', 'add', 'remove']
        };
        tokens.forEach(token => {
            if (complexityIndicators.high.includes(token))
                score += 3;
            if (complexityIndicators.medium.includes(token))
                score += 2;
            if (complexityIndicators.low.includes(token))
                score += 1;
        });
        // Word count also indicates complexity
        if (tokens.length > 50)
            score += 2;
        else if (tokens.length > 20)
            score += 1;
        // Multiple technical domains = higher complexity
        const domains = this.detectDomains(tokens);
        if (domains.length > 2)
            score += 2;
        else if (domains.length > 1)
            score += 1;
        if (score >= 6)
            return 'high';
        if (score >= 3)
            return 'medium';
        return 'low';
    }
    /**
     * Detect technical domains from tokens
     */
    detectDomains(tokens) {
        const detected = [];
        Object.entries(this.domainKeywords).forEach(([domain, keywords]) => {
            const matches = tokens.filter(token => keywords.includes(token));
            if (matches.length > 0) {
                detected.push(domain);
            }
        });
        return detected;
    }
    /**
     * Extract action verbs that indicate what the user wants to do
     */
    extractActionVerbs(tokens) {
        return tokens.filter(token => this.actionVerbs.includes(token));
    }
    /**
     * Combine multiple contexts (e.g., user prompt + assistant reasoning)
     */
    combineContexts(contexts) {
        const combined = {
            keywords: [],
            technicalTerms: [],
            intent: contexts[0]?.intent || 'general',
            complexity: 'medium',
            domains: [],
            actionVerbs: []
        };
        contexts.forEach(ctx => {
            combined.keywords.push(...ctx.keywords);
            combined.technicalTerms.push(...ctx.technicalTerms);
            combined.domains.push(...ctx.domains);
            combined.actionVerbs.push(...ctx.actionVerbs);
        });
        // Deduplicate
        combined.keywords = [...new Set(combined.keywords)];
        combined.technicalTerms = [...new Set(combined.technicalTerms)];
        combined.domains = [...new Set(combined.domains)];
        combined.actionVerbs = [...new Set(combined.actionVerbs)];
        // Determine overall complexity
        const maxComplexity = contexts.reduce((max, ctx) => {
            const levels = { low: 1, medium: 2, high: 3 };
            return levels[ctx.complexity] > levels[max] ? ctx.complexity : max;
        }, 'low');
        combined.complexity = maxComplexity;
        return combined;
    }
}
