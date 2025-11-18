#!/usr/bin/env tsx
/**
 * Extract all skills from zip files to readable markdown format
 * This allows direct access to skill knowledge without MCP tool calls
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as yauzl from 'yauzl';

const SKILLS_DIR = path.join(process.cwd(), '.claude', 'Skills');
const EXTRACTED_DIR = path.join(process.cwd(), '.claude', 'Skills', 'extracted');
const INDEX_FILE = path.join(process.cwd(), '.claude', 'SKILLS_INDEX.md');
const KNOWLEDGE_BASE_FILE = path.join(process.cwd(), '.claude', 'SKILLS_KNOWLEDGE_BASE.md');

interface SkillMetadata {
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  version?: string;
}

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

function extractFrontmatter(content: string): Partial<SkillMetadata> {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {};
  }

  const frontmatterText = match[1];
  const metadata: Partial<SkillMetadata> = {};

  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      metadata[key as keyof SkillMetadata] = arrayContent
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, '')) as any;
    } else {
      metadata[key as keyof SkillMetadata] = value as any;
    }
  }

  return metadata;
}

async function extractSkill(zipPath: string): Promise<SkillMetadata | null> {
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

      const skillName = path.basename(zipPath, '.zip');
      const skillDir = path.join(EXTRACTED_DIR, skillName);
      const metadata: Partial<SkillMetadata> = { name: skillName };
      const files: { [key: string]: string } = {};

      zipfile.readEntry();
      zipfile.on('entry', (entry: yauzl.Entry) => {
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
          return;
        }

        extractZipEntryText(zipfile, entry)
          .then(async (content) => {
            const fileName = path.basename(entry.fileName);
            
            if (fileName === 'SKILL.md') {
              files.skillMarkdown = content;
              const meta = extractFrontmatter(content);
              Object.assign(metadata, meta);
            } else if (fileName === 'README.md') {
              files.readmeMarkdown = content;
            } else if (fileName === 'EXAMPLES.md') {
              files.examplesMarkdown = content;
            }

            // Write file to extracted directory
            await fs.mkdir(skillDir, { recursive: true });
            await fs.writeFile(path.join(skillDir, fileName), content, 'utf-8');
            
            zipfile.readEntry();
          })
          .catch((error) => {
            reject(error);
          });
      });

      zipfile.on('end', async () => {
        const finalMetadata: SkillMetadata = {
          name: metadata.name || skillName,
          description: metadata.description || 'No description available',
          category: metadata.category,
          tags: metadata.tags || [],
          version: metadata.version,
        };

        // Write metadata file
        await fs.writeFile(
          path.join(skillDir, 'METADATA.json'),
          JSON.stringify(finalMetadata, null, 2),
          'utf-8'
        );

        resolve(finalMetadata);
      });

      zipfile.on('error', reject);
    });
  });
}

async function main() {
  try {
    console.log('🚀 Extracting all skills...');
    
    // Create extracted directory
    await fs.mkdir(EXTRACTED_DIR, { recursive: true });

    // Get all zip files
    const files = await fs.readdir(SKILLS_DIR);
    const zipFiles = files.filter(file => file.endsWith('.zip'));

    console.log(`Found ${zipFiles.length} skill zip files`);

    const skills: SkillMetadata[] = [];
    const errors: string[] = [];

    // Extract each skill
    for (const file of zipFiles) {
      try {
        const zipPath = path.join(SKILLS_DIR, file);
        console.log(`  Extracting: ${file}...`);
        const metadata = await extractSkill(zipPath);
        if (metadata) {
          skills.push(metadata);
        }
      } catch (error) {
        const errorMsg = `Failed to extract ${file}: ${error}`;
        console.error(`  ❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    console.log(`\n✅ Extracted ${skills.length} skills successfully`);
    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} errors occurred`);
    }

    // Create skills index
    console.log('\n📝 Creating skills index...');
    const indexContent = `# Skills Index

**Total Skills:** ${skills.length}
**Last Updated:** ${new Date().toISOString()}

## Skills by Category

${Object.entries(
  skills.reduce((acc, skill) => {
    const cat = skill.category || 'uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, SkillMetadata[]>)
)
  .map(([category, categorySkills]) => {
    return `### ${category.charAt(0).toUpperCase() + category.slice(1)} (${categorySkills.length})

${categorySkills
  .map(skill => `- **${skill.name}** - ${skill.description}${skill.tags && skill.tags.length > 0 ? ` [${skill.tags.join(', ')}]` : ''}`)
  .join('\n')}`;
  })
  .join('\n\n')}

## All Skills

${skills
  .map(skill => `### ${skill.name}
- **Description:** ${skill.description}
- **Category:** ${skill.category || 'uncategorized'}
- **Tags:** ${skill.tags?.join(', ') || 'none'}
- **Location:** \`.claude/Skills/extracted/${skill.name}/\`
- **Files:** SKILL.md, README.md${skills.find(s => s.name === skill.name)?.tags?.includes('examples') ? ', EXAMPLES.md' : ''}
`)
  .join('\n')}

## Quick Reference

### Technology Skills
${skills
  .filter(s => s.tags?.some(t => ['react', 'typescript', 'python', 'node', 'javascript'].includes(t.toLowerCase())))
  .map(s => `- **${s.name}** - ${s.description}`)
  .join('\n')}

### Pattern Skills
${skills
  .filter(s => s.tags?.some(t => ['pattern', 'architecture', 'design'].includes(t.toLowerCase())) || s.name.includes('pattern'))
  .map(s => `- **${s.name}** - ${s.description}`)
  .join('\n')}

### Problem-Solving Skills
${skills
  .filter(s => s.tags?.some(t => ['debug', 'error', 'performance', 'optimization'].includes(t.toLowerCase())))
  .map(s => `- **${s.name}** - ${s.description}`)
  .join('\n')}
`;

    await fs.writeFile(INDEX_FILE, indexContent, 'utf-8');
    console.log(`✅ Created index: ${INDEX_FILE}`);

    // Create knowledge base (consolidated content)
    console.log('\n📚 Creating knowledge base...');
    const knowledgeBaseContent = `# Skills Knowledge Base

**Purpose:** Direct access to all skill knowledge for automatic contextual awareness
**Total Skills:** ${skills.length}
**Last Updated:** ${new Date().toISOString()}

> **Note:** This file contains summaries of all skills. For full documentation, see \`.claude/Skills/extracted/{skill-name}/SKILL.md\`

---

${skills
  .map(skill => {
    const skillPath = path.join(EXTRACTED_DIR, skill.name, 'SKILL.md');
    // We'll read the actual content in a second pass
    return `## ${skill.name}

**Category:** ${skill.category || 'uncategorized'}  
**Tags:** ${skill.tags?.join(', ') || 'none'}  
**Description:** ${skill.description}

**Location:** \`.claude/Skills/extracted/${skill.name}/\`

**When to Use:**
${skill.tags?.map(tag => `- When working with ${tag}`).join('\n') || '- See skill documentation for usage guidelines'}

**Key Concepts:**
*See full documentation in extracted files*

---
`;
  })
  .join('\n')}

## Usage

This knowledge base is designed for **automatic contextual awareness**. When you encounter:
- Technologies mentioned in tags → Reference the skill
- Problems matching descriptions → Apply skill knowledge
- Patterns matching categories → Use skill patterns

**Always reference the full skill documentation** in \`.claude/Skills/extracted/{skill-name}/SKILL.md\` for complete details.
`;

    await fs.writeFile(KNOWLEDGE_BASE_FILE, knowledgeBaseContent, 'utf-8');
    console.log(`✅ Created knowledge base: ${KNOWLEDGE_BASE_FILE}`);

    console.log('\n✨ Extraction complete!');
    console.log(`\n📁 Extracted skills: ${EXTRACTED_DIR}`);
    console.log(`📋 Skills index: ${INDEX_FILE}`);
    console.log(`📚 Knowledge base: ${KNOWLEDGE_BASE_FILE}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

