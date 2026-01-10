const logger = require('../utils/logger');

/**
 * Convert Notion blocks back to markdown format
 * Reverses the markdown-to-notion conversion for two-way sync
 */
class NotionToMarkdownConverter {
  /**
   * Convert array of Notion blocks to markdown string
   * @param {Array} blocks - Array of Notion block objects
   * @returns {string} Markdown content
   */
  convert(blocks) {
    if (!blocks || !Array.isArray(blocks)) {
      return '';
    }

    const markdown = [];

    for (const block of blocks) {
      const md = this.convertBlock(block);
      if (md) {
        markdown.push(md);
      }
    }

    return markdown.join('\n');
  }

  /**
   * Convert a single Notion block to markdown
   */
  convertBlock(block) {
    if (!block || !block.type) {
      return null;
    }

    switch (block.type) {
      case 'heading_1':
        return this.convertHeading(block.heading_1, 1);
      case 'heading_2':
        return this.convertHeading(block.heading_2, 2);
      case 'heading_3':
        return this.convertHeading(block.heading_3, 3);
      case 'paragraph':
        return this.convertParagraph(block.paragraph);
      case 'bulleted_list_item':
        return this.convertBulletedListItem(block.bulleted_list_item);
      case 'numbered_list_item':
        return this.convertNumberedListItem(block.numbered_list_item);
      case 'to_do':
        return this.convertToDo(block.to_do);
      case 'code':
        return this.convertCode(block.code);
      case 'quote':
        return this.convertQuote(block.quote);
      case 'divider':
        return '---';
      case 'callout':
        return this.convertCallout(block.callout);
      default:
        logger.debug(`Unsupported block type: ${block.type}`);
        return null;
    }
  }

  /**
   * Convert heading block to markdown
   */
  convertHeading(heading, level) {
    const text = this.convertRichText(heading.rich_text);
    const prefix = '#'.repeat(level);
    return `${prefix} ${text}`;
  }

  /**
   * Convert paragraph block to markdown
   */
  convertParagraph(paragraph) {
    return this.convertRichText(paragraph.rich_text);
  }

  /**
   * Convert bulleted list item to markdown
   */
  convertBulletedListItem(listItem) {
    const text = this.convertRichText(listItem.rich_text);
    return `- ${text}`;
  }

  /**
   * Convert numbered list item to markdown
   */
  convertNumberedListItem(listItem) {
    const text = this.convertRichText(listItem.rich_text);
    return `1. ${text}`;  // Markdown auto-numbers
  }

  /**
   * Convert to-do block to markdown
   */
  convertToDo(toDo) {
    const text = this.convertRichText(toDo.rich_text);
    const checkbox = toDo.checked ? '[x]' : '[ ]';
    return `- ${checkbox} ${text}`;
  }

  /**
   * Convert code block to markdown
   */
  convertCode(code) {
    const text = this.convertRichText(code.rich_text);
    const language = code.language || '';
    return `\`\`\`${language}\n${text}\n\`\`\``;
  }

  /**
   * Convert quote block to markdown
   */
  convertQuote(quote) {
    const text = this.convertRichText(quote.rich_text);
    return `> ${text}`;
  }

  /**
   * Convert callout block to markdown (as blockquote)
   */
  convertCallout(callout) {
    const text = this.convertRichText(callout.rich_text);
    const icon = callout.icon?.emoji || '💡';
    return `> ${icon} ${text}`;
  }

  /**
   * Convert Notion rich text array to plain markdown text
   * Handles bold, italic, code, links, etc.
   */
  convertRichText(richTextArray) {
    if (!richTextArray || !Array.isArray(richTextArray)) {
      return '';
    }

    return richTextArray.map(rt => this.convertRichTextSegment(rt)).join('');
  }

  /**
   * Convert a single rich text segment
   */
  convertRichTextSegment(richText) {
    if (!richText || richText.type !== 'text') {
      return '';
    }

    let text = richText.text.content || '';
    const annotations = richText.annotations || {};

    // Apply formatting
    if (annotations.code) {
      text = `\`${text}\``;
    }
    if (annotations.bold) {
      text = `**${text}**`;
    }
    if (annotations.italic) {
      text = `*${text}*`;
    }
    if (annotations.strikethrough) {
      text = `~~${text}~~`;
    }

    // Handle links
    if (richText.text.link && richText.text.link.url) {
      text = `[${text}](${richText.text.link.url})`;
    }

    return text;
  }

  /**
   * Convert Notion page properties to markdown metadata
   * Used for converting database entries back to markdown
   */
  convertPageProperties(properties) {
    const metadata = [];

    for (const [key, value] of Object.entries(properties)) {
      const metadataLine = this.convertProperty(key, value);
      if (metadataLine) {
        metadata.push(metadataLine);
      }
    }

    return metadata.join('\n');
  }

  /**
   * Convert a single Notion property to markdown
   */
  convertProperty(name, property) {
    if (!property) return null;

    switch (property.type) {
      case 'title':
        return `**${name}**: ${this.convertRichText(property.title)}`;
      case 'rich_text':
        return `**${name}**: ${this.convertRichText(property.rich_text)}`;
      case 'number':
        return `**${name}**: ${property.number}`;
      case 'select':
        return `**${name}**: ${property.select?.name || ''}`;
      case 'multi_select':
        const options = property.multi_select?.map(o => o.name).join(', ');
        return `**${name}**: ${options}`;
      case 'date':
        if (property.date) {
          return `**${name}**: ${property.date.start}`;
        }
        return null;
      case 'checkbox':
        return `**${name}**: ${property.checkbox ? '✓' : '✗'}`;
      case 'url':
        return `**${name}**: ${property.url || ''}`;
      case 'email':
        return `**${name}**: ${property.email || ''}`;
      case 'phone_number':
        return `**${name}**: ${property.phone_number || ''}`;
      case 'relation':
        // Relations are complex, just note the count
        return `**${name}**: ${property.relation?.length || 0} related items`;
      default:
        return null;
    }
  }

  /**
   * Convert full Notion page to markdown
   * Includes properties as metadata and blocks as content
   */
  async convertPage(page, includeProperties = true) {
    const markdown = [];

    // Add page title
    if (page.properties) {
      const titleProperty = Object.values(page.properties).find(p => p.type === 'title');
      if (titleProperty && titleProperty.title) {
        const title = this.convertRichText(titleProperty.title);
        markdown.push(`# ${title}\n`);
      }

      // Add other properties as metadata
      if (includeProperties) {
        const metadata = this.convertPageProperties(page.properties);
        if (metadata) {
          markdown.push(metadata);
          markdown.push(''); // Empty line
        }
      }
    }

    // Add page content (blocks)
    if (page.children && Array.isArray(page.children)) {
      const content = this.convert(page.children);
      markdown.push(content);
    }

    return markdown.join('\n');
  }

  /**
   * Normalize whitespace in generated markdown
   */
  normalizeMarkdown(markdown) {
    return markdown
      .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
      .trim();
  }
}

module.exports = new NotionToMarkdownConverter();
