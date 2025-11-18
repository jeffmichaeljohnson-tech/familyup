#!/usr/bin/env node
/**
 * Skills MCP Server
 * 
 * An MCP server that dynamically loads skills from zip files and provides
 * context-aware skill recognition using 3D thinking (technical, architectural, performance dimensions).
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SkillRegistry } from './services/skillRegistry.js';
import { ContextAnalyzer } from './services/contextAnalyzer.js';
import { registerSkillTools } from './tools/skillTools.js';

// Initialize server
const server = new McpServer({
  name: 'skills-mcp-server',
  version: '1.0.0',
});

// Initialize services
const registry = new SkillRegistry();
const analyzer = new ContextAnalyzer(registry);

// Main function
async function main() {
  try {
    console.error('Initializing Skills MCP Server...');
    
    // Load all skills
    console.error('Loading skills from .claude/Skills directory...');
    await registry.initialize();
    const skillsCount = registry.getSkillsCount();
    console.error(`Loaded ${skillsCount} skills`);

    // Register all tools
    registerSkillTools(server, registry, analyzer);
    console.error('Registered skill tools');

    // Connect via stdio
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Skills MCP Server running via stdio');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Run server
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

