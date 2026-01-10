const MarkdownIt = require('markdown-it');
const logger = require('../utils/logger');

const md = new MarkdownIt();

/**
 * Convert markdown text to Notion block format
 * Handles headers, lists, code blocks, paragraphs, and basic formatting
 */
class MarkdownToNotionConverter {
  /**
   * Convert markdown string to array of Notion blocks
   * @param {string} markdown - Markdown content
   * @returns {Array} Array of Notion block objects
   */
  convert(markdown) {
    if (!markdown || typeof markdown !== 'string') {
      return [];
    }

    const blocks = [];
    const lines = markdown.split('\n');

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) {
        i++;
        continue;
      }

      // Headers (### )
      if (trimmed.startsWith('###')) {
        blocks.push(this.createHeading3(trimmed.replace(/^###\s*/, '')));
        i++;
      }
      else if (trimmed.startsWith('##')) {
        blocks.push(this.createHeading2(trimmed.replace(/^##\s*/, '')));
        i++;
      }
      else if (trimmed.startsWith('#')) {
        blocks.push(this.createHeading1(trimmed.replace(/^#\s*/, '')));
        i++;
      }
      // To-do items (- [ ] or - [x])
      else if (trimmed.match(/^-\s*\[([ x])\]/)) {
        const { block, consumed } = this.createTodoList(lines, i);
        blocks.push(...block);
        i += consumed;
      }
      // Bulleted lists (- )
      else if (trimmed.startsWith('- ')) {
        const { block, consumed } = this.createBulletedList(lines, i);
        blocks.push(...block);
        i += consumed;
      }
      // Numbered lists (1. )
      else if (trimmed.match(/^\d+\.\s/)) {
        const { block, consumed } = this.createNumberedList(lines, i);
        blocks.push(...block);
        i += consumed;
      }
      // Code blocks (```)
      else if (trimmed.startsWith('```')) {
        const { block, consumed } = this.createCodeBlock(lines, i);
        if (block) {
          blocks.push(block);
        }
        i += consumed;
      }
      // Blockquotes (>)
      else if (trimmed.startsWith('>')) {
        const { block, consumed } = this.createQuote(lines, i);
        blocks.push(block);
        i += consumed;
      }
      // Paragraphs
      else {
        const { block, consumed } = this.createParagraph(lines, i);
        if (block) {
          blocks.push(block);
        }
        i += consumed;
      }
    }

    logger.debug(`Converted ${blocks.length} markdown lines to Notion blocks`);
    return blocks;
  }

  /**
   * Create heading_1 block
   */
  createHeading1(text) {
    return {
      object: 'block',
      type: 'heading_1',
      heading_1: {
        rich_text: this.convertInlineFormatting(text)
      }
    };
  }

  /**
   * Create heading_2 block
   */
  createHeading2(text) {
    return {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: this.convertInlineFormatting(text)
      }
    };
  }

  /**
   * Create heading_3 block
   */
  createHeading3(text) {
    return {
      object: 'block',
      type: 'heading_3',
      heading_3: {
        rich_text: this.convertInlineFormatting(text)
      }
    };
  }

  /**
   * Create paragraph block
   */
  createParagraph(lines, startIndex) {
    let text = lines[startIndex].trim();
    let consumed = 1;

    // Continue paragraph until empty line or special syntax
    while (startIndex + consumed < lines.length) {
      const nextLine = lines[startIndex + consumed].trim();
      if (!nextLine || nextLine.startsWith('#') || nextLine.startsWith('-') ||
          nextLine.startsWith('>') || nextLine.startsWith('```') ||
          nextLine.startsWith('|')) {
        break;
      }
      text += ' ' + nextLine;
      consumed++;
    }

    return {
      block: {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: this.convertInlineFormatting(text)
        }
      },
      consumed
    };
  }

  /**
   * Create bulleted_list_item blocks
   */
  createBulletedList(lines, startIndex) {
    const blocks = [];
    let consumed = 0;

    while (startIndex + consumed < lines.length) {
      const line = lines[startIndex + consumed].trim();
      if (!line.startsWith('- ') || line.match(/^-\s*\[([ x])\]/)) {
        break;
      }

      const text = line.replace(/^-\s*/, '');
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: this.convertInlineFormatting(text)
        }
      });
      consumed++;
    }

    return { block: blocks, consumed: consumed || 1 };
  }

  /**
   * Create numbered_list_item blocks
   */
  createNumberedList(lines, startIndex) {
    const blocks = [];
    let consumed = 0;

    while (startIndex + consumed < lines.length) {
      const line = lines[startIndex + consumed].trim();
      if (!line.match(/^\d+\.\s/)) {
        break;
      }

      const text = line.replace(/^\d+\.\s*/, '');
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: this.convertInlineFormatting(text)
        }
      });
      consumed++;
    }

