import { NotionClient } from '../shared/notion-client';
import {
  NotionBlock,
  NotionPageResponse,
  NotionRichText,
} from '../shared/types';
import { Logger } from '../shared/logger';

const logger = new Logger('NotionFetcher');

export interface FetchOptions {
  databaseId: string;
  filter?: object;
  includeContent?: boolean;
}

export interface FetchedPage {
  id: string;
  title: string;
  properties: Record<string, unknown>;
  blocks: NotionBlock[];
  lastEditedTime: string;
  createdTime: string;
  githubPath?: string;
}

export class NotionFetcher {
  private client: NotionClient;

  constructor(client: NotionClient) {
    this.client = client;
  }

  /**
   * Fetch all pages from a database
   */
  async fetchDatabase(options: FetchOptions): Promise<FetchedPage[]> {
    logger.info(`Fetching pages from database ${options.databaseId}`);

    const pages = await this.client.queryDatabase(options.databaseId, options.filter);
    const fetchedPages: FetchedPage[] = [];

    for (const page of pages) {
      const fetchedPage = await this.processPage(page, options.includeContent);
      fetchedPages.push(fetchedPage);
    }

    logger.info(`Fetched ${fetchedPages.length} pages`);
    return fetchedPages;
  }

  /**
   * Fetch a single page by ID
   */
  async fetchPage(pageId: string, includeContent: boolean = true): Promise<FetchedPage> {
    logger.debug(`Fetching page ${pageId}`);

    const page = await this.client.getPage(pageId);
    return this.processPage(page, includeContent);
  }

  /**
   * Fetch pages modified since a given time
   */
  async fetchModifiedSince(
    databaseId: string,
    since: string,
    includeContent: boolean = true
  ): Promise<FetchedPage[]> {
    const filter = {
      timestamp: 'last_edited_time',
      last_edited_time: {
        after: since,
      },
    };

    return this.fetchDatabase({
      databaseId,
      filter,
      includeContent,
    });
  }

  /**
   * Fetch pages by status (e.g., approved items from review queue)
   */
  async fetchByStatus(
    databaseId: string,
    statusProperty: string,
    statusValue: string,
    includeContent: boolean = true
  ): Promise<FetchedPage[]> {
    const filter = {
      property: statusProperty,
      select: {
        equals: statusValue,
      },
    };

    return this.fetchDatabase({
      databaseId,
      filter,
      includeContent,
    });
  }

  private async processPage(
    page: NotionPageResponse,
    includeContent: boolean = true
  ): Promise<FetchedPage> {
    const title = this.extractTitle(page.properties);
    const githubPath = this.extractGitHubPath(page.properties);

    let blocks: NotionBlock[] = [];
    if (includeContent) {
      blocks = await this.client.getPageBlocks(page.id);
    }

    return {
      id: page.id,
      title,
      properties: this.normalizeProperties(page.properties),
      blocks,
      lastEditedTime: page.last_edited_time,
      createdTime: page.created_time,
      githubPath,
    };
  }

  private extractTitle(properties: Record<string, unknown>): string {
    // Look for common title property names
    const titleProps = ['Name', 'Title', 'title', 'name'];

    for (const propName of titleProps) {
      const prop = properties[propName] as { title?: NotionRichText[] } | undefined;
      if (prop?.title && prop.title.length > 0) {
        return prop.title.map(t => t.text.content).join('');
      }
    }

    return 'Untitled';
  }

  private extractGitHubPath(properties: Record<string, unknown>): string | undefined {
    const pathProps = ['GitHub Path', 'github_path', 'GitHubPath', 'File Path'];

    for (const propName of pathProps) {
      const prop = properties[propName] as { rich_text?: NotionRichText[] } | undefined;
      if (prop?.rich_text && prop.rich_text.length > 0) {
        return prop.rich_text.map(t => t.text.content).join('');
      }
    }

    return undefined;
  }

  private normalizeProperties(properties: Record<string, unknown>): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(properties)) {
      normalized[key] = this.extractPropertyValue(value as NotionPropertyResponse);
    }

    return normalized;
  }

  private extractPropertyValue(prop: NotionPropertyResponse): unknown {
    switch (prop.type) {
      case 'title':
        return prop.title?.map((t: NotionRichText) => t.text.content).join('') || '';
      case 'rich_text':
        return prop.rich_text?.map((t: NotionRichText) => t.text.content).join('') || '';
      case 'select':
        return prop.select?.name || null;
      case 'multi_select':
        return prop.multi_select?.map((s: { name: string }) => s.name) || [];
      case 'date':
        return prop.date?.start || null;
      case 'checkbox':
        return prop.checkbox || false;
      case 'url':
        return prop.url || null;
      case 'number':
        return prop.number ?? null;
      default:
        return null;
    }
  }

  /**
   * Search for pages by query
   */
  async searchPages(query: string): Promise<FetchedPage[]> {
    const results = await this.client.search(query, { property: 'object', value: 'page' });
    const fetchedPages: FetchedPage[] = [];

    for (const page of results) {
      const fetchedPage = await this.processPage(page, true);
      fetchedPages.push(fetchedPage);
    }

    return fetchedPages;
  }

  /**
   * Get page IDs that have been modified
   */
  async getModifiedPageIds(databaseId: string, since: string): Promise<string[]> {
    const pages = await this.fetchModifiedSince(databaseId, since, false);
    return pages.map(p => p.id);
  }
}

interface NotionPropertyResponse {
  type: string;
  title?: NotionRichText[];
  rich_text?: NotionRichText[];
  select?: { name: string };
  multi_select?: Array<{ name: string }>;
  date?: { start: string; end?: string };
  checkbox?: boolean;
  url?: string;
  number?: number;
}
