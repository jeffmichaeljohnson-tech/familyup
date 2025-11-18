#!/usr/bin/env tsx

/**
 * Initialize the Skill Orchestrator
 * - Syncs skills from the skills MCP server
 * - Tests basic orchestration functionality
 * - Displays configuration and stats
 */

import { SkillOrchestrator } from './src/orchestrator.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log('🚀 Initializing Skill Orchestrator...\n');

  // Initialize orchestrator
  const dbPath = join(__dirname, 'data/orchestrator.db');
  const orchestrator = new SkillOrchestrator(dbPath);

  // Mock skills data (in production, this would come from mcp__skills__skills_list)
  const mockSkills = [
    {
      name: 'react-development',
      description: 'Comprehensive React development with hooks, components, state management',
      category: 'frontend',
      tags: ['react', 'hooks', 'components', 'state-management']
    },
    {
      name: 'nodejs-backend-patterns',
      description: 'Build production-ready Node.js backend services with Express/Fastify',
      category: 'backend',
      tags: ['nodejs', 'express', 'api', 'backend']
    },
    {
      name: 'debugging-strategies',
      description: 'Master systematic debugging techniques and root cause analysis',
      category: 'development',
      tags: ['debugging', 'troubleshooting', 'analysis']
    },
    {
      name: 'sql-optimization-patterns',
      description: 'Master SQL query optimization, indexing strategies, and EXPLAIN analysis',
      category: 'database',
      tags: ['sql', 'optimization', 'database', 'performance']
    },
    {
      name: 'github-actions-templates',
      description: 'Create production-ready GitHub Actions workflows for CI/CD',
      category: 'devops',
      tags: ['github', 'ci-cd', 'automation', 'deployment']
    }
  ];

  console.log('📚 Syncing skills cache...');
  orchestrator.updateSkillsCache(mockSkills);
  console.log(`✅ Synced ${mockSkills.length} skills\n`);

  // Test orchestration with sample prompts
  console.log('🧪 Testing orchestration with sample prompts...\n');

  const testCases = [
    {
      prompt: 'optimize my React app for better performance',
      reasoning: 'Need to identify performance bottlenecks and apply optimization strategies'
    },
    {
      prompt: 'fix the slow database queries in my application',
      reasoning: 'Looking at SQL queries that are taking too long to execute'
    },
    {
      prompt: 'set up CI/CD pipeline for my project',
      reasoning: 'Need to automate testing, building, and deployment'
    },
    {
      prompt: 'help me debug this authentication error',
      reasoning: 'Users are getting 401 errors when trying to log in'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 User Prompt: "${testCase.prompt}"`);
    console.log(`💭 Reasoning: "${testCase.reasoning}"`);

    const result = await orchestrator.orchestrate(
      testCase.prompt,
      testCase.reasoning
    );

    console.log('\n🎯 Orchestration Results:');
    console.log(`   Intent: ${result.context.intent}`);
    console.log(`   Domains: ${result.context.domains.join(', ') || 'none'}`);
    console.log(`   Keywords: ${result.context.keywords.slice(0, 5).join(', ')}`);
    console.log(`   Complexity: ${result.context.complexity}`);

    if (result.autoInvoke.length > 0) {
      console.log('\n⚡ Auto-Invoke (high confidence):');
      result.autoInvoke.forEach(skill => {
        console.log(`   ✓ ${skill.skillName} (${(skill.confidenceScore * 100).toFixed(1)}%)`);
        console.log(`     ${skill.reasoning.join(', ')}`);
      });
    }

    if (result.suggestions.length > 0) {
      console.log('\n💡 Suggestions (medium confidence):');
      result.suggestions.forEach(skill => {
        console.log(`   • ${skill.skillName} (${(skill.confidenceScore * 100).toFixed(1)}%)`);
      });
    }

    console.log('\n' + '─'.repeat(80));
  }

  // Display statistics
  console.log('\n📊 Orchestrator Statistics:');
  const stats = orchestrator.getStatistics();
  console.log(`   Total Invocations: ${stats.totalInvocations}`);
  console.log(`   Success Rate: ${(stats.successRate * 100).toFixed(1)}%`);

  console.log('\n✅ Initialization complete!');
  console.log('\n📖 Next steps:');
  console.log('   1. Restart Claude Code to load the new MCP server');
  console.log('   2. The orchestrator will automatically analyze your prompts');
  console.log('   3. High-confidence skills will be auto-invoked');
  console.log('   4. You can configure thresholds in the MCP server code\n');

  orchestrator.close();
}

main().catch(console.error);
