import * as fs from 'fs';
import * as path from 'path';
import { FileWatcher } from '../../src/github-to-notion/file-watcher';
import { SyncStateManager } from '../../src/shared/sync-state';

// Mock fs module
jest.mock('fs');
jest.mock('glob', () => ({
  glob: jest.fn().mockResolvedValue([]),
}));

describe('FileWatcher', () => {
  let fileWatcher: FileWatcher;
  let stateManager: SyncStateManager;
  const mockBasePath = '/test/project';

  beforeEach(() => {
    jest.clearAllMocks();
    stateManager = new SyncStateManager('/tmp/test-state.json');
    fileWatcher = new FileWatcher(stateManager, mockBasePath);

    // Mock fs functions
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('# Test Content');
    (fs.statSync as jest.Mock).mockReturnValue({
      isFile: () => true,
      mtime: new Date(),
    });
  });

  describe('constructor', () => {
    it('should use provided base path', () => {
      const watcher = new FileWatcher(stateManager, '/custom/path');
      expect(watcher).toBeDefined();
    });

    it('should default to cwd if no base path provided', () => {
      const watcher = new FileWatcher(stateManager);
      expect(watcher).toBeDefined();
    });
  });

  describe('readFile', () => {
    it('should read file content', () => {
      const content = 'Test content';
      (fs.readFileSync as jest.Mock).mockReturnValue(content);

      const result = fileWatcher.readFile('test.md');

      expect(result).toBe(content);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        path.join(mockBasePath, 'test.md'),
        'utf-8'
      );
    });
  });

  describe('fileExists', () => {
    it('should return true for existing files', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = fileWatcher.fileExists('test.md');

      expect(result).toBe(true);
    });

    it('should return false for non-existing files', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = fileWatcher.fileExists('nonexistent.md');

      expect(result).toBe(false);
    });
  });

  describe('getFileStats', () => {
    it('should return stats for existing files', () => {
      const mockStats = { isFile: () => true, mtime: new Date() };
      (fs.statSync as jest.Mock).mockReturnValue(mockStats);

      const result = fileWatcher.getFileStats('test.md');

      expect(result).toBeDefined();
    });

    it('should return null for non-existing files', () => {
      (fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      const result = fileWatcher.getFileStats('nonexistent.md');

      expect(result).toBeNull();
    });
  });

  describe('categorizeFiles', () => {
    it('should categorize files by path prefix', () => {
      const files = [
        'agents/00-coordinator.md',
        'agents/01-lore.md',
        'knowledge-base/lore/world.md',
        'outputs/calendar/week1.md',
        'README.md',
      ];

      const categories = fileWatcher.categorizeFiles(files);

      expect(categories.agents).toHaveLength(2);
      expect(categories['knowledge-base']).toHaveLength(1);
      expect(categories.outputs).toHaveLength(1);
      expect(categories.other).toHaveLength(1);
    });

    it('should handle empty file list', () => {
      const categories = fileWatcher.categorizeFiles([]);

      expect(categories.agents).toHaveLength(0);
      expect(categories['knowledge-base']).toHaveLength(0);
      expect(categories.outputs).toHaveLength(0);
      expect(categories.other).toHaveLength(0);
    });
  });

  describe('getSpecifiedFiles', () => {
    it('should filter to only markdown files', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('# Content');

      const result = await fileWatcher.getSpecifiedFiles([
        'test.md',
        'test.txt',
        'test.js',
        'readme.md',
      ]);

      // Should only include .md files
      expect(result.length).toBeLessThanOrEqual(2);
    });

    it('should detect deleted files', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      // Set up state with a previously tracked file
      stateManager.setFileHash('deleted.md', 'oldhash');

      const result = await fileWatcher.getSpecifiedFiles(['deleted.md']);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('deleted');
    });

    it('should detect new files', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('# New Content');

      // No previous hash in state
      const result = await fileWatcher.getSpecifiedFiles(['new.md']);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('added');
    });

    it('should detect modified files', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('# Modified Content');

      // Set up state with a different hash
      stateManager.setFileHash('modified.md', 'oldhash');

      const result = await fileWatcher.getSpecifiedFiles(['modified.md']);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('modified');
    });

    it('should skip unchanged files', async () => {
      const content = '# Same Content';
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(content);

      // Set up state with matching hash
      stateManager.updateFileHash('unchanged.md', content);

      const result = await fileWatcher.getSpecifiedFiles(['unchanged.md']);

      expect(result).toHaveLength(0);
    });
  });

  describe('updateState', () => {
    it('should update hashes for added/modified files', () => {
      const changes = [
        { path: 'new.md', type: 'added' as const, content: '# New' },
        { path: 'modified.md', type: 'modified' as const, content: '# Modified' },
      ];

      fileWatcher.updateState(changes);

      expect(stateManager.getFileHash('new.md')).toBeDefined();
      expect(stateManager.getFileHash('modified.md')).toBeDefined();
    });

    it('should remove hashes for deleted files', () => {
      stateManager.setFileHash('deleted.md', 'somehash');
      stateManager.setNotionPageId('deleted.md', 'somepageid');

      const changes = [{ path: 'deleted.md', type: 'deleted' as const }];

      fileWatcher.updateState(changes);

      expect(stateManager.getFileHash('deleted.md')).toBeUndefined();
      expect(stateManager.getNotionPageId('deleted.md')).toBeUndefined();
    });

    it('should update last sync time', () => {
      const changes = [{ path: 'test.md', type: 'added' as const, content: '# Test' }];

      fileWatcher.updateState(changes);

      expect(stateManager.getLastSyncTime()).toBeDefined();
    });
  });
});
