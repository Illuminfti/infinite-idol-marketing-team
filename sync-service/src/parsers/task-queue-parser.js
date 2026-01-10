const fs = require('fs');
const { generateContentHash } = require('../utils/entry-id-generator');
const logger = require('../utils/logger');

/**
 * Parse task-queue.md into structured task entries
 * Extracts task rows from markdown tables
 */
class TaskQueueParser {
  /**
   * Parse the entire task queue file
   * @param {string} filePath - Path to task-queue.md
   * @returns {Array} Array of task entries
   */
  parse(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return this.parseContent(content);
    } catch (error) {
      logger.error('Failed to parse task queue', { error: error.message, filePath });
      throw error;
    }
  }

  /**
   * Parse task queue content string
   * @param {string} content - Markdown content
   * @returns {Array} Array of task entries
   */
  parseContent(content) {
    const tasks = [];

    // Split content by agent sections (## ... Queue)
    const sections = content.split(/(?=## .+ Queue \(Agent \d+\))/);

    for (const section of sections) {
      if (!section.trim()) continue;

      // Extract agent info from section header
      const agentMatch = section.match(/## (.+) Queue \(Agent (\d+)\)/);
      if (!agentMatch) continue;

      const [, agentRole, agentNumber] = agentMatch;

      // Find all table rows in this section
      const tableTasks = this.parseTable(section, agentNumber, agentRole);
      tasks.push(...tableTasks);
    }

    logger.info(`Parsed ${tasks.length} tasks from task queue`);
    return tasks;
  }

  /**
   * Parse tasks from a markdown table in a section
   */
  parseTable(section, agentNumber, agentRole) {
    const tasks = [];

    // Find all table rows (lines starting with |)
    const lines = section.split('\n');
    let inTable = false;
    let headerPassed = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Start of table
      if (trimmed.startsWith('| ID |') || trimmed.startsWith('| **ID** |')) {
        inTable = true;
        headerPassed = false;
        continue;
      }

      // Table separator (|---|---|)
      if (trimmed.match(/^\|[\s-:|]+\|$/)) {
        headerPassed = true;
        continue;
      }

      // End of table (empty line or new section)
      if (!trimmed.startsWith('|') && inTable) {
        inTable = false;
        headerPassed = false;
        continue;
      }

      // Parse data rows
      if (inTable && headerPassed && trimmed.startsWith('|')) {
        const task = this.parseTableRow(trimmed, agentNumber, agentRole);
        if (task) {
          tasks.push(task);
        }
      }
    }

    return tasks;
  }

  /**
   * Parse a single table row into a task object
   */
  parseTableRow(row, agentNumber, agentRole) {
    // Split by | and clean up
    const cells = row.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);

    if (cells.length < 6) {
      return null; // Not enough columns
    }

    const [id, priority, task, status, created, due, ...notesCells] = cells;

    // Skip header-like rows or section dividers
    if (id.includes('VIBING OVERHAUL') || id.includes('REGULAR TASKS') || id.includes('**')) {
      return null;
    }

    // Skip rows with no actual task ID
    if (!id.match(/^[A-Z]+-[A-Z]*-?\d+$/)) {
      return null;
    }

    // Determine task type from prefix
    const taskType = this.getTaskType(id, task);

    // Clean up markdown formatting
    const cleanTask = task.replace(/\*\*/g, '').replace(/\[|\]/g, '').trim();
    const cleanStatus = status.replace(/`/g, '').trim();
    const cleanPriority = priority.replace(/`/g, '').trim();

    // Join notes cells (in case notes contain |)
    const notes = notesCells.join('|').trim();

    // Extract emojis from notes
    const hasCheckmark = notes.includes('✅');
    const hasWarning = notes.includes('⚠️');

    // Generate content hash
    const contentHash = generateContentHash(row);

    return {
      id: id.trim(),
      taskCode: id.trim(),
      title: cleanTask,
      description: cleanTask, // Full description would need separate field in markdown
      taskType,
      contentType: this.inferContentType(cleanTask),
      status: this.normalizeStatus(cleanStatus),
      priority: cleanPriority,
      assignedAgent: {
        number: agentNumber,
        role: agentRole
      },
      created: created.trim() || null,
      due: due.trim() || null,
      notes,
      hasCheckmark,
      hasWarning,
      contentHash
    };
  }

  /**
   * Normalize status values
   */
  normalizeStatus(status) {
    const statusUpper = status.toUpperCase();
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'BLOCKED', 'REVIEW', 'COMPLETE', 'ESCALATED', 'DEFERRED', 'CANCELLED'];

    for (const validStatus of validStatuses) {
      if (statusUpper.includes(validStatus)) {
        return validStatus;
      }
    }

    return 'PENDING'; // Default
  }

  /**
   * Determine task type from ID prefix and content
   */
  getTaskType(id, task) {
    if (id.includes('VIB')) return 'Project';
    if (task.toLowerCase().includes('review')) return 'Review';
    if (task.toLowerCase().includes('create') || task.toLowerCase().includes('draft')) return 'Content';
    if (task.toLowerCase().includes('plan') || task.toLowerCase().includes('strategy')) return 'Planning';
    if (task.toLowerCase().includes('research') || task.toLowerCase().includes('analyze')) return 'Research';
    if (task.toLowerCase().includes('coordination') || task.toLowerCase().includes('orchestration')) return 'Coordination';

    return 'Task';
  }

  /**
   * Infer content type from task description
   */
  inferContentType(task) {
    const taskLower = task.toLowerCase();

    if (taskLower.includes('tweet')) return 'Tweet';
    if (taskLower.includes('thread')) return 'Thread';
    if (taskLower.includes('discord')) return 'Discord';
    if (taskLower.includes('banner') || taskLower.includes('gacha')) return 'Banner';
    if (taskLower.includes('article') || taskLower.includes('post')) return 'Article';
    if (taskLower.includes('prompt')) return 'Prompt';
    if (taskLower.includes('analysis') || taskLower.includes('report')) return 'Analysis';

    return null;
  }

  /**
   * Extract tasks assigned to a specific agent
   */
  getTasksByAgent(filePath, agentNumber) {
    const allTasks = this.parse(filePath);
    return allTasks.filter(task => task.assignedAgent.number === agentNumber);
  }

  /**
   * Extract tasks with specific status
   */
  getTasksByStatus(filePath, status) {
    const allTasks = this.parse(filePath);
    return allTasks.filter(task => task.status === status.toUpperCase());
  }

  /**
   * Extract tasks with specific priority
   */
  getTasksByPriority(filePath, priority) {
    const allTasks = this.parse(filePath);
    return allTasks.filter(task => task.priority === priority.toUpperCase());
  }
}

module.exports = new TaskQueueParser();
