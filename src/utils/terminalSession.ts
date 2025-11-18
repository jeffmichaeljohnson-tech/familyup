/**
 * Terminal Session Reader Utility
 * Provides functions to read terminal history and Cursor session data
 * 
 * ⚠️ IMPORTANT FOR AI ASSISTANTS:
 * This utility provides access to the user's complete terminal history (~13,000 commands).
 * When you need more context about what the user has been working on, USE THIS!
 * 
 * Common use cases:
 * - Understanding recent workflow: getRecentWorkflowContext()
 * - Finding commands related to a project: searchTerminalHistory('project-name')
 * - Understanding what tools/commands they use: searchTerminalHistory('npm|git|docker')
 * - Finding setup/configuration commands: searchTerminalHistory('install|setup|config')
 * - Getting context about a specific file/directory: getCommandsFromDirectory() or searchTerminalHistory('filename')
 * 
 * The history contains ~13,000 commands and grows continuously. Use it liberally for context!
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
 * Searches ALL history (not just recent) for maximum context
 * @param pattern Regex pattern or string to match commands
 * @param limit Maximum number of results
 * @returns Matching commands (most recent first)
 */
export function searchTerminalHistory(pattern: string | RegExp, limit: number = 50): TerminalCommand[] {
  // Search ALL history for maximum context
  const session = getAllTerminalHistory();
  const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
  
  return session.commands
    .filter(cmd => regex.test(cmd.command))
    .slice(-limit);
}

/**
 * Get context-aware workflow information
 * Analyzes recent commands to understand what the user has been working on
 * @param lookback Number of recent commands to analyze (default: 100)
 * @returns Workflow context including projects, tools, and patterns
 */
export function getRecentWorkflowContext(lookback: number = 100): {
  projects: string[];
  tools: string[];
  commonCommands: string[];
  recentPatterns: string[];
} {
  const session = getTerminalSession(lookback);
  const commands = session.commands.map(c => c.command);
  
  // Extract project directories
  const projects = new Set<string>();
  commands.forEach(cmd => {
    const cdMatch = cmd.match(/cd\s+(?:~\/|\.\/)?([^\s\/]+)/);
    if (cdMatch) projects.add(cdMatch[1]);
  });
  
  // Extract tools/commands
  const tools = new Set<string>();
  commands.forEach(cmd => {
    const toolMatch = cmd.match(/^(\w+)/);
    if (toolMatch && !['cd', 'ls', 'cat', 'echo', 'grep'].includes(toolMatch[1])) {
      tools.add(toolMatch[1]);
    }
  });
  
  // Count command frequencies
  const commandCounts = new Map<string, number>();
  commands.forEach(cmd => {
    const baseCmd = cmd.split(' ')[0];
    commandCounts.set(baseCmd, (commandCounts.get(baseCmd) || 0) + 1);
  });
  
  const commonCommands = Array.from(commandCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([cmd]) => cmd);
  
  // Extract patterns (git, npm, docker, etc.)
  const patterns = new Set<string>();
  commands.forEach(cmd => {
    if (cmd.includes('git')) patterns.add('git');
    if (cmd.includes('npm') || cmd.includes('yarn') || cmd.includes('pnpm')) patterns.add('node');
    if (cmd.includes('docker')) patterns.add('docker');
    if (cmd.includes('python') || cmd.includes('pip')) patterns.add('python');
    if (cmd.includes('tsx') || cmd.includes('ts-node')) patterns.add('typescript');
  });
  
  return {
    projects: Array.from(projects).slice(0, 10),
    tools: Array.from(tools).slice(0, 15),
    commonCommands,
    recentPatterns: Array.from(patterns),
  };
}

/**
 * Search for commands related to a specific topic/keyword
 * Useful for understanding how the user works with specific technologies or concepts
 * @param keywords Array of keywords to search for
 * @param limit Maximum number of results per keyword
 * @returns Commands grouped by keyword
 */
export function searchByKeywords(keywords: string[], limit: number = 20): Record<string, TerminalCommand[]> {
  const results: Record<string, TerminalCommand[]> = {};
  
  keywords.forEach(keyword => {
    results[keyword] = searchTerminalHistory(keyword, limit);
  });
  
  return results;
}

/**
 * Get commands related to a specific project or file
 * @param projectName Project name, file name, or path to search for
 * @param limit Maximum number of results
 * @returns Commands related to the project/file
 */
export function getProjectContext(projectName: string, limit: number = 30): TerminalCommand[] {
  // Search for project name in various contexts
  const patterns = [
    projectName,
    `/${projectName}`,
    `${projectName}/`,
    `cd.*${projectName}`,
    `git.*${projectName}`,
  ];
  
  const allResults = new Set<string>();
  
  patterns.forEach(pattern => {
    const results = searchTerminalHistory(pattern, limit);
    results.forEach(cmd => allResults.add(cmd.command));
  });
  
  return Array.from(allResults).map(cmd => ({ command: cmd })).slice(0, limit);
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

