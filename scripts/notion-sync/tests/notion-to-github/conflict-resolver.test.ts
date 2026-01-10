import { ConflictResolver } from '../../src/notion-to-github/conflict-resolver';
import { SyncStateManager } from '../../src/shared/sync-state';
import { GitHubClient } from '../../src/shared/github-client';
import { SyncConflict } from '../../src/shared/types';

// Mock dependencies
jest.mock('../../src/shared/sync-state');
jest.mock('../../src/shared/github-client');
jest.mock('fs');

describe('ConflictResolver', () => {
  let resolver: ConflictResolver;
  let mockStateManager: jest.Mocked<SyncStateManager>;
  let mockGitHubClient: jest.Mocked<GitHubClient>;

  beforeEach(() => {
    mockStateManager = new SyncStateManager() as jest.Mocked<SyncStateManager>;
    mockGitHubClient = new GitHubClient('token', 'owner', 'repo') as jest.Mocked<GitHubClient>;

    // Setup default mocks
    mockStateManager.getConflicts = jest.fn().mockReturnValue([]);
    mockStateManager.addConflict = jest.fn();
    mockStateManager.removeConflict = jest.fn();
    mockStateManager.resolveConflict = jest.fn();
    mockStateManager.clearResolvedConflicts = jest.fn();
    mockStateManager.getNotionPageId = jest.fn();
    mockStateManager.getLastSyncTime = jest.fn();
    mockStateManager.getFileHash = jest.fn();
    mockStateManager.computeHash = jest.fn();

    mockGitHubClient.getFile = jest.fn();

    resolver = new ConflictResolver(mockStateManager, mockGitHubClient);
  });

  describe('detectConflict', () => {
    it('should return null for new files', async () => {
      mockStateManager.getNotionPageId.mockReturnValue(undefined);

      const page = {
        id: 'page123',
        title: 'Test',
        properties: {},
        blocks: [],
        lastEditedTime: '2024-01-15T11:00:00Z',
        createdTime: '2024-01-01T00:00:00Z',
      };

      const result = await resolver.detectConflict('new.md', page);

      expect(result).toBeNull();
    });

    it('should return null when page IDs do not match', async () => {
      mockStateManager.getNotionPageId.mockReturnValue('different-page');

      const page = {
        id: 'page123',
        title: 'Test',
        properties: {},
        blocks: [],
        lastEditedTime: '2024-01-15T11:00:00Z',
        createdTime: '2024-01-01T00:00:00Z',
      };

      const result = await resolver.detectConflict('test.md', page);

      expect(result).toBeNull();
    });

    it('should return null when file does not exist in GitHub', async () => {
      mockStateManager.getNotionPageId.mockReturnValue('page123');
      mockGitHubClient.getFile.mockResolvedValue(null);

      const page = {
        id: 'page123',
        title: 'Test',
        properties: {},
        blocks: [],
        lastEditedTime: '2024-01-15T11:00:00Z',
        createdTime: '2024-01-01T00:00:00Z',
      };

      const result = await resolver.detectConflict('test.md', page);

      expect(result).toBeNull();
    });

    it('should return null when no previous sync exists', async () => {
      mockStateManager.getNotionPageId.mockReturnValue('page123');
      mockStateManager.getLastSyncTime.mockReturnValue('');
      mockGitHubClient.getFile.mockResolvedValue({
        path: 'test.md',
        content: '# Test',
        sha: 'abc123',
        lastModified: '2024-01-15T10:00:00Z',
      });

      const page = {
        id: 'page123',
        title: 'Test',
        properties: {},
        blocks: [],
        lastEditedTime: '2024-01-15T11:00:00Z',
        createdTime: '2024-01-01T00:00:00Z',
      };

      const result = await resolver.detectConflict('test.md', page);

      expect(result).toBeNull();
    });
  });

  describe('analyzeConflict', () => {
    it('should recommend notion-wins when Notion is newer', async () => {
      const conflict: SyncConflict = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T12:00:00Z',
      };

      mockGitHubClient.getFile.mockResolvedValue({
        path: 'test.md',
        content: '# Old content',
        sha: 'abc123',
        lastModified: '2024-01-15T10:00:00Z',
      });

      const analysis = await resolver.analyzeConflict(conflict);

      expect(analysis.recommendation).toBe('notion-wins');
      expect(analysis.reason).toContain('Notion was modified more recently');
    });

    it('should recommend github-wins when GitHub is newer', async () => {
      const conflict: SyncConflict = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T14:00:00Z',
        notionLastModified: '2024-01-15T12:00:00Z',
      };

      mockGitHubClient.getFile.mockResolvedValue({
        path: 'test.md',
        content: '# New content',
        sha: 'abc123',
        lastModified: '2024-01-15T14:00:00Z',
      });

      const analysis = await resolver.analyzeConflict(conflict);

      expect(analysis.recommendation).toBe('github-wins');
      expect(analysis.reason).toContain('GitHub was modified more recently');
    });
  });

  describe('resolveConflict', () => {
    it('should resolve with github-wins strategy', async () => {
      const conflict: SyncConflict = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T12:00:00Z',
      };

      const result = await resolver.resolveConflict(conflict, 'github-wins');

      expect(result.winner).toBe('github');
      expect(mockStateManager.resolveConflict).toHaveBeenCalledWith('test.md', 'github-wins');
    });

    it('should resolve with notion-wins strategy', async () => {
      const conflict: SyncConflict = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T12:00:00Z',
      };

      const result = await resolver.resolveConflict(conflict, 'notion-wins');

      expect(result.winner).toBe('notion');
      expect(mockStateManager.resolveConflict).toHaveBeenCalledWith('test.md', 'notion-wins');
    });

    it('should resolve with manual strategy', async () => {
      const conflict: SyncConflict = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T12:00:00Z',
      };

      const result = await resolver.resolveConflict(conflict, 'manual');

      expect(result.winner).toBe('manual');
      expect(mockStateManager.resolveConflict).toHaveBeenCalledWith('test.md', 'manual');
    });

    it('should resolve with newer-wins strategy by analyzing', async () => {
      const conflict: SyncConflict = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T12:00:00Z',
      };

      mockGitHubClient.getFile.mockResolvedValue({
        path: 'test.md',
        content: '# Content',
        sha: 'abc123',
        lastModified: '2024-01-15T10:00:00Z',
      });

      const result = await resolver.resolveConflict(conflict, 'newer-wins');

      // Notion is newer, so should win
      expect(result.winner).toBe('notion');
    });
  });

  describe('getUnresolvedConflicts', () => {
    it('should return only unresolved conflicts', () => {
      const conflicts: SyncConflict[] = [
        {
          filePath: 'resolved.md',
          notionPageId: 'page1',
          githubLastModified: '2024-01-15T10:00:00Z',
          notionLastModified: '2024-01-15T11:00:00Z',
          resolution: 'github-wins',
        },
        {
          filePath: 'unresolved.md',
          notionPageId: 'page2',
          githubLastModified: '2024-01-15T10:00:00Z',
          notionLastModified: '2024-01-15T11:00:00Z',
        },
      ];

      mockStateManager.getConflicts.mockReturnValue(conflicts);

      const unresolved = resolver.getUnresolvedConflicts();

      expect(unresolved).toHaveLength(1);
      expect(unresolved[0].filePath).toBe('unresolved.md');
    });
  });

  describe('getAllConflicts', () => {
    it('should return all conflicts', () => {
      const conflicts: SyncConflict[] = [
        {
          filePath: 'file1.md',
          notionPageId: 'page1',
          githubLastModified: '2024-01-15T10:00:00Z',
          notionLastModified: '2024-01-15T11:00:00Z',
        },
        {
          filePath: 'file2.md',
          notionPageId: 'page2',
          githubLastModified: '2024-01-15T10:00:00Z',
          notionLastModified: '2024-01-15T11:00:00Z',
          resolution: 'github-wins',
        },
      ];

      mockStateManager.getConflicts.mockReturnValue(conflicts);

      const allConflicts = resolver.getAllConflicts();

      expect(allConflicts).toHaveLength(2);
    });
  });

  describe('markResolved', () => {
    it('should remove conflict from state', () => {
      resolver.markResolved('test.md');

      expect(mockStateManager.removeConflict).toHaveBeenCalledWith('test.md');
    });
  });

  describe('clearResolvedConflicts', () => {
    it('should clear resolved conflicts from state', () => {
      resolver.clearResolvedConflicts();

      expect(mockStateManager.clearResolvedConflicts).toHaveBeenCalled();
    });
  });

  describe('addConflict', () => {
    it('should add conflict to state', () => {
      const conflict: SyncConflict = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T11:00:00Z',
      };

      resolver.addConflict(conflict);

      expect(mockStateManager.addConflict).toHaveBeenCalledWith(conflict);
    });
  });

  describe('hasConflict', () => {
    it('should return true if file has unresolved conflict', () => {
      mockStateManager.getConflicts.mockReturnValue([
        {
          filePath: 'test.md',
          notionPageId: 'page123',
          githubLastModified: '2024-01-15T10:00:00Z',
          notionLastModified: '2024-01-15T11:00:00Z',
        },
      ]);

      const result = resolver.hasConflict('test.md');

      expect(result).toBe(true);
    });

    it('should return false if file has resolved conflict', () => {
      mockStateManager.getConflicts.mockReturnValue([
        {
          filePath: 'test.md',
          notionPageId: 'page123',
          githubLastModified: '2024-01-15T10:00:00Z',
          notionLastModified: '2024-01-15T11:00:00Z',
          resolution: 'github-wins',
        },
      ]);

      const result = resolver.hasConflict('test.md');

      expect(result).toBe(false);
    });

    it('should return false if file has no conflict', () => {
      mockStateManager.getConflicts.mockReturnValue([]);

      const result = resolver.hasConflict('test.md');

      expect(result).toBe(false);
    });
  });

  describe('generateConflictReport', () => {
    it('should generate report for conflicts', () => {
      mockStateManager.getConflicts.mockReturnValue([
        {
          filePath: 'test.md',
          notionPageId: 'page123',
          githubLastModified: '2024-01-15T10:00:00Z',
          notionLastModified: '2024-01-15T11:00:00Z',
        },
      ]);

      const report = resolver.generateConflictReport();

      expect(report).toContain('# Sync Conflicts Report');
      expect(report).toContain('test.md');
      expect(report).toContain('page123');
      expect(report).toContain('Unresolved');
    });

    it('should return message when no conflicts', () => {
      mockStateManager.getConflicts.mockReturnValue([]);

      const report = resolver.generateConflictReport();

      expect(report).toBe('No conflicts detected.');
    });
  });
});
