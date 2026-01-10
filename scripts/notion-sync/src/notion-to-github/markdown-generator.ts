import { NotionBlock, NotionRichText, MarkdownFrontmatter } from '../shared/types';
import { FetchedPage } from './notion-fetcher';
import { Logger } from '../shared/logger';

const logger = new Logger('MarkdownGenerator');

export interface GeneratorOptions {
  includeFrontmatter?: boolean;
  includeNotionId?: boolean;
  includeLastSynced?: boolean;
}

export class MarkdownGenerator {
  private defaultOptions: GeneratorOptions = {
    includeFrontmatter: true,
    includeNotionId: true,
    includeLastSynced: true,
  };

  /**
   * Generate markdown from a Notion page
   */
  generate(page: FetchedPage, options: GeneratorOptions = {}): string {
    const opts = { ...this.defaultOptions, ...options };
    const parts: string[] = [];

    // Generate frontmatter
    if (opts.includeFrontmatter) {
      const frontmatter = this.generateFrontmatter(page, opts);
      parts.push(frontmatter);
    }

    // Generate content from blocks
    const content = this.blocksToMarkdown(page.blocks);
    parts.push(content);

    return parts.join('\n').trim() + '\n';
  }

  private generateFrontmatter(page: FetchedPage, options: GeneratorOptions): string {
    const frontmatter: MarkdownFrontmatter = {
      title: page.title,
    };

    if (options.includeNotionId) {
      frontmatter.notionId = page.id;
    }

    if (options.includeLastSynced) {
      frontmatter.lastSynced = new Date().toISOString();
    }

    // Add properties from Notion
    if (page.properties['Status']) {
      frontmatter.status = page.properties['Status'] as string;
    }

    if (page.properties['Tags']) {
      frontmatter.tags = page.properties['Tags'] as string[];
    }

    // Build frontmatter string
    const lines = ['---'];
    for (const [key, value] of Object.entries(frontmatter)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          lines.push(`${key}:`);
          for (const item of value) {
            lines.push(`  - ${item}`);
          }
        } else {
          lines.push(`${key}: ${this.formatFrontmatterValue(value)}`);
        }
      }
    }
    lines.push('---');
    lines.push('');

    return lines.join('\n');
  }

  private formatFrontmatterValue(value: unknown): string {
    if (typeof value === 'string') {
      // Quote strings that contain special characters
      if (value.includes(':') || value.includes('#') || value.includes("'")) {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value;
    }
    return String(value);
  }

  /**
   * Convert Notion blocks to markdown
   */
  blocksToMarkdown(blocks: NotionBlock[], depth: number = 0): string {
    const lines: string[] = [];

    for (const block of blocks) {
      const markdown = this.blockToMarkdown(block, depth);
      if (markdown) {
        lines.push(markdown);
      }

      // Process children
      if (block.children && block.children.length > 0) {
        const childMarkdown = this.blocksToMarkdown(block.children, depth + 1);
        if (childMarkdown) {
          lines.push(childMarkdown);
        }
      }
    }

    return lines.join('\n');
  }

  private blockToMarkdown(block: NotionBlock, depth: number = 0): string {
    const indent = '  '.repeat(depth);

    switch (block.type) {
      case 'paragraph':
        return this.richTextToMarkdown(block.content.rich_text) + '\n';

      case 'heading_1':
        return `# ${this.richTextToMarkdown(block.content.rich_text)}\n`;

      case 'heading_2':
        return `## ${this.richTextToMarkdown(block.content.rich_text)}\n`;

      case 'heading_3':
        return `### ${this.richTextToMarkdown(block.content.rich_text)}\n`;

      case 'bulleted_list_item':
        return `${indent}- ${this.richTextToMarkdown(block.content.rich_text)}`;

      case 'numbered_list_item':
        return `${indent}1. ${this.richTextToMarkdown(block.content.rich_text)}`;

      case 'to_do': {
        const checked = block.content.checked ? 'x' : ' ';
        return `${indent}- [${checked}] ${this.richTextToMarkdown(block.content.rich_text)}`;
      }

      case 'toggle':
        return `${indent}<details>\n${indent}<summary>${this.richTextToMarkdown(block.content.rich_text)}</summary>\n`;

      case 'code': {
        const language = block.content.language || '';
        const code = this.richTextToMarkdown(block.content.rich_text);
        return `\`\`\`${language}\n${code}\n\`\`\`\n`;
      }

      case 'quote':
        return `> ${this.richTextToMarkdown(block.content.rich_text)}\n`;

      case 'callout': {
        const icon = block.content.icon?.emoji || '💡';
        const text = this.richTextToMarkdown(block.content.rich_text);
        return `> ${icon} ${text}\n`;
      }

      case 'divider':
        return '---\n';

      case 'image': {
        const url = block.content.file?.url || block.content.external?.url || '';
        const caption = block.content.caption
          ? this.richTextToMarkdown(block.content.caption)
          : '';
        return `![${caption}](${url})\n`;
      }

      case 'bookmark': {
        const url = block.content.url || '';
        const caption = block.content.caption
          ? this.richTextToMarkdown(block.content.caption)
          : url;
        return `[${caption}](${url})\n`;
      }

      case 'link_preview':
        return `[${block.content.url}](${block.content.url})\n`;

      case 'table':
        return this.tableToMarkdown(block);

      case 'table_row':
        // Handled by table
        return '';

      case 'column_list':
        // Flatten columns into sequential content
        return '';

      case 'column':
        // Content handled by children
        return '';

      default:
        logger.debug(`Unknown block type: ${block.type}`);
        return '';
    }
  }

  private richTextToMarkdown(richText?: NotionRichText[]): string {
    if (!richText || richText.length === 0) {
      return '';
    }

    return richText.map(text => {
      let content = text.text.content;

      // Apply annotations
      if (text.annotations) {
        if (text.annotations.code) {
          content = `\`${content}\``;
        }
        if (text.annotations.bold) {
          content = `**${content}**`;
        }
        if (text.annotations.italic) {
          content = `*${content}*`;
        }
        if (text.annotations.strikethrough) {
          content = `~~${content}~~`;
        }
        if (text.annotations.underline) {
          content = `<u>${content}</u>`;
        }
      }

      // Apply link
      if (text.text.link) {
        content = `[${content}](${text.text.link.url})`;
      }

      return content;
    }).join('');
  }

  private tableToMarkdown(block: NotionBlock): string {
    if (!block.children || block.children.length === 0) {
      return '';
    }

    const rows: string[][] = [];

    for (const row of block.children) {
      if (row.type === 'table_row' && row.content.cells) {
        const cells = row.content.cells.map((cell: NotionRichText[]) =>
          this.richTextToMarkdown(cell)
        );
        rows.push(cells);
      }
    }

    if (rows.length === 0) {
      return '';
    }

    const lines: string[] = [];

    // Header row
    lines.push(`| ${rows[0].join(' | ')} |`);

    // Separator
    lines.push(`| ${rows[0].map(() => '---').join(' | ')} |`);

    // Data rows
    for (let i = 1; i < rows.length; i++) {
      lines.push(`| ${rows[i].join(' | ')} |`);
    }

    return lines.join('\n') + '\n';
  }

  /**
   * Generate a file path from a Notion page
   */
  generateFilePath(page: FetchedPage, basePath: string = ''): string {
    // Use existing path if available
    if (page.githubPath) {
      return page.githubPath;
    }

    // Generate from title
    const filename = this.slugify(page.title) + '.md';
    return basePath ? `${basePath}/${filename}` : filename;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
