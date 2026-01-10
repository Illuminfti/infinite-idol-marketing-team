import { NotionClient } from '../shared/notion-client';
import { GitHubClient } from '../shared/github-client';
import { SyncStateManager } from '../shared/sync-state';
import { SyncConfig, SyncResult, SyncError } from '../shared/types';
import { NotionFetcher, FetchedPage } from './notion-fetcher';
import { MarkdownGenerator } from './markdown-generator';
import { GitHubCommitter } from './github-committer';
import { ConflictResolver, ResolutionStrategy } from './conflict-resolver';
import { Logger } from '../shared/logger';

const logger = new Logger('NotionToGitHub');

export interface SyncOptions {
  dryRun?: boolean;
  force?: boolean;
  databases?: string[];
  conflictStrategy?: ResolutionStrategy;
}

export class NotionToGitHubSync {
  private config: SyncConfig;
  private notionClient: NotionClient;
  private githubClient: GitHubClient;
  private stateManager: SyncStateManager;
  private fetcher: NotionFetcher;
  private generator: MarkdownGenerator;
  private committer: GitHubCommitter;
  private conflictResolver: ConflictResolver;

  constructor(config: SyncConfig) {
    this.config = config;
    this.notionClient = new NotionClient(config.notion.token);
    this.githubClient = new GitHubClient(
      config.github.token,
      config.github.owner,
      config.github.repo,
      config.github.branch
    );
    this.stateManager = new SyncStateManager();
    this.fetcher = new NotionFetcher(this.notionClient);
    this.generator = new MarkdownGenerator();
    this.committer = new GitHubCommitter(this.githubClient);
    this.conflictResolver = new ConflictResolver(
      this.stateManager,
      this.githubClient
    );
  }

