const fs = require('fs');
const { generateContentHash } = require('../utils/entry-id-generator');
const logger = require('../utils/logger');

/**
 * Parse decisions.md into structured decision entries
 * Extracts decision records with full context and rationale
 */
class DecisionLogParser {
  /**
   * Parse the entire decision log file
   * @param {string} filePath - Path to decisions.md
   * @returns {Array} Array of decision entries
   */
  parse(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return this.parseContent(content);
    } catch (error) {
      logger.error('Failed to parse decision log', { error: error.message, filePath });
      throw error;
    }
  }

  /**
   * Parse decision log content string
   * @param {string} content - Markdown content
   * @returns {Array} Array of decision entries
   */
  parseContent(content) {
    const decisions = [];

    // Find the Decision Log section
    const logSectionMatch = content.match(/## Decision Log\s*\n([\s\S]+)/);
    if (!logSectionMatch) {
      logger.warn('No Decision Log section found');
      return decisions;
    }

    const logSection = logSectionMatch[1];

    // Split by decision entry headers: ### YYYY-MM-DD - DEC-
    const sections = logSection.split(/(?=### \d{4}-\d{2}-\d{2} - DEC-)/);

    for (const section of sections) {
      if (!section.trim()) continue;

      const decision = this.parseEntry(section);
      if (decision) {
        decisions.push(decision);
      }
    }

    logger.info(`Parsed ${decisions.length} decisions from decision log`);
    return decisions;
  }

  /**
   * Parse a single decision entry
   */
  parseEntry(section) {
    // Extract date and decision ID from header
    const headerMatch = section.match(/### (\d{4}-\d{2}-\d{2}) - (DEC-[A-Z]*-?\d+): (.+)/);
    if (!headerMatch) {
      return null;
    }

    const [, date, decisionId, title] = headerMatch;

    // Extract fields
    const decidedByMatch = section.match(/\*\*Decided By\*\*:\s*(.+)/);
    const decidedBy = decidedByMatch ? decidedByMatch[1].trim() : null;

    // Parse agent number and name from "##  - Name" format
    let agentNumber = null;
    let agentName = null;
    if (decidedBy) {
      const agentMatch = decidedBy.match(/(\d{2})\s*-\s*(.+)/);
      if (agentMatch) {
        agentNumber = agentMatch[1];
        agentName = agentMatch[2].trim();
      }
    }

    // Decision Type
    const typeMatch = section.match(/\*\*Decision Type\*\*:\s*(.+)/);
    const decisionType = typeMatch ? typeMatch[1].trim() : null;

    // Priority
    const priorityMatch = section.match(/\*\*Priority\*\*:\s*(.+)/);
    const priority = priorityMatch ? priorityMatch[1].trim() : null;

    // Status
    const statusMatch = section.match(/\*\*Status\*\*:\s*(.+)/);
    const rawStatus = statusMatch ? statusMatch[1].trim() : 'Pending Review';

    // Parse status (may include additional info in parentheses)
    let status = rawStatus;
    let statusNotes = null;
    const statusParseMatch = rawStatus.match(/^([A-Za-z\s]+)(?:\s*\((.+)\))?/);
    if (statusParseMatch) {
      status = statusParseMatch[1].trim();
      statusNotes = statusParseMatch[2] ? statusParseMatch[2].trim() : null;
    }

    // Context
    const contextMatch = section.match(/\*\*Context\*\*:\s*\n([\s\S]*?)(?=\n\*\*Decision\*\*:)/);
    const context = contextMatch ? contextMatch[1].trim() : '';

    // Decision
    const decisionMatch = section.match(/\*\*Decision\*\*:\s*\n([\s\S]*?)(?=\n\*\*Rationale\*\*:)/);
    const decision = decisionMatch ? decisionMatch[1].trim() : '';

    // Rationale
    const rationaleMatch = section.match(/\*\*Rationale\*\*:\s*\n([\s\S]*?)(?=\n\*\*Alternatives Considered\*\*:)/);
    const rationale = rationaleMatch ? rationaleMatch[1].trim() : '';

    // Alternatives Considered
    const alternativesMatch = section.match(/\*\*Alternatives Considered\*\*:\s*\n([\s\S]*?)(?=\n\*\*Impact\*\*:)/);
    const alternatives = alternativesMatch ? alternativesMatch[1].trim() : '';

    // Impact section
    const impactMatch = section.match(/\*\*Impact\*\*:\s*\n([\s\S]*?)(?=\n\*\*Human Approval\*\*:)/);
    const impactText = impactMatch ? impactMatch[1].trim() : '';

    // Extract affected files from impact
    const affectedFiles = [];
    const filesMatch = impactText.match(/\*\*Affected Files\*\*:\s*\n([\s\S]*?)(?=\n\s*-\s*\*\*|$)/);
    if (filesMatch) {
      const fileLines = filesMatch[1].trim().split('\n');
      for (const line of fileLines) {
        const fileMatch = line.match(/[`']([^`']+)[`']/);
        if (fileMatch) {
          affectedFiles.push(fileMatch[1]);
        }
      }
    }

    // Extract affected agents from impact
    const affectedAgents = [];
    const agentsMatch = impactText.match(/\*\*Affected Agents\*\*:\s*(.+)/);
    if (agentsMatch) {
      const agentsText = agentsMatch[1];
      // Extract agent numbers (00-18)
      const agentMatches = agentsText.matchAll(/\b(\d{2})\b/g);
      for (const match of agentMatches) {
        affectedAgents.push(match[1]);
      }
    }

    // Extract timeline from impact
    const timelineMatch = impactText.match(/\*\*Timeline\*\*:\s*(.+)/);
    const timeline = timelineMatch ? timelineMatch[1].trim() : null;

    // Human Approval
    const humanApprovalMatch = section.match(/\*\*Human Approval\*\*:\s*(.+)/);
    const humanApproval = humanApprovalMatch ? humanApprovalMatch[1].trim() : 'Not Required';

    // Parse human approval status
    let requiresHumanApproval = false;
    let humanApprovalDate = null;
    let humanApprovalStatus = 'Not Required';

    if (humanApproval.toLowerCase().includes('required') && !humanApproval.toLowerCase().includes('not required')) {
      requiresHumanApproval = true;
      humanApprovalStatus = 'Required';
    }

    if (humanApproval.toLowerCase().includes('approved')) {
      humanApprovalStatus = 'Approved';
      const dateMatch = humanApproval.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        humanApprovalDate = dateMatch[1];
      }
    }

    if (humanApproval.toLowerCase().includes('rejected')) {
      humanApprovalStatus = 'Rejected';
    }

    // Check for superseded relationships
    const supersededByMatch = section.match(/\*\*Superseded By\*\*:\s*(DEC-[A-Z]*-?\d+)/);
    const supersedesMatch = section.match(/\*\*Supersedes\*\*:\s*(DEC-[A-Z]*-?\d+)/);

    const supersededBy = supersededByMatch ? supersededByMatch[1] : null;
    const supersedes = supersedesMatch ? supersedesMatch[1] : null;

    // Generate content hash
    const contentHash = generateContentHash(section);

    return {
      id: decisionId,
      decisionId,
      date,
      title: title.trim(),
      decidedBy: {
        agentNumber,
        agentName,
        raw: decidedBy
      },
      decisionType,
      priority,
      status,
      statusNotes,
      context,
      decision,
      rationale,
      alternatives,
      impactText,
      affectedFiles,
      affectedAgents,
      timeline,
      humanApproval: {
        status: humanApprovalStatus,
        required: requiresHumanApproval,
        date: humanApprovalDate,
        raw: humanApproval
      },
      supersededBy,
      supersedes,
      fullContent: section.trim(),
      contentHash
    };
  }

  /**
   * Get decisions by agent
   */
  getDecisionsByAgent(filePath, agentNumber) {
    const allDecisions = this.parse(filePath);
    return allDecisions.filter(d => d.decidedBy.agentNumber === agentNumber);
  }

  /**
   * Get decisions by type
   */
  getDecisionsByType(filePath, decisionType) {
    const allDecisions = this.parse(filePath);
    return allDecisions.filter(d => d.decisionType === decisionType);
  }

  /**
   * Get decisions requiring human approval
   */
  getPendingHumanApproval(filePath) {
    const allDecisions = this.parse(filePath);
    return allDecisions.filter(d => d.humanApproval.required && d.humanApproval.status === 'Required');
  }
}

module.exports = new DecisionLogParser();
