#!/usr/bin/env node

import { loadConfig, validateConfig } from './shared/config';
import { Logger, LogLevel } from './shared/logger';
import { GitHubToNotionSync } from './github-to-notion';
import { NotionToGitHubSync } from './notion-to-github';

const logger = new Logger('Main');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'both';

  // Set log level from environment
  if (process.env.LOG_LEVEL === 'debug') {
    Logger.setLevel(LogLevel.DEBUG);
  }

  logger.info(`Starting sync with command: ${command}`);

  try {
    // Load configuration
    const config = loadConfig();

    // Validate configuration
    if (!validateConfig(config)) {
      logger.error('Configuration validation failed');
      process.exit(1);
    }

    // Parse options
    const options = parseOptions(args.slice(1));

    switch (command) {
      case 'to-notion': {
        const sync = new GitHubToNotionSync(config);
        const result = await sync.sync(options);
        printResult(result);
        process.exit(result.success ? 0 : 1);
        break;
      }

      case 'from-notion': {
        const sync = new NotionToGitHubSync(config);
        const result = await sync.sync(options);
        printResult(result);
        process.exit(result.success ? 0 : 1);
        break;
      }

      case 'both': {
        // First sync from GitHub to Notion
        logger.info('Phase 1: Syncing GitHub to Notion');
        const toNotionSync = new GitHubToNotionSync(config);
        const toNotionResult = await toNotionSync.sync(options);
        printResult(toNotionResult);

        if (!toNotionResult.success) {
          logger.warn('GitHub to Notion sync had errors, continuing with Notion to GitHub');
        }

        // Then sync from Notion to GitHub
        logger.info('Phase 2: Syncing Notion to GitHub');
        const toGitHubSync = new NotionToGitHubSync(config);
        const toGitHubResult = await toGitHubSync.sync(options);
        printResult(toGitHubResult);

        const overallSuccess = toNotionResult.success && toGitHubResult.success;
        process.exit(overallSuccess ? 0 : 1);
        break;
      }

      case 'status': {
        const toNotionSync = new GitHubToNotionSync(config);
        const state = toNotionSync.getState();
        console.log(JSON.stringify(state, null, 2));
        break;
      }

      case 'reset': {
        const toNotionSync = new GitHubToNotionSync(config);
        toNotionSync.resetState();
        logger.success('Sync state has been reset');
        break;
      }

      case 'help':
      default:
        printHelp();
        break;
    }
  } catch (error) {
    logger.error('Sync failed', error);
    process.exit(1);
  }
}

function parseOptions(args: string[]): Record<string, unknown> {
  const options: Record<string, unknown> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--dry-run' || arg === '-n') {
      options.dryRun = true;
    } else if (arg === '--force' || arg === '-f') {
      options.force = true;
    } else if (arg === '--files' && args[i + 1]) {
      options.files = args[i + 1].split(',');
      i++;
    } else if (arg === '--databases' && args[i + 1]) {
      options.databases = args[i + 1].split(',');
      i++;
    } else if (arg === '--conflict-strategy' && args[i + 1]) {
      options.conflictStrategy = args[i + 1];
      i++;
    }
  }

  return options;
}

function printResult(result: { success: boolean; syncedFiles: string[]; errors: Array<{ message: string }> }) {
  console.log('\n--- Sync Result ---');
  console.log(`Success: ${result.success}`);
  console.log(`Files synced: ${result.syncedFiles.length}`);

  if (result.syncedFiles.length > 0) {
    console.log('\nSynced files:');
    result.syncedFiles.forEach(f => console.log(`  - ${f}`));
  }

  if (result.errors.length > 0) {
    console.log('\nErrors:');
    result.errors.forEach(e => console.log(`  - ${e.message}`));
  }
}

function printHelp() {
  console.log(`
Infinite Idol Notion Sync

Usage:
  npm run sync:to-notion     Sync GitHub files to Notion
  npm run sync:from-notion   Sync Notion pages to GitHub
  npm run sync:both          Run both syncs

Commands:
  to-notion     Sync markdown files from GitHub to Notion databases
  from-notion   Sync Notion pages back to GitHub markdown files
  both          Run both directions (default)
  status        Show current sync state
  reset         Reset sync state

Options:
  --dry-run, -n              Preview changes without making them
  --force, -f                Force sync all files (ignore cache)
  --files <paths>            Comma-separated list of files to sync
  --databases <names>        Comma-separated list of databases to sync
  --conflict-strategy <s>    How to resolve conflicts:
                             github-wins, notion-wins, newer-wins, manual

Environment Variables:
  NOTION_TOKEN               Notion integration token (required)
  NOTION_KNOWLEDGE_BASE_DB   Knowledge base database ID (required)
  NOTION_AGENT_ACTIVITY_DB   Agent activity database ID
  NOTION_REVIEW_QUEUE_DB     Review queue database ID
  NOTION_CONTENT_CALENDAR_DB Content calendar database ID
  NOTION_TWEET_QUEUE_DB      Tweet queue database ID
  GITHUB_TOKEN               GitHub personal access token (required)
  GITHUB_OWNER               GitHub repository owner (required)
  GITHUB_REPO                GitHub repository name (required)
  GITHUB_BRANCH              Git branch (default: main)
  SYNC_PATHS                 Paths to sync (default: knowledge-base,agents,outputs)
  DRY_RUN                    Set to 'true' to run in dry-run mode
  LOG_LEVEL                  Set to 'debug' for verbose logging

Examples:
  # Sync all files to Notion
  npm run sync:to-notion

  # Dry run to see what would change
  npm run sync:to-notion -- --dry-run

  # Force sync specific files
  npm run sync:to-notion -- --force --files agents/00-coordinator.md,CLAUDE.md

  # Sync only the review queue from Notion
  npm run sync:from-notion -- --databases reviewQueue
`);
}

main();