  /**
   * Run the sync process
   */
  async sync(options: SyncOptions = {}): Promise<SyncResult> {
    logger.info('Starting Notion to GitHub sync');

    const errors: SyncError[] = [];
    const syncedFiles: string[] = [];
    const dryRun = options.dryRun || this.config.sync.dryRun;

    try {
      // Determine which databases to sync
      const databases = this.getDatabasestoSync(options.databases);

      for (const [name, databaseId] of Object.entries(databases)) {
        if (!databaseId) {
          logger.debug(`Skipping ${name}: no database ID configured`);
          continue;
        }

        logger.info(`Syncing database: ${name}`);

        try {
          const result = await this.syncDatabase(
            name,
            databaseId,
            { ...options, dryRun }
          );
          syncedFiles.push(...result.syncedFiles);
          errors.push(...result.errors);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          errors.push({
            message: `Failed to sync ${name}: ${errorMessage}`,
            code: 'DATABASE_SYNC_ERROR',
          });
          logger.error(`Error syncing database ${name}`, error);
        }
      }

      // Update state
      if (!dryRun && syncedFiles.length > 0) {
        this.stateManager.setLastSyncTime(new Date().toISOString());
        this.stateManager.saveState();
      }

      const result: SyncResult = {
        success: errors.length === 0,
        syncedFiles,
        errors,
        conflicts: this.conflictResolver.getUnresolvedConflicts(),
        timestamp: new Date().toISOString(),
      };

      if (result.success) {
        logger.success(`Sync completed: ${syncedFiles.length} file(s) synced`);
      } else {
        logger.warn(`Sync completed with errors: ${syncedFiles.length} synced, ${errors.length} errors`);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Sync failed', error);
      return {
        success: false,
        syncedFiles,
        errors: [{
          message: errorMessage,
          code: 'SYNC_FAILED',
        }],
        conflicts: [],
        timestamp: new Date().toISOString(),
      };
    }
  }

  private getDatabasestoSync(selectedDatabases?: string[]): Record<string, string> {
    const allDatabases = this.config.notion.databases;

    if (selectedDatabases && selectedDatabases.length > 0) {
      const filtered: Record<string, string> = {};
      for (const name of selectedDatabases) {
        if (name in allDatabases) {
          filtered[name] = allDatabases[name as keyof typeof allDatabases];
        }
      }
      return filtered;
    }

    return allDatabases;
  }

  private async syncDatabase(
    name: string,
    databaseId: string,
    options: SyncOptions
  ): Promise<SyncResult> {
    const errors: SyncError[] = [];
    const syncedFiles: string[] = [];

    // Fetch pages from Notion
    const lastSyncTime = options.force ? undefined : this.stateManager.getLastSyncTime();
    let pages: FetchedPage[];

    if (lastSyncTime) {
      pages = await this.fetcher.fetchModifiedSince(databaseId, lastSyncTime);
    } else {
      pages = await this.fetcher.fetchDatabase({
        databaseId,
        includeContent: true,
      });
    }

    logger.info(`Found ${pages.length} pages to sync from ${name}`);

    // Process each page
    for (const page of pages) {
      try {
        const result = await this.processPage(page, name, options);
        if (result.success && result.filePath) {
          syncedFiles.push(result.filePath);
        } else if (result.error) {
          errors.push({
            notionPageId: page.id,
            message: result.error,
            code: 'PAGE_SYNC_ERROR',
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({
          notionPageId: page.id,
          message: errorMessage,
          code: 'PAGE_SYNC_ERROR',
        });
      }
    }

    return {
      success: errors.length === 0,
      syncedFiles,
      errors,
      conflicts: [],
      timestamp: new Date().toISOString(),
    };
  }

  private async processPage(
    page: FetchedPage,
    databaseName: string,
    options: SyncOptions
  ): Promise<{ success: boolean; filePath?: string; error?: string }> {
    // Determine file path
    const basePath = this.getBasePathForDatabase(databaseName);
    const filePath = this.generator.generateFilePath(page, basePath);

    logger.debug(`Processing page ${page.id} -> ${filePath}`);

    // Check for conflicts
    const conflict = await this.conflictResolver.detectConflict(filePath, page);
    if (conflict) {
      const resolution = await this.conflictResolver.resolveConflict(
        conflict,
        options.conflictStrategy || 'newer-wins'
      );

      if (resolution.winner === 'github') {
        logger.info(`Conflict resolved: GitHub wins for ${filePath}`);
        return { success: true, filePath };
      } else if (resolution.winner === 'manual') {
        logger.warn(`Conflict requires manual resolution: ${filePath}`);
        this.conflictResolver.addConflict(conflict);
        return { success: false, error: 'Manual conflict resolution required' };
      }
      // If Notion wins, continue with sync
    }

    // Generate markdown
    const markdown = this.generator.generate(page);

    // Commit to GitHub
    const commitResult = await this.committer.upsertFile(
      filePath,
      markdown,
      `[Notion Sync] Update ${page.title}`,
      options.dryRun
    );

    if (commitResult.success) {
      // Update state
      if (!options.dryRun) {
        this.stateManager.setNotionPageId(filePath, page.id);
        this.stateManager.updateFileHash(filePath, markdown);
      }
      return { success: true, filePath };
    } else {
      return { success: false, error: commitResult.error };
    }
  }

  private getBasePathForDatabase(name: string): string {
    const pathMap: Record<string, string> = {
      knowledgeBase: 'knowledge-base',
      agentActivity: 'logs',
      reviewQueue: 'reviews',
      contentCalendar: 'outputs/calendar',
      tweetQueue: 'outputs/tweets',
    };

    return pathMap[name] || 'synced';
  }

  /**
   * Get current sync state
   */
  getState() {
    return this.stateManager.getState();
  }

  /**
   * Reset sync state
   */
  resetState() {
    this.stateManager.reset();
    logger.info('Sync state reset');
  }

  /**
   * Get unresolved conflicts
   */
  getConflicts() {
    return this.conflictResolver.getUnresolvedConflicts();
  }
}

// Export all components
export { NotionFetcher, FetchedPage } from './notion-fetcher';
export { MarkdownGenerator } from './markdown-generator';
export { GitHubCommitter, FileUpdate, CommitResult } from './github-committer';
export { ConflictResolver, ResolutionStrategy, ConflictDetails } from './conflict-resolver';
