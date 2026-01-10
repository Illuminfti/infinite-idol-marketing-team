import { NotionClient } from '../shared/notion-client';
import { ContentCalendarItem, NotionRichText } from '../shared/types';
import { Logger } from '../shared/logger';

const logger = new Logger('ContentCalendarDB');

export interface ContentCalendarRecord {
  id: string;
  item: ContentCalendarItem;
  createdTime: string;
  lastEditedTime: string;
}

export class ContentCalendarDatabase {
  private client: NotionClient;
  private databaseId: string;

  constructor(client: NotionClient, databaseId: string) {
    this.client = client;
    this.databaseId = databaseId;
  }

  /**
   * Add a new calendar entry
   */
  async addEntry(item: ContentCalendarItem): Promise<string> {
    const properties = this.buildProperties(item);
    const pageId = await this.client.createPage(this.databaseId, properties);
    logger.info(`Created calendar entry for ${item.date}: ${item.contentType}`);
    return pageId;
  }

  /**
   * Get entries for a date range
   */
  async getEntriesForDateRange(startDate: string, endDate: string): Promise<ContentCalendarRecord[]> {
    const filter = {
      and: [
        {
          property: 'Date',
          date: {
            on_or_after: startDate,
          },
        },
        {
          property: 'Date',
          date: {
            on_or_before: endDate,
          },
        },
      ],
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Get entries for today
   */
  async getTodaysEntries(): Promise<ContentCalendarRecord[]> {
    const today = new Date().toISOString().split('T')[0];
    const filter = {
      property: 'Date',
      date: {
        equals: today,
      },
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Get upcoming entries
   */
  async getUpcomingEntries(days: number = 7): Promise<ContentCalendarRecord[]> {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);

    return this.getEntriesForDateRange(
      today.toISOString().split('T')[0],
      futureDate.toISOString().split('T')[0]
    );
  }

  /**
   * Get entries by status
   */
  async getEntriesByStatus(status: ContentCalendarItem['status']): Promise<ContentCalendarRecord[]> {
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
   * Get entries by content type
   */
  async getEntriesByType(contentType: ContentCalendarItem['contentType']): Promise<ContentCalendarRecord[]> {
    const filter = {
      property: 'Content Type',
      select: {
        equals: contentType,
      },
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Update entry status
   */
  async updateStatus(pageId: string, status: ContentCalendarItem['status']): Promise<void> {
    await this.client.updatePage(pageId, {
      Status: this.client.buildSelectProperty(status),
    });
    logger.info(`Updated calendar entry ${pageId} status to ${status}`);
  }

  /**
   * Add performance notes
   */
  async addPerformanceNotes(pageId: string, performance: string): Promise<void> {
    await this.client.updatePage(pageId, {
      Performance: this.client.buildRichTextProperty(performance),
    });
    logger.debug(`Added performance notes to calendar entry ${pageId}`);
  }

  /**
   * Reschedule an entry
   */
  async reschedule(pageId: string, newDate: string): Promise<void> {
    await this.client.updatePage(pageId, {
      Date: this.client.buildDateProperty(newDate),
    });
    logger.info(`Rescheduled calendar entry ${pageId} to ${newDate}`);
  }

  private buildProperties(item: ContentCalendarItem): Record<string, unknown> {
    const properties: Record<string, unknown> = {
      Name: this.client.buildTitleProperty(`${item.date} - ${item.contentType}`),
      Date: this.client.buildDateProperty(item.date),
      'Content Type': this.client.buildSelectProperty(item.contentType),
      Content: this.client.buildRichTextProperty(item.content),
      Status: this.client.buildSelectProperty(item.status),
      Platform: this.client.buildSelectProperty(item.platform),
    };

    if (item.performance) {
      properties['Performance'] = this.client.buildRichTextProperty(item.performance);
    }

    return properties;
  }

  private parseRecord(page: { id: string; properties: Record<string, unknown>; created_time: string; last_edited_time: string }): ContentCalendarRecord {
    const props = page.properties as Record<string, { type: string; title?: NotionRichText[]; select?: { name: string }; rich_text?: NotionRichText[]; date?: { start: string } }>;

    return {
      id: page.id,
      item: {
        date: props['Date']?.date?.start || '',
        contentType: (props['Content Type']?.select?.name as ContentCalendarItem['contentType']) || 'tweet',
        content: props['Content']?.rich_text?.[0]?.text.content || '',
        status: (props['Status']?.select?.name as ContentCalendarItem['status']) || 'draft',
        platform: props['Platform']?.select?.name || '',
        performance: props['Performance']?.rich_text?.[0]?.text.content,
      },
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
    };
  }
}
