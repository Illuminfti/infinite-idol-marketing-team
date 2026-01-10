import * as fs from 'fs';
import { SyncStateManager } from '../../src/shared/sync-state';

jest.mock('fs');

describe('SyncStateManager', () => {
  const testStatePath = '/tmp/test-sync-state.json';

  // Helper to create a fresh state manager
  function createStateManager(): SyncStateManager {
    // Reset all mocks to their initial state
    jest.resetAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.readFileSync as jest.Mock).mockReturnValue('{}');
    return new SyncStateManager(testStatePath);
  }

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    it('should load existing state from file', () => {
      const existingState = {
        lastSyncTime: '2024-01-15T10:00:00Z',
        fileHashes: { 'test.md': 'abc123' },
        notionPageIds: { 'test.md': 'page123' },
        conflicts: [],
      };

      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(existingState));

      const manager = new SyncStateManager(testStatePath);

      expect(manager.getLastSyncTime()).toBe('2024-01-15T10:00:00Z');
      expect(manager.getFileHash('test.md')).toBe('abc123');
    });

    it('should use defaults when no file exists', () => {
      const manager = createStateManager();

      expect(manager.getLastSyncTime()).toBe('');
      expect(manager.getAllFileHashes()).toEqual({});
    });

    it('should handle corrupted state file gracefully', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json{{{');

      const manager = new SyncStateManager(testStatePath);

      expect(manager.getLastSyncTime()).toBe('');
    });
  });

  describe('file hashes', () => {
    it('should set and get file hashes', () => {
      const stateManager = createStateManager();
      stateManager.setFileHash('test.md', 'hash123');

      expect(stateManager.getFileHash('test.md')).toBe('hash123');
    });

    it('should remove file hashes', () => {
      const stateManager = createStateManager();
      stateManager.setFileHash('test.md', 'hash123');
      stateManager.removeFileHash('test.md');

      expect(stateManager.getFileHash('test.md')).toBeUndefined();
    });

    it('should return all file hashes', () => {
      const stateManager = createStateManager();
      stateManager.setFileHash('file1.md', 'hash1');
      stateManager.setFileHash('file2.md', 'hash2');

      const hashes = stateManager.getAllFileHashes();

      expect(hashes).toEqual({
        'file1.md': 'hash1',
        'file2.md': 'hash2',
      });
    });

    it('should return a copy of hashes, not the original', () => {
      const stateManager = createStateManager();
      stateManager.setFileHash('test.md', 'hash123');

      const hashes = stateManager.getAllFileHashes();
      hashes['new.md'] = 'newhash';

      expect(stateManager.getFileHash('new.md')).toBeUndefined();
    });
  });

  describe('notion page IDs', () => {
    it('should set and get page IDs', () => {
      const stateManager = createStateManager();
      stateManager.setNotionPageId('test.md', 'page123');

      expect(stateManager.getNotionPageId('test.md')).toBe('page123');
    });

    it('should remove page IDs', () => {
      const stateManager = createStateManager();
      stateManager.setNotionPageId('test.md', 'page123');
      stateManager.removeNotionPageId('test.md');

      expect(stateManager.getNotionPageId('test.md')).toBeUndefined();
    });

    it('should find file path by notion ID', () => {
      const stateManager = createStateManager();
      stateManager.setNotionPageId('test.md', 'page123');

      const filePath = stateManager.getFilePathByNotionId('page123');

      expect(filePath).toBe('test.md');
    });

    it('should return undefined for unknown notion ID', () => {
      const stateManager = createStateManager();
      const filePath = stateManager.getFilePathByNotionId('unknown');

      expect(filePath).toBeUndefined();
    });
  });

  describe('sync time', () => {
    it('should set and get last sync time', () => {
      const stateManager = createStateManager();
      const time = '2024-01-15T10:00:00Z';
      stateManager.setLastSyncTime(time);

      expect(stateManager.getLastSyncTime()).toBe(time);
    });
  });

  describe('conflicts', () => {
    it('should add conflicts', () => {
      const stateManager = createStateManager();
      const conflict = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T11:00:00Z',
      };

      stateManager.addConflict(conflict);

      expect(stateManager.getConflicts()).toHaveLength(1);
    });

    it('should update existing conflict for same file', () => {
      const stateManager = createStateManager();
      const conflict1 = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T11:00:00Z',
      };

      const conflict2 = {
        filePath: 'test.md',
        notionPageId: 'page456',
        githubLastModified: '2024-01-15T12:00:00Z',
        notionLastModified: '2024-01-15T13:00:00Z',
      };

      stateManager.addConflict(conflict1);
      stateManager.addConflict(conflict2);

      const conflicts = stateManager.getConflicts();
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].notionPageId).toBe('page456');
    });

    it('should resolve conflicts', () => {
      const stateManager = createStateManager();
      const conflict = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T11:00:00Z',
      };

      stateManager.addConflict(conflict);
      stateManager.resolveConflict('test.md', 'github-wins');

      const conflicts = stateManager.getConflicts();
      expect(conflicts[0].resolution).toBe('github-wins');
    });

    it('should remove conflicts', () => {
      const stateManager = createStateManager();
      const conflict = {
        filePath: 'test.md',
        notionPageId: 'page123',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T11:00:00Z',
      };

      stateManager.addConflict(conflict);
      stateManager.removeConflict('test.md');

      expect(stateManager.getConflicts()).toHaveLength(0);
    });

    it('should clear resolved conflicts', () => {
      const stateManager = createStateManager();

      // Add a conflict and then resolve it
      stateManager.addConflict({
        filePath: 'resolved.md',
        notionPageId: 'page1',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T11:00:00Z',
      });
      stateManager.resolveConflict('resolved.md', 'github-wins');

      // Add an unresolved conflict
      stateManager.addConflict({
        filePath: 'unresolved.md',
        notionPageId: 'page2',
        githubLastModified: '2024-01-15T10:00:00Z',
        notionLastModified: '2024-01-15T11:00:00Z',
      });

      stateManager.clearResolvedConflicts();

      const conflicts = stateManager.getConflicts();
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].filePath).toBe('unresolved.md');
    });
  });

  describe('hasFileChanged', () => {
    it('should return true for new files', () => {
      const stateManager = createStateManager();
      const result = stateManager.hasFileChanged('new.md', 'content');

      expect(result).toBe(true);
    });

    it('should return true for modified files', () => {
      const stateManager = createStateManager();
      stateManager.setFileHash('test.md', 'oldhash');

      const result = stateManager.hasFileChanged('test.md', 'new content');

      expect(result).toBe(true);
    });

    it('should return false for unchanged files', () => {
      const stateManager = createStateManager();
      const content = 'same content';
      stateManager.updateFileHash('test.md', content);

      const result = stateManager.hasFileChanged('test.md', content);

      expect(result).toBe(false);
    });
  });

  describe('computeHash', () => {
    it('should compute consistent hashes', () => {
      const stateManager = createStateManager();
      const content = 'test content';
      const hash1 = stateManager.computeHash(content);
      const hash2 = stateManager.computeHash(content);

      expect(hash1).toBe(hash2);
    });

    it('should compute different hashes for different content', () => {
      const stateManager = createStateManager();
      const hash1 = stateManager.computeHash('content 1');
      const hash2 = stateManager.computeHash('content 2');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('saveState', () => {
    it('should write state to file', () => {
      const stateManager = createStateManager();
      stateManager.setLastSyncTime('2024-01-15T10:00:00Z');
      stateManager.saveState();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        testStatePath,
        expect.any(String)
      );
    });
  });

  describe('reset', () => {
    it('should clear all state', () => {
      const stateManager = createStateManager();
      stateManager.setLastSyncTime('2024-01-15T10:00:00Z');
      stateManager.setFileHash('test.md', 'hash');
      stateManager.setNotionPageId('test.md', 'page');

      stateManager.reset();

      expect(stateManager.getLastSyncTime()).toBe('');
      expect(stateManager.getAllFileHashes()).toEqual({});
      expect(stateManager.getAllNotionPageIds()).toEqual({});
    });
  });

  describe('getState', () => {
    it('should return a copy of the state', () => {
      const stateManager = createStateManager();
      stateManager.setLastSyncTime('2024-01-15T10:00:00Z');
      stateManager.setFileHash('test.md', 'hash');

      const state = stateManager.getState();

      expect(state.lastSyncTime).toBe('2024-01-15T10:00:00Z');
      expect(state.fileHashes['test.md']).toBe('hash');
    });
  });
});
