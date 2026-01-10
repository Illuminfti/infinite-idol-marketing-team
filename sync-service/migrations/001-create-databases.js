require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Note: This script uses the MCP Notion tools available in the environment
// For direct execution, we'll use the Notion SDK
const { Client } = require('@notionhq/client');
const logger = require('../src/utils/logger');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * Create all 7 Notion databases for the Infinite Idol Marketing Team sync
 */
async function createDatabases() {
  logger.info('Starting database creation...');

  try {
    // First, we need to find or create a parent page
    // Search for an existing "Infinite Idol - Marketing Team" page or create new one
    const parentPage = await findOrCreateParentPage();
    logger.info(`Using parent page: ${parentPage.id}`);

    const dbIds = {};

    // Create Agent Registry Database
    logger.info('Creating Agent Registry Database...');
    dbIds.agentRegistry = await createAgentRegistryDatabase(parentPage.id);

    // Create Activity Log Database
    logger.info('Creating Activity Log Database...');
    dbIds.activityLog = await createActivityLogDatabase(parentPage.id);

    // Create Decision Log Database
    logger.info('Creating Decision Log Database...');
    dbIds.decisionLog = await createDecisionLogDatabase(parentPage.id);

    // Create Task Queue Database
    logger.info('Creating Task Queue Database...');
    dbIds.taskQueue = await createTaskQueueDatabase(parentPage.id);

    // Create Content Calendar Database
    logger.info('Creating Content Calendar Database...');
    dbIds.contentCalendar = await createContentCalendarDatabase(parentPage.id);

    // Create Knowledge Base Database
    logger.info('Creating Knowledge Base Database...');
    dbIds.knowledgeBase = await createKnowledgeBaseDatabase(parentPage.id);

    // Create Reviews Pipeline Database
    logger.info('Creating Reviews Pipeline Database...');
    dbIds.reviewsPipeline = await createReviewsPipelineDatabase(parentPage.id);

    // Save database IDs to config
    const configPath = path.join(__dirname, '../config/notion-databases.json');
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(dbIds, null, 2));

    logger.info('✅ All databases created successfully!');
    logger.info('Database IDs saved to config/notion-databases.json');
    console.log('\n=== Database IDs ===');
    console.log(JSON.stringify(dbIds, null, 2));

    return dbIds;
  } catch (error) {
    logger.error('Failed to create databases', { error: error.message });
    throw error;
  }
}

/**
 * Find or create parent page for databases
 */
async function findOrCreateParentPage() {
  try {
    // Check if parent page ID provided as command line argument
    const parentPageId = process.argv[2];
    if (parentPageId) {
      logger.info(`Using provided parent page ID: ${parentPageId}`);
      return { id: parentPageId };
    }

    // Search for existing page
    const response = await notion.search({
      query: 'Infinite Idol Marketing Team',
      filter: { property: 'object', value: 'page' }
    });

    if (response.results.length > 0) {
      logger.info('Found existing parent page');
      return response.results[0];
    }

    // If no page found, we need to create one
    // For now, we'll log instructions for the user
    logger.warn('No parent page found. Please create a page in Notion titled "Infinite Idol Marketing Team" and share it with the integration.');
    logger.warn('Then run this script again, or provide the page ID as an argument: node migrations/001-create-databases.js PAGE_ID');
    throw new Error('Parent page not found. Please create "Infinite Idol Marketing Team" page in Notion first.');
  } catch (error) {
    logger.error('Error finding parent page', { error: error.message });
    throw error;
  }
}

/**
 * Create Agent Registry Database
 */
async function createAgentRegistryDatabase(parentPageId) {
  const database = await notion.databases.create({
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: 'Agent Registry' } }],
    properties: {
      'Agent Number': { title: {} },
      'Agent Name': { rich_text: {} },
      'Role': { rich_text: {} },
      'Status': {
        select: {
          options: [
            { name: 'Active', color: 'green' },
            { name: 'Inactive', color: 'gray' },
            { name: 'On Hold', color: 'yellow' }
          ]
        }
      },
      'Authority Level': {
        select: {
          options: [
            { name: 'System Authority', color: 'red' },
            { name: 'Business Authority', color: 'orange' },
            { name: 'Cultural Authority', color: 'purple' },
            { name: 'Domain Authority', color: 'blue' },
            { name: 'No Special Authority', color: 'gray' }
          ]
        }
      },
      'Primary Responsibilities': { rich_text: {} },
      'Skills Used': { multi_select: { options: [] } },
      'Write Permissions': { multi_select: { options: [] } },
      'Persona File Path': { rich_text: {} },
      'Last Active': { date: {} }
    }
  });

  logger.info(`✓ Agent Registry created: ${database.id}`);
  return database.id;
}

