#!/usr/bin/env tsx
/**
 * Terminal Session Reader
 * Reads terminal history and Cursor terminal session data
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

interface TerminalSession {
  commands: Array<{
    timestamp?: string;
    command: string;
    directory?: string;
  }>;
  recentCommands: string[];
  cursorHistory?: Array<{
    path: string;
    timestamp: number;
  }>;
}

/**
 * Read zsh history file
 */
function readZshHistory(limit: number = 100): string[] {
  const historyPath = join(homedir(), '.zsh_history');
  
  if (!existsSync(historyPath)) {
    console.warn('No zsh history file found');
    return [];
  }

  try {
    const content = readFileSync(historyPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    // Parse zsh history format: ": timestamp:0;command"
    const commands = lines
      .slice(-limit)
      .map(line => {
        // Remove timestamp prefix if present
        const match = line.match(/^: \d+:\d+;(.+)$/);
        return match ? match[1] : line;
      })
      .filter(cmd => cmd.trim().length > 0);

    return commands;
  } catch (error) {
    console.error('Error reading zsh history:', error);
    return [];
  }
}

/**
 * Check for Cursor terminal session storage
 */
function findCursorTerminalSessions(): string[] {
  const possiblePaths = [
    join(homedir(), 'Library', 'Application Support', 'Cursor', 'User', 'History'),
    join(homedir(), 'Library', 'Application Support', 'Cursor', 'logs'),
    join(homedir(), '.cursor', 'terminal'),
    join(process.cwd(), '.cursor', 'terminal'),
  ];

  const found: string[] = [];
  
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      found.push(path);
    }
  }

  return found;
}

/**
 * Read Cursor history entries
 */
function readCursorHistory(limit: number = 20): Array<{ path: string; timestamp: number }> {
  const historyPath = join(homedir(), 'Library', 'Application Support', 'Cursor', 'User', 'History');
  
  if (!existsSync(historyPath)) {
    return [];
  }

  try {
    const dirs = readdirSync(historyPath)
      .filter(dir => dir.startsWith('-'))
      .map(dir => ({
        path: join(historyPath, dir),
        mtime: statSync(join(historyPath, dir)).mtimeMs,
      }))
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, limit);

    const entries: Array<{ path: string; timestamp: number }> = [];

    for (const dir of dirs) {
      const entriesFile = join(dir.path, 'entries.json');
      if (existsSync(entriesFile)) {
        try {
          const content = JSON.parse(readFileSync(entriesFile, 'utf-8'));
          if (content.entries && Array.isArray(content.entries)) {
            content.entries.forEach((entry: any) => {
              entries.push({
                path: content.resource || dir.path,
                timestamp: entry.timestamp || dir.mtime,
              });
            });
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }

    return entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  } catch (error) {
    console.error('Error reading Cursor history:', error);
    return [];
  }
}

/**
 * Get recent terminal session data
 */
export function getTerminalSession(limit: number = 50): TerminalSession {
  const commands = readZshHistory(limit * 2); // Get more to filter duplicates
  
  // Remove duplicates and get unique recent commands
  const uniqueCommands = Array.from(new Set(commands)).slice(-limit);
  
  const cursorSessions = findCursorTerminalSessions();
  const cursorHistory = readCursorHistory(10);

  return {
    commands: uniqueCommands.map(cmd => ({
      command: cmd,
    })),
    recentCommands: uniqueCommands.slice(-20),
    cursorHistory: cursorHistory.length > 0 ? cursorHistory : undefined,
  };
}

/**
 * Main execution
 */
const isMainModule = import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('read-terminal-session.ts');

if (isMainModule) {
  const limit = process.argv[2] ? parseInt(process.argv[2]) : 50;
  const session = getTerminalSession(limit);
  
  console.log('=== Terminal Session History ===\n');
  console.log(`Found ${session.commands.length} recent commands\n`);
  
  console.log('Recent Commands:');
  session.recentCommands.forEach((cmd, i) => {
    console.log(`${i + 1}. ${cmd}`);
  });
  
  if (session.cursorHistory && session.cursorHistory.length > 0) {
    console.log('\n=== Recent Cursor File History ===');
    session.cursorHistory.slice(0, 5).forEach((entry, i) => {
      const date = new Date(entry.timestamp);
      console.log(`${i + 1}. ${entry.path} (${date.toLocaleString()})`);
    });
  }
  
  const cursorSessions = findCursorTerminalSessions();
  if (cursorSessions.length > 0) {
    console.log('\n=== Cursor Terminal Session Paths ===');
    cursorSessions.forEach(path => console.log(`  ${path}`));
  }
}

