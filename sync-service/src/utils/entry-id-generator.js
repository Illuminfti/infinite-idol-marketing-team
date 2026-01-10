const crypto = require('crypto');

/**
 * Generates a unique Entry ID for an activity log entry
 * Format: ACTIVITY-YYYYMMDD-HHMM-AGENT##
 */
function generateActivityLogEntryId(timestamp, agentNumber) {
  const dateStr = timestamp.replace(/[^\d]/g, '').substring(0, 12); // YYYYMMDDHHmm
  const agentStr = agentNumber.padStart(2, '0');
  return `ACTIVITY-${dateStr}-${agentStr}`;
}

/**
 * Generates a unique Task ID
 * Format: AGENT-PREFIX-###
 */
function generateTaskId(agentPrefix, sequence) {
  return `${agentPrefix}-${sequence.toString().padStart(3, '0')}`;
}

/**
 * Generates a unique Decision ID
 * Format: DEC-### or DEC-DOMAIN-###
 */
function generateDecisionId(domain = null, sequence) {
  if (domain) {
    return `DEC-${domain.toUpperCase()}-${sequence.toString().padStart(3, '0')}`;
  }
  return `DEC-${sequence.toString().padStart(3, '0')}`;
}

/**
 * Generates a content hash for change detection
 */
function generateContentHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 12);
}

/**
 * Generates a sync ID for tracking sync operations
 * Format: sync-YYYYMMDDHHMMSS-hash
 */
function generateSyncId() {
  const timestamp = new Date().toISOString().replace(/[^\d]/g, '').substring(0, 14);
  const randomHash = crypto.randomBytes(3).toString('hex');
  return `sync-${timestamp}-${randomHash}`;
}

module.exports = {
  generateActivityLogEntryId,
  generateTaskId,
  generateDecisionId,
  generateContentHash,
  generateSyncId
};
