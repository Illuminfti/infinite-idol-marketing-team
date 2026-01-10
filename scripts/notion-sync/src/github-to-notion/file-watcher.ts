import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { FileChange } from '../shared/types';
import { SyncStateManager } from '../shared/sync-state';
import { Logger } from '../shared/logger';

const logger = new Logger('FileWatcher');

export interface WatchOptions {
  patterns: string[];
  basePath: string;
  ignorePatterns?: string[];
}

export class FileWatcher {
  private stateManager: SyncStateManager;
  private basePath: string;

  constructor(stateManager: SyncStateManager, basePath?: string) {
    this.stateManager = stateManager;
    this.basePath = basePath || process.cwd();
  }

  /**
   * Find all markdown files matching the patterns
   */
  async findFiles(patterns: string[], ignorePatterns: string[] = []): Promise<string[]> {
    const allFiles: Set<string> = new Set();

    for (const pattern of patterns) {
      const fullPattern = path.join(this.basePath, pattern, '**/*.md');
      const files = await glob(fullPattern, {
        ignore: ignorePatterns.map(p => path.join(this.basePath, p)),
        nodir: true,
      });

      files.forEach(file => {
        // Convert to relative path
        const relativePath = path.relative(this.basePath, file);
        allFiles.add(relativePath);
      });
    }

    logger.debug(`Found ${allFiles.size} markdown files`);
    return Array.from(allFiles).sort();
  }

  /**
   * Detect changes since last sync
   */
  async detectChanges(options: WatchOptions): Promise<FileChange[]> {
    const changes: FileChange[] = [];
    const currentFiles = await this.findFiles(options.patterns, options.ignorePatterns);
    const previousHashes = this.stateManager.getAllFileHashes();

    // Check for new and modified files
    for (const filePath of currentFiles) {
      const fullPath = path.join(this.basePath, filePath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const currentHash = this.stateManager.computeHash(content);
      const previousHash = previousHashes[filePath];

      if (!previousHash) {
        changes.push({
          path: filePath,
          type: 'added',
          content,
        });
        logger.debug(`New file detected: ${filePath}`);
      } else if (previousHash !== currentHash) {
        changes.push({
          path: filePath,
          type: 'modified',
          content,
          previousContent: undefined, // Could load from git if needed
        });
        logger.debug(`Modified file detected: ${filePath}`);
      }
    }

    // Check for deleted files
    const currentFileSet = new Set(currentFiles);
    for (const previousPath of Object.keys(previousHashes)) {
      if (!currentFileSet.has(previousPath)) {
        changes.push({
          path: previousPath,
          type: 'deleted',
        });
        logger.debug(`Deleted file detected: ${previousPath}`);
      }
    }

    logger.info(`Detected ${changes.length} changes`);
    return changes;
  }

  /**
   * Get files that have been explicitly specified (e.g., from git diff)
   */
  async getSpecifiedFiles(filePaths: string[]): Promise<FileChange[]> {
    const changes: FileChange[] = [];

    for (const filePath of filePaths) {
      const fullPath = path.join(this.basePath, filePath);

      if (!filePath.endsWith('.md')) {
        continue;
      }

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const previousHash = this.stateManager.getFileHash(filePath);

        if (!previousHash) {
          changes.push({ path: filePath, type: 'added', content });
        } else {
          const currentHash = this.stateManager.computeHash(content);
          if (previousHash !== currentHash) {
            changes.push({ path: filePath, type: 'modified', content });
          }
        }
      } else {
        // File was deleted
        if (this.stateManager.getFileHash(filePath)) {
          changes.push({ path: filePath, type: 'deleted' });
        }
      }
    }

    return changes;
  }

  /**
   * Read file content
   */
  readFile(filePath: string): string {
    const fullPath = path.join(this.basePath, filePath);
    return fs.readFileSync(fullPath, 'utf-8');
  }

  /**
   * Check if file exists
   */
  fileExists(filePath: string): boolean {
    const fullPath = path.join(this.basePath, filePath);
    return fs.existsSync(fullPath);
  }

  /**
   * Get file stats
   */
  getFileStats(filePath: string): fs.Stats | null {
    try {
      const fullPath = path.join(this.basePath, filePath);
      return fs.statSync(fullPath);
    } catch {
      return null;
    }
  }

  /**
   * Update state after successful sync
   */
  updateState(changes: FileChange[]): void {
    for (const change of changes) {
      if (change.type === 'deleted') {
        this.stateManager.removeFileHash(change.path);
        this.stateManager.removeNotionPageId(change.path);
      } else if (change.content) {
        this.stateManager.updateFileHash(change.path, change.content);
      }
    }

    this.stateManager.setLastSyncTime(new Date().toISOString());
    this.stateManager.saveState();
  }

  /**
   * Get all files with their content
   */
  async getAllFilesWithContent(patterns: string[]): Promise<Array<{ path: string; content: string }>> {
    const files = await this.findFiles(patterns);
    return files.map(filePath => ({
      path: filePath,
      content: this.readFile(filePath),
    }));
  }

  /**
   * Filter files by category based on path
   */
  categorizeFiles(files: string[]): Record<string, string[]> {
    const categories: Record<string, string[]> = {
      agents: [],
      'knowledge-base': [],
      outputs: [],
      other: [],
    };

    for (const file of files) {
      if (file.startsWith('agents/')) {
        categories.agents.push(file);
      } else if (file.startsWith('knowledge-base/')) {
        categories['knowledge-base'].push(file);
      } else if (file.startsWith('outputs/')) {
        categories.outputs.push(file);
      } else {
        categories.other.push(file);
      }
    }

    return categories;
  }
}
