/**
 * Generate MCP command data for batch migration
 */

const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = path.join(__dirname, '../config/notion-databases.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Load migration data
const dataPath = path.join(__dirname, '../state/migration-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Generate MCP commands for Activity Log (skip first one as it's created)
const activityCommands = data.activityEntries.slice(1).map(entry => ({
  parent: { database_id: config.activityLog },
  properties: {
    'Entry ID': { title: [{ text: { content: entry.id }}]},
    'Timestamp': { date: { start: entry.timestamp }},
    'Agent Number': { select: { name: entry.agentNumber }},
    'Agent Name': { rich_text: [{ text: { content: entry.agentName.substring(0, 2000) }}]},
    'Activity Type': { rich_text: [{ text: { content: entry.activityType.substring(0, 2000) }}]},
    'Summary': { rich_text: [{ text: { content: entry.summary.substring(0, 2000) }}]},
    'Status': { rich_text: [{ text: { content: entry.status }}]},
    ...(entry.dsRating ? { 'DS Rating': { number: entry.dsRating }} : {})
  }
}));

// Generate MCP commands for Task Queue
const taskCommands = data.tasks.map(task => ({
  parent: { database_id: config.taskQueue },
  properties: {
    'Task Code': { title: [{ text: { content: task.taskCode || task.id }}]},
    'Description': { rich_text: [{ text: { content: (task.title || task.description || '').substring(0, 2000) }}]},
    'Status': { select: { name: task.status }},
    'Priority': { select: { name: task.priority || 'P2' }},
    'Assigned Agent': { rich_text: [{ text: { content: task.assignedAgent ? `${task.assignedAgent.number} - ${task.assignedAgent.role}` : '' }}]},
    ...(task.created ? { 'Created': { date: { start: task.created }}} : {}),
    ...(task.dueDate ? { 'Due Date': { date: { start: task.dueDate }}} : {})
  }
}));

// Generate MCP commands for Decision Log
const decisionCommands = data.decisions.map(decision => ({
  parent: { database_id: config.decisionLog },
  properties: {
    'Decision ID': { title: [{ text: { content: decision.decisionId }}]},
    'Date': { date: { start: decision.date }},
    'Title': { rich_text: [{ text: { content: decision.title.substring(0, 2000) }}]},
    'Decided By': { rich_text: [{ text: { content: decision.decidedBy || '' }}]},
    ...(decision.type ? { 'Type': { select: { name: decision.type }}} : {}),
    ...(decision.priority ? { 'Priority': { select: { name: decision.priority }}} : {}),
    ...(decision.status ? { 'Status': { select: { name: decision.status }}} : {})
  }
}));

// Save commands to file
const outputData = {
  activityLog: { databaseId: config.activityLog, commands: activityCommands, count: activityCommands.length },
  taskQueue: { databaseId: config.taskQueue, commands: taskCommands, count: taskCommands.length },
  decisionLog: { databaseId: config.decisionLog, commands: decisionCommands, count: decisionCommands.length },
  total: activityCommands.length + taskCommands.length + decisionCommands.length
};

const outputPath = path.join(__dirname, '../state/mcp-commands.json');
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

console.log('=== MCP Commands Generated ===');
console.log(`Activity Log: ${activityCommands.length} entries (1 already created)`);
console.log(`Task Queue: ${taskCommands.length} tasks`);
console.log(`Decision Log: ${decisionCommands.length} decisions`);
console.log(`Total: ${outputData.total} commands to execute`);
console.log(`\nSaved to: ${outputPath}`);
