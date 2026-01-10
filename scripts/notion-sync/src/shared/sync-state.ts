import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { SyncState, SyncConflict } from './types';
import { Logger } from './logger';

const logger = new Logger('SyncState');

export class SyncStateManager {
  private stateFilePath: string;
  private state: SyncState;

  constructor(stateFilePath?: string) {
    this.stateFilePath = stateFilePath || path.join(process.cwd(), '.sync-state.json');
    this.state = this.loadState();
  }

  private loadState(): SyncState {
    try {
      if (fs.existsSync(this.stateFilePath)) {
        const content = fs.readFileSync(this.stateFilePath, 'utf-8');
        const parsed = JSON.parse(content);
        logger.debug('Loaded sync state from file');
        return {
          lastSyncTime: parsed.lastSyncTime || '',
          fileHashes: { ...(parsed.fileHashes || {}) },
          notionPageIds: { ...(parsed.notionPageIds || {}) },
          conflicts: [...(parsed.conflicts || [])],
        };
      }
    } catch (error) {
      logger.warn('Failed to load sync state, using defaults', error);
    }
    return {
      lastSyncTime: '',
      fileHashes: {},
      notionPageIds: {},
      conflicts: [],
    };
  }

  saveState(): void {
    try {
      fs.writeFileSync(this.stateFilePath, JSON.stringify(this.state, null, 2));
      logger.debug('Saved sync state to file');
    } catch (error) {
      logger.error('Failed to save sync state', error);
      throw error;
    }
  }

  getLastSyncTime(): string {
    return this.state.lastSyncTime;
  }

  setLastSyncTime(timestamp: string): void {
    this.state.lastSyncTime = timestamp;
  }

  getFileHash(filePath: string): string | undefined {
    return this.state.fileHashes[filePath];
  }

  setFileHash(filePath: string, hash: string): void {
    this.state.fileHashes[filePath] = hash;
  }

  removeFileHash(filePath: string): void {
    delete this.state.fileHashes[filePath];
  }

  getAllFileHashes(): Record<string, string> {
    return { ...this.state.fileHashes };
  }

  getNotionPageId(filePath: string): string | undefined {
    return this.state.notionPageIds[filePath];
  }

  setNotionPageId(filePath: string, pageId: string): void {
    this.state.notionPageIds[filePath] = pageId;
  }

  removeNotionPageId(filePath: string): void {
    delete this.state.notionPageIds[filePath];
  }

  getAllNotionPageIds(): Record<string, string> {
    return { ...this.state.notionPageIds };
  }

  getFilePathByNotionId(notionId: string): string | undefined {
    const entries = Object.entries(this.state.notionPageIds);
    const found = entries.find(([_, id]) => id === notionId);
    return found ? found[0] : undefined;
  }

  addConflict(conflict: SyncConflict): void {
    const existingIndex = this.state.conflicts.findIndex(
      c => c.filePath === conflict.filePath
    );
    if (existingIndex >= 0) {
      this.state.conflicts[existingIndex] = conflict;
    } else {
      this.state.conflicts.push(conflict);
    }
  }

  getConflicts(): SyncConflict[] {
    return [...this.state.conflicts];
  }

  resolveConflict(filePath: string, resolution: 'github-wins' | 'notion-wins' | 'manual'): void {
    const conflict = this.state.conflicts.find(c => c.filePath === filePath);
    if (conflict) {
      conflict.resolution = resolution;
    }
  }

  removeConflict(filePath: string): void {
    this.state.conflicts = this.state.conflicts.filter(c => c.filePath !== filePath);
  }

  clearResolvedConflicts(): void {
    this.state.conflicts = this.state.conflicts.filter(c => !c.resolution);
  }

  hasFileChanged(filePath: string, content: string): boolean {
    const currentHash = this.computeHash(content);
    const storedHash = this.getFileHash(filePath);
    return storedHash !== currentHash;
  }

  computeHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  updateFileHash(filePath: string, content: string): void {
    const hash = this.computeHash(content);
    this.setFileHash(filePath, hash);
  }

  reset(): void {
    this.state = {
      lastSyncTime: '',
      fileHashes: {},
      notionPageIds: {},
      conflicts: [],
    };
    this.saveState();
  }

  getState(): SyncState {
    return { ...this.state };
  }
}