/**
 * Create Activity Log Database
 */
async function createActivityLogDatabase(parentPageId) {
  const database = await notion.databases.create({
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: 'Activity Log' } }],
    properties: {
      'Entry ID': { title: {} },
      'Timestamp': { date: {} },
      'Agent Number': {
        select: {
          options: Array.from({ length: 19 }, (_, i) => ({
            name: i.toString().padStart(2, '0'),
            color: 'blue'
          }))
        }
      },
      'Agent Name': { rich_text: {} },
      'Activity Type': {
        select: {
          options: [
            { name: 'Session Start', color: 'green' },
            { name: 'Content Creation', color: 'blue' },
            { name: 'Review', color: 'purple' },
            { name: 'Coordination', color: 'orange' },
            { name: 'Escalation', color: 'red' },
            { name: 'Canon Review', color: 'pink' },
            { name: 'Cultural Review', color: 'yellow' },
            { name: 'Asset Creation', color: 'gray' },
            { name: 'Planning', color: 'brown' },
            { name: 'Research', color: 'default' },
            { name: 'System', color: 'default' }
          ]
        }
      },
      'Summary': { rich_text: {} },
      'Status': {
        select: {
          options: [
            { name: 'Complete', color: 'green' },
            { name: 'In Progress', color: 'yellow' },
            { name: 'Blocked', color: 'red' }
          ]
        }
      },
      'Files Touched': { multi_select: { options: [] } },
      'DS Rating': { number: { format: 'number' } },
      'Review Verdict': {
        select: {
          options: [
            { name: 'APPROVED', color: 'green' },
            { name: 'NEEDS MORE DEGEN', color: 'yellow' },
            { name: 'TOO FAR', color: 'red' },
            { name: 'ESCALATED', color: 'orange' },
            { name: 'N/A', color: 'gray' }
          ]
        }
      },
      'Session ID': { rich_text: {} },
      'Sync Status': {
        select: {
          options: [
            { name: 'Synced', color: 'green' },
            { name: 'Pending GitHub', color: 'yellow' },
            { name: 'Pending Notion', color: 'yellow' },
            { name: 'Conflict', color: 'red' }
          ]
        }
      }
    }
  });

  logger.info(`✓ Activity Log created: ${database.id}`);
  return database.id;
}

/**
 * Create Decision Log Database
 */
async function createDecisionLogDatabase(parentPageId) {
  const database = await notion.databases.create({
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: 'Decision Log' } }],
    properties: {
      'Decision ID': { title: {} },
      'Date': { date: {} },
      'Title': { rich_text: {} },
      'Decided By Agent': { rich_text: {} },
      'Decision Type': {
        select: {
          options: [
            { name: 'Strategy', color: 'blue' },
            { name: 'Content', color: 'green' },
            { name: 'Canon', color: 'purple' },
            { name: 'Technical', color: 'gray' },
            { name: 'Escalation', color: 'red' },
            { name: 'Process', color: 'orange' }
          ]
        }
      },
      'Priority': {
        select: {
          options: [
            { name: 'P0', color: 'red' },
            { name: 'P1', color: 'orange' },
            { name: 'P2', color: 'yellow' },
            { name: 'P3', color: 'gray' }
          ]
        }
      },
      'Status': {
        select: {
          options: [
            { name: 'Approved', color: 'green' },
            { name: 'Pending Review', color: 'yellow' },
            { name: 'Rejected', color: 'red' },
            { name: 'Superseded', color: 'gray' }
          ]
        }
      },
      'Context': { rich_text: {} },
      'Decision': { rich_text: {} },
      'Rationale': { rich_text: {} },
      'Alternatives': { rich_text: {} },
      'Affected Files': { multi_select: { options: [] } },
      'Human Approval': {
        select: {
          options: [
            { name: 'Required', color: 'yellow' },
            { name: 'Not Required', color: 'gray' },
            { name: 'Approved', color: 'green' },
            { name: 'Rejected', color: 'red' }
          ]
        }
      },
      'Human Approval Date': { date: {} },
      'Sync Status': {
        select: {
          options: [
            { name: 'Synced', color: 'green' },
            { name: 'Pending GitHub', color: 'yellow' },
            { name: 'Pending Notion', color: 'yellow' },
            { name: 'Conflict', color: 'red' }
          ]
        }
      }
    }
  });

  logger.info(`✓ Decision Log created: ${database.id}`);
  return database.id;
}

/**
 * Create Task Queue Database
 */
