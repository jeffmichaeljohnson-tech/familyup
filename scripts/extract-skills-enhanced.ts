#!/usr/bin/env tsx
/**
 * Enhanced Skills Extraction - Maximum Knowledge Extraction
 * Extracts FULL content from all skills for maximum awareness
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as yauzl from 'yauzl';

const SKILLS_DIR = path.join(process.cwd(), '.claude', 'Skills');
const EXTRACTED_DIR = path.join(process.cwd(), '.claude', 'Skills', 'extracted');
const KNOWLEDGE_DIR = path.join(process.cwd(), '.claude', 'knowledge');

interface SkillMetadata {
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  version?: string;
  context7_library?: string;
  context7_trust_score?: number;
}

interface SkillContent {
  metadata: SkillMetadata;
  skillMarkdown: string;
  readmeMarkdown: string;
  examplesMarkdown: string;
  fullContent: string;
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

async function extractSkill(zipPath: string): Promise<SkillContent | null> {
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
      const content: Partial<SkillContent> = {
        metadata: {} as SkillMetadata,
        skillMarkdown: '',
        readmeMarkdown: '',
        examplesMarkdown: '',
        fullContent: '',
      };

      zipfile.readEntry();
      zipfile.on('entry', (entry: yauzl.Entry) => {
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
          return;
        }

        extractZipEntryText(zipfile, entry)
          .then(async (text) => {
            const fileName = path.basename(entry.fileName);
            
            if (fileName === 'SKILL.md') {
              content.skillMarkdown = text;
              const meta = extractFrontmatter(text);
              Object.assign(metadata, meta);
            } else if (fileName === 'README.md') {
              content.readmeMarkdown = text;
            } else if (fileName === 'EXAMPLES.md') {
              content.examplesMarkdown = text;
            }

            content.fullContent += `\n\n=== ${fileName} ===\n\n${text}`;
            
            // Write file to extracted directory
            await fs.mkdir(skillDir, { recursive: true });
            await fs.writeFile(path.join(skillDir, fileName), text, 'utf-8');
            
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
          context7_library: metadata.context7_library,
          context7_trust_score: metadata.context7_trust_score,
        };

        content.metadata = finalMetadata;

        // Write metadata file
        await fs.writeFile(
          path.join(skillDir, 'METADATA.json'),
          JSON.stringify(finalMetadata, null, 2),
          'utf-8'
        );

        // Write full content file
        await fs.writeFile(
          path.join(skillDir, 'FULL_CONTENT.md'),
          content.fullContent.trim(),
          'utf-8'
        );

        resolve(content as SkillContent);
      });

      zipfile.on('error', reject);
    });
  });
}

async function main() {
  try {
    console.log('🚀 Enhanced Skills Extraction - Maximum Knowledge...');
    
    await fs.mkdir(EXTRACTED_DIR, { recursive: true });
    await fs.mkdir(KNOWLEDGE_DIR, { recursive: true });

    const files = await fs.readdir(SKILLS_DIR);
    const zipFiles = files.filter(file => file.endsWith('.zip'));

    console.log(`Found ${zipFiles.length} skill zip files`);

    const skills: SkillContent[] = [];
    const errors: string[] = [];

    // Extract all skills
    for (const file of zipFiles) {
      try {
        const zipPath = path.join(SKILLS_DIR, file);
        console.log(`  Extracting: ${file}...`);
        const skill = await extractSkill(zipPath);
        if (skill) {
          skills.push(skill);
        }
      } catch (error) {
        const errorMsg = `Failed to extract ${file}: ${error}`;
        console.error(`  ❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    console.log(`\n✅ Extracted ${skills.length} skills`);

    // Create comprehensive knowledge files
    await createKnowledgeFiles(skills);
    
    console.log('\n✨ Enhanced extraction complete!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

async function createKnowledgeFiles(skills: SkillContent[]) {
  console.log('\n📚 Creating comprehensive knowledge files...');

  // 1. Technology Mapping
  await createTechnologyMapping(skills);
  
  // 2. Problem-Solution Mapping
  await createProblemSolutionMapping(skills);
  
  // 3. Quick Reference Cards
  await createQuickReferenceCards(skills);
  
  // 4. Pattern Library
  await createPatternLibrary(skills);
  
  // 5. Usage Examples Database
  await createUsageExamples(skills);
  
  // 6. Comprehensive Knowledge Base
  await createComprehensiveKnowledgeBase(skills);
  
  // 7. Searchable Index
  await createSearchableIndex(skills);
  
  // 8. Agent Instructions
  await createAgentInstructions(skills);
}

async function createTechnologyMapping(skills: SkillContent[]) {
  const techMap: Record<string, string[]> = {};
  
  skills.forEach(skill => {
    const techs = [
      ...(skill.metadata.tags || []),
      skill.metadata.name,
      skill.metadata.description,
    ].join(' ').toLowerCase();
    
    const technologies = [
      'react', 'typescript', 'javascript', 'python', 'node', 'postgresql', 'sql',
      'fastapi', 'microservices', 'api', 'auth', 'testing', 'database', 'migration',
      'deployment', 'github', 'kubernetes', 'k8s', 'terraform', 'web3', 'defi',
      'solidity', 'langchain', 'rag', 'error', 'debug', 'performance', 'optimization',
      'memory', 'agentdb', 'monorepo', 'code review', 'documentation', 'secrets',
      'distributed', 'tracing', 'frontend', 'backend', 'async', 'concurrent',
    ];
    
    technologies.forEach(tech => {
      if (techs.includes(tech)) {
        if (!techMap[tech]) techMap[tech] = [];
        techMap[tech].push(skill.metadata.name);
      }
    });
  });

  const content = `# Technology → Skills Mapping

**Purpose:** Quick lookup of skills by technology/keyword
**Total Mappings:** ${Object.keys(techMap).length}
**Last Updated:** ${new Date().toISOString()}

${Object.entries(techMap)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([tech, skillNames]) => {
    return `## ${tech.charAt(0).toUpperCase() + tech.slice(1)}

**Skills:** ${skillNames.length}
${skillNames.map(name => `- \`${name}\``).join('\n')}

**Usage:** When you encounter "${tech}" in context, automatically reference these skills.
`;
  })
  .join('\n')}
`;

  await fs.writeFile(
    path.join(KNOWLEDGE_DIR, 'TECHNOLOGY_MAPPING.md'),
    content,
    'utf-8'
  );
  console.log('  ✅ Technology mapping created');
}

async function createProblemSolutionMapping(skills: SkillContent[]) {
  const problemMap: Record<string, string[]> = {};
  
  const problems = [
    { keywords: ['slow', 'performance', 'optimize', 'bottleneck'], skills: [] },
    { keywords: ['bug', 'error', 'debug', 'issue'], skills: [] },
    { keywords: ['migrate', 'database', 'schema'], skills: [] },
    { keywords: ['test', 'testing', 'qa'], skills: [] },
    { keywords: ['deploy', 'ci/cd', 'pipeline'], skills: [] },
    { keywords: ['security', 'auth', 'vulnerability'], skills: [] },
    { keywords: ['scale', 'scalability', 'load'], skills: [] },
    { keywords: ['design', 'architecture', 'pattern'], skills: [] },
    { keywords: ['cost', 'expensive', 'budget'], skills: [] },
    { keywords: ['memory', 'leak', 'usage'], skills: [] },
  ];

  skills.forEach(skill => {
    const content = [
      skill.metadata.name,
      skill.metadata.description,
      ...(skill.metadata.tags || []),
    ].join(' ').toLowerCase();

    problems.forEach(problem => {
      if (problem.keywords.some(kw => content.includes(kw))) {
        problem.skills.push(skill.metadata.name);
      }
    });
  });

  const content = `# Problem → Solution Skills Mapping

**Purpose:** Find skills that solve specific problems
**Last Updated:** ${new Date().toISOString()}

${problems
  .filter(p => p.skills.length > 0)
  .map(problem => {
    return `## ${problem.keywords[0].charAt(0).toUpperCase() + problem.keywords[0].slice(1)} Problem

**Keywords:** ${problem.keywords.join(', ')}

**Relevant Skills:**
${problem.skills.map(name => `- \`${name}\``).join('\n')}

**Usage:** When user mentions "${problem.keywords[0]}", automatically consider these skills.
`;
  })
  .join('\n\n')}
`;

  await fs.writeFile(
    path.join(KNOWLEDGE_DIR, 'PROBLEM_SOLUTION_MAPPING.md'),
    content,
    'utf-8'
  );
  console.log('  ✅ Problem-solution mapping created');
}

async function createQuickReferenceCards(skills: SkillContent[]) {
  const cards = skills.map(skill => {
    const tags = (skill.metadata.tags || []).join(', ') || 'none';
    return `## ${skill.metadata.name}

**Category:** ${skill.metadata.category || 'uncategorized'}  
**Tags:** ${tags}  
**Description:** ${skill.metadata.description}

**When to Use:**
${(skill.metadata.tags || []).map(tag => `- Working with ${tag}`).join('\n') || '- See full documentation'}

**Location:** \`.claude/Skills/extracted/${skill.metadata.name}/\`

---
`;
  }).join('\n');

  const content = `# Skills Quick Reference Cards

**Purpose:** Fast lookup of all skills with key information
**Total Skills:** ${skills.length}
**Last Updated:** ${new Date().toISOString()}

${cards}
`;

  await fs.writeFile(
    path.join(KNOWLEDGE_DIR, 'QUICK_REFERENCE_CARDS.md'),
    content,
    'utf-8'
  );
  console.log('  ✅ Quick reference cards created');
}

async function createPatternLibrary(skills: SkillContent[]) {
  const patterns: Record<string, { skills: string[]; descriptions: string[] }> = {};
  
  skills.forEach(skill => {
    const patternKeywords = [
      'pattern', 'architecture', 'design', 'template', 'best practice',
      'strategy', 'approach', 'methodology', 'framework', 'principle',
    ];

    patternKeywords.forEach(pattern => {
      const content = [
        skill.metadata.name,
        skill.metadata.description,
      ].join(' ').toLowerCase();

      if (content.includes(pattern)) {
        if (!patterns[pattern]) {
          patterns[pattern] = { skills: [], descriptions: [] };
        }
        patterns[pattern].skills.push(skill.metadata.name);
        patterns[pattern].descriptions.push(skill.metadata.description);
      }
    });
  });

  const content = `# Pattern Library

**Purpose:** Skills organized by patterns and architectural concepts
**Last Updated:** ${new Date().toISOString()}

${Object.entries(patterns)
  .map(([pattern, data]) => {
    return `## ${pattern.charAt(0).toUpperCase() + pattern.slice(1)} Patterns

${data.skills.map((name, i) => `### ${name}
${data.descriptions[i]}

**Location:** \`.claude/Skills/extracted/${name}/\`
`).join('\n')}
`;
  })
  .join('\n')}
`;

  await fs.writeFile(
    path.join(KNOWLEDGE_DIR, 'PATTERN_LIBRARY.md'),
    content,
    'utf-8'
  );
  console.log('  ✅ Pattern library created');
}

async function createUsageExamples(skills: SkillContent[]) {
  const examples: Array<{ skill: string; example: string; context: string }> = [];
  
  skills.forEach(skill => {
    // Extract examples from EXAMPLES.md if available
    if (skill.examplesMarkdown) {
      const exampleLines = skill.examplesMarkdown.split('\n').slice(0, 10);
      examples.push({
        skill: skill.metadata.name,
        example: exampleLines.join('\n'),
        context: skill.metadata.description,
      });
    }
  });

  const content = `# Usage Examples Database

**Purpose:** Real-world examples of when and how to use each skill
**Total Examples:** ${examples.length}
**Last Updated:** ${new Date().toISOString()}

${examples
  .map(ex => {
    return `## ${ex.skill}

**Context:** ${ex.context}

**Example:**
\`\`\`
${ex.example}
\`\`\`

**Location:** \`.claude/Skills/extracted/${ex.skill}/EXAMPLES.md\`

---
`;
  })
  .join('\n')}
`;

  await fs.writeFile(
    path.join(KNOWLEDGE_DIR, 'USAGE_EXAMPLES.md'),
    content,
    'utf-8'
  );
  console.log('  ✅ Usage examples database created');
}

async function createComprehensiveKnowledgeBase(skills: SkillContent[]) {
  const content = `# Comprehensive Skills Knowledge Base

**Purpose:** Complete knowledge base with full skill content for maximum awareness
**Total Skills:** ${skills.length}
**Last Updated:** ${new Date().toISOString()}

> **Note:** This is a comprehensive knowledge base. For quick reference, see other knowledge files.

---

${skills
  .map(skill => {
    const tags = (skill.metadata.tags || []).join(', ') || 'none';
    return `# ${skill.metadata.name}

**Category:** ${skill.metadata.category || 'uncategorized'}  
**Tags:** ${tags}  
**Description:** ${skill.metadata.description}
**Version:** ${skill.metadata.version || 'N/A'}
**Trust Score:** ${skill.metadata.context7_trust_score || 'N/A'}

## Full Content

${skill.skillMarkdown.substring(0, 2000)}${skill.skillMarkdown.length > 2000 ? '...' : ''}

**Full Documentation:** \`.claude/Skills/extracted/${skill.metadata.name}/SKILL.md\`

---

`;
  })
  .join('\n')}
`;

  await fs.writeFile(
    path.join(KNOWLEDGE_DIR, 'COMPREHENSIVE_KNOWLEDGE_BASE.md'),
    content,
    'utf-8'
  );
  console.log('  ✅ Comprehensive knowledge base created');
}

async function createSearchableIndex(skills: SkillContent[]) {
  const index: Array<{
    name: string;
    description: string;
    tags: string[];
    category: string;
    keywords: string[];
  }> = [];

  skills.forEach(skill => {
    const allText = [
      skill.metadata.name,
      skill.metadata.description,
      ...(skill.metadata.tags || []),
      skill.metadata.category || '',
    ].join(' ').toLowerCase();

    const keywords = Array.from(new Set(
      allText.split(/\s+/).filter(w => w.length > 3)
    ));

    index.push({
      name: skill.metadata.name,
      description: skill.metadata.description,
      tags: skill.metadata.tags || [],
      category: skill.metadata.category || 'uncategorized',
      keywords,
    });
  });

  const content = `# Searchable Skills Index

**Purpose:** Searchable index for finding skills by any keyword
**Total Skills:** ${skills.length}
**Last Updated:** ${new Date().toISOString()}

## Index Format

Each skill entry includes:
- Name
- Description
- Tags
- Category
- Keywords (extracted from all content)

---

${index
  .map(item => {
    return `## ${item.name}

**Description:** ${item.description}  
**Category:** ${item.category}  
**Tags:** ${item.tags.join(', ') || 'none'}  
**Keywords:** ${item.keywords.slice(0, 20).join(', ')}...

**Location:** \`.claude/Skills/extracted/${item.name}/\`

`;
  })
  .join('\n')}
`;

  await fs.writeFile(
    path.join(KNOWLEDGE_DIR, 'SEARCHABLE_INDEX.md'),
    content,
    'utf-8'
  );
  console.log('  ✅ Searchable index created');
}

async function createAgentInstructions(skills: SkillContent[]) {
  const techMap: Record<string, string[]> = {};
  const problemMap: Record<string, string[]> = {};

  skills.forEach(skill => {
    const content = [
      skill.metadata.name,
      skill.metadata.description,
      ...(skill.metadata.tags || []),
    ].join(' ').toLowerCase();

    // Technology mapping
    ['react', 'typescript', 'python', 'node', 'postgresql', 'api', 'auth', 'testing',
     'deployment', 'github', 'kubernetes', 'terraform', 'web3', 'langchain', 'error',
     'debug', 'performance', 'memory', 'monorepo'].forEach(tech => {
      if (content.includes(tech)) {
        if (!techMap[tech]) techMap[tech] = [];
        techMap[tech].push(skill.metadata.name);
      }
    });

    // Problem mapping
    ['slow', 'bug', 'migrate', 'test', 'deploy', 'security', 'scale', 'cost'].forEach(problem => {
      if (content.includes(problem)) {
        if (!problemMap[problem]) problemMap[problem] = [];
        problemMap[problem].push(skill.metadata.name);
      }
    });
  });

  const content = `# Agent Instructions - Maximum Awareness

**Purpose:** Complete instructions for automatic skill usage with maximum awareness
**Last Updated:** ${new Date().toISOString()}

## Core Principle

**You MUST automatically draw upon relevant skills when context matches, WITHOUT being explicitly asked.**

## Technology → Skills Mappings

${Object.entries(techMap)
  .map(([tech, skillNames]) => {
    return `### ${tech.charAt(0).toUpperCase() + tech.slice(1)}
**Keywords:** ${tech}, ${tech}s, ${tech}ing, ${tech}ed
**Skills:** ${skillNames.join(', ')}
**Action:** When you encounter "${tech}" in any context, automatically reference these skills.
`;
  })
  .join('\n')}

## Problem → Solution Mappings

${Object.entries(problemMap)
  .map(([problem, skillNames]) => {
    return `### ${problem.charAt(0).toUpperCase() + problem.slice(1)} Problem
**Keywords:** ${problem}, ${problem}ing, ${problem}ed, ${problem}s
**Skills:** ${skillNames.join(', ')}
**Action:** When user mentions "${problem}", automatically consider these skills.
`;
  })
  .join('\n')}

## Knowledge Files Available

1. **\`.claude/knowledge/TECHNOLOGY_MAPPING.md\`** - Technology → Skills
2. **\`.claude/knowledge/PROBLEM_SOLUTION_MAPPING.md\`** - Problem → Solution
3. **\`.claude/knowledge/QUICK_REFERENCE_CARDS.md\`** - Quick lookup
4. **\`.claude/knowledge/PATTERN_LIBRARY.md\`** - Patterns and architectures
5. **\`.claude/knowledge/USAGE_EXAMPLES.md\`** - Real-world examples
6. **\`.claude/knowledge/COMPREHENSIVE_KNOWLEDGE_BASE.md\`** - Full content
7. **\`.claude/knowledge/SEARCHABLE_INDEX.md\`** - Searchable index

## Automatic Usage Protocol

1. **Analyze Context** - Extract technologies, patterns, problems
2. **Check Mappings** - Use technology/problem mappings above
3. **Read Knowledge Files** - Reference relevant knowledge files
4. **Read Skill Files** - Read \`.claude/Skills/extracted/{skill-name}/SKILL.md\`
5. **Apply Knowledge** - Use skill knowledge immediately
6. **Don't Wait** - Be proactive, not reactive

## All Available Skills

${skills.map(s => `- **${s.metadata.name}** - ${s.metadata.description}`).join('\n')}

---

**Remember:** Maximum awareness means reading these files proactively and using skills automatically!
`;

  await fs.writeFile(
    path.join(KNOWLEDGE_DIR, 'AGENT_INSTRUCTIONS.md'),
    content,
    'utf-8'
  );
  console.log('  ✅ Agent instructions created');
}

main();

