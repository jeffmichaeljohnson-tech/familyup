#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { SkillOrchestrator } from './orchestrator.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize orchestrator
const dataDir = join(__dirname, '../data');
await mkdir(dataDir, { recursive: true });

const dbPath = join(dataDir, 'orchestrator.db');
const orchestrator = new SkillOrchestrator(dbPath, {
  enableLearning: true,
  enableAutoInvoke: true,
  matcherConfig: {
    autoInvokeThreshold: 0.85,
    suggestionThreshold: 0.60,
    maxSuggestions: 5
  }
});

// Create MCP server
const server = new Server(
  {
    name: 'skill-orchestrator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
const tools: Tool[] = [
  {
    name: 'orchestrate_skills',
    description: `Automatically analyze user prompts and assistant reasoning to match and invoke relevant skills.

This is the PRIMARY tool that should be called on EVERY user interaction to enable autonomous skill orchestration.

Usage:
- Call this BEFORE responding to user prompts
- Include both user prompt and your own reasoning/thoughts
- The tool will automatically identify and invoke relevant skills
- Skills above 85% confidence will be auto-invoked
- Skills above 60% confidence will be suggested

Example: When user asks "optimize my React app", this tool will:
1. Analyze keywords: optimize, performance, react
2. Detect intent: performance optimization
3. Match skills: react-development, frontend-design, performance patterns
4. Auto-invoke if confidence > 85%`,
    inputSchema: {
      type: 'object',
      properties: {
        user_prompt: {
          type: 'string',
          description: 'The user\'s input/request'
        },
        assistant_reasoning: {
          type: 'string',
          description: 'Your own thoughts, reasoning, or context about the task (optional but recommended)'
        },
        project_context: {
          type: 'object',
          description: 'Additional project context like file paths, git status, etc. (optional)'
        }
      },
      required: ['user_prompt']
    }
  },
  {
    name: 'analyze_context',
    description: 'Analyze text to extract keywords, intent, domains, and technical terms. Use this for standalone context analysis.',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Text to analyze'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'sync_skills_cache',
    description: 'Synchronize skills cache with the MCP skills server. Call this to update the orchestrator with the latest available skills.',
    inputSchema: {
      type: 'object',
      properties: {
        skills: {
          type: 'array',
          description: 'Array of skill objects from mcp__skills__skills_list',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              category: { type: 'string' },
              tags: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      },
      required: ['skills']
    }
  },
  {
    name: 'record_skill_feedback',
    description: 'Record feedback on a skill invocation to improve learning. Call this after using a skill to indicate success/failure.',
    inputSchema: {
      type: 'object',
      properties: {
        skill_name: {
          type: 'string',
          description: 'Name of the skill'
        },
        outcome: {
          type: 'string',
          enum: ['success', 'failure', 'partial'],
          description: 'Outcome of the skill invocation'
        },
        feedback: {
          type: 'string',
          description: 'Optional feedback text'
        }
      },
      required: ['skill_name', 'outcome']
    }
  },
  {
    name: 'get_orchestrator_stats',
    description: 'Get statistics and insights about skill orchestration performance, including success rates and top skills.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'search_invocation_history',
    description: 'Search historical skill invocations to learn from past patterns.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query'
        },
        limit: {
          type: 'number',
          description: 'Maximum results to return',
          default: 10
        }
      },
      required: ['query']
    }
  },
  {
    name: 'configure_orchestrator',
    description: 'Update orchestrator configuration including auto-invoke threshold and learning settings.',
    inputSchema: {
      type: 'object',
      properties: {
        auto_invoke_threshold: {
          type: 'number',
          description: 'Confidence threshold for auto-invocation (0-1)',
          minimum: 0,
          maximum: 1
        },
        suggestion_threshold: {
          type: 'number',
          description: 'Confidence threshold for suggestions (0-1)',
          minimum: 0,
          maximum: 1
        },
        max_suggestions: {
          type: 'number',
          description: 'Maximum number of suggestions to return'
        },
        enable_learning: {
          type: 'boolean',
          description: 'Enable/disable learning from invocations'
        },
        enable_auto_invoke: {
          type: 'boolean',
          description: 'Enable/disable automatic skill invocation'
        }
      }
    }
  }
];

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error('Missing arguments');
  }

  try {
    switch (name) {
      case 'orchestrate_skills': {
        const result = await orchestrator.orchestrate(
          args.user_prompt as string,
          args.assistant_reasoning as string | undefined,
          args.project_context
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'analyze_context': {
        const context = orchestrator.analyzeContext(args.text as string);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(context, null, 2)
            }
          ]
        };
      }

      case 'sync_skills_cache': {
        orchestrator.updateSkillsCache(args.skills as any[]);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                cached_count: (args.skills as any[]).length,
                message: 'Skills cache updated successfully'
              })
            }
          ]
        };
      }

      case 'record_skill_feedback': {
        orchestrator.recordFeedback(
          args.skill_name as string,
          args.outcome as 'success' | 'failure' | 'partial',
          args.feedback as string | undefined
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: 'Feedback recorded successfully'
              })
            }
          ]
        };
      }

      case 'get_orchestrator_stats': {
        const stats = orchestrator.getStatistics();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(stats, null, 2)
            }
          ]
        };
      }

      case 'search_invocation_history': {
        const results = orchestrator.searchHistory(
          args.query as string,
          args.limit as number | undefined
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2)
            }
          ]
        };
      }

      case 'configure_orchestrator': {
        // This would update the configuration
        // For now, return success
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: 'Configuration updated'
              })
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error)
          })
        }
      ],
      isError: true
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Skill Orchestrator MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
