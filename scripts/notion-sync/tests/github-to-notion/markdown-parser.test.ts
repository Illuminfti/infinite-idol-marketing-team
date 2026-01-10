import { MarkdownParser } from '../../src/github-to-notion/markdown-parser';

describe('MarkdownParser', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  describe('parse', () => {
    it('should parse markdown with frontmatter', () => {
      const markdown = `---
title: Test Document
status: published
tags:
  - lore
  - character
---

# Introduction

This is the content.`;

      const result = parser.parse(markdown);

      expect(result.frontmatter.title).toBe('Test Document');
      expect(result.frontmatter.status).toBe('published');
      expect(result.frontmatter.tags).toEqual(['lore', 'character']);
      expect(result.content).toContain('# Introduction');
      expect(result.content).toContain('This is the content.');
    });

    it('should parse markdown without frontmatter', () => {
      const markdown = `# Just a Title

Some content here.`;

      const result = parser.parse(markdown);

      expect(result.frontmatter.title).toBeUndefined();
      expect(result.content).toBe('# Just a Title\n\nSome content here.');
    });

    it('should handle empty markdown', () => {
      const result = parser.parse('');

      expect(result.content).toBe('');
    });

    it('should preserve notionId in frontmatter', () => {
      const markdown = `---
notionId: abc123def456
lastSynced: "2024-01-15T10:30:00Z"
---

Content`;

      const result = parser.parse(markdown);

      expect(result.frontmatter.notionId).toBe('abc123def456');
      // gray-matter parses unquoted ISO dates as Date objects, quoted as strings
      expect(result.frontmatter.lastSynced).toBe('2024-01-15T10:30:00Z');
    });

    it('should handle frontmatter with special characters', () => {
      const markdown = `---
title: "Test: A Document"
description: "Contains 'quotes' and colons:"
---

Content`;

      const result = parser.parse(markdown);

      expect(result.frontmatter.title).toBe('Test: A Document');
    });
  });

  describe('extractTitle', () => {
    it('should use frontmatter title if available', () => {
      const content = '# Different Title\n\nContent';
      const frontmatter = { title: 'Frontmatter Title' };

      const title = parser.extractTitle(content, frontmatter);

      expect(title).toBe('Frontmatter Title');
    });

    it('should extract H1 if no frontmatter title', () => {
      const content = '# Heading One\n\nContent';
      const frontmatter = {};

      const title = parser.extractTitle(content, frontmatter);

      expect(title).toBe('Heading One');
    });

    it('should use first line if no H1', () => {
      const content = 'Just some text\n\nMore text';
      const frontmatter = {};

      const title = parser.extractTitle(content, frontmatter);

      expect(title).toBe('Just some text');
    });

    it('should return Untitled for empty content', () => {
      const title = parser.extractTitle('', {});

      expect(title).toBe('Untitled');
    });

    it('should truncate very long titles', () => {
      const longText = 'A'.repeat(200);
      const frontmatter = {};

      const title = parser.extractTitle(longText, frontmatter);

      expect(title.length).toBeLessThanOrEqual(100);
    });

    it('should handle H1 with inline formatting', () => {
      const content = '# **Bold** Title\n\nContent';
      const frontmatter = {};

      const title = parser.extractTitle(content, frontmatter);

      expect(title).toBe('**Bold** Title');
    });
  });

  describe('splitIntoSections', () => {
    it('should split content by headers', () => {
      const content = `# Section One

Content one.

## Section Two

Content two.

### Section Three

Content three.`;

      const sections = parser.splitIntoSections(content);

      expect(sections).toHaveLength(3);
      expect(sections[0].level).toBe(1);
      expect(sections[0].title).toBe('Section One');
      expect(sections[0].content).toBe('Content one.');
      expect(sections[1].level).toBe(2);
      expect(sections[1].title).toBe('Section Two');
      expect(sections[2].level).toBe(3);
      expect(sections[2].title).toBe('Section Three');
    });

    it('should handle content without headers', () => {
      const content = 'Just plain text\n\nWith paragraphs';

      const sections = parser.splitIntoSections(content);

      expect(sections).toHaveLength(1);
      expect(sections[0].level).toBe(0);
      expect(sections[0].title).toBe('');
    });

    it('should handle empty content', () => {
      const sections = parser.splitIntoSections('');

      expect(sections).toHaveLength(0);
    });

    it('should handle multiple consecutive headers', () => {
      const content = `# First
## Second
### Third`;

      const sections = parser.splitIntoSections(content);

      expect(sections).toHaveLength(3);
    });
  });

  describe('updateFrontmatter', () => {
    it('should add frontmatter to markdown without it', () => {
      const markdown = '# Title\n\nContent';
      const updates = { notionId: 'abc123', lastSynced: '2024-01-15' };

      const result = parser.updateFrontmatter(markdown, updates);

      expect(result).toContain('notionId: abc123');
      expect(result).toContain('# Title');
    });

    it('should update existing frontmatter', () => {
      const markdown = `---
title: Original
status: draft
---

Content`;
      const updates = { status: 'published', newField: 'value' };

      const result = parser.updateFrontmatter(markdown, updates);

      expect(result).toContain('title: Original');
      expect(result).toContain('status: published');
      expect(result).toContain('newField: value');
    });

    it('should preserve content when updating frontmatter', () => {
      const markdown = `---
title: Test
---

# Heading

Content here.`;
      const updates = { status: 'published' };

      const result = parser.updateFrontmatter(markdown, updates);

      expect(result).toContain('# Heading');
      expect(result).toContain('Content here.');
    });
  });

  describe('stripFrontmatter', () => {
    it('should remove frontmatter from markdown', () => {
      const markdown = `---
title: Test
---

Content`;

      const result = parser.stripFrontmatter(markdown);

      expect(result).toBe('Content');
      expect(result).not.toContain('---');
      expect(result).not.toContain('title');
    });

    it('should return content unchanged if no frontmatter', () => {
      const markdown = '# Title\n\nContent';

      const result = parser.stripFrontmatter(markdown);

      expect(result).toBe('# Title\n\nContent');
    });
  });

  describe('hasFrontmatter', () => {
    it('should return true for markdown with frontmatter', () => {
      const markdown = `---
title: Test
---

Content`;

      expect(parser.hasFrontmatter(markdown)).toBe(true);
    });

    it('should return false for markdown without frontmatter', () => {
      const markdown = '# Title\n\nContent';

      expect(parser.hasFrontmatter(markdown)).toBe(false);
    });
  });

  describe('extractLinks', () => {
    it('should extract all links from markdown', () => {
      const content = 'Check [Google](https://google.com) and [GitHub](https://github.com)';

      const links = parser.extractLinks(content);

      expect(links).toHaveLength(2);
      expect(links[0]).toEqual({ text: 'Google', url: 'https://google.com' });
      expect(links[1]).toEqual({ text: 'GitHub', url: 'https://github.com' });
    });

    it('should return empty array if no links', () => {
      const content = 'No links here';

      const links = parser.extractLinks(content);

      expect(links).toHaveLength(0);
    });
  });

  describe('extractCodeBlocks', () => {
    it('should extract code blocks with language', () => {
      const content = '```typescript\nconst x = 1;\n```';

      const blocks = parser.extractCodeBlocks(content);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].language).toBe('typescript');
      expect(blocks[0].code).toBe('const x = 1;');
    });

    it('should extract code blocks without language', () => {
      const content = '```\nsome code\n```';

      const blocks = parser.extractCodeBlocks(content);

      expect(blocks).toHaveLength(1);
      expect(blocks[0].language).toBe('plain text');
    });

    it('should extract multiple code blocks', () => {
      const content = '```js\ncode1\n```\n\n```python\ncode2\n```';

      const blocks = parser.extractCodeBlocks(content);

      expect(blocks).toHaveLength(2);
    });
  });

  describe('extractImages', () => {
    it('should extract images from markdown', () => {
      const content = '![Alt text](https://example.com/image.png)';

      const images = parser.extractImages(content);

      expect(images).toHaveLength(1);
      expect(images[0]).toEqual({ alt: 'Alt text', url: 'https://example.com/image.png' });
    });

    it('should handle images with empty alt text', () => {
      const content = '![](https://example.com/image.png)';

      const images = parser.extractImages(content);

      expect(images).toHaveLength(1);
      expect(images[0].alt).toBe('');
    });
  });

  describe('getWordCount', () => {
    it('should count words correctly', () => {
      const content = 'This is a test with seven words';

      const count = parser.getWordCount(content);

      expect(count).toBe(7);
    });

    it('should ignore frontmatter in word count', () => {
      const content = `---
title: Test
---

Three words here`;

      const count = parser.getWordCount(content);

      expect(count).toBe(3);
    });
  });

  describe('getReadingTime', () => {
    it('should estimate reading time', () => {
      const words = Array(400).fill('word').join(' ');

      const time = parser.getReadingTime(words);

      expect(time).toBe(2); // 400 words / 200 wpm = 2 minutes
    });

    it('should round up reading time', () => {
      const words = Array(250).fill('word').join(' ');

      const time = parser.getReadingTime(words);

      expect(time).toBe(2); // 250 words / 200 wpm = 1.25, rounds to 2
    });
  });
});
