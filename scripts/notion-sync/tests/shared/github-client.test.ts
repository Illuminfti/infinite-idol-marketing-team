/* eslint-disable @typescript-eslint/no-explicit-any */
import { GitHubClient } from '../../src/shared/github-client';

// Store mock functions
const mockGetContent = jest.fn();
const mockCreateOrUpdateFileContents = jest.fn();
const mockDeleteFile = jest.fn();
const mockListCommits = jest.fn();
const mockGetCommit = jest.fn();
const mockGetRef = jest.fn();
const mockCreateRef = jest.fn();
const mockPullsCreate = jest.fn();

// Mock @octokit/rest module
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    repos: {
      getContent: mockGetContent,
      createOrUpdateFileContents: mockCreateOrUpdateFileContents,
      deleteFile: mockDeleteFile,
      listCommits: mockListCommits,
      getCommit: mockGetCommit,
    },
    git: {
      getRef: mockGetRef,
      createRef: mockCreateRef,
    },
    pulls: {
      create: mockPullsCreate,
    },
  })),
}));

describe('GitHubClient', () => {
  let client: GitHubClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = new GitHubClient('ghp_token', 'owner', 'repo', 'main');
  });

  describe('constructor', () => {
    it('should initialize with default branch', () => {
      const c = new GitHubClient('token', 'owner', 'repo');
      expect(c.getBranch()).toBe('main');
    });

    it('should initialize with custom branch', () => {
      expect(client.getBranch()).toBe('main');
      expect(client.getOwner()).toBe('owner');
      expect(client.getRepo()).toBe('repo');
    });
  });

  describe('getFile', () => {
    it('should get file content', async () => {
      const content = 'Hello World';
      const encodedContent = Buffer.from(content).toString('base64');

      mockGetContent.mockResolvedValue({
        data: {
          path: 'test.md',
          content: encodedContent,
          sha: 'sha123',
        },
      });

      const result = await client.getFile('test.md');

      expect(result).not.toBeNull();
      expect(result?.path).toBe('test.md');
      expect(result?.content).toBe(content);
      expect(result?.sha).toBe('sha123');
    });

    it('should return null for 404 errors', async () => {
      const error = { status: 404 };
      mockGetContent.mockRejectedValue(error);

      const result = await client.getFile('nonexistent.md');

      expect(result).toBeNull();
    });

    it('should throw for other errors', async () => {
      const error = { status: 500, message: 'Server error' };
      mockGetContent.mockRejectedValue(error);

      await expect(client.getFile('test.md')).rejects.toEqual(error);
    });

    it('should return null for directories', async () => {
      mockGetContent.mockResolvedValue({
        data: [{ type: 'file', path: 'file.md' }],
      });

      const result = await client.getFile('directory');

      expect(result).toBeNull();
    });
  });

  describe('getFiles', () => {
    it('should get multiple files', async () => {
      const content1 = Buffer.from('Content 1').toString('base64');
      const content2 = Buffer.from('Content 2').toString('base64');

      mockGetContent
        .mockResolvedValueOnce({
          data: { path: 'file1.md', content: content1, sha: 'sha1' },
        })
        .mockResolvedValueOnce({
          data: { path: 'file2.md', content: content2, sha: 'sha2' },
        });

      const result = await client.getFiles(['file1.md', 'file2.md']);

      expect(result).toHaveLength(2);
      expect(result[0].path).toBe('file1.md');
      expect(result[1].path).toBe('file2.md');
    });

    it('should skip files that return null', async () => {
      const content = Buffer.from('Content').toString('base64');
      const error = { status: 404 };

      mockGetContent
        .mockResolvedValueOnce({
          data: { path: 'file1.md', content, sha: 'sha1' },
        })
        .mockRejectedValueOnce(error);

      const result = await client.getFiles(['file1.md', 'file2.md']);

      expect(result).toHaveLength(1);
      expect(result[0].path).toBe('file1.md');
    });
  });

  describe('listFilesInDirectory', () => {
    it('should list files in a directory', async () => {
      mockGetContent.mockResolvedValue({
        data: [
          { type: 'file', path: 'dir/file1.md' },
          { type: 'file', path: 'dir/file2.md' },
        ],
      });

      const result = await client.listFilesInDirectory('dir');

      expect(result).toHaveLength(2);
      expect(result).toContain('dir/file1.md');
      expect(result).toContain('dir/file2.md');
    });

    it('should recursively list files in subdirectories', async () => {
      mockGetContent
        .mockResolvedValueOnce({
          data: [
            { type: 'file', path: 'dir/file1.md' },
            { type: 'dir', path: 'dir/subdir' },
          ],
        })
        .mockResolvedValueOnce({
          data: [{ type: 'file', path: 'dir/subdir/file2.md' }],
        });

      const result = await client.listFilesInDirectory('dir');

      expect(result).toHaveLength(2);
      expect(result).toContain('dir/file1.md');
      expect(result).toContain('dir/subdir/file2.md');
    });

    it('should filter files by pattern', async () => {
      mockGetContent.mockResolvedValue({
        data: [
          { type: 'file', path: 'dir/file.md' },
          { type: 'file', path: 'dir/file.txt' },
        ],
      });

      const result = await client.listFilesInDirectory('dir', /\.md$/);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('dir/file.md');
    });

    it('should return empty array for 404', async () => {
      mockGetContent.mockRejectedValue({ status: 404 });

      const result = await client.listFilesInDirectory('nonexistent');

      expect(result).toEqual([]);
    });

    it('should throw for other errors', async () => {
      const error = { status: 500 };
      mockGetContent.mockRejectedValue(error);

      await expect(client.listFilesInDirectory('dir')).rejects.toEqual(error);
    });
  });

  describe('createOrUpdateFile', () => {
    it('should create a new file', async () => {
      mockGetContent.mockRejectedValue({ status: 404 });

      mockCreateOrUpdateFileContents.mockResolvedValue({
        data: {
          commit: {
            sha: 'newsha',
            message: 'Create file',
          },
        },
      });

      const result = await client.createOrUpdateFile(
        'new.md',
        'content',
        'Create file'
      );

      expect(result.sha).toBe('newsha');
      expect(result.files).toContain('new.md');
    });

    it('should update an existing file', async () => {
      const content = Buffer.from('old').toString('base64');
      mockGetContent.mockResolvedValue({
        data: { path: 'test.md', content, sha: 'oldsha' },
      });

      mockCreateOrUpdateFileContents.mockResolvedValue({
        data: {
          commit: {
            sha: 'newsha',
            message: 'Update file',
          },
        },
      });

      const result = await client.createOrUpdateFile(
        'test.md',
        'new content',
        'Update file'
      );

      expect(result.sha).toBe('newsha');
    });

    it('should use provided sha', async () => {
      mockCreateOrUpdateFileContents.mockResolvedValue({
        data: {
          commit: {
            sha: 'newsha',
          },
        },
      });

      await client.createOrUpdateFile(
        'test.md',
        'content',
        'Update',
        'existingsha'
      );

      expect(mockCreateOrUpdateFileContents).toHaveBeenCalledWith(
        expect.objectContaining({ sha: 'existingsha' })
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete an existing file', async () => {
      const content = Buffer.from('content').toString('base64');
      mockGetContent.mockResolvedValue({
        data: { path: 'test.md', content, sha: 'sha123' },
      });

      mockDeleteFile.mockResolvedValue({});

      await client.deleteFile('test.md', 'Delete file');

      expect(mockDeleteFile).toHaveBeenCalledWith(
        expect.objectContaining({
          path: 'test.md',
          sha: 'sha123',
        })
      );
    });

    it('should skip delete for non-existent file', async () => {
      mockGetContent.mockRejectedValue({ status: 404 });

      await client.deleteFile('nonexistent.md', 'Delete');

      expect(mockDeleteFile).not.toHaveBeenCalled();
    });
  });

  describe('getRecentCommits', () => {
    it('should get recent commits', async () => {
      mockListCommits.mockResolvedValue({
        data: [
          {
            sha: 'sha1',
            commit: { message: 'Commit 1', author: { date: '2024-01-15T10:00:00Z' } },
          },
          {
            sha: 'sha2',
            commit: { message: 'Commit 2', author: { date: '2024-01-14T10:00:00Z' } },
          },
        ],
      });

      const result = await client.getRecentCommits();

      expect(result).toHaveLength(2);
      expect(result[0].sha).toBe('sha1');
      expect(result[0].message).toBe('Commit 1');
    });

    it('should filter by since and path', async () => {
      mockListCommits.mockResolvedValue({ data: [] });

      await client.getRecentCommits('2024-01-01', 'path/to/file');

      expect(mockListCommits).toHaveBeenCalledWith(
        expect.objectContaining({
          since: '2024-01-01',
          path: 'path/to/file',
        })
      );
    });
  });

  describe('getCommitFiles', () => {
    it('should get files changed in a commit', async () => {
      mockGetCommit.mockResolvedValue({
        data: {
          files: [{ filename: 'file1.md' }, { filename: 'file2.md' }],
        },
      });

      const result = await client.getCommitFiles('sha123');

      expect(result).toHaveLength(2);
      expect(result).toContain('file1.md');
      expect(result).toContain('file2.md');
    });

    it('should return empty array if no files', async () => {
      mockGetCommit.mockResolvedValue({
        data: {},
      });

      const result = await client.getCommitFiles('sha123');

      expect(result).toEqual([]);
    });
  });

  describe('getChangedFilesSince', () => {
    it('should get all changed files since a date', async () => {
      mockListCommits.mockResolvedValue({
        data: [{ sha: 'sha1', commit: { message: 'Change' } }],
      });

      mockGetCommit.mockResolvedValue({
        data: { files: [{ filename: 'file1.md' }] },
      });

      const result = await client.getChangedFilesSince('2024-01-01', [
        'knowledge-base',
      ]);

      expect(result).toContain('file1.md');
    });
  });

  describe('createBranch', () => {
    it('should create a new branch', async () => {
      mockGetRef.mockResolvedValue({
        data: { object: { sha: 'sourcesha' } },
      });

      mockCreateRef.mockResolvedValue({});

      await client.createBranch('feature-branch');

      expect(mockCreateRef).toHaveBeenCalledWith(
        expect.objectContaining({
          ref: 'refs/heads/feature-branch',
          sha: 'sourcesha',
        })
      );
    });

    it('should create branch from specified source', async () => {
      mockGetRef.mockResolvedValue({
        data: { object: { sha: 'devsha' } },
      });

      mockCreateRef.mockResolvedValue({});

      await client.createBranch('feature', 'develop');

      expect(mockGetRef).toHaveBeenCalledWith(
        expect.objectContaining({ ref: 'heads/develop' })
      );
    });
  });

  describe('createPullRequest', () => {
    it('should create a pull request', async () => {
      mockPullsCreate.mockResolvedValue({
        data: { number: 42 },
      });

      const prNumber = await client.createPullRequest(
        'Title',
        'Body',
        'feature-branch'
      );

      expect(prNumber).toBe(42);
      expect(mockPullsCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Title',
          body: 'Body',
          head: 'feature-branch',
          base: 'main',
        })
      );
    });

    it('should use custom base branch', async () => {
      mockPullsCreate.mockResolvedValue({
        data: { number: 43 },
      });

      await client.createPullRequest('Title', 'Body', 'feature', 'develop');

      expect(mockPullsCreate).toHaveBeenCalledWith(
        expect.objectContaining({ base: 'develop' })
      );
    });
  });
});
