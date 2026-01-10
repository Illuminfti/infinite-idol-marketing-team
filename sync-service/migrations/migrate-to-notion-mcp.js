/**
 * Migrate historical data to Notion using MCP tools via Claude Code
 * This script generates the MCP tool calls needed for migration
 */

const fs = require('fs');
const path = require('path');

// Load migration data
const migrationDataPath = path.join(__dirname, '../state/migration-data.json');
const migrationData = JSON.parse(fs.readFileSync(migrationDataPath, 'utf-8'));

// Load database IDs
const dbConfigPath = path.join(__dirname, '../config/notion-databases.json');
const dbConfig = JSON.parse(fs.readFileSync(dbConfigPath, 'utf-8'));

console.log('=== Migration Data Summary ===');
console.log(`Activity Entries: ${migrationData.activityEntries.length}`);
console.log(`Tasks: ${migrationData.tasks.length}`);
console.log(`Decisions: ${migrationData.decisions.length}`);
console.log('');

console.log('=== Database IDs ===');
console.log(`Activity Log: ${dbConfig.activityLog}`);
console.log(`Task Queue: ${dbConfig.taskQueue}`);
console.log(`Decision Log: ${dbConfig.decisionLog}`);
console.log('');

console.log('=== Export for Claude Code MCP Migration ===');
console.log('');

// Export data in a format that Claude Code can easily use
const exportData = {
  databases: dbConfig,
  data: migrationData,
  instructions: {
    activityLog: {
      databaseId: dbConfig.activityLog,
      entries: migrationData.activityEntries.length,
      sampleEntry: migrationData.activityEntries[0]
    },
    taskQueue: {
      databaseId: dbConfig.taskQueue,
      entries: migrationData.tasks.length,
      sampleTask: migrationData.tasks[0]
    },
    decisionLog: {
      databaseId: dbConfig.decisionLog,
      entries: migrationData.decisions.length,
      sampleDecision: migrationData.decisions[0]
    }
  }
};

// Save export
const exportPath = path.join(__dirname, '../state/mcp-migration-export.json');
fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));

console.log(`Export saved to: ${exportPath}`);
console.log('');
console.log('Next: Use Claude Code MCP tools to create pages in Notion databases');
