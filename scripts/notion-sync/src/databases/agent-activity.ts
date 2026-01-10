import { NotionClient } from '../shared/notion-client';
import { AgentActivityEntry, NotionRichText } from '../shared/types';
import { Logger } from '../shared/logger';

const logger = new Logger('AgentActivityDB');

export interface AgentActivityRecord {
  id: string;
  entry: AgentActivityEntry;
  createdTime: string;
  lastEditedTime: string;
}

export class AgentActivityDatabase {
  private client: NotionClient;
  private databaseId: string;

  constructor(client: NotionClient, databaseId: string) {
    this.client = client;
    this.databaseId = databaseId;
  }

  /**
   * Add a new activity entry
   */
  async addEntry(entry: AgentActivityEntry): Promise<string> {
    const properties = this.buildProperties(entry);
    const pageId = await this.client.createPage(this.databaseId, properties);
    logger.info(`Created activity entry for ${entry.agentName}: ${entry.action}`);
    return pageId;
  }

  /**
   * Get all entries for a specific agent
   */
  async getEntriesByAgent(agentName: string): Promise<AgentActivityRecord[]> {
    const filter = {
      property: 'Agent',
      select: {
        equals: agentName,
      },
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Get entries by status
   */
  async getEntriesByStatus(status: 'success' | 'error' | 'pending'): Promise<AgentActivityRecord[]> {
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
   * Get recent entries
   */
  async getRecentEntries(limit: number = 50): Promise<AgentActivityRecord[]> {
    const pages = await this.client.queryDatabase(this.databaseId);
    const records = pages.map(page => this.parseRecord(page));

    // Sort by timestamp and limit
    return records
      .sort((a, b) => new Date(b.entry.timestamp).getTime() - new Date(a.entry.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Update entry status
   */
  async updateStatus(pageId: string, status: 'success' | 'error' | 'pending'): Promise<void> {
    await this.client.updatePage(pageId, {
      Status: this.client.buildSelectProperty(status),
    });
    logger.info(`Updated activity entry ${pageId} status to ${status}`);
  }

  private buildProperties(entry: AgentActivityEntry): Record<string, unknown> {
    const properties: Record<string, unknown> = {
      Name: this.client.buildTitleProperty(`${entry.agentName}: ${entry.action}`),
      Agent: this.client.buildSelectProperty(entry.agentName),
      Action: this.client.buildRichTextProperty(entry.action),
      Timestamp: this.client.buildDateProperty(entry.timestamp),
      Status: this.client.buildSelectProperty(entry.status),
    };

    if (entry.filesModified.length > 0) {
      properties['Files Modified'] = this.client.buildRichTextProperty(
        entry.filesModified.join(', ')
      );
    }

    if (entry.details) {
      properties['Details'] = this.client.buildRichTextProperty(entry.details);
    }

    return properties;
  }

  private parseRecord(page: { id: string; properties: Record<string, unknown>; created_time: string; last_edited_time: string }): AgentActivityRecord {
    const props = page.properties as Record<string, { type: string; select?: { name: string }; rich_text?: NotionRichText[]; date?: { start: string } }>;

    return {
      id: page.id,
      entry: {
        agentName: props['Agent']?.select?.name || '',
        action: props['Action']?.rich_text?.[0]?.text.content || '',
        timestamp: props['Timestamp']?.date?.start || new Date().toISOString(),
        filesModified: (props['Files Modified']?.rich_text?.[0]?.text.content || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        status: (props['Status']?.select?.name as 'success' | 'error' | 'pending') || 'pending',
        details: props['Details']?.rich_text?.[0]?.text.content,
      },
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
    };
  }
}
