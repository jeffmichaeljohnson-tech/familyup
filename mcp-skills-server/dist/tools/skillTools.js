/**
 * MCP Tools for skill discovery and retrieval
 */
import { z } from 'zod';
// Input schemas
const SkillSearchInputSchema = z.object({
    query: z.string()
        .min(1, "Query must not be empty")
        .max(500, "Query must not exceed 500 characters")
        .describe("Search query to find relevant skills"),
    limit: z.number()
        .int()
        .min(1)
        .max(50)
        .default(10)
        .describe("Maximum number of results to return"),
}).strict();
const GetSkillInputSchema = z.object({
    name: z.string()
        .min(1, "Skill name must not be empty")
        .describe("Name of the skill to retrieve"),
    format: z.enum(['full', 'metadata', 'skill', 'readme', 'examples'])
        .default('full')
        .describe("Format of the response: 'full' (all content), 'metadata' (only metadata), 'skill' (SKILL.md), 'readme' (README.md), 'examples' (EXAMPLES.md)"),
}).strict();
const AnalyzeContextInputSchema = z.object({
    query: z.string()
        .min(1, "Query must not be empty")
        .max(2000, "Query must not exceed 2000 characters")
        .describe("User query or problem description to analyze"),
    code_context: z.string()
        .max(10000, "Code context must not exceed 10000 characters")
        .optional()
        .describe("Optional code context to help with analysis"),
    project_type: z.string()
        .max(100, "Project type must not exceed 100 characters")
        .optional()
        .describe("Optional project type (e.g., 'web', 'mobile', 'backend', 'enterprise')"),
}).strict();
const ListSkillsInputSchema = z.object({
    category: z.string()
        .max(100, "Category must not exceed 100 characters")
        .optional()
        .describe("Optional category filter"),
    tags: z.array(z.string())
        .max(20, "Maximum 20 tags allowed")
        .optional()
        .describe("Optional tags to filter by"),
    limit: z.number()
        .int()
        .min(1)
        .max(100)
        .default(50)
        .describe("Maximum number of skills to return"),
}).strict();
/**
 * Register all skill-related tools
 */
