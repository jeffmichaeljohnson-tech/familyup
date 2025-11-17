#!/usr/bin/env tsx
/**
 * Check zsh history configuration
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { execSync } from 'child_process';

interface HistoryConfig {
  histSize: string;
  saveHist: string;
  histFile: string;
  actualFileLines: number;
  actualFileSize: number;
  configSource: string;
}

function getZshConfig(): HistoryConfig {
  const systemZshrc = '/etc/zshrc';
  const userZshrc = join(homedir(), '.zshrc');
  const histFile = join(homedir(), '.zsh_history');
  
  let histSize = 'not set';
  let saveHist = 'not set';
  let histFilePath = 'not set';
  let configSource = 'defaults';
  
  // Check system config
  if (existsSync(systemZshrc)) {
    try {
      const content = readFileSync(systemZshrc, 'utf-8');
      const histSizeMatch = content.match(/HISTSIZE=(\d+)/);
      const saveHistMatch = content.match(/SAVEHIST=(\d+)/);
      const histFileMatch = content.match(/HISTFILE=(.+)/);
      
      if (histSizeMatch) histSize = histSizeMatch[1];
      if (saveHistMatch) saveHist = saveHistMatch[1];
      if (histFileMatch) histFilePath = histFileMatch[1].replace(/\$\{ZDOTDIR:- \$HOME\}/g, homedir()).replace(/\$HOME/g, homedir());
      
      configSource = 'system (/etc/zshrc)';
    } catch (e) {
      // Ignore
    }
  }
  
  // Check user config
  if (existsSync(userZshrc)) {
    try {
      const content = readFileSync(userZshrc, 'utf-8');
      const histSizeMatch = content.match(/HISTSIZE=(\d+)/);
      const saveHistMatch = content.match(/SAVEHIST=(\d+)/);
      const histFileMatch = content.match(/HISTFILE=(.+)/);
      
      if (histSizeMatch) {
        histSize = histSizeMatch[1];
        configSource = 'user (~/.zshrc)';
      }
      if (saveHistMatch) {
        saveHist = saveHistMatch[1];
        configSource = 'user (~/.zshrc)';
      }
      if (histFileMatch) {
        histFilePath = histFileMatch[1].replace(/\$\{ZDOTDIR:- \$HOME\}/g, homedir()).replace(/\$HOME/g, homedir());
      }
    } catch (e) {
      // Ignore
    }
  }
  
  // Get actual file stats
  let actualFileLines = 0;
  let actualFileSize = 0;
  
  if (existsSync(histFile)) {
    try {
      const content = readFileSync(histFile, 'utf-8');
      actualFileLines = content.split('\n').filter(l => l.trim()).length;
      actualFileSize = statSync(histFile).size;
    } catch (e) {
      // Ignore
    }
  }
  
  return {
    histSize,
    saveHist,
    histFile: histFilePath,
    actualFileLines,
    actualFileSize,
    configSource,
  };
}

const config = getZshConfig();

console.log('=== zsh History Configuration ===\n');
console.log(`Configuration Source: ${config.configSource}`);
console.log(`HISTSIZE (in-memory): ${config.histSize}`);
console.log(`SAVEHIST (saved to file): ${config.saveHist}`);
console.log(`HISTFILE: ${config.histFile}`);
console.log('\n=== Actual History File ===');
console.log(`Lines in file: ${config.actualFileLines.toLocaleString()}`);
console.log(`File size: ${(config.actualFileSize / 1024).toFixed(1)} KB`);

if (config.saveHist !== 'not set') {
  const saveHistNum = parseInt(config.saveHist);
  const difference = config.actualFileLines - saveHistNum;
  
  console.log('\n=== Analysis ===');
  if (config.actualFileLines > saveHistNum) {
    console.log(`⚠️  File has ${difference.toLocaleString()} more lines than SAVEHIST limit`);
    console.log('   This suggests history is not being trimmed automatically.');
    console.log('   The file will continue to grow until manually cleaned.');
  } else {
    console.log(`✓ File is within SAVEHIST limit`);
  }
  
  console.log(`\n📝 Your zsh is configured to keep:`);
  console.log(`   - ${config.histSize} commands in memory during session`);
  console.log(`   - ${config.saveHist} commands saved to file`);
  console.log(`   - But your file actually contains: ${config.actualFileLines.toLocaleString()} commands`);
}

