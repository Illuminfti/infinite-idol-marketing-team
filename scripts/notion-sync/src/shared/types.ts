// Notion types
export interface NotionPage {
  id: string;
  title: string;
  content: NotionBlock[];
  properties: Record<string, NotionProperty>;
  lastEditedTime: string;
  createdTime: string;
}

export interface NotionBlock {
  id: string;
  type: string;
  content: NotionBlockContent;
  children?: NotionBlock[];
}

export interface NotionBlockContent {
  rich_text?: NotionRichText[];
  language?: string;
  checked?: boolean;
  icon?: { emoji?: string };
  file?: { url?: string };
  external?: { url?: string };
  caption?: NotionRichText[];
  url?: string;
  cells?: NotionRichText[][];
  [key: string]: unknown;
}

export interface NotionProperty {
  type: string;
  value: unknown;
}

export interface NotionRichText {
  type: 'text';
  text: {
    content: string;
    link?: { url: string };
  };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
}

// GitHub types
export interface GitHubFile {
  path: string;
  content: string;
  sha: string;
  lastModified: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  files: string[];
  timestamp: string;
}

// Markdown types
export interface ParsedMarkdown {
  frontmatter: MarkdownFrontmatter;
  content: string;
  rawContent: string;
}

export interface MarkdownFrontmatter {
  title?: string;
  notionId?: string;
  lastSynced?: string;
  syncDirection?: 'github-to-notion' | 'notion-to-github' | 'both';
  status?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface MarkdownSection {
  level: number;
  title: string;
  content: string;
}

// Sync types
export interface SyncState {
  lastSyncTime: string;
  fileHashes: Record<string, string>;
  notionPageIds: Record<string, string>;
  conflicts: SyncConflict[];
}

export interface SyncConflict {
  filePath: string;
  notionPageId: string;
  githubLastModified: string;
  notionLastModified: string;
  resolution?: 'github-wins' | 'notion-wins' | 'manual';
}

export interface SyncResult {
  success: boolean;
  syncedFiles: string[];
  errors: SyncError[];
  conflicts: SyncConflict[];
  timestamp: string;
}

export interface SyncError {
  filePath?: string;
  notionPageId?: string;
  message: string;
  code: string;
  stack?: string;
}

// Database schemas
export interface AgentActivityEntry {
  agentName: string;
  action: string;
  timestamp: string;
  filesModified: string[];
  status: 'success' | 'error' | 'pending';
  details?: string;
}

export interface ReviewQueueItem {
  title: string;
  submittedBy: string;
  category: 'lore' | 'content' | 'event' | 'gacha' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
  content: string;
  notionPageId?: string;
  githubPath?: string;
  humanNotes?: string;
}

export interface TweetQueueItem {
  tweetText: string;
  pillar: 'ika-voice' | 'lore' | 'founder-hype' | 'engagement';
  createdBy: string;
  scheduledDate?: string;
  status: 'draft' | 'approved' | 'scheduled' | 'posted';
  engagementMetrics?: {
    likes?: number;
    retweets?: number;
    replies?: number;
  };
}

export interface ContentCalendarItem {
  date: string;
  contentType: 'tweet' | 'thread' | 'discord-event' | 'article';
  content: string;
  status: 'draft' | 'scheduled' | 'posted';
  platform: string;
  performance?: string;
}

// Config types
export interface SyncConfig {
  notion: {
    token: string;
    databases: {
      knowledgeBase: string;
      agentActivity: string;
      reviewQueue: string;
      contentCalendar: string;
      tweetQueue: string;
    };
  };
  github: {
    token: string;
    owner: string;
    repo: string;
    branch: string;
  };
  sync: {
    paths: string[];
    intervalMinutes: number;
    dryRun: boolean;
  };
}

// File change types
export interface FileChange {
  path: string;
  type: 'added' | 'modified' | 'deleted';
  content?: string;
  previousContent?: string;
}

// Notion API response types
export interface NotionDatabaseQuery {
  results: NotionPageResponse[];
  has_more: boolean;
  next_cursor?: string;
}

export interface NotionPageResponse {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, NotionPropertyResponse>;
  parent: {
    type: string;
    database_id?: string;
    page_id?: string;
  };
}

export interface NotionPropertyResponse {
  id: string;
  type: string;
  title?: NotionRichText[];
  rich_text?: NotionRichText[];
  select?: { name: string };
  multi_select?: Array<{ name: string }>;
  date?: { start: string; end?: string };
  checkbox?: boolean;
  url?: string;
  number?: number;
  [key: string]: unknown;
}
