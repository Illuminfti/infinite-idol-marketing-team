const { execSync } = require('child_process');
const logger = require('../utils/logger');

/**
 * Detect changed files using git diff
 */
class DiffDetector {
  /**
   * Get list of changed files between two commits
   */
  getChangedFiles(fromCommit, toCommit = 'HEAD', repoPath = process.env.REPO_PATH) {
    try {
      const command = `git -C "${repoPath}" diff --name-status ${fromCommit} ${toCommit}`;
      const output = execSync(command, { encoding: 'utf-8' });

      const files = [];
      const lines = output.trim().split('\n').filter(Boolean);

      for (const line of lines) {
        const [status, ...pathParts] = line.split('\t');
        const filePath = pathParts.join('\t'); // Handle paths with tabs

        // Only include files we care about
        if (this.shouldSync(filePath)) {
          files.push({
            status, // M=Modified, A=Added, D=Deleted
            path: filePath
          });
        }
      }

      logger.info(`Found ${files.length} changed files`, { fromCommit, toCommit });
      return files;
    } catch (error) {
      logger.error('Failed to get changed files', { error: error.message });
      throw error;
    }
  }

  /**
   * Get changed line ranges for a specific file
   */
  getChangedLineRanges(filePath, fromCommit, toCommit = 'HEAD', repoPath = process.env.REPO_PATH) {
    try {
      const command = `git -C "${repoPath}" diff -U0 ${fromCommit} ${toCommit} -- "${filePath}"`;
      const output = execSync(command, { encoding: 'utf-8' });

      const ranges = [];
      const regex = /@@ -\d+,?\d* \+(\d+),?(\d+)? @@/g;
      let match;

      while ((match = regex.exec(output)) !== null) {
        const start = parseInt(match[1]);
        const count = parseInt(match[2] || 1);
        ranges.push({ start, end: start + count });
      }

      logger.debug(`Found ${ranges.length} changed line ranges for ${filePath}`);
      return ranges;
    } catch (error) {
      // File might be new or deleted, return empty ranges
      logger.debug(`No line ranges for ${filePath}`, { error: error.message });
      return [];
    }
  }

  /**
   * Get current git commit SHA
   */
  getCurrentCommit(repoPath = process.env.REPO_PATH) {
    try {
      const command = `git -C "${repoPath}" rev-parse HEAD`;
      const sha = execSync(command, { encoding: 'utf-8' }).trim();
      return sha;
    } catch (error) {
      logger.error('Failed to get current commit', { error: error.message });
      throw error;
    }
  }

  /**
   * Check if file should be synced to Notion
   */
  shouldSync(filePath) {
    const syncPaths = [
      'logs/agent-activity.md',
      'logs/decisions.md',
      'automation/task-queue.md',
      'outputs/calendar/master-calendar.md',
      'reviews/pending-human-review.md'
    ];

    // Check exact matches
    if (syncPaths.includes(filePath)) {
      return true;
    }

    // Check patterns
    if (filePath.startsWith('knowledge-base/') && filePath.endsWith('.md')) {
      return true;
    }

    if (filePath.startsWith('agents/') && filePath.endsWith('.md')) {
      return true;
    }

    return false;
  }

  /**
   * Get file type for parser selection
   */
  getFileType(filePath) {
    if (filePath === 'logs/agent-activity.md') return 'activity-log';
    if (filePath === 'logs/decisions.md') return 'decision-log';
    if (filePath === 'automation/task-queue.md') return 'task-queue';
    if (filePath === 'outputs/calendar/master-calendar.md') return 'content-calendar';
    if (filePath === 'reviews/pending-human-review.md') return 'reviews';
    if (filePath.startsWith('knowledge-base/')) return 'knowledge-base';
    if (filePath.startsWith('agents/')) return 'agent-registry';
    return null;
  }
}

module.exports = new DiffDetector();
