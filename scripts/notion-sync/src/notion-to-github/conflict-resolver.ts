import { SyncConflict } from '../shared/types';
import { SyncStateManager } from '../shared/sync-state';
import { GitHubClient } from '../shared/github-client';
import { FetchedPage } from './notion-fetcher';
import { Logger } from '../shared/logger';

const logger = new Logger('ConflictResolver');

export type ResolutionStrategy = 'github-wins' | 'notion-wins' | 'newer-wins' | 'manual';

export interface ConflictDetails {
  conflict: SyncConflict;
  githubContent?: string;
  notionContent?: string;
  recommendation: ResolutionStrategy;
  reason: string;
}

export class ConflictResolver {
  private stateManager: SyncStateManager;
  private githubClient: GitHubClient;
  private defaultStrategy: ResolutionStrategy;

  constructor(
    stateManager: SyncStateManager,
    githubClient: GitHubClient,
    defaultStrategy: ResolutionStrategy = 'newer-wins'
  ) {
    this.stateManager = stateManager;
    this.githubClient = githubClient;
    this.defaultStrategy = defaultStrategy;
  }

  /**
   * Detect conflicts between GitHub and Notion versions
   */
  async detectConflict(
    filePath: string,
    notionPage: FetchedPage
  ): Promise<SyncConflict | null> {
    const existingPageId = this.stateManager.getNotionPageId(filePath);

    // No conflict if this is a new file
    if (!existingPageId || existingPageId !== notionPage.id) {
      return null;
    }

    // Get GitHub file info
    const githubFile = await this.githubClient.getFile(filePath);
    if (!githubFile) {
      return null;
    }

    // Get last sync time
    const lastSyncTime = this.stateManager.getLastSyncTime();
    if (!lastSyncTime) {
      // No previous sync, no conflict possible
      return null;
    }

    const githubModified = githubFile.lastModified || new Date().toISOString();
    const notionModified = notionPage.lastEditedTime;

    // Check if both have been modified since last sync
    const githubModifiedSinceSync = new Date(githubModified) > new Date(lastSyncTime);
    const notionModifiedSinceSync = new Date(notionModified) > new Date(lastSyncTime);

    if (githubModifiedSinceSync && notionModifiedSinceSync) {
      // Check if content actually differs
      const currentHash = this.stateManager.computeHash(githubFile.content);
      const storedHash = this.stateManager.getFileHash(filePath);

      if (currentHash !== storedHash) {
        logger.warn(`Conflict detected for ${filePath}`);
        return {
          filePath,
          notionPageId: notionPage.id,
          githubLastModified: githubModified,
          notionLastModified: notionModified,
        };
      }
    }

    return null;
  }

  /**
   * Analyze a conflict and provide resolution details
   */
  async analyzeConflict(conflict: SyncConflict): Promise<ConflictDetails> {
    const githubFile = await this.githubClient.getFile(conflict.filePath);

    const githubTime = new Date(conflict.githubLastModified);
    const notionTime = new Date(conflict.notionLastModified);

    let recommendation: ResolutionStrategy;
    let reason: string;

    if (this.defaultStrategy === 'newer-wins') {
      if (notionTime > githubTime) {
        recommendation = 'notion-wins';
        reason = `Notion was modified more recently (${notionTime.toISOString()} vs ${githubTime.toISOString()})`;
      } else {
        recommendation = 'github-wins';
        reason = `GitHub was modified more recently (${githubTime.toISOString()} vs ${notionTime.toISOString()})`;
      }
    } else {
      recommendation = this.defaultStrategy;
      reason = `Using configured default strategy: ${this.defaultStrategy}`;
    }

    return {
      conflict,
      githubContent: githubFile?.content,
      recommendation,
      reason,
    };
  }

  /**
   * Resolve a conflict with the given strategy
   */
  async resolveConflict(
    conflict: SyncConflict,
    strategy: ResolutionStrategy
  ): Promise<{ winner: 'github' | 'notion' | 'manual'; content?: string }> {
    logger.info(`Resolving conflict for ${conflict.filePath} with strategy: ${strategy}`);

    switch (strategy) {
      case 'github-wins':
        this.stateManager.resolveConflict(conflict.filePath, 'github-wins');
        return { winner: 'github' };

      case 'notion-wins':
        this.stateManager.resolveConflict(conflict.filePath, 'notion-wins');
        return { winner: 'notion' };

      case 'newer-wins': {
        const analysis = await this.analyzeConflict(conflict);
        return this.resolveConflict(conflict, analysis.recommendation);
      }

      case 'manual':
        this.stateManager.resolveConflict(conflict.filePath, 'manual');
        return { winner: 'manual' };

      default:
        throw new Error(`Unknown resolution strategy: ${strategy}`);
    }
  }

  /**
   * Get all unresolved conflicts
   */
  getUnresolvedConflicts(): SyncConflict[] {
    return this.stateManager.getConflicts().filter(c => !c.resolution);
  }

  /**
   * Get all conflicts including resolved ones
   */
  getAllConflicts(): SyncConflict[] {
    return this.stateManager.getConflicts();
  }

  /**
   * Mark a conflict as resolved without choosing a winner
   */
  markResolved(filePath: string): void {
    this.stateManager.removeConflict(filePath);
    logger.info(`Marked conflict as resolved: ${filePath}`);
  }

  /**
   * Clear all resolved conflicts from state
   */
  clearResolvedConflicts(): void {
    this.stateManager.clearResolvedConflicts();
    logger.info('Cleared all resolved conflicts');
  }

  /**
   * Add a new conflict to the state
   */
  addConflict(conflict: SyncConflict): void {
    this.stateManager.addConflict(conflict);
    logger.info(`Added conflict for ${conflict.filePath}`);
  }

  /**
   * Check if a file has an unresolved conflict
   */
  hasConflict(filePath: string): boolean {
    const conflicts = this.stateManager.getConflicts();
    return conflicts.some(c => c.filePath === filePath && !c.resolution);
  }

  /**
   * Generate a merge report for conflicts
   */
  generateConflictReport(): string {
    const conflicts = this.stateManager.getConflicts();

    if (conflicts.length === 0) {
      return 'No conflicts detected.';
    }

    const lines: string[] = [
      '# Sync Conflicts Report',
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      `Total conflicts: ${conflicts.length}`,
      '',
      '## Details',
      '',
    ];

    for (const conflict of conflicts) {
      lines.push(`### ${conflict.filePath}`);
      lines.push('');
      lines.push(`- Notion Page ID: ${conflict.notionPageId}`);
      lines.push(`- GitHub Modified: ${conflict.githubLastModified}`);
      lines.push(`- Notion Modified: ${conflict.notionLastModified}`);
      lines.push(`- Resolution: ${conflict.resolution || 'Unresolved'}`);
      lines.push('');
    }

    return lines.join('\n');
  }
}
