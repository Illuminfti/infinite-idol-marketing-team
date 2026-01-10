// Jest setup file
// Increase timeout for integration tests
jest.setTimeout(30000);

// Store original env vars
const originalEnv = { ...process.env };

// Reset env vars before each test to allow individual tests to override
beforeEach(() => {
  // Set default test environment variables
  process.env.NOTION_TOKEN = 'secret_test_token_123';
  process.env.NOTION_KNOWLEDGE_BASE_DB = 'test_knowledge_db_123';
  process.env.NOTION_AGENT_ACTIVITY_DB = 'test_activity_db_123';
  process.env.NOTION_REVIEW_QUEUE_DB = 'test_review_db_123';
  process.env.NOTION_CONTENT_CALENDAR_DB = 'test_calendar_db_123';
  process.env.NOTION_TWEET_QUEUE_DB = 'test_tweet_db_123';
  process.env.GITHUB_TOKEN = 'ghp_test_token_123';
  process.env.GITHUB_OWNER = 'test-owner';
  process.env.GITHUB_REPO = 'test-repo';
  process.env.GITHUB_BRANCH = 'main';
  process.env.SYNC_PATHS = 'knowledge-base,agents,outputs';
  // Don't set DRY_RUN by default so tests can verify the default behavior
  delete process.env.DRY_RUN;
});

afterAll(() => {
  // Restore original env
  process.env = originalEnv;
});
