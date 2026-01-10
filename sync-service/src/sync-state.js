const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

const STATE_FILE = path.join(__dirname, '../state/sync-state.json');
const BACKUP_FILE = path.join(__dirname, '../state/sync-state.backup.json');

/**
 * Initialize sync state file if it doesn't exist
 */
function initializeSyncState() {
  const initialState = {
    github_to_notion: {
      last_sync_commit_sha: null,
      last_sync_timestamp: null,
      files_synced: {}
    },
    notion_to_github: {
      last_sync_timestamp: null,
      databases: {}
    },
    conflicts: []
  };

  if (!fs.existsSync(STATE_FILE)) {
    logger.info('Creating initial sync state file');
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(initialState, null, 2));
  }

  return initialState;
}

/**
 * Get current sync state
 */
function getSyncState() {
  try {
    if (!fs.existsSync(STATE_FILE)) {
      return initializeSyncState();
    }
    const data = fs.readFileSync(STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Failed to read sync state, using backup', { error: error.message });

    // Try backup
    if (fs.existsSync(BACKUP_FILE)) {
      const backupData = fs.readFileSync(BACKUP_FILE, 'utf-8');
      return JSON.parse(backupData);
    }

    // Initialize new state
    return initializeSyncState();
  }
}

/**
 * Update sync state (with atomic write + backup)
 */
function updateSyncState(updates) {
  try {
    const currentState = getSyncState();

    // Create backup before updating
    if (fs.existsSync(STATE_FILE)) {
      fs.copyFileSync(STATE_FILE, BACKUP_FILE);
    }

    // Merge updates
    const newState = {
      ...currentState,
      github_to_notion: {
        ...currentState.github_to_notion,
        ...updates.github_to_notion
      },
      notion_to_github: {
        ...currentState.notion_to_github,
        ...updates.notion_to_github
      },
      conflicts: updates.conflicts || currentState.conflicts
    };

    // Atomic write: write to temp file, then rename
    const tempFile = STATE_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(newState, null, 2));
    fs.renameSync(tempFile, STATE_FILE);

    logger.info('Sync state updated successfully');
    return newState;
  } catch (error) {
    logger.error('Failed to update sync state', { error: error.message });
    throw error;
  }
}

/**
 * Add a conflict to the state
 */
function addConflict(conflict) {
  const state = getSyncState();
  state.conflicts.push({
    ...conflict,
    id: `CONF-${state.conflicts.length + 1}`.padStart(8, '0'),
    created_at: new Date().toISOString(),
    status: 'pending'
  });

  updateSyncState({ conflicts: state.conflicts });
}

/**
 * Resolve a conflict
 */
function resolveConflict(conflictId, resolution) {
  const state = getSyncState();
  const conflict = state.conflicts.find(c => c.id === conflictId);

  if (!conflict) {
    throw new Error(`Conflict ${conflictId} not found`);
  }

  conflict.status = 'resolved';
  conflict.resolution = resolution;
  conflict.resolved_at = new Date().toISOString();

  updateSyncState({ conflicts: state.conflicts });
}

/**
 * Get pending conflicts
 */
function getPendingConflicts() {
  const state = getSyncState();
  return state.conflicts.filter(c => c.status === 'pending');
}

module.exports = {
  getSyncState,
  updateSyncState,
  initializeSyncState,
  addConflict,
  resolveConflict,
  getPendingConflicts
};
