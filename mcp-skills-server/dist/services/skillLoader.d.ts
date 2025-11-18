/**
 * Service for loading and parsing skill zip files
 */
import { SkillDocumentation } from '../types/index.js';
/**
 * Load a single skill from a zip file
 */
export declare function loadSkillFromZip(zipPath: string): Promise<SkillDocumentation>;
/**
 * Load all skills from the Skills directory
 */
export declare function loadAllSkills(): Promise<SkillDocumentation[]>;
//# sourceMappingURL=skillLoader.d.ts.map