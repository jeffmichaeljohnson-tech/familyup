/**
 * Terminal Session Reader Utility
 * Provides functions to read terminal history and Cursor session data
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface TerminalCommand {
  command: string;
  timestamp?: string;
  directory?: string;
}

export interface TerminalSession {
  commands: TerminalCommand[];
  recentCommands: string[];
  cursorHistory?: Array<{
    path: string;
    timestamp: number;
  }>;
}

/**
 * Read zsh history file
 * @param limit Maximum number of commands to read (0 = read all)
 */
function readZshHistory(limit: number = 100): string[] {
  const historyPath = join(homedir(), '.zsh_history');
  
  if (!existsSync(historyPath)) {
    return [];
  }

  try {
    const content = readFileSync(historyPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    // If limit is 0, read all history
    const linesToProcess = limit === 0 ? lines : lines.slice(-limit);
    
    // Parse zsh history format: ": timestamp:0;command" or just "command"
    const commands = linesToProcess
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
 * Get total number of commands in history
 */
export function getHistoryStats(): { totalCommands: number; fileSize: number; filePath: string } {
  const historyPath = join(homedir(), '.zsh_history');
  
  if (!existsSync(historyPath)) {
    return { totalCommands: 0, fileSize: 0, filePath: historyPath };
  }

  try {
    const content = readFileSync(historyPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const stats = statSync(historyPath);
    
    return {
      totalCommands: lines.length,
      fileSize: stats.size,
      filePath: historyPath,
    };
  } catch (error) {
    console.error('Error reading history stats:', error);
    return { totalCommands: 0, fileSize: 0, filePath: historyPath };
  }
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
 * @param limit Maximum number of commands to return (0 = all history)
 * @returns Terminal session data including commands and Cursor history
 */
export function getTerminalSession(limit: number = 50): TerminalSession {
  // If limit is 0, read all history, otherwise get more to filter duplicates
  const readLimit = limit === 0 ? 0 : limit * 2;
  const commands = readZshHistory(readLimit);
  
  // Remove duplicates and get unique commands
  const uniqueCommands = limit === 0 
    ? Array.from(new Set(commands))
    : Array.from(new Set(commands)).slice(-limit);
  
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
 * Get ALL terminal history (no limit)
 * @returns Complete terminal session data
 */
export function getAllTerminalHistory(): TerminalSession {
  return getTerminalSession(0);
}

/**
 * Get recent commands matching a pattern
 * @param pattern Regex pattern to match commands
 * @param limit Maximum number of results
 * @returns Matching commands
 */
export function searchTerminalHistory(pattern: string | RegExp, limit: number = 20): TerminalCommand[] {
  const session = getTerminalSession(200);
  const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
  
  return session.commands
    .filter(cmd => regex.test(cmd.command))
    .slice(-limit);
}

/**
 * Get commands from a specific directory
 * @param directory Directory path to filter by
 * @param limit Maximum number of results
 * @returns Commands executed in that directory
 */
export function getCommandsFromDirectory(directory: string, limit: number = 20): TerminalCommand[] {
  const session = getTerminalSession(200);
  
  return session.commands
    .filter(cmd => {
      // Check if command contains cd to this directory
      return cmd.command.includes(`cd ${directory}`) || 
             cmd.command.includes(`cd "${directory}"`) ||
             cmd.directory === directory;
    })
    .slice(-limit);
}

