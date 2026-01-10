import { NotionClient } from '../shared/notion-client';
import { NotionRichText } from '../shared/types';
import { Logger } from '../shared/logger';

const logger = new Logger('KnowledgeBaseDB');

export interface KnowledgeBaseEntry {
  title: string;
  category: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  githubPath?: string;
  lastSynced?: string;
}

export interface KnowledgeBaseRecord {
  id: string;
  entry: KnowledgeBaseEntry;
  createdTime: string;
  lastEditedTime: string;
}

export class KnowledgeBaseDatabase {
  private client: NotionClient;
  private databaseId: string;

  constructor(client: NotionClient, databaseId: string) {
    this.client = client;
    this.databaseId = databaseId;
  }

  /**
   * Add a new knowledge base entry
   */
  async addEntry(entry: KnowledgeBaseEntry): Promise<string> {
    const properties = this.buildProperties(entry);
    const content = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: entry.content } }],
        },
      },
    ];

    const pageId = await this.client.createPage(this.databaseId, properties, content);
    logger.info(`Created knowledge base entry: ${entry.title}`);
    return pageId;
  }

  /**
   * Get all entries
   */
  async getAllEntries(): Promise<KnowledgeBaseRecord[]> {
    const pages = await this.client.queryDatabase(this.databaseId);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Get entries by category
   */
  async getEntriesByCategory(category: string): Promise<KnowledgeBaseRecord[]> {
    const filter = {
      property: 'Category',
      select: {
        equals: category,
      },
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Get entries by tag
   */
  async getEntriesByTag(tag: string): Promise<KnowledgeBaseRecord[]> {
    const filter = {
      property: 'Tags',
      multi_select: {
        contains: tag,
      },
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Get published entries only
   */
  async getPublishedEntries(): Promise<KnowledgeBaseRecord[]> {
    const filter = {
      property: 'Status',
      select: {
        equals: 'published',
      },
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Search entries by title
   */
  async searchByTitle(query: string): Promise<KnowledgeBaseRecord[]> {
    const allEntries = await this.getAllEntries();
    const lowerQuery = query.toLowerCase();
    return allEntries.filter(entry =>
      entry.entry.title.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Update an entry
   */
  async updateEntry(pageId: string, updates: Partial<KnowledgeBaseEntry>): Promise<void> {
    const properties: Record<string, unknown> = {};

    if (updates.title) {
      properties['Name'] = this.client.buildTitleProperty(updates.title);
    }
    if (updates.category) {
      properties['Category'] = this.client.buildSelectProperty(updates.category);
    }
    if (updates.status) {
      properties['Status'] = this.client.buildSelectProperty(updates.status);
    }
    if (updates.tags) {
      properties['Tags'] = this.client.buildMultiSelectProperty(updates.tags);
    }
    if (updates.githubPath) {
      properties['GitHub Path'] = this.client.buildRichTextProperty(updates.githubPath);
    }
    if (updates.lastSynced) {
      properties['Last Synced'] = this.client.buildDateProperty(updates.lastSynced);
    }

    await this.client.updatePage(pageId, properties);
    logger.info(`Updated knowledge base entry ${pageId}`);
  }

  /**
   * Get entry by GitHub path
   */
  async getByGitHubPath(path: string): Promise<KnowledgeBaseRecord | null> {
    const allEntries = await this.getAllEntries();
    return allEntries.find(entry => entry.entry.githubPath === path) || null;
  }

  /**
   * Publish an entry
   */
  async publishEntry(pageId: string): Promise<void> {
    await this.updateEntry(pageId, { status: 'published' });
    logger.info(`Published knowledge base entry ${pageId}`);
  }

  /**
   * Archive an entry
   */
  async archiveEntry(pageId: string): Promise<void> {
    await this.updateEntry(pageId, { status: 'archived' });
    logger.info(`Archived knowledge base entry ${pageId}`);
  }

  private buildProperties(entry: KnowledgeBaseEntry): Record<string, unknown> {
    const properties: Record<string, unknown> = {
      Name: this.client.buildTitleProperty(entry.title),
      Category: this.client.buildSelectProperty(entry.category),
      Status: this.client.buildSelectProperty(entry.status),
      Tags: this.client.buildMultiSelectProperty(entry.tags),
    };

    if (entry.githubPath) {
      properties['GitHub Path'] = this.client.buildRichTextProperty(entry.githubPath);
    }

    if (entry.lastSynced) {
      properties['Last Synced'] = this.client.buildDateProperty(entry.lastSynced);
    }

    return properties;
  }

  private parseRecord(page: { id: string; properties: Record<string, unknown>; created_time: string; last_edited_time: string }): KnowledgeBaseRecord {
    const props = page.properties as Record<string, {
      type: string;
      title?: NotionRichText[];
      select?: { name: string };
      multi_select?: Array<{ name: string }>;
      rich_text?: NotionRichText[];
      date?: { start: string };
    }>;

    return {
      id: page.id,
      entry: {
        title: props['Name']?.title?.[0]?.text.content || '',
        category: props['Category']?.select?.name || '',
        content: '', // Would need to fetch page content separately
        status: (props['Status']?.select?.name as KnowledgeBaseEntry['status']) || 'draft',
        tags: props['Tags']?.multi_select?.map(s => s.name) || [],
        githubPath: props['GitHub Path']?.rich_text?.[0]?.text.content,
        lastSynced: props['Last Synced']?.date?.start,
      },
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
    };
  }
}
