import { NotionClient } from '../shared/notion-client';
import { NotionConverter } from './notion-converter';
import { MarkdownParser } from './markdown-parser';
import { ParsedMarkdown, SyncResult, SyncError } from '../shared/types';
import { Logger } from '../shared/logger';

const logger = new Logger('NotionUploader');

export interface UploadOptions {
  databaseId: string;
  dryRun?: boolean;
  updateExisting?: boolean;
}

export interface UploadResult {
  success: boolean;
  pageId?: string;
  error?: string;
  isNew: boolean;
}

export class NotionUploader {
  private client: NotionClient;
  private converter: NotionConverter;
  private parser: MarkdownParser;

  constructor(client: NotionClient) {
    this.client = client;
    this.converter = new NotionConverter();
    this.parser = new MarkdownParser();
  }

  /**
   * Upload a markdown file to Notion
   */
  async uploadMarkdown(
    filePath: string,
    content: string,
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      const parsed = this.parser.parse(content);
      const title = this.parser.extractTitle(parsed.content, parsed.frontmatter);

      logger.info(`Uploading ${filePath} as "${title}"`);

      if (options.dryRun) {
        logger.info(`[DRY RUN] Would upload ${filePath} to database ${options.databaseId}`);
        return { success: true, isNew: true };
      }

      // Check if page already exists
      const existingPageId = parsed.frontmatter.notionId;

      if (existingPageId && options.updateExisting) {
        return await this.updateExistingPage(existingPageId, parsed, title, filePath);
      } else {
        return await this.createNewPage(options.databaseId, parsed, title, filePath);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to upload ${filePath}`, error);
      return {
        success: false,
        error: errorMessage,
        isNew: false,
      };
    }
  }

  private async createNewPage(
    databaseId: string,
    parsed: ParsedMarkdown,
    title: string,
    filePath: string
  ): Promise<UploadResult> {
    const blocks = this.converter.convert(parsed);
    const apiBlocks = this.converter.toNotionApiBlocks(blocks);

    const properties = this.buildProperties(parsed, title, filePath);

    const pageId = await this.client.createPage(databaseId, properties, apiBlocks);

    logger.success(`Created new page: ${pageId}`);
    return { success: true, pageId, isNew: true };
  }

  private async updateExistingPage(
    pageId: string,
    parsed: ParsedMarkdown,
    title: string,
    filePath: string
  ): Promise<UploadResult> {
    // Update page properties
    const properties = this.buildProperties(parsed, title, filePath);
    await this.client.updatePage(pageId, properties);

    // Clear existing content and add new
    await this.client.clearPageContent(pageId);

    const blocks = this.converter.convert(parsed);
    const apiBlocks = this.converter.toNotionApiBlocks(blocks);
    await this.client.appendBlocks(pageId, apiBlocks);

    logger.success(`Updated existing page: ${pageId}`);
    return { success: true, pageId, isNew: false };
  }

  private buildProperties(
    parsed: ParsedMarkdown,
    title: string,
    filePath: string
  ): Record<string, unknown> {
    const properties: Record<string, unknown> = {
      Name: this.client.buildTitleProperty(title),
      'GitHub Path': this.client.buildRichTextProperty(filePath),
      'Last Synced': this.client.buildDateProperty(new Date().toISOString()),
    };

    if (parsed.frontmatter.status) {
      properties['Status'] = this.client.buildSelectProperty(parsed.frontmatter.status);
    }

    if (parsed.frontmatter.tags && Array.isArray(parsed.frontmatter.tags)) {
      properties['Tags'] = this.client.buildMultiSelectProperty(parsed.frontmatter.tags);
    }

    return properties;
  }

  /**
   * Upload multiple markdown files
   */
  async uploadMultiple(
    files: Array<{ path: string; content: string }>,
    options: UploadOptions
  ): Promise<SyncResult> {
    const results: UploadResult[] = [];
    const errors: SyncError[] = [];
    const syncedFiles: string[] = [];

    for (const file of files) {
      const result = await this.uploadMarkdown(file.path, file.content, options);
      results.push(result);

      if (result.success) {
        syncedFiles.push(file.path);
      } else {
        errors.push({
          filePath: file.path,
          message: result.error || 'Unknown error',
          code: 'UPLOAD_FAILED',
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

  /**
   * Sync a file (create or update based on state)
   */
  async syncFile(
    filePath: string,
    content: string,
    existingPageId: string | undefined,
    options: UploadOptions
  ): Promise<UploadResult> {
    const parsed = this.parser.parse(content);

    // Use existing page ID from state or frontmatter
    const pageId = existingPageId || parsed.frontmatter.notionId;

    if (pageId) {
      return this.uploadMarkdown(filePath, content, {
        ...options,
        updateExisting: true,
      });
    } else {
      return this.uploadMarkdown(filePath, content, options);
    }
  }

  /**
   * Delete a page from Notion
   */
  async deletePage(pageId: string, dryRun: boolean = false): Promise<boolean> {
    try {
      if (dryRun) {
        logger.info(`[DRY RUN] Would archive page ${pageId}`);
        return true;
      }

      await this.client.archivePage(pageId);
      logger.info(`Archived page ${pageId}`);
      return true;
    } catch (error) {
      logger.error(`Failed to archive page ${pageId}`, error);
      return false;
    }
  }
}
