import dotenv from 'dotenv';
import { SyncConfig } from './types';
import { Logger } from './logger';

const logger = new Logger('Config');

export function loadConfig(): SyncConfig {
  dotenv.config();

  const requiredEnvVars = [
    'NOTION_TOKEN',
    'NOTION_KNOWLEDGE_BASE_DB',
    'GITHUB_TOKEN',
    'GITHUB_OWNER',
    'GITHUB_REPO',
  ];

  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  const config: SyncConfig = {
    notion: {
      token: process.env.NOTION_TOKEN!,
      databases: {
        knowledgeBase: process.env.NOTION_KNOWLEDGE_BASE_DB!,
        agentActivity: process.env.NOTION_AGENT_ACTIVITY_DB || '',
        reviewQueue: process.env.NOTION_REVIEW_QUEUE_DB || '',
        contentCalendar: process.env.NOTION_CONTENT_CALENDAR_DB || '',
        tweetQueue: process.env.NOTION_TWEET_QUEUE_DB || '',
      },
    },
    github: {
      token: process.env.GITHUB_TOKEN!,
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      branch: process.env.GITHUB_BRANCH || 'main',
    },
    sync: {
      paths: (process.env.SYNC_PATHS || 'knowledge-base,agents,outputs').split(','),
      intervalMinutes: parseInt(process.env.SYNC_INTERVAL_MINUTES || '60', 10),
      dryRun: process.env.DRY_RUN === 'true',
    },
  };

  logger.info('Configuration loaded successfully');
  return config;
}

export function validateConfig(config: SyncConfig): boolean {
  if (!config.notion.token.startsWith('secret_')) {
    logger.error('Invalid Notion token format');
    return false;
  }

  if (!config.github.token.startsWith('ghp_') && !config.github.token.startsWith('github_pat_')) {
    logger.error('Invalid GitHub token format');
    return false;
  }

  if (config.sync.paths.length === 0) {
    logger.error('No sync paths configured');
    return false;
  }

  return true;
}

export function getConfigValue<T>(config: SyncConfig, path: string): T | undefined {
  const parts = path.split('.');
  let current: unknown = config;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current as T;
}