async function createTaskQueueDatabase(parentPageId) {
  const database = await notion.databases.create({
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: 'Task Queue' } }],
    properties: {
      'Task Code': { title: {} },
      'Title': { rich_text: {} },
      'Description': { rich_text: {} },
      'Status': {
        select: {
          options: [
            { name: 'PENDING', color: 'gray' },
            { name: 'IN_PROGRESS', color: 'blue' },
            { name: 'BLOCKED', color: 'red' },
            { name: 'REVIEW', color: 'yellow' },
            { name: 'COMPLETE', color: 'green' },
            { name: 'ESCALATED', color: 'orange' },
            { name: 'DEFERRED', color: 'purple' },
            { name: 'CANCELLED', color: 'gray' }
          ]
        }
      },
      'Priority': {
        select: {
          options: [
            { name: 'P0', color: 'red' },
            { name: 'P1', color: 'orange' },
            { name: 'P2', color: 'yellow' },
            { name: 'P3', color: 'gray' }
          ]
        }
      },
      'Task Type': {
        select: {
          options: [
            { name: 'Content', color: 'blue' },
            { name: 'Review', color: 'purple' },
            { name: 'Asset', color: 'green' },
            { name: 'Coordination', color: 'orange' },
            { name: 'Research', color: 'gray' },
            { name: 'Canon', color: 'pink' },
            { name: 'Cultural', color: 'yellow' },
            { name: 'System', color: 'default' },
            { name: 'Project', color: 'brown' }
          ]
        }
      },
      'Content Type': {
        select: {
          options: [
            { name: 'Tweet', color: 'blue' },
            { name: 'Thread', color: 'blue' },
            { name: 'Discord', color: 'purple' },
            { name: 'Banner', color: 'green' },
            { name: 'Article', color: 'orange' },
            { name: 'Prompt', color: 'gray' },
            { name: 'Analysis', color: 'yellow' }
          ]
        }
      },
      'Assigned Agent': { rich_text: {} },
      'Created': { date: {} },
      'Due': { date: {} },
      'Completed': { date: {} },
      'Output File Path': { rich_text: {} },
      'Notes': { rich_text: {} },
      'Sync Status': {
        select: {
          options: [
            { name: 'Synced', color: 'green' },
            { name: 'Pending GitHub', color: 'yellow' },
            { name: 'Pending Notion', color: 'yellow' },
            { name: 'Conflict', color: 'red' }
          ]
        }
      }
    }
  });

  logger.info(`✓ Task Queue created: ${database.id}`);
  return database.id;
}

/**
 * Create Content Calendar Database
 */
async function createContentCalendarDatabase(parentPageId) {
  const database = await notion.databases.create({
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: 'Content Calendar' } }],
    properties: {
      'Content ID': { title: {} },
      'Title': { rich_text: {} },
      'Content Type': {
        select: {
          options: [
            { name: 'Tweet', color: 'blue' },
            { name: 'Thread', color: 'blue' },
            { name: 'Discord Event', color: 'purple' },
            { name: 'Banner', color: 'green' },
            { name: 'Article', color: 'orange' },
            { name: 'Prompt', color: 'gray' },
            { name: 'Video', color: 'red' }
          ]
        }
      },
      'Scheduled Date': { date: {} },
      'Published At': { date: {} },
      'Status': {
        select: {
          options: [
            { name: 'Scheduled', color: 'yellow' },
            { name: 'Published', color: 'green' },
            { name: 'Cancelled', color: 'red' },
            { name: 'Draft', color: 'gray' }
          ]
        }
      },
      'Pillar': {
        select: {
          options: [
            { name: 'Ika Voice (40%)', color: 'pink' },
            { name: 'Lore Drops (25%)', color: 'purple' },
            { name: 'Founder Hype (20%)', color: 'blue' },
            { name: 'Community (15%)', color: 'green' }
          ]
        }
      },
      'Platform': {
        select: {
          options: [
            { name: 'Twitter', color: 'blue' },
            { name: 'Discord', color: 'purple' },
            { name: 'Blog', color: 'orange' },
            { name: 'Medium', color: 'gray' },
            { name: 'YouTube', color: 'red' }
          ]
        }
      },
      'Review Status': {
        select: {
          options: [
            { name: 'Pending Canon', color: 'yellow' },
            { name: 'Canon Approved', color: 'green' },
            { name: 'Pending Cultural', color: 'yellow' },
            { name: 'Cultural Approved', color: 'green' },
            { name: 'Pending Coordinator', color: 'orange' },
            { name: 'Final Approved', color: 'green' }
          ]
        }
      },
      'Owner Agent': { rich_text: {} },
      'DS Rating': { number: { format: 'number' } },
      'Platform URL': { url: {} },
      'Likes': { number: {} },
      'Retweets': { number: {} },
      'Comments': { number: {} },
      'Impressions': { number: {} },
      'Sync Status': {
        select: {
          options: [
            { name: 'Synced', color: 'green' },
            { name: 'Pending GitHub', color: 'yellow' },
            { name: 'Pending Notion', color: 'yellow' },
            { name: 'Conflict', color: 'red' }
          ]
        }
      }
    }
  });

  logger.info(`✓ Content Calendar created: ${database.id}`);
  return database.id;
}

