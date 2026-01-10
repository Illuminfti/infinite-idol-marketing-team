const { Client } = require('@notionhq/client');
const markdownToNotion = require('../converters/markdown-to-notion');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../config/notion-databases.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const notion = new Client({ auth: process.env.NOTION_API_KEY });

class DecisionLogClient {
  constructor() {
    this.databaseId = config.decisionLog;
  }

  async findByDecisionId(decisionId) {
    try {
      const response = await notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Decision ID',
          title: { equals: decisionId }
        }
      });

      return response.results.length > 0 ? response.results[0] : null;
    } catch (error) {
      logger.error('Failed to find decision', { decisionId, error: error.message });
      throw error;
    }
  }

  async create(decision) {
    try {
      const properties = {
        'Decision ID': { title: [{ text: { content: decision.decisionId } }] },
        'Date': { date: { start: decision.date } },
        'Title': { rich_text: [{ text: { content: decision.title.substring(0, 2000) } }] },
        'Decision Type': { select: { name: decision.decisionType } },
        'Priority': { select: { name: decision.priority } },
        'Status': { select: { name: decision.status } },
        'Context': { rich_text: [{ text: { content: decision.context.substring(0, 2000) } }] },
        'Decision': { rich_text: [{ text: { content: decision.decision.substring(0, 2000) } }] },
        'Rationale': { rich_text: [{ text: { content: decision.rationale.substring(0, 2000) } }] },
        'Human Approval': { select: { name: decision.humanApproval.status } },
        'Sync Status': { select: { name: 'Synced' } }
      };

      if (decision.decidedBy && decision.decidedBy.raw) {
        properties['Decided By Agent'] = {
          rich_text: [{ text: { content: decision.decidedBy.raw } }]
        };
      }

      if (decision.alternatives) {
        properties['Alternatives'] = {
          rich_text: [{ text: { content: decision.alternatives.substring(0, 2000) } }]
        };
      }

      if (decision.affectedFiles && decision.affectedFiles.length > 0) {
        properties['Affected Files'] = {
          multi_select: decision.affectedFiles.slice(0, 10).map(file => ({ name: file.substring(0, 100) }))
        };
      }

      if (decision.humanApproval.date) {
        properties['Human Approval Date'] = { date: { start: decision.humanApproval.date } };
      }

      // Add full content as page body
      const children = markdownToNotion.convert(decision.fullContent);
      const truncatedChildren = markdownToNotion.truncateIfNeeded(children, 100);

      const page = await notion.pages.create({
        parent: { database_id: this.databaseId },
        properties,
        children: truncatedChildren
      });

      logger.info('Created decision', { decisionId: decision.decisionId, pageId: page.id });
      return page.id;
    } catch (error) {
      logger.error('Failed to create decision', { decisionId: decision.decisionId, error: error.message });
      throw error;
    }
  }

  async update(pageId, decision) {
    try {
      const properties = {
        'Status': { select: { name: decision.status } },
        'Human Approval': { select: { name: decision.humanApproval.status } },
        'Sync Status': { select: { name: 'Synced' } }
      };

      await notion.pages.update({
        page_id: pageId,
        properties
      });

      logger.info('Updated decision', { decisionId: decision.decisionId, pageId });
      return { status: 'updated', pageId };
    } catch (error) {
      logger.error('Failed to update decision', { pageId, error: error.message });
      throw error;
    }
  }

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

      logger.info(`Retrieved ${pages.length} decision pages`);
      return pages;
    } catch (error) {
      logger.error('Failed to get all decision pages', { error: error.message });
      throw error;
    }
  }

  async getChangedSince(timestamp) {
    try {
      const response = await notion.databases.query({
        database_id: this.databaseId,
        filter: {
          timestamp: 'last_edited_time',
          last_edited_time: { after: timestamp }
        }
      });

      return response.results;
    } catch (error) {
      logger.error('Failed to get changed decisions', { error: error.message });
      throw error;
    }
  }
}

module.exports = new DecisionLogClient();
