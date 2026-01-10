import matter from 'gray-matter';
import { ParsedMarkdown, MarkdownFrontmatter, MarkdownSection } from '../shared/types';
import { Logger } from '../shared/logger';

const logger = new Logger('MarkdownParser');

export class MarkdownParser {
  /**
   * Parse a markdown file into frontmatter and content
   */
  parse(rawContent: string): ParsedMarkdown {
    try {
      const { data, content } = matter(rawContent);

      const frontmatter: MarkdownFrontmatter = {
        title: data.title,
        notionId: data.notionId,
        lastSynced: data.lastSynced,
        syncDirection: data.syncDirection,
        status: data.status,
        tags: data.tags,
        ...data,
      };

      return {
        frontmatter,
        content: content.trim(),
        rawContent,
      };
    } catch (error) {
      logger.error('Failed to parse markdown', error);
      throw new Error(`Markdown parsing failed: ${error}`);
    }
  }

  /**
   * Extract title from markdown content if not in frontmatter
   */
  extractTitle(content: string, frontmatter: MarkdownFrontmatter): string {
    if (frontmatter.title) {
      return frontmatter.title;
    }

    // Look for first H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      return h1Match[1].trim();
    }

    // Look for first line of content
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      return lines[0].substring(0, 100);
    }

    return 'Untitled';
  }

  /**
   * Split markdown into sections by headers
   */
  splitIntoSections(content: string): MarkdownSection[] {
    const sections: MarkdownSection[] = [];
    const lines = content.split('\n');

    let currentSection: MarkdownSection | null = null;
    let currentContent: string[] = [];

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
        }

        currentSection = {
          level: headerMatch[1].length,
          title: headerMatch[2].trim(),
          content: '',
        };
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      sections.push(currentSection);
    } else if (currentContent.length > 0) {
      // Content without headers
      const trimmedContent = currentContent.join('\n').trim();
      if (trimmedContent) {
        sections.push({
          level: 0,
          title: '',
          content: trimmedContent,
        });
      }
    }

    return sections;
  }

  /**
   * Add or update frontmatter in markdown
   */
  updateFrontmatter(rawContent: string, updates: Partial<MarkdownFrontmatter>): string {
    const { data, content } = matter(rawContent);
    const newData = { ...data, ...updates };

    return matter.stringify(content, newData);
  }

  /**
   * Remove frontmatter from markdown
   */
  stripFrontmatter(rawContent: string): string {
    const { content } = matter(rawContent);
    return content.trim();
  }

  /**
   * Check if markdown has frontmatter
   */
  hasFrontmatter(rawContent: string): boolean {
    return rawContent.trim().startsWith('---');
  }

  /**
   * Extract all links from markdown
   */
  extractLinks(content: string): Array<{ text: string; url: string }> {
    const links: Array<{ text: string; url: string }> = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        text: match[1],
        url: match[2],
      });
    }

    return links;
  }

  /**
   * Extract all code blocks from markdown
   */
  extractCodeBlocks(content: string): Array<{ language: string; code: string }> {
    const blocks: Array<{ language: string; code: string }> = [];
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || 'plain text',
        code: match[2].trim(),
      });
    }

    return blocks;
  }

  /**
   * Extract all images from markdown
   */
  extractImages(content: string): Array<{ alt: string; url: string }> {
    const images: Array<{ alt: string; url: string }> = [];
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      images.push({
        alt: match[1],
        url: match[2],
      });
    }

    return images;
  }

  /**
   * Get word count of content
   */
  getWordCount(content: string): number {
    const text = this.stripFrontmatter(content);
    const words = text.split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  /**
   * Get reading time estimate in minutes
   */
  getReadingTime(content: string, wordsPerMinute: number = 200): number {
    const wordCount = this.getWordCount(content);
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
