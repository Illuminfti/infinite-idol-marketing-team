import { Octokit } from '@octokit/rest';
import { GitHubFile, GitHubCommit } from './types';
import { Logger } from './logger';

const logger = new Logger('GitHubClient');

export class GitHubClient {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor(token: string, owner: string, repo: string, branch: string = 'main') {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
    logger.debug(`GitHub client initialized for ${owner}/${repo}`);
  }

  async getFile(path: string): Promise<GitHubFile | null> {
    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if ('content' in response.data && !Array.isArray(response.data)) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        return {
          path: response.data.path,
          content,
          sha: response.data.sha,
          lastModified: '', // Will be populated from commit info if needed
        };
      }

      return null;
    } catch (error: unknown) {
      if ((error as { status?: number }).status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getFiles(paths: string[]): Promise<GitHubFile[]> {
    const files: GitHubFile[] = [];

    for (const path of paths) {
      const file = await this.getFile(path);
      if (file) {
        files.push(file);
      }
    }

    return files;
  }

  async listFilesInDirectory(path: string, pattern?: RegExp): Promise<string[]> {
    const files: string[] = [];

    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if (Array.isArray(response.data)) {
        for (const item of response.data) {
          if (item.type === 'file') {
            if (!pattern || pattern.test(item.path)) {
              files.push(item.path);
            }
          } else if (item.type === 'dir') {
            const subFiles = await this.listFilesInDirectory(item.path, pattern);
            files.push(...subFiles);
          }
        }
      }
    } catch (error: unknown) {
      if ((error as { status?: number }).status !== 404) {
        throw error;
      }
    }

    return files;
  }

  async createOrUpdateFile(
    path: string,
    content: string,
    message: string,
    existingSha?: string
  ): Promise<GitHubCommit> {
    const encodedContent = Buffer.from(content).toString('base64');

    let sha = existingSha;
    if (!sha) {
      const existing = await this.getFile(path);
      sha = existing?.sha;
    }

    const response = await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      content: encodedContent,
      branch: this.branch,
      sha,
    });

    logger.info(`${sha ? 'Updated' : 'Created'} file ${path}`);

    return {
      sha: response.data.commit.sha ?? '',
      message: response.data.commit.message ?? message,
      files: [path],
      timestamp: new Date().toISOString(),
    };
  }

  async deleteFile(path: string, message: string): Promise<void> {
    const file = await this.getFile(path);
    if (!file) {
      logger.warn(`File ${path} not found, skipping delete`);
      return;
    }

    await this.octokit.repos.deleteFile({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      sha: file.sha,
      branch: this.branch,
    });

    logger.info(`Deleted file ${path}`);
  }

  async getRecentCommits(since?: string, path?: string): Promise<GitHubCommit[]> {
    const response = await this.octokit.repos.listCommits({
      owner: this.owner,
      repo: this.repo,
      sha: this.branch,
      since,
      path,
      per_page: 100,
    });

    return response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      files: [], // Would need additional API call to get files
      timestamp: commit.commit.author?.date || new Date().toISOString(),
    }));
  }

  async getCommitFiles(sha: string): Promise<string[]> {
    const response = await this.octokit.repos.getCommit({
      owner: this.owner,
      repo: this.repo,
      ref: sha,
    });

    return response.data.files?.map(f => f.filename) || [];
  }

  async getChangedFilesSince(since: string, paths: string[]): Promise<string[]> {
    const changedFiles = new Set<string>();

    for (const path of paths) {
      const commits = await this.getRecentCommits(since, path);
      for (const commit of commits) {
        const files = await this.getCommitFiles(commit.sha);
        files.forEach(f => changedFiles.add(f));
      }
    }

    return Array.from(changedFiles);
  }

  async createBranch(branchName: string, fromBranch?: string): Promise<void> {
    const source = fromBranch || this.branch;
    const ref = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${source}`,
    });

    await this.octokit.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha: ref.data.object.sha,
    });

    logger.info(`Created branch ${branchName} from ${source}`);
  }

  async createPullRequest(
    title: string,
    body: string,
    head: string,
    base?: string
  ): Promise<number> {
    const response = await this.octokit.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      head,
      base: base || this.branch,
    });

    logger.info(`Created pull request #${response.data.number}`);
    return response.data.number;
  }

  getOwner(): string {
    return this.owner;
  }

  getRepo(): string {
    return this.repo;
  }

  getBranch(): string {
    return this.branch;
  }
}
