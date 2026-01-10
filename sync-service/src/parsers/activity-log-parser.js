const fs = require('fs');
const path = require('path');
const { generateActivityLogEntryId, generateContentHash } = require('../utils/entry-id-generator');
const logger = require('../utils/logger');

/**
 * Parse agent-activity.md into structured entries
 * Handles multiple agent formats including Resident Degen reviews with DS ratings
 */
class ActivityLogParser {
  /**
   * Parse the entire activity log file
   * @param {string} filePath - Path to agent-activity.md
   * @returns {Array} Array of activity log entries
   */
  parse(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return this.parseContent(content);
    } catch (error) {
      logger.error('Failed to parse activity log', { error: error.message, filePath });
      throw error;
    }
  }

  /**
   * Parse activity log content string
   * @param {string} content - Markdown content
   * @returns {Array} Array of activity log entries
   */
  parseContent(content) {
    const entries = [];

    // Split by activity entry headers: ### [YYYY-MM-DD HH:MM] Agent: ##
    // Using positive lookahead to preserve the delimiter
    const sections = content.split(/(?=### \[\d{4}-\d{2}-\d{2} \d{2}:\d{2}\] Agent: \d{2})/);

    for (const section of sections) {
      if (!section.trim()) continue;

      const entry = this.parseEntry(section);
      if (entry) {
        entries.push(entry);
      }
    }

    logger.info(`Parsed ${entries.length} activity log entries`);
    return entries;
  }

  /**
   * Parse a single activity log entry
   */
  parseEntry(section) {
    // Extract timestamp and agent info from header
    const headerMatch = section.match(/### \[(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\] Agent: (\d{2}) - (.+)/);
    if (!headerMatch) {
      return null;
    }

    const [, timestamp, agentNumber, agentNameLine] = headerMatch;

    // Agent name might have additional text after it
    const agentName = agentNameLine.split('\n')[0].trim();

    // Generate entry ID
    const entryId = generateActivityLogEntryId(timestamp, agentNumber);

    // Extract activity type
    const activityTypeMatch = section.match(/\*\*Activity Type\*\*:\s*(.+)/);
    const activityType = activityTypeMatch ? activityTypeMatch[1].trim() : 'Unknown';

    // Extract summary (multi-line, until next ** section)
    const summaryMatch = section.match(/\*\*Summary\*\*:\s*\n([\s\S]*?)(?=\n\*\*|$)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : '';

    // Extract status
    const statusMatch = section.match(/\*\*Status\*\*:\s*(.+)/);
    const status = statusMatch ? statusMatch[1].trim() : 'Complete';

    // Extract files touched
    const filesTouched = [];
    const filesMatch = section.match(/\*\*Files Touched\*\*:\s*\n([\s\S]*?)(?=\n\*\*|$)/);
    if (filesMatch) {
      const fileLines = filesMatch[1].trim().split('\n');
      for (const line of fileLines) {
        const fileMatch = line.match(/^-\s*`?([^`\s]+)`?/);
        if (fileMatch) {
          filesTouched.push(fileMatch[1]);
        }
      }
    }

    // Extract next actions
    const nextActionsMatch = section.match(/\*\*Next Actions\*\*:\s*\n([\s\S]*?)(?=\n\*\*|$)/);
    const nextActions = nextActionsMatch ? nextActionsMatch[1].trim() : '';

    // Extract notes
    const notesMatch = section.match(/\*\*Notes\*\*:\s*\n([\s\S]*?)(?=\n#{3,}|$)/);
    const notes = notesMatch ? notesMatch[1].trim() : '';

    // Check for Resident Degen review specific fields
    let dsRating = null;
    let reviewVerdict = null;

    // DS Rating pattern: DS-X.X or DS-X
    const dsMatch = section.match(/DS-(\d+\.?\d*)/);
    if (dsMatch) {
      dsRating = parseFloat(dsMatch[1]);
    }

    // Verdict patterns
    const verdictPatterns = [
      /\*\*Verdict\*\*:\s*(.+)/,
      /\*\*Decision\*\*:\s*(.+)/,
      /\*\*Overall Assessment\*\*:\s*(.+)/
    ];

    for (const pattern of verdictPatterns) {
      const match = section.match(pattern);
      if (match) {
        const verdictText = match[1].trim();
        // Extract emoji + verdict text
        if (verdictText.includes('APPROVED')) reviewVerdict = 'APPROVED';
        else if (verdictText.includes('NEEDS MORE DEGEN')) reviewVerdict = 'NEEDS MORE DEGEN';
        else if (verdictText.includes('TOO FAR')) reviewVerdict = 'TOO FAR';
        else if (verdictText.includes('ESCALATED')) reviewVerdict = 'ESCALATED';
        break;
      }
    }

    // Extract session ID if present
    const sessionIdMatch = section.match(/\*\*Session ID\*\*:\s*(.+)/);
    const sessionId = sessionIdMatch ? sessionIdMatch[1].trim() : null;

    // Extract related tasks if present
    const relatedTasks = [];
    const tasksMatch = section.match(/\*\*Related Tasks\*\*:\s*\n([\s\S]*?)(?=\n\*\*|$)/);
    if (tasksMatch) {
      const taskLines = tasksMatch[1].trim().split('\n');
      for (const line of taskLines) {
        const taskMatch = line.match(/^-\s*([A-Z]+-\d+)/);
        if (taskMatch) {
          relatedTasks.push(taskMatch[1]);
        }
      }
    }

    // Generate content hash for change detection
    const contentHash = generateContentHash(section);

    return {
      id: entryId,
      timestamp: timestamp.replace(' ', 'T') + ':00Z',
      agentNumber,
      agentName,
      activityType,
      summary,
      status,
      filesTouched,
      nextActions,
      notes,
      dsRating,
      reviewVerdict,
      sessionId,
      relatedTasks,
      fullContent: section.trim(),
      contentHash
    };
  }

  /**
   * Parse only entries from specific line ranges (for incremental sync)
   * @param {string} filePath - Path to agent-activity.md
   * @param {Array} lineRanges - Array of {start, end} line ranges
   * @returns {Array} Array of activity log entries in those ranges
   */
  parseLineRanges(filePath, lineRanges) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let relevantContent = '';
      for (const range of lineRanges) {
        const rangeLines = lines.slice(range.start - 1, range.end);
        relevantContent += rangeLines.join('\n') + '\n';
      }

      // Find complete entry boundaries within the relevant content
      // This ensures we get full entries even if the range only partially captures them
      const allEntries = this.parseContent(content);
      const changedEntries = [];

      // Match entries that overlap with changed line ranges
      for (const entry of allEntries) {
        const entryStart = content.indexOf(entry.fullContent);
        const entryEnd = entryStart + entry.fullContent.length;

        for (const range of lineRanges) {
          const rangeStart = lines.slice(0, range.start - 1).join('\n').length;
          const rangeEnd = lines.slice(0, range.end).join('\n').length;

          // Check if entry overlaps with this range
          if (entryStart <= rangeEnd && entryEnd >= rangeStart) {
            changedEntries.push(entry);
            break;
          }
        }
      }

      logger.info(`Parsed ${changedEntries.length} entries from ${lineRanges.length} line ranges`);
      return changedEntries;
    } catch (error) {
      logger.error('Failed to parse line ranges', { error: error.message, filePath });
      throw error;
    }
  }
}

module.exports = new ActivityLogParser();
