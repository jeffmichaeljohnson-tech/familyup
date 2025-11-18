/**
 * Service for loading and parsing skill zip files
 */

import * as yauzl from 'yauzl';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { SkillDocumentation, SkillMetadata } from '../types/index.js';

// Security: Maximum file and total content sizes
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_TOTAL_CONTENT_SIZE = 50 * 1024 * 1024; // 50MB per skill

// Try multiple possible paths for skills directory
function findSkillsDir(): string {
  // Check environment variable first
  if (process.env.SKILLS_DIR) {
    const resolvedPath = path.resolve(process.env.SKILLS_DIR);
    // Security: Validate SKILLS_DIR points to expected location
    if (!existsSync(resolvedPath)) {
      console.warn(`SKILLS_DIR does not exist: ${resolvedPath}`);
    } else if (!resolvedPath.includes('.claude') && !resolvedPath.includes('Skills')) {
      console.warn(`SKILLS_DIR points to unexpected location: ${resolvedPath}`);
    } else {
      return resolvedPath;
    }
  }
  
  const possiblePaths = [
    path.join(process.cwd(), '.claude', 'Skills'),
    path.join(process.cwd(), '..', '.claude', 'Skills'),
  ];
  
  // If running from dist/, try relative to dist
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    possiblePaths.push(
      path.join(__dirname, '..', '..', '.claude', 'Skills'),
      path.join(__dirname, '..', '..', '..', '.claude', 'Skills')
    );
  } catch {
    // Ignore if not ES modules
  }
  
  for (const dirPath of possiblePaths) {
    if (existsSync(dirPath)) {
      return dirPath;
    }
  }
  
  // Default to project root relative to current working directory
  return path.join(process.cwd(), '.claude', 'Skills');
}

const SKILLS_DIR = findSkillsDir();

/**
 * Extract frontmatter from markdown content
 */
function extractFrontmatter(content: string): Partial<SkillMetadata> {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {};
  }

  const frontmatterText = match[1];
  const metadata: Partial<SkillMetadata> = {};

  // Parse YAML-like frontmatter
  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Handle arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      metadata[key as keyof SkillMetadata] = arrayContent
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, '')) as any;
    } else {
      // Handle numbers
      if (key.includes('score') || key === 'version') {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          metadata[key as keyof SkillMetadata] = num as any;
        } else {
          metadata[key as keyof SkillMetadata] = value as any;
        }
      } else {
        metadata[key as keyof SkillMetadata] = value as any;
      }
    }
  }

  return metadata;
}

/**
 * Extract text content from zip entry
 */
async function extractZipEntryText(
  zipfile: yauzl.ZipFile,
  entry: yauzl.Entry
): Promise<string> {
  return new Promise((resolve, reject) => {
    zipfile.openReadStream(entry, (err, readStream) => {
      if (err) {
        reject(err);
        return;
      }

      const chunks: Buffer[] = [];
      readStream!.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      readStream!.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'));
      });
      readStream!.on('error', reject);
    });
  });
}

/**
 * Load a single skill from a zip file
 */
export async function loadSkillFromZip(zipPath: string): Promise<SkillDocumentation> {
  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        reject(err);
        return;
      }

      if (!zipfile) {
        reject(new Error('Failed to open zip file'));
        return;
      }

      const skill: Partial<SkillDocumentation> = {
        metadata: {} as SkillMetadata,
        fullContent: '',
      };

      const files: { [key: string]: string } = {};
      let totalContentSize = 0; // Track total content size for security

      zipfile.readEntry();
      zipfile.on('entry', (entry: yauzl.Entry) => {
        if (/\/$/.test(entry.fileName)) {
          // Directory entry, skip
          zipfile.readEntry();
          return;
        }

        // Security: Validate zip entry filename to prevent path traversal attacks
        if (entry.fileName.includes('..') || 
            entry.fileName.startsWith('/') || 
            entry.fileName.includes('\\') ||
            entry.fileName.length > 255) {
          console.warn(`Skipping suspicious zip entry: ${entry.fileName}`);
          zipfile.readEntry();
          return;
        }

        // Security: Check file size before extraction
        if (entry.uncompressedSize && entry.uncompressedSize > MAX_FILE_SIZE) {
          console.warn(`Skipping file too large (${entry.uncompressedSize} bytes): ${entry.fileName}`);
          zipfile.readEntry();
          return;
        }

        extractZipEntryText(zipfile, entry)
          .then((content) => {
            // Security: Check total content size
            totalContentSize += Buffer.byteLength(content, 'utf8');
            if (totalContentSize > MAX_TOTAL_CONTENT_SIZE) {
              reject(new Error(`Skill content exceeds maximum size limit (${MAX_TOTAL_CONTENT_SIZE} bytes)`));
              return;
            }

            const fileName = path.basename(entry.fileName);
            
            if (fileName === 'SKILL.md') {
              files.skillMarkdown = content;
              skill.skillMarkdown = content;
              // Extract metadata from SKILL.md frontmatter
              const metadata = extractFrontmatter(content);
              skill.metadata = {
                name: metadata.name || path.basename(zipPath, '.zip'),
                description: metadata.description || '',
                category: metadata.category,
                tags: metadata.tags || [],
                version: metadata.version,
                context7_library: metadata.context7_library,
                context7_trust_score: metadata.context7_trust_score,
              } as SkillMetadata;
            } else if (fileName === 'README.md') {
              files.readmeMarkdown = content;
              skill.readmeMarkdown = content;
            } else if (fileName === 'EXAMPLES.md') {
              files.examplesMarkdown = content;
              skill.examplesMarkdown = content;
            }

            skill.fullContent += `\n\n=== ${fileName} ===\n\n${content}`;
            
            zipfile.readEntry();
          })
          .catch((error) => {
            reject(error);
          });
      });

      zipfile.on('end', () => {
        if (!skill.metadata || !skill.metadata.name) {
          // Fallback: use filename if no metadata found
          skill.metadata = {
            name: path.basename(zipPath, '.zip'),
            description: 'No description available',
            tags: [],
          } as SkillMetadata;
        }
        resolve(skill as SkillDocumentation);
      });

      zipfile.on('error', reject);
    });
  });
}

/**
 * Load all skills from the Skills directory
 */
export async function loadAllSkills(): Promise<SkillDocumentation[]> {
  try {
    const files = await fs.readdir(SKILLS_DIR);
    const zipFiles = files.filter(file => file.endsWith('.zip'));

    const skills = await Promise.all(
      zipFiles.map(async (file) => {
        try {
          const zipPath = path.join(SKILLS_DIR, file);
          return await loadSkillFromZip(zipPath);
        } catch (error) {
          console.error(`Failed to load skill ${file}:`, error);
          return null;
        }
      })
    );

    return skills.filter((skill): skill is SkillDocumentation => skill !== null);
  } catch (error) {
    console.error('Failed to load skills:', error);
    return [];
  }
}

