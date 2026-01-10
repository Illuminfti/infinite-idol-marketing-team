/**
 * Historical data migration using direct MCP tool calls
 * This script outputs commands that should be executed via Claude Code's MCP integration
 */

require('dotenv').config();
const path = require('path');
const logger = require('../src/utils/logger');

// Parsers
const activityLogParser = require('../src/parsers/activity-log-parser');
const taskQueueParser = require('../src/parsers/task-queue-parser');
const decisionLogParser = require('../src/parsers/decision-log-parser');

const REPO_PATH = process.env.REPO_PATH;

async function prepareDataForMigration() {
  logger.info('📊 Preparing data for migration');

  // Parse all data
  const activityLogPath = path.join(REPO_PATH, 'logs/agent-activity.md');
  const activityEntries = activityLogParser.parse(activityLogPath);
  logger.info(`Found ${activityEntries.length} activity log entries`);

  const taskQueuePath = path.join(REPO_PATH, 'automation/task-queue.md');
  const tasks = taskQueueParser.parse(taskQueuePath);
  logger.info(`Found ${tasks.length} tasks`);

  const decisionLogPath = path.join(REPO_PATH, 'logs/decisions.md');
  const decisions = decisionLogParser.parse(decisionLogPath);
  logger.info(`Found ${decisions.length} decisions`);

  return {
    activityEntries,
    tasks,
    decisions
  };
}

if (require.main === module) {
  prepareDataForMigration()
    .then(data => {
      console.log('\n=== Migration Data Prepared ===');
      console.log(`Activity Entries: ${data.activityEntries.length}`);
      console.log(`Tasks: ${data.tasks.length}`);
      console.log(`Decisions: ${data.decisions.length}`);

      // Save data for external migration
      const fs = require('fs');
      fs.writeFileSync(
        path.join(__dirname, '../state/migration-data.json'),
        JSON.stringify(data, null, 2)
      );
      console.log('\nData saved to state/migration-data.json');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Preparation failed', { error: error.message });
      process.exit(1);
    });
}

module.exports = { prepareDataForMigration };
