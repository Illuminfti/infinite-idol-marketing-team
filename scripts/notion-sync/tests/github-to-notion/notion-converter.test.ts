import { NotionConverter } from '../../src/github-to-notion/notion-converter';
import { ParsedMarkdown } from '../../src/shared/types';

describe('NotionConverter', () => {
  let converter: NotionConverter;

  beforeEach(() => {
    converter = new NotionConverter();
  });

  describe('convert', () => {
    it('should convert headings', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: '# Heading 1\n\n## Heading 2\n\n### Heading 3',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks).toHaveLength(3);
      expect(blocks[0].type).toBe('heading_1');
      expect(blocks[1].type).toBe('heading_2');
      expect(blocks[2].type).toBe('heading_3');
    });

    it('should convert paragraphs', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: 'This is a paragraph.\n\nThis is another paragraph.',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks).toHaveLength(2);
      expect(blocks[0].type).toBe('paragraph');
      expect(blocks[1].type).toBe('paragraph');
    });

    it('should convert bullet lists', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: '- Item 1\n- Item 2\n- Item 3',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks).toHaveLength(3);
      blocks.forEach(block => {
        expect(block.type).toBe('bulleted_list_item');
      });
    });

    it('should convert numbered lists', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: '1. First\n2. Second\n3. Third',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks).toHaveLength(3);
      blocks.forEach(block => {
        expect(block.type).toBe('numbered_list_item');
      });
    });

    it('should convert code blocks', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: '```typescript\nconst x = 1;\n```',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('code');
      expect(blocks[0].content.language).toBe('typescript');
      expect(blocks[0].content.rich_text?.[0]?.text.content).toBe('const x = 1;');
    });

    it('should convert code blocks without language', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: '```\nsome code\n```',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('code');
      expect(blocks[0].content.language).toBe('plain text');
    });

    it('should convert blockquotes', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: '> This is a quote\n> Multiple lines',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].type).toBe('quote');
    });

    it('should convert horizontal rules', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: 'Before\n\n---\n\nAfter',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks.some(b => b.type === 'divider')).toBe(true);
    });

    it('should convert todo items', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: '- [ ] Unchecked task\n- [x] Checked task',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks).toHaveLength(2);
      expect(blocks[0].type).toBe('to_do');
      expect(blocks[0].content.checked).toBe(false);
      expect(blocks[1].type).toBe('to_do');
      expect(blocks[1].content.checked).toBe(true);
    });

    it('should handle complex mixed content', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: `# Title

Introduction paragraph.

## Section

- Bullet 1
- Bullet 2

\`\`\`javascript
const code = true;
\`\`\`

> A quote

---

Final thoughts.`,
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks.length).toBeGreaterThan(5);
      expect(blocks.find(b => b.type === 'heading_1')).toBeDefined();
      expect(blocks.find(b => b.type === 'heading_2')).toBeDefined();
      expect(blocks.find(b => b.type === 'bulleted_list_item')).toBeDefined();
      expect(blocks.find(b => b.type === 'code')).toBeDefined();
      expect(blocks.find(b => b.type === 'quote')).toBeDefined();
      expect(blocks.find(b => b.type === 'divider')).toBeDefined();
    });

    it('should handle empty content', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: '',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks).toHaveLength(0);
    });

    it('should handle content with only whitespace', () => {
      const parsed: ParsedMarkdown = {
        frontmatter: {},
        content: '   \n\n   ',
        rawContent: '',
      };

      const blocks = converter.convert(parsed);

      expect(blocks).toHaveLength(0);
    });
  });

  describe('parseInlineFormatting', () => {
    it('should parse bold text', () => {
      const result = converter.parseInlineFormatting('This is **bold** text');

      expect(result).toHaveLength(3);
      expect(result[1].annotations?.bold).toBe(true);
      expect(result[1].text.content).toBe('bold');
    });

    it('should parse italic text', () => {
      const result = converter.parseInlineFormatting('This is *italic* text');

      expect(result).toHaveLength(3);
      expect(result[1].annotations?.italic).toBe(true);
      expect(result[1].text.content).toBe('italic');
    });

    it('should parse strikethrough text', () => {
      const result = converter.parseInlineFormatting('This is ~~strikethrough~~ text');

      expect(result).toHaveLength(3);
      expect(result[1].annotations?.strikethrough).toBe(true);
      expect(result[1].text.content).toBe('strikethrough');
    });

    it('should parse inline code', () => {
      const result = converter.parseInlineFormatting('Use `const` keyword');

      expect(result).toHaveLength(3);
      expect(result[1].annotations?.code).toBe(true);
      expect(result[1].text.content).toBe('const');
    });

    it('should parse links', () => {
      const result = converter.parseInlineFormatting('Visit [Google](https://google.com)');

      expect(result).toHaveLength(2);
      expect(result[1].text.content).toBe('Google');
      expect(result[1].text.link?.url).toBe('https://google.com');
    });

    it('should handle mixed formatting', () => {
      const result = converter.parseInlineFormatting('**Bold** and *italic* and `code`');

      const bold = result.find(r => r.annotations?.bold);
      const italic = result.find(r => r.annotations?.italic);
      const code = result.find(r => r.annotations?.code);

      expect(bold).toBeDefined();
      expect(italic).toBeDefined();
      expect(code).toBeDefined();
    });

    it('should handle plain text', () => {
      const result = converter.parseInlineFormatting('Just plain text');

      expect(result).toHaveLength(1);
      expect(result[0].text.content).toBe('Just plain text');
      expect(result[0].annotations).toBeUndefined();
    });

    it('should handle empty string', () => {
      const result = converter.parseInlineFormatting('');

      expect(result).toHaveLength(0);
    });

    it('should handle underscore-style bold', () => {
      const result = converter.parseInlineFormatting('This is __bold__ text');

      const bold = result.find(r => r.annotations?.bold);
      expect(bold).toBeDefined();
      expect(bold?.text.content).toBe('bold');
    });
  });

  describe('toNotionApiBlocks', () => {
    it('should convert blocks to API format', () => {
      const blocks = [
        {
          id: '',
          type: 'paragraph',
          content: {
            rich_text: [{ type: 'text' as const, text: { content: 'Hello' } }],
          },
        },
      ];

      const apiBlocks = converter.toNotionApiBlocks(blocks);

      expect(apiBlocks).toHaveLength(1);
      expect(apiBlocks[0]).toHaveProperty('object', 'block');
      expect(apiBlocks[0]).toHaveProperty('type', 'paragraph');
      expect(apiBlocks[0]).toHaveProperty('paragraph');
    });

    it('should handle nested children', () => {
      const blocks = [
        {
          id: '',
          type: 'bulleted_list_item',
          content: {
            rich_text: [{ type: 'text' as const, text: { content: 'Parent' } }],
          },
          children: [
            {
              id: '',
              type: 'bulleted_list_item',
              content: {
                rich_text: [{ type: 'text' as const, text: { content: 'Child' } }],
              },
            },
          ],
        },
      ];

      const apiBlocks = converter.toNotionApiBlocks(blocks);

      expect(apiBlocks).toHaveLength(1);
      const parent = apiBlocks[0] as Record<string, unknown>;
      const listItem = parent.bulleted_list_item as Record<string, unknown>;
      expect(listItem.children).toBeDefined();
    });
  });
});
