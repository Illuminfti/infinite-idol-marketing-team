import { loadConfig, validateConfig } from '../../src/shared/config';

describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Set required env vars
    process.env.NOTION_TOKEN = 'secret_test_token';
    process.env.NOTION_KNOWLEDGE_BASE_DB = 'test_db_id';
    process.env.GITHUB_TOKEN = 'ghp_test_token';
    process.env.GITHUB_OWNER = 'test-owner';
    process.env.GITHUB_REPO = 'test-repo';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('loadConfig', () => {
    it('should load configuration from environment variables', () => {
      const config = loadConfig();

      expect(config.notion.token).toBe('secret_test_token');
      expect(config.notion.databases.knowledgeBase).toBe('test_db_id');
      expect(config.github.token).toBe('ghp_test_token');
      expect(config.github.owner).toBe('test-owner');
      expect(config.github.repo).toBe('test-repo');
    });

    it('should use default values for optional config', () => {
      const config = loadConfig();

      expect(config.github.branch).toBe('main');
      expect(config.sync.paths).toContain('knowledge-base');
      expect(config.sync.intervalMinutes).toBe(60);
      expect(config.sync.dryRun).toBe(false);
    });

    it('should use custom values when provided', () => {
      process.env.GITHUB_BRANCH = 'develop';
      process.env.SYNC_PATHS = 'custom-path,another-path';
      process.env.SYNC_INTERVAL_MINUTES = '30';
      process.env.DRY_RUN = 'true';

      const config = loadConfig();

      expect(config.github.branch).toBe('develop');
      expect(config.sync.paths).toEqual(['custom-path', 'another-path']);
      expect(config.sync.intervalMinutes).toBe(30);
      expect(config.sync.dryRun).toBe(true);
    });

    it('should throw error when required env vars are missing', () => {
      delete process.env.NOTION_TOKEN;

      expect(() => loadConfig()).toThrow('Missing required environment variables');
    });

    it('should load optional database IDs', () => {
      process.env.NOTION_AGENT_ACTIVITY_DB = 'activity_db';
      process.env.NOTION_REVIEW_QUEUE_DB = 'review_db';
      process.env.NOTION_CONTENT_CALENDAR_DB = 'calendar_db';
      process.env.NOTION_TWEET_QUEUE_DB = 'tweet_db';

      const config = loadConfig();

      expect(config.notion.databases.agentActivity).toBe('activity_db');
      expect(config.notion.databases.reviewQueue).toBe('review_db');
      expect(config.notion.databases.contentCalendar).toBe('calendar_db');
      expect(config.notion.databases.tweetQueue).toBe('tweet_db');
    });
  });

  describe('validateConfig', () => {
    it('should return true for valid config', () => {
      const config = loadConfig();

      expect(validateConfig(config)).toBe(true);
    });

    it('should return false for invalid Notion token format', () => {
      const config = loadConfig();
      config.notion.token = 'invalid_token';

      expect(validateConfig(config)).toBe(false);
    });

    it('should return false for invalid GitHub token format', () => {
      const config = loadConfig();
      config.github.token = 'invalid_token';

      expect(validateConfig(config)).toBe(false);
    });

    it('should accept github_pat_ token format', () => {
      process.env.GITHUB_TOKEN = 'github_pat_test_token';

      const config = loadConfig();

      expect(validateConfig(config)).toBe(true);
    });

    it('should return false for empty sync paths', () => {
      const config = loadConfig();
      config.sync.paths = [];

      expect(validateConfig(config)).toBe(false);
    });
  });
});
