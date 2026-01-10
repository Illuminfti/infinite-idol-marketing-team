require('dotenv').config();
const path = require('path');
const logger = require('../src/utils/logger');

// Parsers
const activityLogParser = require('../src/parsers/activity-log-parser');
const taskQueueParser = require('../src/parsers/task-queue-parser');
const decisionLogParser = require('../src/parsers/decision-log-parser');

// Notion clients
const notionClients = require('../src/notion');

const REPO_PATH = process.env.REPO_PATH;

/**
 * Migrate all historical data from GitHub to Notion
 */
async function migrateHistoricalData() {
  logger.info('🚀 Starting historical data migration');

  try {
    const stats = {
      activityLog: { created: 0, failed: 0 },
      taskQueue: { created: 0, failed: 0 },
      decisionLog: { created: 0, failed: 0 }
    };

    // 1. Migrate Activity Log
    logger.info('📝 Migrating Activity Log...');
    const activityLogPath = path.join(REPO_PATH, 'logs/agent-activity.md');
    const activityEntries = activityLogParser.parse(activityLogPath);
    logger.info(`Found ${activityEntries.length} activity log entries`);

    for (const entry of activityEntries) {
      try {
        // Check if already exists
        const existing = await notionClients.activityLog.findByEntryId(entry.id);
        if (existing) {
          logger.debug(`Activity entry ${entry.id} already exists, skipping`);
          continue;
        }

        await notionClients.activityLog.create(entry);
        stats.activityLog.created++;

        if (stats.activityLog.created % 10 === 0) {
          logger.info(`Progress: ${stats.activityLog.created}/${activityEntries.length} activity entries`);
        }
      } catch (error) {
        logger.error(`Failed to migrate activity entry ${entry.id}`, { error: error.message });
        stats.activityLog.failed++;
      }
    }

    logger.info(`✅ Activity Log migration complete: ${stats.activityLog.created} created, ${stats.activityLog.failed} failed`);

    // 2. Migrate Task Queue
    logger.info('📋 Migrating Task Queue...');
    const taskQueuePath = path.join(REPO_PATH, 'automation/task-queue.md');
    const tasks = taskQueueParser.parse(taskQueuePath);
    logger.info(`Found ${tasks.length} tasks`);

    for (const task of tasks) {
      try {
        const existing = await notionClients.taskQueue.findByTaskCode(task.taskCode);
        if (existing) {
          logger.debug(`Task ${task.taskCode} already exists, skipping`);
          continue;
        }

        await notionClients.taskQueue.create(task);
        stats.taskQueue.created++;

        if (stats.taskQueue.created % 10 === 0) {
          logger.info(`Progress: ${stats.taskQueue.created}/${tasks.length} tasks`);
        }
      } catch (error) {
        logger.error(`Failed to migrate task ${task.taskCode}`, { error: error.message });
        stats.taskQueue.failed++;
      }
    }

    logger.info(`✅ Task Queue migration complete: ${stats.taskQueue.created} created, ${stats.taskQueue.failed} failed`);

    // 3. Migrate Decision Log
    logger.info('📊 Migrating Decision Log...');
    const decisionLogPath = path.join(REPO_PATH, 'logs/decisions.md');
    const decisions = decisionLogParser.parse(decisionLogPath);
    logger.info(`Found ${decisions.length} decisions`);

    for (const decision of decisions) {
      try {
        const existing = await notionClients.decisionLog.findByDecisionId(decision.decisionId);
        if (existing) {
          logger.debug(`Decision ${decision.decisionId} already exists, skipping`);
          continue;
        }

        await notionClients.decisionLog.create(decision);
        stats.decisionLog.created++;
      } catch (error) {
        logger.error(`Failed to migrate decision ${decision.decisionId}`, { error: error.message });
        stats.decisionLog.failed++;
      }
    }

    logger.info(`✅ Decision Log migration complete: ${stats.decisionLog.created} created, ${stats.decisionLog.failed} failed`);

    // Summary
    logger.info('🎉 Historical data migration complete!');
    logger.info('Summary:', {
      activityLog: stats.activityLog,
      taskQueue: stats.taskQueue,
      decisionLog: stats.decisionLog,
      total: {
        created: stats.activityLog.created + stats.taskQueue.created + stats.decisionLog.created,
        failed: stats.activityLog.failed + stats.taskQueue.failed + stats.decisionLog.failed
      }
    });

    return stats;

  } catch (error) {
    logger.error('Migration failed', { error: error.message, stack: error.stack });
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  migrateHistoricalData()
    .then((stats) => {
      logger.info('Migration completed successfully');
      console.log('\n=== Migration Summary ===');
      console.log(`Activity Log: ${stats.activityLog.created} entries created`);
      console.log(`Task Queue: ${stats.taskQueue.created} tasks created`);
      console.log(`Decision Log: ${stats.decisionLog.created} decisions created`);
      console.log(`Total: ${stats.activityLog.created + stats.taskQueue.created + stats.decisionLog.created} records migrated`);
      process.exit(0);
    })
    .catch(error => {
      logger.error('Migration failed', { error: error.message });
      process.exit(1);
    });
}

module.exports = { migrateHistoricalData };
