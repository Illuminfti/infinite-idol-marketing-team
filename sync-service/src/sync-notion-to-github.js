/**
 * Notion → GitHub sync orchestrator
 * Queries Notion for changes and updates GitHub markdown files
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { getSyncState, updateSyncState } = require('./sync-state');
const logger = require('./utils/logger');

const REPO_PATH = process.env.REPO_PATH;

/**
 * NOTE: This sync uses a simplified approach since MCP tools are needed
 * for accessing Notion databases created via MCP integration.
 *
 * For production, implement using Claude Code MCP tools to:
 * 1. Query Notion databases for changed pages
 * 2. Convert Notion content back to markdown
 * 3. Update GitHub files
 * 4. Commit changes
 */

async function syncNotionToGitHub() {
  logger.info('🔄 Starting Notion → GitHub sync');

  try {
    const syncState = getSyncState();
    const lastSyncTime = syncState.notion_to_github.last_sync_timestamp;

    if (!lastSyncTime) {
      logger.info('No previous Notion sync timestamp. Skipping initial sync.');
      logger.info('Notion → GitHub sync should be triggered manually after human edits');
      return;
    }

    logger.info(`Checking for Notion changes since ${lastSyncTime}`);

    // TODO: Implement using MCP tools
    // This requires:
    // 1. mcp__MCP_DOCKER__API-post-database-query to find changed pages
    // 2. mcp__MCP_DOCKER__API-retrieve-a-page to get page content
    // 3. Convert Notion blocks back to markdown
    // 4. Update corresponding GitHub files
    // 5. Git commit with descriptive message

    logger.warn('Notion → GitHub sync requires MCP tool implementation');
    logger.warn('For now, Notion changes should be manually reviewed and synced');

    // Update sync state
    updateSyncState({
      notion_to_github: {
        last_sync_timestamp: new Date().toISOString(),
        last_sync_status: 'skipped - manual sync required'
      }
    });

    logger.info('✅ Notion → GitHub sync check complete');

  } catch (error) {
    logger.error('Notion → GitHub sync failed', { error: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Check for conflicts before updating GitHub
 * Returns true if safe to update, false if conflict detected
 */
function checkForConflicts(filePath, notionContent) {
  try {
    // Check if file was modified in GitHub since last sync
    const syncState = getSyncState();
    const lastSyncCommit = syncState.github_to_notion.last_sync_commit_sha;

    if (!lastSyncCommit) {
      logger.warn('No last sync commit, cannot check for conflicts');
      return true; // Assume safe
    }

    // Get git status for file
    const fullPath = path.join(REPO_PATH, filePath);
    const gitStatus = execSync(`git -C "${REPO_PATH}" status --porcelain "${filePath}"`, { encoding: 'utf-8' });

    if (gitStatus.trim()) {
      logger.warn('File has uncommitted changes in GitHub', { filePath });
      return false; // Conflict
    }

    // Check if file changed since last sync
    const diffOutput = execSync(
      `git -C "${REPO_PATH}" diff ${lastSyncCommit} HEAD -- "${filePath}"`,
      { encoding: 'utf-8' }
    );

    if (diffOutput.trim()) {
      logger.warn('File changed in GitHub since last sync', { filePath });
      return false; // Conflict
    }

    return true; // Safe to update
  } catch (error) {
    logger.error('Error checking for conflicts', { filePath, error: error.message });
    return false; // Assume conflict on error
  }
}

/**
 * Update a GitHub file with content from Notion
 */
function updateGitHubFile(filePath, content) {
  const fullPath = path.join(REPO_PATH, filePath);

  // Check for conflicts first
  if (!checkForConflicts(filePath, content)) {
    logger.error('Conflict detected, cannot auto-update', { filePath });
    throw new Error(`Conflict detected in ${filePath}`);
  }

  // Write file
  fs.writeFileSync(fullPath, content, 'utf-8');
  logger.info('Updated GitHub file', { filePath });

  // Stage file
  execSync(`git -C "${REPO_PATH}" add "${filePath}"`, { encoding: 'utf-8' });
}

/**
 * Commit all staged changes from Notion sync
 */
function commitNotionChanges(changedFiles) {
  if (changedFiles.length === 0) {
    logger.info('No files to commit');
    return;
  }

  const commitMessage = `Sync from Notion: Updated ${changedFiles.length} file(s)

Files updated:
${changedFiles.map(f => `- ${f}`).join('\n')}

Synced by: Notion Integration
Timestamp: ${new Date().toISOString()}`;

  try {
    execSync(`git -C "${REPO_PATH}" commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { encoding: 'utf-8' });
    logger.info('Committed Notion changes', { fileCount: changedFiles.length });
  } catch (error) {
    logger.error('Failed to commit changes', { error: error.message });
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  syncNotionToGitHub()
    .then(() => {
      logger.info('Notion → GitHub sync completed');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Sync failed', { error: error.message });
      process.exit(1);
    });
}

module.exports = { syncNotionToGitHub, updateGitHubFile, commitNotionChanges };
