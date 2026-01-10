/**
 * Batch migration script to create Notion pages via direct API calls
 * This uses the Notion SDK to bypass MCP tool call limitations
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

// Load configuration
const configPath = path.join(__dirname, '../config/notion-databases.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Load migration data
const dataPath = path.join(__dirname, '../state/migration-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Convert markdown to Notion blocks (simplified)
function markdownToBlocks(markdown) {
  if (!markdown) return [];

  const blocks = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    if (line.trim() === '') continue;

    // Simple paragraph block
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{
          type: 'text',
          text: { content: line.substring(0, 2000) } // Notion limit
        }]
      }
    });

    // Limit to 100 blocks (Notion API limit)
    if (blocks.length >= 90) break;
  }

  return blocks;
}

async function migrateActivityLog() {
  console.log('\n=== Migrating Activity Log ===');
  let created = 0;
  let failed = 0;

  for (const entry of data.activityEntries) {
    try {
      const properties = {
        'Entry ID': {
          title: [{ text: { content: entry.id } }]
        },
        'Timestamp': {
          date: { start: entry.timestamp }
        },
        'Agent Number': {
          select: { name: entry.agentNumber }
        },
        'Agent Name': {
          rich_text: [{ text: { content: entry.agentName.substring(0, 2000) } }]
        },
        'Activity Type': {
          rich_text: [{ text: { content: entry.activityType.substring(0, 2000) } }]
        },
        'Summary': {
          rich_text: [{ text: { content: entry.summary.substring(0, 2000) } }]
        },
        'Status': {
          rich_text: [{ text: { content: entry.status } }]
        }
      };

      // Add DS Rating if present
      if (entry.dsRating !== null && entry.dsRating !== undefined) {
        properties['DS Rating'] = { number: entry.dsRating };
      }

      // Create page with content
      const children = markdownToBlocks(entry.fullContent);

      await notion.pages.create({
        parent: { database_id: config.activityLog },
        properties,
        children
      });

      created++;
      console.log(`✓ Created: ${entry.id}`);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 350));

    } catch (error) {
      console.error(`✗ Failed: ${entry.id} - ${error.message}`);
      failed++;
    }
  }

  console.log(`\nActivity Log: ${created} created, ${failed} failed`);
  return { created, failed };
}

async function migrateTaskQueue() {
  console.log('\n=== Migrating Task Queue ===');
  let created = 0;
  let failed = 0;

  for (const task of data.tasks) {
    try {
      const properties = {
        'Task Code': {
          title: [{ text: { content: task.taskCode || task.id } }]
        },
        'Description': {
          rich_text: [{ text: { content: (task.title || task.description || '').substring(0, 2000) } }]
        },
        'Status': {
          select: { name: task.status }
        },
        'Priority': {
          select: { name: task.priority || 'P2' }
        },
        'Assigned Agent': {
          rich_text: [{ text: { content: task.assignedAgent ? `${task.assignedAgent.number} - ${task.assignedAgent.role}` : '' } }]
        }
      };

      // Add dates if present
      if (task.created) {
        properties['Created'] = { date: { start: task.created } };
      }
      if (task.dueDate) {
        properties['Due Date'] = { date: { start: task.dueDate } };
      }

      await notion.pages.create({
        parent: { database_id: config.taskQueue },
        properties
      });

      created++;
      console.log(`✓ Created: ${task.taskCode || task.id}`);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 350));

    } catch (error) {
      console.error(`✗ Failed: ${task.taskCode || task.id} - ${error.message}`);
      failed++;
    }
  }

  console.log(`\nTask Queue: ${created} created, ${failed} failed`);
  return { created, failed };
}

async function migrateDecisionLog() {
  console.log('\n=== Migrating Decision Log ===');
  let created = 0;
  let failed = 0;

  for (const decision of data.decisions) {
    try {
      const properties = {
        'Decision ID': {
          title: [{ text: { content: decision.decisionId } }]
        },
        'Date': {
          date: { start: decision.date }
        },
        'Title': {
          rich_text: [{ text: { content: decision.title.substring(0, 2000) } }]
        },
        'Decided By': {
          rich_text: [{ text: { content: decision.decidedBy || '' } }]
        }
      };

      // Add optional fields
      if (decision.type) {
        properties['Type'] = { select: { name: decision.type } };
      }
      if (decision.priority) {
        properties['Priority'] = { select: { name: decision.priority } };
      }
      if (decision.status) {
        properties['Status'] = { select: { name: decision.status } };
      }

      // Create page with context/rationale content
      const children = markdownToBlocks(decision.fullContent || decision.context);

      await notion.pages.create({
        parent: { database_id: config.decisionLog },
        properties,
        children
      });

      created++;
      console.log(`✓ Created: ${decision.decisionId}`);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 350));

    } catch (error) {
      console.error(`✗ Failed: ${decision.decisionId} - ${error.message}`);
      failed++;
    }
  }

  console.log(`\nDecision Log: ${created} created, ${failed} failed`);
  return { created, failed };
}

async function main() {
  console.log('🚀 Starting batch migration to Notion');
  console.log(`Database IDs:`);
  console.log(`  Activity Log: ${config.activityLog}`);
  console.log(`  Task Queue: ${config.taskQueue}`);
  console.log(`  Decision Log: ${config.decisionLog}`);

  try {
    const stats = {
      activityLog: await migrateActivityLog(),
      taskQueue: await migrateTaskQueue(),
      decisionLog: await migrateDecisionLog()
    };

    console.log('\n=== Migration Complete ===');
    console.log(`Activity Log: ${stats.activityLog.created}/${data.activityEntries.length} entries`);
    console.log(`Task Queue: ${stats.taskQueue.created}/${data.tasks.length} tasks`);
    console.log(`Decision Log: ${stats.decisionLog.created}/${data.decisions.length} decisions`);
    console.log(`Total: ${stats.activityLog.created + stats.taskQueue.created + stats.decisionLog.created} records created`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { migrateActivityLog, migrateTaskQueue, migrateDecisionLog };
