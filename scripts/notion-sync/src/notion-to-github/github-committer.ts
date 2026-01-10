import { GitHubClient } from '../shared/github-client';
import { GitHubCommit } from '../shared/types';
import { Logger } from '../shared/logger';

const logger = new Logger('GitHubCommitter');

export interface CommitOptions {
  branch?: string;
  dryRun?: boolean;
  commitMessage?: string;
}

export interface FileUpdate {
  path: string;
  content: string;
  action: 'create' | 'update' | 'delete';
}

export interface CommitResult {
  success: boolean;
  commit?: GitHubCommit;
  error?: string;
  filesUpdated: string[];
}

export class GitHubCommitter {
  private client: GitHubClient;

  constructor(client: GitHubClient) {
    this.client = client;
  }

  /**
   * Commit a single file update
   */
  async commitFile(
    update: FileUpdate,
    options: CommitOptions = {}
  ): Promise<CommitResult> {
    try {
      if (options.dryRun) {
        logger.info(`[DRY RUN] Would ${update.action} ${update.path}`);
        return {
          success: true,
          filesUpdated: [update.path],
        };
      }

      const message = options.commitMessage || this.generateCommitMessage([update]);

      if (update.action === 'delete') {
        await this.client.deleteFile(update.path, message);
      } else {
        await this.client.createOrUpdateFile(update.path, update.content, message);
      }

      logger.success(`Committed ${update.action} for ${update.path}`);
      return {
        success: true,
        commit: {
          sha: '', // Would be returned from the API
          message,
          files: [update.path],
          timestamp: new Date().toISOString(),
        },
        filesUpdated: [update.path],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to commit ${update.path}`, error);
      return {
        success: false,
        error: errorMessage,
        filesUpdated: [],
      };
    }
  }

  /**
   * Commit multiple file updates in sequence
   */
  async commitFiles(
    updates: FileUpdate[],
    options: CommitOptions = {}
  ): Promise<CommitResult> {
    const filesUpdated: string[] = [];
    const errors: string[] = [];

    for (const update of updates) {
      const message = options.commitMessage || this.generateCommitMessage([update]);
      const result = await this.commitFile(update, { ...options, commitMessage: message });

      if (result.success) {
        filesUpdated.push(...result.filesUpdated);
      } else if (result.error) {
        errors.push(`${update.path}: ${result.error}`);
      }
    }

    return {
      success: errors.length === 0,
      filesUpdated,
      error: errors.length > 0 ? errors.join('; ') : undefined,
    };
  }

  /**
   * Create a file in GitHub
   */
  async createFile(
    path: string,
    content: string,
    message?: string,
    dryRun: boolean = false
  ): Promise<CommitResult> {
    return this.commitFile(
      { path, content, action: 'create' },
      { dryRun, commitMessage: message }
    );
  }

  /**
   * Update a file in GitHub
   */
  async updateFile(
    path: string,
    content: string,
    message?: string,
    dryRun: boolean = false
  ): Promise<CommitResult> {
    return this.commitFile(
      { path, content, action: 'update' },
      { dryRun, commitMessage: message }
    );
  }

  /**
   * Delete a file in GitHub
   */
  async deleteFile(
    path: string,
    message?: string,
    dryRun: boolean = false
  ): Promise<CommitResult> {
    return this.commitFile(
      { path, content: '', action: 'delete' },
      { dryRun, commitMessage: message }
    );
  }

  /**
   * Create or update a file based on whether it exists
   */
  async upsertFile(
    path: string,
    content: string,
    message?: string,
    dryRun: boolean = false
  ): Promise<CommitResult> {
    const existingFile = await this.client.getFile(path);
    const action = existingFile ? 'update' : 'create';

    return this.commitFile(
      { path, content, action },
      { dryRun, commitMessage: message }
    );
  }

  /**
   * Check if a file exists in GitHub
   */
  async fileExists(path: string): Promise<boolean> {
    const file = await this.client.getFile(path);
    return file !== null;
  }

  /**
   * Get the current content of a file
   */
  async getFileContent(path: string): Promise<string | null> {
    const file = await this.client.getFile(path);
    return file?.content || null;
  }

  /**
   * Generate a commit message for a set of updates
   */
  private generateCommitMessage(updates: FileUpdate[]): string {
    if (updates.length === 1) {
      const update = updates[0];
      const action = update.action === 'create' ? 'Add' : update.action === 'update' ? 'Update' : 'Delete';
      return `[Notion Sync] ${action} ${update.path}`;
    }

    const actionCounts = {
      create: 0,
      update: 0,
      delete: 0,
    };

    for (const update of updates) {
      actionCounts[update.action]++;
    }

    const parts: string[] = [];
    if (actionCounts.create > 0) parts.push(`${actionCounts.create} added`);
    if (actionCounts.update > 0) parts.push(`${actionCounts.update} updated`);
    if (actionCounts.delete > 0) parts.push(`${actionCounts.delete} deleted`);

    return `[Notion Sync] ${parts.join(', ')} (${updates.length} files)`;
  }

  /**
   * Create a sync branch for changes
   */
  async createSyncBranch(branchName?: string): Promise<string> {
    const name = branchName || `notion-sync-${Date.now()}`;
    await this.client.createBranch(name);
    return name;
  }

  /**
   * Create a pull request for sync changes
   */
  async createSyncPR(
    branchName: string,
    title: string,
    body: string
  ): Promise<number> {
    return this.client.createPullRequest(title, body, branchName);
  }
}
