const { Client } = require('@notionhq/client');
const markdownToNotion = require('../converters/markdown-to-notion');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../config/notion-databases.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * Activity Log Notion database client
 */
class ActivityLogClient {
  constructor() {
    this.databaseId = config.activityLog;
  }

  /**
   * Find entry by Entry ID
   */
  async findByEntryId(entryId) {
    try {
      const response = await notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Entry ID',
          title: { equals: entryId }
        }
      });

      return response.results.length > 0 ? response.results[0] : null;
    } catch (error) {
      logger.error('Failed to find activity log entry', { entryId, error: error.message });
      throw error;
    }
  }

  /**
   * Create new activity log entry
   */
  async create(entry) {
    try {
      const properties = {
        'Entry ID': { title: [{ text: { content: entry.id } }] },
        'Timestamp': { date: { start: entry.timestamp } },
        'Agent Number': { select: { name: entry.agentNumber } },
        'Agent Name': { rich_text: [{ text: { content: entry.agentName } }] },
        'Activity Type': { select: { name: entry.activityType } },
        'Summary': { rich_text: [{ text: { content: entry.summary.substring(0, 2000) } }] },
        'Status': { select: { name: entry.status } },
        'Sync Status': { select: { name: 'Synced' } }
      };

      // Optional fields
      if (entry.sessionId) {
        properties['Session ID'] = { rich_text: [{ text: { content: entry.sessionId } }] };
      }

      if (entry.dsRating !== null && entry.dsRating !== undefined) {
        properties['DS Rating'] = { number: entry.dsRating };
      }

      if (entry.reviewVerdict) {
        properties['Review Verdict'] = { select: { name: entry.reviewVerdict } };
      }

      if (entry.filesTouched && entry.filesTouched.length > 0) {
        properties['Files Touched'] = {
          multi_select: entry.filesTouched.slice(0, 10).map(file => ({ name: file.substring(0, 100) }))
        };
      }

      // Convert full content to Notion blocks
      const children = markdownToNotion.convert(entry.fullContent);
      const truncatedChildren = markdownToNotion.truncateIfNeeded(children, 100);

      const page = await notion.pages.create({
        parent: { database_id: this.databaseId },
        properties,
        children: truncatedChildren
      });

      logger.info('Created activity log entry', { entryId: entry.id, pageId: page.id });
      return page.id;
    } catch (error) {
      logger.error('Failed to create activity log entry', { entryId: entry.id, error: error.message });
      throw error;
    }
  }

  /**
   * Update existing activity log entry
   */
  async update(pageId, entry) {
    try {
      // Check if last edited by human
      const existingPage = await notion.pages.retrieve({ page_id: pageId });
      const lastEditedBy = existingPage.last_edited_by;

      if (lastEditedBy.type === 'person') {
        logger.warn('Activity log entry was edited by human, potential conflict', { pageId, entryId: entry.id });
        return { status: 'conflict', pageId };
      }

      // Safe to update
      const properties = {
        'Timestamp': { date: { start: entry.timestamp } },
        'Summary': { rich_text: [{ text: { content: entry.summary.substring(0, 2000) } }] },
        'Status': { select: { name: entry.status } },
        'Sync Status': { select: { name: 'Synced' } }
      };

      if (entry.dsRating !== null && entry.dsRating !== undefined) {
        properties['DS Rating'] = { number: entry.dsRating };
      }

      if (entry.reviewVerdict) {
        properties['Review Verdict'] = { select: { name: entry.reviewVerdict } };
      }

      await notion.pages.update({
        page_id: pageId,
        properties
      });

      logger.info('Updated activity log entry', { entryId: entry.id, pageId });
      return { status: 'updated', pageId };
    } catch (error) {
      logger.error('Failed to update activity log entry', { pageId, error: error.message });
      throw error;
    }
  }

  /**
   * Get all pages (for Notion → GitHub sync)
   */
  async getAllPages() {
    try {
      const pages = [];
      let cursor = undefined;

      while (true) {
        const response = await notion.databases.query({
          database_id: this.databaseId,
          start_cursor: cursor,
          page_size: 100
        });

        pages.push(...response.results);

        if (!response.has_more) break;
        cursor = response.next_cursor;
      }

      logger.info(`Retrieved ${pages.length} activity log pages`);
      return pages;
    } catch (error) {
      logger.error('Failed to get all activity log pages', { error: error.message });
      throw error;
    }
  }

  /**
   * Get pages changed since timestamp
   */
  async getChangedSince(timestamp) {
    try {
      const response = await notion.databases.query({
        database_id: this.databaseId,
        filter: {
          timestamp: 'last_edited_time',
          last_edited_time: { after: timestamp }
        },
        sorts: [{ timestamp: 'last_edited_time', direction: 'ascending' }]
      });

      logger.info(`Found ${response.results.length} activity log changes since ${timestamp}`);
      return response.results;
    } catch (error) {
      logger.error('Failed to get changed activity log pages', { error: error.message });
      throw error;
    }
  }
}

module.exports = new ActivityLogClient();
