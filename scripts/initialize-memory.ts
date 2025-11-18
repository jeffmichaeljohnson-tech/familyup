#!/usr/bin/env tsx
/**
 * Initialize Memory System
 * Sets up the memory tables and initializes the system
 */

import { initializeMemorySystem, getMemoryStats } from '../src/utils/memorySystem';

console.log('Initializing memory system...\n');

try {
    initializeMemorySystem();
    
    const stats = getMemoryStats();
    console.log('\n✓ Memory system initialized successfully!\n');
    console.log('Memory Statistics:');
    console.log(`  - Sessions: ${stats.sessions}`);
    console.log(`  - Session Memories: ${stats.sessionMemories}`);
    console.log(`  - Long-term Memories: ${stats.longTermMemories}`);
    console.log(`  - Project Knowledge: ${stats.projectKnowledge}`);
    console.log(`  - User Preferences: ${stats.userPreferences}`);
    console.log(`  - Cross-session Contexts: ${stats.crossSessionContexts}`);
} catch (error) {
    console.error('Error initializing memory system:', error);
    process.exit(1);
}

