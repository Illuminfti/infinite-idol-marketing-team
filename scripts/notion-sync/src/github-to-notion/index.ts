import { NotionClient } from '../shared/notion-client';
import { SyncStateManager } from '../shared/sync-state';
import { SyncConfig, SyncResult, SyncError, FileChange } from '../shared/types';
import { FileWatcher } from './file-watcher';
import { NotionUploader } from './notion-uploader';
import { MarkdownParser } from './markdown-parser';
import { Logger } from '../shared/logger';

const logger = new Logger('GitHubToNotion');

export interface SyncOptions {
  force?: boolean;
  dryRun?: boolean;
  files?: string[];
}

export class GitHubToNotionSync {
  private config: SyncConfig;
  private notionClient: NotionClient;
  private stateManager: SyncStateManager;
  private fileWatcher: FileWatcher;
  private uploader: NotionUploader;
  private parser: MarkdownParser;

  constructor(config: SyncConfig, basePath?: string) {
    this.config = config;
    this.notionClient = new NotionClient(config.notion.token);
    this.stateManager = new SyncStateManager();
    this.fileWatcher = new FileWatcher(this.stateManager, basePath);
    this.uploader = new NotionUploader(this.notionClient);
    this.parser = new MarkdownParser();
  }

  /**
   * Run the sync process
   */
  async sync(options: SyncOptions = {}): Promise<SyncResult> {
    logger.info('Starting GitHub to Notion sync');

    const errors: SyncError[] = [];
    const syncedFiles: string[] = [];

    try {
      // Detect changed files
      let changes: FileChange[];

      if (options.files && options.files.length > 0) {
        // Sync specific files
        changes = await this.fileWatcher.getSpecifiedFiles(options.files);
      } else if (options.force) {
        // Force sync all files
        const allFiles = await this.fileWatcher.getAllFilesWithContent(this.config.sync.paths);
        changes = allFiles.map(f => ({
          path: f.path,
          type: 'modified' as const,
          content: f.content,
        }));
      } else {
        // Detect changes since last sync
        changes = await this.fileWatcher.detectChanges({
          patterns: this.config.sync.paths,
          basePath: process.cwd(),
        });
      }

      if (changes.length === 0) {
        logger.info('No changes detected');
        return {
          success: true,
          syncedFiles: [],
          errors: [],
          conflicts: [],
          timestamp: new Date().toISOString(),
        };
      }

      logger.info(`Processing ${changes.length} file(s)`);

      // Process each change
      for (const change of changes) {
        try {
          await this.processChange(change, options, syncedFiles);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          errors.push({
            filePath: change.path,
            message: errorMessage,
            code: 'SYNC_ERROR',
          });
          logger.error(`Error processing ${change.path}`, error);
        }
      }

      // Update state if not dry run
      if (!options.dryRun && !this.config.sync.dryRun) {
        this.fileWatcher.updateState(changes.filter(c => syncedFiles.includes(c.path)));
      }

      const result: SyncResult = {
        success: errors.length === 0,
        syncedFiles,
        errors,
        conflicts: [],
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

  private async processChange(
    change: FileChange,
    options: SyncOptions,
    syncedFiles: string[]
  ): Promise<void> {
    const dryRun = options.dryRun || this.config.sync.dryRun;
    const databaseId = this.getDatabaseIdForFile(change.path);

    switch (change.type) {
      case 'added':
      case 'modified': {
        if (!change.content) {
          throw new Error('Content is required for added/modified files');
        }

        const existingPageId = this.stateManager.getNotionPageId(change.path);
        const result = await this.uploader.syncFile(
          change.path,
          change.content,
          existingPageId,
          {
            databaseId,
            dryRun,
            updateExisting: change.type === 'modified',
          }
        );

        if (result.success) {
          syncedFiles.push(change.path);
          if (result.pageId && !dryRun) {
            this.stateManager.setNotionPageId(change.path, result.pageId);
          }
        } else {
          throw new Error(result.error || 'Upload failed');
        }
        break;
      }

      case 'deleted': {
        const pageId = this.stateManager.getNotionPageId(change.path);
        if (pageId) {
          const success = await this.uploader.deletePage(pageId, dryRun);
          if (success) {
            syncedFiles.push(change.path);
          }
        }
        break;
      }
    }
  }

  private getDatabaseIdForFile(filePath: string): string {
    // Route files to appropriate databases based on path
    if (filePath.startsWith('logs/agent-activity')) {
      return this.config.notion.databases.agentActivity || this.config.notion.databases.knowledgeBase;
    }
    if (filePath.startsWith('reviews/')) {
      return this.config.notion.databases.reviewQueue || this.config.notion.databases.knowledgeBase;
    }
    if (filePath.startsWith('outputs/calendar/')) {
      return this.config.notion.databases.contentCalendar || this.config.notion.databases.knowledgeBase;
    }
    if (filePath.includes('tweet')) {
      return this.config.notion.databases.tweetQueue || this.config.notion.databases.knowledgeBase;
    }

    return this.config.notion.databases.knowledgeBase;
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
}

// Export all components for individual use
export { FileWatcher } from './file-watcher';
export { NotionUploader } from './notion-uploader';
export { NotionConverter } from './notion-converter';
export { MarkdownParser } from './markdown-parser';
