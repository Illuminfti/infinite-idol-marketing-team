import { NotionBlock, ParsedMarkdown, NotionRichText } from '../shared/types';

export class NotionConverter {
  /**
   * Convert parsed markdown to Notion blocks
   */
  convert(parsed: ParsedMarkdown): NotionBlock[] {
    const blocks: NotionBlock[] = [];
    const lines = parsed.content.split('\n');

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) {
        i++;
        continue;
      }

      // Headers
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        blocks.push(this.createHeadingBlock(headerMatch[1].length, headerMatch[2]));
        i++;
        continue;
      }

      // Code blocks
      if (line.startsWith('```')) {
        const { block, endIndex } = this.parseCodeBlock(lines, i);
        blocks.push(block);
        i = endIndex + 1;
        continue;
      }

      // Todo items (must come before bullet lists)
      if (line.match(/^[-*]\s+\[([ xX])\]/)) {
        const { block, endIndex } = this.parseTodoList(lines, i);
        blocks.push(...block);
        i = endIndex + 1;
        continue;
      }

      // Bullet lists
      if (line.match(/^[-*]\s+/)) {
        const { block, endIndex } = this.parseBulletList(lines, i);
        blocks.push(...block);
        i = endIndex + 1;
        continue;
      }

      // Numbered lists
      if (line.match(/^\d+\.\s+/)) {
        const { block, endIndex } = this.parseNumberedList(lines, i);
        blocks.push(...block);
        i = endIndex + 1;
        continue;
      }

      // Blockquotes
      if (line.startsWith('>')) {
        const { block, endIndex } = this.parseBlockquote(lines, i);
        blocks.push(block);
        i = endIndex + 1;
        continue;
      }

      // Horizontal rule
      if (line.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
        blocks.push(this.createDividerBlock());
        i++;
        continue;
      }

      // Tables
      if (line.includes('|') && i + 1 < lines.length && lines[i + 1].match(/^\|?[-:|]+\|/)) {
        const { block, endIndex } = this.parseTable(lines, i);
        blocks.push(block);
        i = endIndex + 1;
        continue;
      }

      // Default: paragraph
      const { block, endIndex } = this.parseParagraph(lines, i);
      blocks.push(block);
      i = endIndex + 1;
    }

    return blocks;
  }

  private createHeadingBlock(level: number, text: string): NotionBlock {
    const type = level === 1 ? 'heading_1' : level === 2 ? 'heading_2' : 'heading_3';
    return {
      id: '',
      type,
      content: {
        rich_text: this.parseInlineFormatting(text),
      },
    };
  }

  private createParagraphBlock(text: string): NotionBlock {
    return {
      id: '',
      type: 'paragraph',
      content: {
        rich_text: this.parseInlineFormatting(text),
      },
    };
  }

  private createDividerBlock(): NotionBlock {
    return {
      id: '',
      type: 'divider',
      content: {},
    };
  }

  private parseCodeBlock(lines: string[], startIndex: number): { block: NotionBlock; endIndex: number } {
    const firstLine = lines[startIndex];
    const language = firstLine.replace('```', '').trim() || 'plain text';

    const codeLines: string[] = [];
    let i = startIndex + 1;

    while (i < lines.length && !lines[i].startsWith('```')) {
      codeLines.push(lines[i]);
      i++;
    }

    return {
      block: {
        id: '',
        type: 'code',
        content: {
          rich_text: [{ type: 'text', text: { content: codeLines.join('\n') } }],
          language,
        },
      },
      endIndex: i,
    };
  }

  private parseBulletList(lines: string[], startIndex: number): { block: NotionBlock[]; endIndex: number } {
    const blocks: NotionBlock[] = [];
    let i = startIndex;

    while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
      const text = lines[i].replace(/^[-*]\s+/, '');
      blocks.push({
        id: '',
        type: 'bulleted_list_item',
        content: {
          rich_text: this.parseInlineFormatting(text),
        },
      });
      i++;
    }

    return { block: blocks, endIndex: i - 1 };
  }

  private parseNumberedList(lines: string[], startIndex: number): { block: NotionBlock[]; endIndex: number } {
    const blocks: NotionBlock[] = [];
    let i = startIndex;

    while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
      const text = lines[i].replace(/^\d+\.\s+/, '');
      blocks.push({
        id: '',
        type: 'numbered_list_item',
        content: {
          rich_text: this.parseInlineFormatting(text),
        },
      });
      i++;
    }

    return { block: blocks, endIndex: i - 1 };
  }

  private parseTodoList(lines: string[], startIndex: number): { block: NotionBlock[]; endIndex: number } {
    const blocks: NotionBlock[] = [];
    let i = startIndex;

    while (i < lines.length && lines[i].match(/^[-*]\s+\[([ xX])\]/)) {
      const match = lines[i].match(/^[-*]\s+\[([ xX])\]\s*(.*)$/);
      if (match) {
        const checked = match[1].toLowerCase() === 'x';
        const text = match[2];
        blocks.push({
          id: '',
          type: 'to_do',
          content: {
            rich_text: this.parseInlineFormatting(text),
            checked,
          },
        });
      }
      i++;
    }

    return { block: blocks, endIndex: i - 1 };
  }

  private parseBlockquote(lines: string[], startIndex: number): { block: NotionBlock; endIndex: number } {
    const quoteLines: string[] = [];
    let i = startIndex;

    while (i < lines.length && lines[i].startsWith('>')) {
      quoteLines.push(lines[i].replace(/^>\s*/, ''));
      i++;
    }

    return {
      block: {
        id: '',
        type: 'quote',
        content: {
          rich_text: this.parseInlineFormatting(quoteLines.join('\n')),
        },
      },
      endIndex: i - 1,
    };
  }

  private parseTable(lines: string[], startIndex: number): { block: NotionBlock; endIndex: number } {
    // Notion doesn't have native table blocks, so we convert to a code block
    const tableLines: string[] = [];
    let i = startIndex;

    while (i < lines.length && lines[i].includes('|')) {
      tableLines.push(lines[i]);
      i++;
    }

    return {
      block: {
        id: '',
        type: 'code',
        content: {
          rich_text: [{ type: 'text', text: { content: tableLines.join('\n') } }],
          language: 'markdown',
        },
      },
      endIndex: i - 1,
    };
  }

  private parseParagraph(lines: string[], startIndex: number): { block: NotionBlock; endIndex: number } {
    const paragraphLines: string[] = [];
    let i = startIndex;

    while (i < lines.length && lines[i].trim() && !this.isSpecialLine(lines[i])) {
      paragraphLines.push(lines[i]);
      i++;
    }

    return {
      block: this.createParagraphBlock(paragraphLines.join(' ')),
      endIndex: i - 1,
    };
  }

  private isSpecialLine(line: string): boolean {
    return (
      line.match(/^#{1,6}\s+/) !== null ||
      line.startsWith('```') ||
      line.match(/^[-*]\s+/) !== null ||
      line.match(/^\d+\.\s+/) !== null ||
      line.startsWith('>') ||
      line.match(/^(-{3,}|\*{3,}|_{3,})$/) !== null ||
      (line.includes('|') && line.match(/^\|?[-:|]+\|/) !== null)
    );
  }

  /**
   * Parse inline formatting (bold, italic, code, links)
   */
  parseInlineFormatting(text: string): NotionRichText[] {
    const richText: NotionRichText[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      // Bold: **text** or __text__
      const boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/);
      if (boldMatch) {
        richText.push({
          type: 'text',
          text: { content: boldMatch[2] },
          annotations: { bold: true },
        });
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Italic: *text* or _text_ (but not ** or __)
      const italicMatch = remaining.match(/^(\*|_)([^*_]+?)\1(?!\1)/);
      if (italicMatch) {
        richText.push({
          type: 'text',
          text: { content: italicMatch[2] },
          annotations: { italic: true },
        });
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Strikethrough: ~~text~~
      const strikeMatch = remaining.match(/^~~(.+?)~~/);
      if (strikeMatch) {
        richText.push({
          type: 'text',
          text: { content: strikeMatch[1] },
          annotations: { strikethrough: true },
        });
        remaining = remaining.slice(strikeMatch[0].length);
        continue;
      }

      // Code: `text`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        richText.push({
          type: 'text',
          text: { content: codeMatch[1] },
          annotations: { code: true },
        });
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // Link: [text](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        richText.push({
          type: 'text',
          text: { content: linkMatch[1], link: { url: linkMatch[2] } },
        });
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Plain text (up to next special character)
      const plainMatch = remaining.match(/^[^*_`~[]+/);
      if (plainMatch) {
        richText.push({
          type: 'text',
          text: { content: plainMatch[0] },
        });
        remaining = remaining.slice(plainMatch[0].length);
        continue;
      }

      // Single special character (not part of formatting)
      richText.push({
        type: 'text',
        text: { content: remaining[0] },
      });
      remaining = remaining.slice(1);
    }

    return richText;
  }

  /**
   * Convert NotionBlocks to Notion API block format
   */
  toNotionApiBlocks(blocks: NotionBlock[]): object[] {
    return blocks.map(block => {
      const apiBlock: Record<string, unknown> = {
        object: 'block',
        type: block.type,
      };

      apiBlock[block.type] = block.content;

      if (block.children && block.children.length > 0) {
        (apiBlock[block.type] as Record<string, unknown>).children = this.toNotionApiBlocks(block.children);
      }

      return apiBlock;
    });
  }
}
