import { MarkdownGenerator } from '../../src/notion-to-github/markdown-generator';
import { FetchedPage } from '../../src/notion-to-github/notion-fetcher';
import { NotionBlock } from '../../src/shared/types';

describe('MarkdownGenerator', () => {
  let generator: MarkdownGenerator;

  beforeEach(() => {
    generator = new MarkdownGenerator();
  });

  const createPage = (
    title: string,
    blocks: NotionBlock[],
    properties: Record<string, unknown> = {}
  ): FetchedPage => ({
    id: 'test-page-id',
    title,
    properties,
    blocks,
    lastEditedTime: '2024-01-15T10:00:00Z',
    createdTime: '2024-01-01T10:00:00Z',
  });

  describe('generate', () => {
    it('should generate frontmatter with title and notionId', () => {
      const page = createPage('Test Title', []);

      const markdown = generator.generate(page);

      expect(markdown).toContain('---');
      expect(markdown).toContain('title: Test Title');
      expect(markdown).toContain('notionId: test-page-id');
    });

    it('should include lastSynced in frontmatter', () => {
      const page = createPage('Test', []);

      const markdown = generator.generate(page);

      expect(markdown).toContain('lastSynced:');
    });

    it('should convert paragraph blocks', () => {
      const page = createPage('Test', [
        {
          id: 'block1',
          type: 'paragraph',
          content: {
            rich_text: [{ type: 'text', text: { content: 'Hello world' } }],
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('Hello world');
    });

    it('should convert heading blocks', () => {
      const page = createPage('Test', [
        {
          id: 'h1',
          type: 'heading_1',
          content: {
            rich_text: [{ type: 'text', text: { content: 'Heading 1' } }],
          },
        },
        {
          id: 'h2',
          type: 'heading_2',
          content: {
            rich_text: [{ type: 'text', text: { content: 'Heading 2' } }],
          },
        },
        {
          id: 'h3',
          type: 'heading_3',
          content: {
            rich_text: [{ type: 'text', text: { content: 'Heading 3' } }],
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('# Heading 1');
      expect(markdown).toContain('## Heading 2');
      expect(markdown).toContain('### Heading 3');
    });

    it('should convert bullet list items', () => {
      const page = createPage('Test', [
        {
          id: 'bullet1',
          type: 'bulleted_list_item',
          content: {
            rich_text: [{ type: 'text', text: { content: 'Item 1' } }],
          },
        },
        {
          id: 'bullet2',
          type: 'bulleted_list_item',
          content: {
            rich_text: [{ type: 'text', text: { content: 'Item 2' } }],
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('- Item 1');
      expect(markdown).toContain('- Item 2');
    });

    it('should convert numbered list items', () => {
      const page = createPage('Test', [
        {
          id: 'num1',
          type: 'numbered_list_item',
          content: {
            rich_text: [{ type: 'text', text: { content: 'First' } }],
          },
        },
        {
          id: 'num2',
          type: 'numbered_list_item',
          content: {
            rich_text: [{ type: 'text', text: { content: 'Second' } }],
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('1. First');
      expect(markdown).toContain('1. Second');
    });

    it('should convert todo items', () => {
      const page = createPage('Test', [
        {
          id: 'todo1',
          type: 'to_do',
          content: {
            rich_text: [{ type: 'text', text: { content: 'Unchecked' } }],
            checked: false,
          },
        },
        {
          id: 'todo2',
          type: 'to_do',
          content: {
            rich_text: [{ type: 'text', text: { content: 'Checked' } }],
            checked: true,
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('- [ ] Unchecked');
      expect(markdown).toContain('- [x] Checked');
    });

    it('should convert code blocks', () => {
      const page = createPage('Test', [
        {
          id: 'code1',
          type: 'code',
          content: {
            rich_text: [{ type: 'text', text: { content: 'const x = 1;' } }],
            language: 'typescript',
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('```typescript');
      expect(markdown).toContain('const x = 1;');
      expect(markdown).toContain('```');
    });

    it('should convert quote blocks', () => {
      const page = createPage('Test', [
        {
          id: 'quote1',
          type: 'quote',
          content: {
            rich_text: [{ type: 'text', text: { content: 'A wise quote' } }],
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('> A wise quote');
    });

    it('should convert divider blocks', () => {
      const page = createPage('Test', [
        {
          id: 'divider1',
          type: 'divider',
          content: {},
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('---');
    });

    it('should skip frontmatter when disabled', () => {
      const page = createPage('Test', []);

      const markdown = generator.generate(page, { includeFrontmatter: false });

      expect(markdown).not.toContain('---');
      expect(markdown).not.toContain('title:');
    });

    it('should not include notionId when disabled', () => {
      const page = createPage('Test', []);

      const markdown = generator.generate(page, { includeNotionId: false });

      expect(markdown).not.toContain('notionId:');
    });
  });

  describe('blocksToMarkdown', () => {
    it('should handle empty blocks array', () => {
      const markdown = generator.blocksToMarkdown([]);

      expect(markdown).toBe('');
    });

    it('should handle nested children', () => {
      const blocks: NotionBlock[] = [
        {
          id: 'parent',
          type: 'bulleted_list_item',
          content: {
            rich_text: [{ type: 'text', text: { content: 'Parent' } }],
          },
          children: [
            {
              id: 'child',
              type: 'bulleted_list_item',
              content: {
                rich_text: [{ type: 'text', text: { content: 'Child' } }],
              },
            },
          ],
        },
      ];

      const markdown = generator.blocksToMarkdown(blocks);

      expect(markdown).toContain('- Parent');
      expect(markdown).toContain('Child');
    });

    it('should handle unknown block types gracefully', () => {
      const blocks: NotionBlock[] = [
        {
          id: 'unknown',
          type: 'unknown_type',
          content: {},
        },
      ];

      const markdown = generator.blocksToMarkdown(blocks);

      // Should not throw, just skip the block
      expect(markdown).toBe('');
    });
  });

  describe('rich text formatting', () => {
    it('should convert bold text', () => {
      const page = createPage('Test', [
        {
          id: 'para',
          type: 'paragraph',
          content: {
            rich_text: [
              { type: 'text', text: { content: 'bold' }, annotations: { bold: true } },
            ],
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('**bold**');
    });

    it('should convert italic text', () => {
      const page = createPage('Test', [
        {
          id: 'para',
          type: 'paragraph',
          content: {
            rich_text: [
              { type: 'text', text: { content: 'italic' }, annotations: { italic: true } },
            ],
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('*italic*');
    });

    it('should convert inline code', () => {
      const page = createPage('Test', [
        {
          id: 'para',
          type: 'paragraph',
          content: {
            rich_text: [
              { type: 'text', text: { content: 'code' }, annotations: { code: true } },
            ],
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('`code`');
    });

    it('should convert links', () => {
      const page = createPage('Test', [
        {
          id: 'para',
          type: 'paragraph',
          content: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Google', link: { url: 'https://google.com' } },
              },
            ],
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('[Google](https://google.com)');
    });

    it('should convert strikethrough text', () => {
      const page = createPage('Test', [
        {
          id: 'para',
          type: 'paragraph',
          content: {
            rich_text: [
              { type: 'text', text: { content: 'deleted' }, annotations: { strikethrough: true } },
            ],
          },
        },
      ]);

      const markdown = generator.generate(page);

      expect(markdown).toContain('~~deleted~~');
    });
  });

  describe('generateFilePath', () => {
    it('should use existing githubPath if available', () => {
      const page = createPage('Test', []);
      page.githubPath = 'existing/path.md';

      const filePath = generator.generateFilePath(page, 'base');

      expect(filePath).toBe('existing/path.md');
    });

    it('should generate path from title', () => {
      const page = createPage('My Document Title', []);

      const filePath = generator.generateFilePath(page, 'base');

      expect(filePath).toBe('base/my-document-title.md');
    });

    it('should handle titles with special characters', () => {
      const page = createPage('Test: A Document!', []);

      const filePath = generator.generateFilePath(page, '');

      expect(filePath).toBe('test-a-document.md');
    });

    it('should handle empty base path', () => {
      const page = createPage('Test', []);

      const filePath = generator.generateFilePath(page, '');

      expect(filePath).toBe('test.md');
    });
  });
});
