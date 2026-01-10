import { NotionClient } from '../shared/notion-client';
import { TweetQueueItem, NotionRichText } from '../shared/types';
import { Logger } from '../shared/logger';

const logger = new Logger('TweetQueueDB');

export interface TweetQueueRecord {
  id: string;
  item: TweetQueueItem;
  createdTime: string;
  lastEditedTime: string;
}

export class TweetQueueDatabase {
  private client: NotionClient;
  private databaseId: string;

  constructor(client: NotionClient, databaseId: string) {
    this.client = client;
    this.databaseId = databaseId;
  }

  /**
   * Add a new tweet to the queue
   */
  async addTweet(item: TweetQueueItem): Promise<string> {
    const properties = this.buildProperties(item);
    const pageId = await this.client.createPage(this.databaseId, properties);
    logger.info(`Created tweet: ${item.tweetText.substring(0, 50)}...`);
    return pageId;
  }

  /**
   * Get all draft tweets
   */
  async getDraftTweets(): Promise<TweetQueueRecord[]> {
    return this.getTweetsByStatus('draft');
  }

  /**
   * Get approved tweets ready for scheduling
   */
  async getApprovedTweets(): Promise<TweetQueueRecord[]> {
    return this.getTweetsByStatus('approved');
  }

  /**
   * Get scheduled tweets
   */
  async getScheduledTweets(): Promise<TweetQueueRecord[]> {
    return this.getTweetsByStatus('scheduled');
  }

  /**
   * Get tweets by status
   */
  async getTweetsByStatus(status: TweetQueueItem['status']): Promise<TweetQueueRecord[]> {
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
   * Get tweets by pillar
   */
  async getTweetsByPillar(pillar: TweetQueueItem['pillar']): Promise<TweetQueueRecord[]> {
    const filter = {
      property: 'Pillar',
      select: {
        equals: pillar,
      },
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  /**
   * Approve a tweet
   */
  async approveTweet(pageId: string): Promise<void> {
    await this.client.updatePage(pageId, {
      Status: this.client.buildSelectProperty('approved'),
    });
    logger.info(`Approved tweet ${pageId}`);
  }

  /**
   * Schedule a tweet
   */
  async scheduleTweet(pageId: string, scheduledDate: string): Promise<void> {
    await this.client.updatePage(pageId, {
      Status: this.client.buildSelectProperty('scheduled'),
      'Scheduled Date': this.client.buildDateProperty(scheduledDate),
    });
    logger.info(`Scheduled tweet ${pageId} for ${scheduledDate}`);
  }

  /**
   * Mark tweet as posted
   */
  async markAsPosted(pageId: string): Promise<void> {
    await this.client.updatePage(pageId, {
      Status: this.client.buildSelectProperty('posted'),
    });
    logger.info(`Marked tweet ${pageId} as posted`);
  }

  /**
   * Update engagement metrics
   */
  async updateMetrics(
    pageId: string,
    metrics: { likes?: number; retweets?: number; replies?: number }
  ): Promise<void> {
    const metricsString = `Likes: ${metrics.likes || 0}, RTs: ${metrics.retweets || 0}, Replies: ${metrics.replies || 0}`;
    await this.client.updatePage(pageId, {
      Metrics: this.client.buildRichTextProperty(metricsString),
    });
    logger.debug(`Updated metrics for tweet ${pageId}`);
  }

  /**
   * Get tweets due for posting
   */
  async getTweetsDueForPosting(): Promise<TweetQueueRecord[]> {
    const now = new Date().toISOString();
    const filter = {
      and: [
        {
          property: 'Status',
          select: {
            equals: 'scheduled',
          },
        },
        {
          property: 'Scheduled Date',
          date: {
            on_or_before: now,
          },
        },
      ],
    };

    const pages = await this.client.queryDatabase(this.databaseId, filter);
    return pages.map(page => this.parseRecord(page));
  }

  private buildProperties(item: TweetQueueItem): Record<string, unknown> {
    const properties: Record<string, unknown> = {
      Name: this.client.buildTitleProperty(item.tweetText.substring(0, 100)),
      'Tweet Text': this.client.buildRichTextProperty(item.tweetText),
      Pillar: this.client.buildSelectProperty(item.pillar),
      'Created By': this.client.buildSelectProperty(item.createdBy),
      Status: this.client.buildSelectProperty(item.status),
    };

    if (item.scheduledDate) {
      properties['Scheduled Date'] = this.client.buildDateProperty(item.scheduledDate);
    }

    return properties;
  }

  private parseRecord(page: { id: string; properties: Record<string, unknown>; created_time: string; last_edited_time: string }): TweetQueueRecord {
    const props = page.properties as Record<string, { type: string; title?: NotionRichText[]; select?: { name: string }; rich_text?: NotionRichText[]; date?: { start: string } }>;

    const metricsText = props['Metrics']?.rich_text?.[0]?.text.content || '';
    const metricsMatch = metricsText.match(/Likes: (\d+), RTs: (\d+), Replies: (\d+)/);

    return {
      id: page.id,
      item: {
        tweetText: props['Tweet Text']?.rich_text?.[0]?.text.content || '',
        pillar: (props['Pillar']?.select?.name as TweetQueueItem['pillar']) || 'engagement',
        createdBy: props['Created By']?.select?.name || '',
        scheduledDate: props['Scheduled Date']?.date?.start,
        status: (props['Status']?.select?.name as TweetQueueItem['status']) || 'draft',
        engagementMetrics: metricsMatch ? {
          likes: parseInt(metricsMatch[1], 10),
          retweets: parseInt(metricsMatch[2], 10),
          replies: parseInt(metricsMatch[3], 10),
        } : undefined,
      },
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
    };
  }
}