export function registerSkillTools(server, registry, analyzer) {
    // Search skills tool
    server.registerTool('skills_search', {
        title: 'Search Skills',
        description: `Search for skills by query string. Returns relevant skills ranked by relevance score.

This tool searches across skill names, descriptions, categories, tags, and content to find the most relevant skills for your query.

Args:
  - query (string): Search query (1-500 characters)
  - limit (number): Maximum results to return (1-50, default: 10)

Returns:
  JSON object with:
  {
    "total": number,           // Total number of matching skills
    "results": [
      {
        "name": string,        // Skill name
        "description": string, // Skill description
        "category": string,    // Skill category (optional)
        "tags": string[],      // Skill tags
        "relevanceScore": number, // Relevance score (higher = more relevant)
        "matchedTerms": string[] // Which fields matched
      }
    ]
  }

Examples:
  - Search for React skills: query="react"
  - Search for database skills: query="database migration"
  - Search for performance skills: query="optimization performance"`,
        inputSchema: SkillSearchInputSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async (args) => {
        const results = registry.searchSkills(args.query);
        const limit = args.limit ?? 10;
        const limitedResults = results.slice(0, limit);
        const formattedResults = limitedResults.map(result => ({
            name: result.skill.metadata.name,
            description: result.skill.metadata.description,
            category: result.skill.metadata.category || null,
            tags: result.skill.metadata.tags || [],
            relevanceScore: result.relevanceScore,
            matchedTerms: result.matchedTerms,
        }));
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        total: results.length,
                        results: formattedResults,
                    }, null, 2),
                }],
            structuredContent: {
                total: results.length,
                results: formattedResults,
            },
        };
    });
    // Get skill tool
    server.registerTool('skills_get', {
        title: 'Get Skill Documentation',
        description: `Retrieve full documentation for a specific skill by name.

Args:
  - name (string): Name of the skill to retrieve
  - format (enum): Response format:
    - 'full': All content (SKILL.md + README.md + EXAMPLES.md)
    - 'metadata': Only metadata (name, description, tags, etc.)
    - 'skill': Only SKILL.md content
    - 'readme': Only README.md content
    - 'examples': Only EXAMPLES.md content

Returns:
  JSON object with skill documentation based on requested format.

Examples:
  - Get full React skill: name="react-development", format="full"
  - Get only metadata: name="react-development", format="metadata"
  - Get examples: name="react-development", format="examples"`,
        inputSchema: GetSkillInputSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async (args) => {
        const skill = registry.getSkill(args.name);
        if (!skill) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            error: `Skill '${args.name}' not found`,
                            availableSkills: registry.getAllSkills().map(s => s.metadata.name),
                        }, null, 2),
                    }],
            };
        }
        const format = args.format ?? 'full';
        let content;
        switch (format) {
            case 'metadata':
                content = {
                    name: skill.metadata.name,
                    description: skill.metadata.description,
                    category: skill.metadata.category || null,
                    tags: skill.metadata.tags || [],
                    version: skill.metadata.version || null,
                    context7_library: skill.metadata.context7_library || null,
                    context7_trust_score: skill.metadata.context7_trust_score || null,
                };
                break;
            case 'skill':
                content = {
                    name: skill.metadata.name,
                    skillMarkdown: skill.skillMarkdown || null,
                };
                break;
            case 'readme':
                content = {
                    name: skill.metadata.name,
                    readmeMarkdown: skill.readmeMarkdown || null,
                };
                break;
            case 'examples':
                content = {
                    name: skill.metadata.name,
                    examplesMarkdown: skill.examplesMarkdown || null,
                };
                break;
            case 'full':
            default:
                content = {
                    name: skill.metadata.name,
                    metadata: {
                        description: skill.metadata.description,
                        category: skill.metadata.category || null,
                        tags: skill.metadata.tags || [],
                        version: skill.metadata.version || null,
                    },
                    skillMarkdown: skill.skillMarkdown || null,
                    readmeMarkdown: skill.readmeMarkdown || null,
                    examplesMarkdown: skill.examplesMarkdown || null,
                    fullContent: skill.fullContent,
                };
                break;
        }
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify(content, null, 2),
                }],
            structuredContent: content,
        };
    });
    // List skills tool
    server.registerTool('skills_list', {
        title: 'List All Skills',
        description: `List all available skills, optionally filtered by category or tags.

Args:
  - category (string, optional): Filter by category
  - tags (string[], optional): Filter by tags (any match)
  - limit (number): Maximum results to return (1-100, default: 50)

Returns:
  JSON object with list of skills and their metadata.

Examples:
  - List all skills: (no filters)
  - List frontend skills: category="frontend"
  - List React-related skills: tags=["react"]`,
        inputSchema: ListSkillsInputSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async (args) => {
        let skills = registry.getAllSkills();
        // Apply filters
        if (args.category) {
            skills = registry.searchByCategory(args.category);
        }
        if (args.tags && args.tags.length > 0) {
            const tagFiltered = registry.searchByTags(args.tags);
            if (args.category) {
                // Intersection of category and tags
                const categorySet = new Set(skills.map(s => s.metadata.name));
                skills = tagFiltered.filter(s => categorySet.has(s.metadata.name));
            }
            else {
                skills = tagFiltered;
            }
        }
        // Apply limit
        const limit = args.limit ?? 50;
        const limitedSkills = skills.slice(0, limit);
        const formattedSkills = limitedSkills.map(skill => ({
            name: skill.metadata.name,
            description: skill.metadata.description,
            category: skill.metadata.category || null,
            tags: skill.metadata.tags || [],
            version: skill.metadata.version || null,
        }));
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        total: skills.length,
                        returned: formattedSkills.length,
                        skills: formattedSkills,
                    }, null, 2),
                }],
            structuredContent: {
                total: skills.length,
                returned: formattedSkills.length,
                skills: formattedSkills,
            },
        };
    });
    // Analyze context tool (3D thinking)
    server.registerTool('skills_analyze_context', {
        title: 'Analyze Context and Recommend Skills',
        description: `Analyze a user query or problem using 3D thinking (technical, architectural, performance dimensions) and recommend relevant skills.

This tool performs multi-dimensional analysis:
- Technical Dimension: Identifies technologies, patterns, and complexity
- Architectural Dimension: Identifies patterns, concerns, and scale
- Performance Dimension: Identifies concerns, optimizations, and bottlenecks

Args:
  - query (string): User query or problem description (1-2000 characters)
  - code_context (string, optional): Code context to help with analysis (max 10000 characters)
  - project_type (string, optional): Project type (e.g., 'web', 'mobile', 'backend', 'enterprise')

Returns:
  JSON object with:
  {
    "analysis": {
      "technicalDimension": {
        "technologies": string[],
        "patterns": string[],
        "complexity": "low" | "medium" | "high"
      },
      "architecturalDimension": {
        "patterns": string[],
        "concerns": string[],
        "scale": "small" | "medium" | "large"
      },
      "performanceDimension": {
        "concerns": string[],
        "optimizations": string[],
        "bottlenecks": string[]
      }
    },
    "recommendations": [
      {
        "skill": {
          "name": string,
          "description": string,
          "category": string,
          "tags": string[]
        },
        "confidence": number,  // 0-1
        "reasoning": string,
        "applicableDimensions": string[]
      }
    ]
  }

Examples:
  - Analyze React performance issue: query="React app is slow, too many re-renders"
  - Analyze database migration: query="Need to migrate PostgreSQL database schema", project_type="backend"
  - Analyze API design: query="Designing REST API for microservices", code_context="...code..."`,
        inputSchema: AnalyzeContextInputSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async (args) => {
        const analysis = analyzer.analyzeContext(args.query, args.code_context, args.project_type);
        const recommendations = analyzer.recommendSkills(args.query, args.code_context, args.project_type);
        const formattedRecommendations = recommendations.map(rec => ({
            skill: {
                name: rec.skill.metadata.name,
                description: rec.skill.metadata.description,
                category: rec.skill.metadata.category || null,
                tags: rec.skill.metadata.tags || [],
            },
            confidence: Math.round(rec.confidence * 100) / 100,
            reasoning: rec.reasoning,
            applicableDimensions: rec.applicableDimensions,
        }));
        const result = {
            analysis: {
                technicalDimension: analysis.technicalDimension,
                architecturalDimension: analysis.architecturalDimension,
                performanceDimension: analysis.performanceDimension,
            },
            recommendations: formattedRecommendations,
        };
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                }],
            structuredContent: result,
        };
    });
    // Get categories tool
    server.registerTool('skills_get_categories', {
        title: 'Get All Categories',
        description: 'Get a list of all available skill categories.',
        inputSchema: z.object({}).strict(),
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async () => {
        const categories = registry.getCategories();
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        categories,
                        count: categories.length,
                    }, null, 2),
                }],
            structuredContent: {
                categories,
                count: categories.length,
            },
        };
    });
    // Get tags tool
    server.registerTool('skills_get_tags', {
        title: 'Get All Tags',
        description: 'Get a list of all available skill tags.',
        inputSchema: z.object({}).strict(),
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async () => {
        const tags = registry.getAllTags();
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        tags,
                        count: tags.length,
                    }, null, 2),
                }],
            structuredContent: {
                tags,
                count: tags.length,
            },
        };
    });
}
//# sourceMappingURL=skillTools.js.map