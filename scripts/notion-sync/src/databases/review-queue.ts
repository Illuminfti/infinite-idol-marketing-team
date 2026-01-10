import { NotionClient } from '../shared/notion-client';
import { ReviewQueueItem, NotionRichText } from '../shared/types';
import { Logger } from '../shared/logger';

const logger = new Logger('ReviewQueueDB');

export interface ReviewQueueRecord {
  id: string;
  item: ReviewQueueItem;
  createdTime: string;
  lastEditedTime: string;
}

export class ReviewQueueDatabase {
  private client: NotionClient;
  private databaseId: string;

  constructor(client: NotionClient, databaseId: string) {
    this.client = client;
    this.databaseId = databaseId;
  }

  /**
   * Add a new review item
   */
  async addItem(item: ReviewQueueItem): Promise<string> {
    const properties = this.buildProperties(item);
    const content = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: item.content } }],
        },
      },
    ];

    const pageId = await this.client.createPage(this.databaseId, properties, content);
    logger.info(`Created review item: ${item.title}`);
    return pageId;
  }

  /**
   * Get all pending items
   */
  async getPendingItems(): Promise<ReviewQueueRecord[]> {
    return this.getItemsByStatus('pending');
  }

  /**
   * Get approved items
   */
  async getApprovedItems(): Promise<ReviewQueueRecord[]> {
    return this.getItemsByStatus('approved');
  }

  /**
   * Get items by status
   */
  async getItemsByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<ReviewQueueRecord[]> {
    const filter = {
      property: 'Status',
      select: {
        equals: status,
      },
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Get items by category
   */
  async getItemsByCategory(category: string): Promise<ReviewQueueRecord[]> {
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
   * Get high priority items
   */
  async getHighPriorityItems(): Promise<ReviewQueueRecord[]> {
    const filter = {
      and: [
        {
          property: 'Priority',
          select: {
            equals: 'high',
          },
        },
        {
          property: 'Status',
          select: {
            equals: 'pending',
          },
        },
      ],
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Approve an item
   */
  async approveItem(pageId: string, notes?: string): Promise<void> {
    const properties: Record<string, unknown> = {
      Status: this.client.buildSelectProperty('approved'),
    };

    if (notes) {
      properties['Human Notes'] = this.client.buildRichTextProperty(notes);
    }

    await this.client.updatePage(pageId, properties);
    logger.info(`Approved review item ${pageId}`);
  }

  /**
   * Reject an item
   */
  async rejectItem(pageId: string, reason: string): Promise<void> {
    await this.client.updatePage(pageId, {
      Status: this.client.buildSelectProperty('rejected'),
      'Human Notes': this.client.buildRichTextProperty(reason),
    });
    logger.info(`Rejected review item ${pageId}`);
  }

  /**
   * Update item status
   */
  async updateStatus(pageId: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> {
    await this.client.updatePage(pageId, {
      Status: this.client.buildSelectProperty(status),
    });
    logger.info(`Updated review item ${pageId} status to ${status}`);
  }

  private buildProperties(item: ReviewQueueItem): Record<string, unknown> {
    const properties: Record<string, unknown> = {
      Name: this.client.buildTitleProperty(item.title),
      'Submitted By': this.client.buildSelectProperty(item.submittedBy),
      Category: this.client.buildSelectProperty(item.category),
      Priority: this.client.buildSelectProperty(item.priority),
      Status: this.client.buildSelectProperty(item.status),
    };

    if (item.githubPath) {
      properties['GitHub Path'] = this.client.buildRichTextProperty(item.githubPath);
    }

    if (item.humanNotes) {
      properties['Human Notes'] = this.client.buildRichTextProperty(item.humanNotes);
    }

    return properties;
  }

  private parseRecord(page: { id: string; properties: Record<string, unknown>; created_time: string; last_edited_time: string }): ReviewQueueRecord {
    const props = page.properties as Record<string, { type: string; title?: NotionRichText[]; select?: { name: string }; rich_text?: NotionRichText[] }>;

    return {
      id: page.id,
      item: {
        title: props['Name']?.title?.[0]?.text.content || '',
        submittedBy: props['Submitted By']?.select?.name || '',
        category: (props['Category']?.select?.name as ReviewQueueItem['category']) || 'other',
        priority: (props['Priority']?.select?.name as ReviewQueueItem['priority']) || 'medium',
        status: (props['Status']?.select?.name as ReviewQueueItem['status']) || 'pending',
        content: '', // Would need to fetch page content separately
        githubPath: props['GitHub Path']?.rich_text?.[0]?.text.content,
        humanNotes: props['Human Notes']?.rich_text?.[0]?.text.content,
      },
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
    };
  }
}