    return { block: blocks, consumed: consumed || 1 };
  }

  /**
   * Create to_do blocks (checkboxes)
   */
  createTodoList(lines, startIndex) {
    const blocks = [];
    let consumed = 0;

    while (startIndex + consumed < lines.length) {
      const line = lines[startIndex + consumed].trim();
      const match = line.match(/^-\s*\[([ x])\]\s*(.+)/);
      if (!match) {
        break;
      }

      const [, checkChar, text] = match;
      const checked = checkChar === 'x';

      blocks.push({
        object: 'block',
        type: 'to_do',
        to_do: {
          rich_text: this.convertInlineFormatting(text),
          checked
        }
      });
      consumed++;
    }

    return { block: blocks, consumed: consumed || 1 };
  }

  /**
   * Create code block
   */
  createCodeBlock(lines, startIndex) {
    let consumed = 1;
    const firstLine = lines[startIndex].trim();

    // Extract language (```javascript)
    const language = firstLine.replace(/^```/, '').trim() || 'plain text';

    let codeContent = '';

    // Collect lines until closing ```
    while (startIndex + consumed < lines.length) {
      const line = lines[startIndex + consumed];
      if (line.trim() === '```') {
        consumed++;
        break;
      }
      codeContent += line + '\n';
      consumed++;
    }

    return {
      block: {
        object: 'block',
        type: 'code',
        code: {
          rich_text: [{
            type: 'text',
            text: { content: codeContent.trimEnd() }
          }],
          language: this.normalizeLanguage(language)
        }
      },
      consumed
    };
  }

  /**
   * Create quote block
   */
  createQuote(lines, startIndex) {
    let text = lines[startIndex].trim().replace(/^>\s*/, '');
    let consumed = 1;

    // Continue quote until line doesn't start with >
    while (startIndex + consumed < lines.length) {
      const nextLine = lines[startIndex + consumed].trim();
      if (!nextLine.startsWith('>')) {
        break;
      }
      text += ' ' + nextLine.replace(/^>\s*/, '');
      consumed++;
    }

    return {
      block: {
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: this.convertInlineFormatting(text)
        }
      },
      consumed
    };
  }

  /**
   * Convert inline markdown formatting to Notion rich text format
   * Handles **bold**, *italic*, `code`, [links](url)
   */
  convertInlineFormatting(text) {
    const richText = [];

    // Split by code blocks first (preserve them)
    const segments = this.splitByCodeBlocks(text);

    for (const segment of segments) {
      if (segment.isCode) {
        richText.push({
          type: 'text',
          text: { content: segment.content },
          annotations: { code: true }
        });
      } else {
        // Process other formatting
        richText.push(...this.processInlineText(segment.content));
      }
    }

    return richText;
  }

  /**
   * Split text by inline code blocks (`code`)
   */
  splitByCodeBlocks(text) {
    const segments = [];
    const regex = /`([^`]+)`/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before code
      if (match.index > lastIndex) {
        segments.push({
          content: text.substring(lastIndex, match.index),
          isCode: false
        });
      }

      // Add code segment
      segments.push({
        content: match[1],
        isCode: true
      });

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        content: text.substring(lastIndex),
        isCode: false
      });
    }

    return segments;
  }

  /**
   * Process text for bold, italic, links
   */
  processInlineText(text) {
    const richText = [];

    // Simple implementation: just handle bold and italic
    // For now, convert to plain text (more complex parsing would be needed for full support)

    // Remove markdown formatting for simplicity
    const plainText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // Bold
      .replace(/\*([^*]+)\*/g, '$1')      // Italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Links

    if (plainText) {
      richText.push({
        type: 'text',
        text: { content: plainText }
      });
    }

    return richText;
  }

  /**
   * Normalize language names for Notion code blocks
   */
  normalizeLanguage(lang) {
    const languageMap = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'rb': 'ruby',
      'sh': 'shell',
      'bash': 'shell',
      'yml': 'yaml'
    };

    const normalized = lang.toLowerCase();
    return languageMap[normalized] || normalized;
  }

  /**
   * Truncate blocks if they exceed Notion's limits
   * Notion has limits: 2000 blocks per page, 2000 chars per text block
   */
  truncateIfNeeded(blocks, maxBlocks = 100) {
    if (blocks.length <= maxBlocks) {
      return blocks;
    }

    logger.warn(`Truncating blocks from ${blocks.length} to ${maxBlocks}`);
    return blocks.slice(0, maxBlocks);
  }
}

module.exports = new MarkdownToNotionConverter();