/**
 * Create Knowledge Base Database
 */
async function createKnowledgeBaseDatabase(parentPageId) {
  const database = await notion.databases.create({
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: 'Knowledge Base' } }],
    properties: {
      'File Path': { title: {} },
      'File Name': { rich_text: {} },
      'Category': {
        select: {
          options: [
            { name: 'Lore', color: 'purple' },
            { name: 'Characters', color: 'pink' },
            { name: 'Game Mechanics', color: 'blue' },
            { name: 'Brand', color: 'orange' },
            { name: 'Crypto', color: 'green' },
            { name: 'Light Novels', color: 'gray' },
            { name: 'Technical', color: 'red' }
          ]
        }
      },
      'Canon Tier': {
        select: {
          options: [
            { name: 'Tier 1 (Inviolable)', color: 'red' },
            { name: 'Tier 2 (Published Novels)', color: 'orange' },
            { name: 'Tier 3 (Character Profiles)', color: 'yellow' },
            { name: 'Tier 4 (World Docs)', color: 'green' },
            { name: 'Tier 5 (Content)', color: 'blue' },
            { name: 'Tier 6 (Proposals)', color: 'gray' }
          ]
        }
      },
      'Description': { rich_text: {} },
      'Last Modified': { date: {} },
      'Last Modified By': { rich_text: {} },
      'Word Count': { number: {} },
      'Tags': { multi_select: { options: [] } },
      'Is Sealed': { checkbox: {} },
      'Git Commit SHA': { rich_text: {} },
      'Sync Status': {
        select: {
          options: [
            { name: 'Synced', color: 'green' },
            { name: 'Pending GitHub', color: 'yellow' },
            { name: 'Pending Notion', color: 'yellow' },
            { name: 'Conflict', color: 'red' }
          ]
        }
      }
    }
  });

  logger.info(`✓ Knowledge Base created: ${database.id}`);
  return database.id;
}

/**
 * Create Reviews Pipeline Database
 */
async function createReviewsPipelineDatabase(parentPageId) {
  const database = await notion.databases.create({
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: 'Reviews Pipeline' } }],
    properties: {
      'Item ID': { title: {} },
      'Submitted Date': { date: {} },
      'Submitting Agent': { rich_text: {} },
      'Priority': {
        select: {
          options: [
            { name: 'CRITICAL', color: 'red' },
            { name: 'HIGH', color: 'orange' },
            { name: 'MEDIUM', color: 'yellow' },
            { name: 'LOW', color: 'gray' }
          ]
        }
      },
      'Category': {
        select: {
          options: [
            { name: 'Canon Conflict', color: 'purple' },
            { name: 'New Canon', color: 'purple' },
            { name: 'Strategy Change', color: 'blue' },
            { name: 'Crisis Response', color: 'red' },
            { name: 'Technical', color: 'gray' },
            { name: 'Budget', color: 'green' },
            { name: 'Legal', color: 'orange' },
            { name: 'Character Death', color: 'red' },
            { name: 'Partnership', color: 'blue' },
            { name: 'Uncertainty', color: 'yellow' }
          ]
        }
      },
      'Status': {
        select: {
          options: [
            { name: 'Pending Review', color: 'yellow' },
            { name: 'Human Reviewing', color: 'orange' },
            { name: 'Approved', color: 'green' },
            { name: 'Rejected', color: 'red' },
            { name: 'Deferred', color: 'gray' }
          ]
        }
      },
      'Context': { rich_text: {} },
      'Question': { rich_text: {} },
      'Agent Recommendation': { rich_text: {} },
      'Human Decision': { rich_text: {} },
      'Human Decided Date': { date: {} },
      'Related Files': { multi_select: { options: [] } },
      'Sync Status': {
        select: {
          options: [
            { name: 'Synced', color: 'green' },
            { name: 'Pending GitHub', color: 'yellow' },
            { name: 'Pending Notion', color: 'yellow' },
            { name: 'Conflict', color: 'red' }
          ]
        }
      }
    }
  });

  logger.info(`✓ Reviews Pipeline created: ${database.id}`);
  return database.id;
}

// Run if called directly
if (require.main === module) {
  createDatabases()
    .then(() => {
      logger.info('Migration completed successfully');
      process.exit(0);
    })
    .catch(error => {
      logger.error('Migration failed', { error: error.message });
      process.exit(1);
    });
}

module.exports = { createDatabases };
