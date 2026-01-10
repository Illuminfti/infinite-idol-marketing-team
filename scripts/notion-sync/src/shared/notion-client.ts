import { Client } from '@notionhq/client';
import {
  NotionBlock,
  NotionRichText,
  NotionPageResponse,
} from './types';
import { Logger } from './logger';

const logger = new Logger('NotionClient');

export class NotionClient {
  private client: Client;

  constructor(token: string) {
    this.client = new Client({ auth: token });
    logger.debug('Notion client initialized');
  }

  async queryDatabase(databaseId: string, filter?: object): Promise<NotionPageResponse[]> {
    const allResults: NotionPageResponse[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const response = await this.client.databases.query({
        database_id: databaseId,
        filter: filter as Parameters<typeof this.client.databases.query>[0]['filter'],
        start_cursor: startCursor,
        page_size: 100,
      });

      allResults.push(...(response.results as NotionPageResponse[]));
      hasMore = response.has_more;
      startCursor = response.next_cursor ?? undefined;
    }

    logger.debug(`Queried database ${databaseId}, found ${allResults.length} pages`);
    return allResults;
  }

  async getPage(pageId: string): Promise<NotionPageResponse> {
    const response = await this.client.pages.retrieve({ page_id: pageId });
    return response as NotionPageResponse;
  }

  async getPageBlocks(pageId: string): Promise<NotionBlock[]> {
    const allBlocks: NotionBlock[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const response = await this.client.blocks.children.list({
        block_id: pageId,
        start_cursor: startCursor,
        page_size: 100,
      });

      for (const block of response.results) {
        const typedBlock = block as { id: string; type: string; [key: string]: unknown };
        const notionBlock: NotionBlock = {
          id: typedBlock.id,
          type: typedBlock.type,
          content: typedBlock[typedBlock.type] as NotionBlock['content'],
        };

        // Recursively fetch children if the block has them
        if ((typedBlock as { has_children?: boolean }).has_children) {
          notionBlock.children = await this.getPageBlocks(typedBlock.id);
        }

        allBlocks.push(notionBlock);
      }

      hasMore = response.has_more;
      startCursor = response.next_cursor ?? undefined;
    }

    return allBlocks;
  }

  async createPage(
    databaseId: string,
    properties: Record<string, unknown>,
    children?: object[]
  ): Promise<string> {
    const response = await this.client.pages.create({
      parent: { database_id: databaseId },
      properties: properties as Parameters<typeof this.client.pages.create>[0]['properties'],
      children: children as Parameters<typeof this.client.pages.create>[0]['children'],
    });

    logger.info(`Created page in database ${databaseId}: ${response.id}`);
    return response.id;
  }

  async updatePage(
    pageId: string,
    properties: Record<string, unknown>
  ): Promise<void> {
    await this.client.pages.update({
      page_id: pageId,
      properties: properties as Parameters<typeof this.client.pages.update>[0]['properties'],
    });
    logger.info(`Updated page ${pageId}`);
  }

  async appendBlocks(pageId: string, blocks: object[]): Promise<void> {
    // Notion API has a limit of 100 blocks per request
    const chunks = this.chunkArray(blocks, 100);

    for (const chunk of chunks) {
      await this.client.blocks.children.append({
        block_id: pageId,
        children: chunk as Parameters<typeof this.client.blocks.children.append>[0]['children'],
      });
    }

    logger.debug(`Appended ${blocks.length} blocks to page ${pageId}`);
  }

  async deleteBlock(blockId: string): Promise<void> {
    await this.client.blocks.delete({ block_id: blockId });
    logger.debug(`Deleted block ${blockId}`);
  }

  async clearPageContent(pageId: string): Promise<void> {
    const blocks = await this.getPageBlocks(pageId);
    for (const block of blocks) {
      await this.deleteBlock(block.id);
    }
    logger.debug(`Cleared content of page ${pageId}`);
  }

  async archivePage(pageId: string): Promise<void> {
    await this.client.pages.update({
      page_id: pageId,
      archived: true,
    });
    logger.info(`Archived page ${pageId}`);
  }

  async search(query: string, filter?: { property: string; value: string }): Promise<NotionPageResponse[]> {
    const response = await this.client.search({
      query,
      filter: filter ? {
        property: filter.property as 'object',
        value: filter.value as 'page' | 'database',
      } : undefined,
    });

    return response.results as NotionPageResponse[];
  }

  buildTitleProperty(title: string): { title: NotionRichText[] } {
    return {
      title: [
        {
          type: 'text',
          text: { content: title },
        },
      ],
    };
  }

  buildRichTextProperty(text: string): { rich_text: NotionRichText[] } {
    return {
      rich_text: [
        {
          type: 'text',
          text: { content: text },
        },
      ],
    };
  }

  buildSelectProperty(value: string): { select: { name: string } } {
    return {
      select: { name: value },
    };
  }

  buildMultiSelectProperty(values: string[]): { multi_select: Array<{ name: string }> } {
    return {
      multi_select: values.map(name => ({ name })),
    };
  }

  buildDateProperty(date: string): { date: { start: string } } {
    return {
      date: { start: date },
    };
  }

  buildCheckboxProperty(checked: boolean): { checkbox: boolean } {
    return {
      checkbox: checked,
    };
  }

  buildUrlProperty(url: string): { url: string } {
    return { url };
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
