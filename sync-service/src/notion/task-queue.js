const { Client } = require('@notionhq/client');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../config/notion-databases.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const notion = new Client({ auth: process.env.NOTION_API_KEY });

class TaskQueueClient {
  constructor() {
    this.databaseId = config.taskQueue;
  }

  async findByTaskCode(taskCode) {
    try {
      const response = await notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Task Code',
          title: { equals: taskCode }
        }
      });

      return response.results.length > 0 ? response.results[0] : null;
    } catch (error) {
      logger.error('Failed to find task', { taskCode, error: error.message });
      throw error;
    }
  }

  async create(task) {
    try {
      const properties = {
        'Task Code': { title: [{ text: { content: task.taskCode } }] },
        'Title': { rich_text: [{ text: { content: task.title.substring(0, 2000) } }] },
        'Description': { rich_text: [{ text: { content: task.description.substring(0, 2000) } }] },
        'Status': { select: { name: task.status } },
        'Priority': { select: { name: task.priority } },
        'Sync Status': { select: { name: 'Synced' } }
      };

      if (task.taskType) {
        properties['Task Type'] = { select: { name: task.taskType } };
      }

      if (task.contentType) {
        properties['Content Type'] = { select: { name: task.contentType } };
      }

      if (task.assignedAgent) {
        properties['Assigned Agent'] = {
          rich_text: [{ text: { content: `${task.assignedAgent.number} - ${task.assignedAgent.role}` } }]
        };
      }

      if (task.created) {
        properties['Created'] = { date: { start: task.created } };
      }

      if (task.due) {
        properties['Due'] = { date: { start: task.due } };
      }

      if (task.notes) {
        properties['Notes'] = { rich_text: [{ text: { content: task.notes.substring(0, 2000) } }] };
      }

      const page = await notion.pages.create({
        parent: { database_id: this.databaseId },
        properties
      });

      logger.info('Created task', { taskCode: task.taskCode, pageId: page.id });
      return page.id;
    } catch (error) {
      logger.error('Failed to create task', { taskCode: task.taskCode, error: error.message });
      throw error;
    }
  }

  async update(pageId, task) {
    try {
      const properties = {
        'Title': { rich_text: [{ text: { content: task.title.substring(0, 2000) } }] },
        'Status': { select: { name: task.status } },
        'Priority': { select: { name: task.priority } },
        'Sync Status': { select: { name: 'Synced' } }
      };

      if (task.notes) {
        properties['Notes'] = { rich_text: [{ text: { content: task.notes.substring(0, 2000) } }] };
      }

      await notion.pages.update({
        page_id: pageId,
        properties
      });

      logger.info('Updated task', { taskCode: task.taskCode, pageId });
      return { status: 'updated', pageId };
    } catch (error) {
      logger.error('Failed to update task', { pageId, error: error.message });
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

      logger.info(`Retrieved ${pages.length} task pages`);
      return pages;
    } catch (error) {
      logger.error('Failed to get all task pages', { error: error.message });
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
      logger.error('Failed to get changed tasks', { error: error.message });
      throw error;
    }
  }
}

module.exports = new TaskQueueClient();
