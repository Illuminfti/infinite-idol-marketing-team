require('dotenv').config();
const path = require('path');
const diffDetector = require('./github/diff-detector');
const { getSyncState, updateSyncState, addConflict } = require('./sync-state');
const logger = require('./utils/logger');

// Parsers
const activityLogParser = require('./parsers/activity-log-parser');
const taskQueueParser = require('./parsers/task-queue-parser');
const decisionLogParser = require('./parsers/decision-log-parser');

// Notion clients
const notionClients = require('./notion');

const REPO_PATH = process.env.REPO_PATH;

/**
 * Main sync orchestrator: GitHub → Notion
 */
async function syncGitHubToNotion() {
  logger.info('🚀 Starting GitHub → Notion sync');

  try {
    // Get current and last synced commit
    const currentCommit = diffDetector.getCurrentCommit(REPO_PATH);
    const syncState = getSyncState();
    const lastCommit = syncState.github_to_notion.last_sync_commit_sha;

    if (!lastCommit) {
      logger.info('No previous sync found. Run historical migration first, or this will sync all files.');
      // For first run, we'll process all files
    } else if (currentCommit === lastCommit) {
      logger.info('No new commits since last sync');
      return;
    }

    logger.info(`Syncing from ${lastCommit || 'beginning'} to ${currentCommit}`);

    // Get changed files
    const changedFiles = lastCommit
      ? diffDetector.getChangedFiles(lastCommit, currentCommit, REPO_PATH)
      : diffDetector.getChangedFiles('HEAD~1', 'HEAD', REPO_PATH); // Just last commit for safety

    if (changedFiles.length === 0) {
      logger.info('No relevant files changed');
      updateSyncState({
        github_to_notion: {
          last_sync_commit_sha: currentCommit,
          last_sync_timestamp: new Date().toISOString()
        }
      });
      return;
    }

    logger.info(`Processing ${changedFiles.length} changed files`);

    let totalCreated = 0;
    let totalUpdated = 0;
    let totalConflicts = 0;

    // Process each file
    for (const file of changedFiles) {
      logger.info(`Processing ${file.path} (${file.status})`);

      try {
        const fileType = diffDetector.getFileType(file.path);
        if (!fileType) {
          logger.warn(`Unknown file type: ${file.path}`);
          continue;
        }

        const filePath = path.join(REPO_PATH, file.path);

        // Skip deleted files
        if (file.status === 'D') {
          logger.info(`File deleted, skipping: ${file.path}`);
          continue;
        }

        const result = await processFile(fileType, filePath);
        totalCreated += result.created;
        totalUpdated += result.updated;
        totalConflicts += result.conflicts;

      } catch (error) {
        logger.error(`Failed to process file ${file.path}`, { error: error.message });
      }
    }

    // Update sync state
    updateSyncState({
      github_to_notion: {
        last_sync_commit_sha: currentCommit,
        last_sync_timestamp: new Date().toISOString()
      }
    });

    logger.info('✅ GitHub → Notion sync complete', {
      created: totalCreated,
      updated: totalUpdated,
      conflicts: totalConflicts
    });

  } catch (error) {
    logger.error('Sync failed', { error: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Process a single file based on its type
 */
async function processFile(fileType, filePath) {
  let created = 0;
  let updated = 0;
  let conflicts = 0;

  switch (fileType) {
    case 'activity-log':
      const activityEntries = activityLogParser.parse(filePath);
      logger.info(`Parsed ${activityEntries.length} activity log entries`);

      for (const entry of activityEntries) {
        try {
          const existing = await notionClients.activityLog.findByEntryId(entry.id);

          if (existing) {
            const result = await notionClients.activityLog.update(existing.id, entry);
            if (result.status === 'conflict') {
              conflicts++;
              addConflict({
                type: 'activity-log',
                entryId: entry.id,
                pageId: existing.id,
                github_version: entry,
                notion_version: existing
              });
            } else {
              updated++;
            }
          } else {
            await notionClients.activityLog.create(entry);
            created++;
          }
        } catch (error) {
          logger.error(`Failed to sync activity entry ${entry.id}`, { error: error.message });
        }
      }
      break;

    case 'task-queue':
      const tasks = taskQueueParser.parse(filePath);
      logger.info(`Parsed ${tasks.length} tasks`);

      for (const task of tasks) {
        try {
          const existing = await notionClients.taskQueue.findByTaskCode(task.taskCode);

          if (existing) {
            await notionClients.taskQueue.update(existing.id, task);
            updated++;
          } else {
            await notionClients.taskQueue.create(task);
            created++;
          }
        } catch (error) {
          logger.error(`Failed to sync task ${task.taskCode}`, { error: error.message });
        }
      }
      break;

    case 'decision-log':
      const decisions = decisionLogParser.parse(filePath);
      logger.info(`Parsed ${decisions.length} decisions`);

      for (const decision of decisions) {
        try {
          const existing = await notionClients.decisionLog.findByDecisionId(decision.decisionId);

          if (existing) {
            await notionClients.decisionLog.update(existing.id, decision);
            updated++;
          } else {
            await notionClients.decisionLog.create(decision);
            created++;
          }
        } catch (error) {
          logger.error(`Failed to sync decision ${decision.decisionId}`, { error: error.message });
        }
      }
      break;

    default:
      logger.warn(`No handler for file type: ${fileType}`);
  }

  return { created, updated, conflicts };
}

// Run if called directly
if (require.main === module) {
  syncGitHubToNotion()
    .then(() => {
      logger.info('Sync completed successfully');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Sync failed', { error: error.message });
      process.exit(1);
    });
}

module.exports = { syncGitHubToNotion };
