# Skill: Post to X

> **Purpose**: Post content, images, and long-form articles to X (Twitter)
> **Source**: [skills.sh/jimliu/baoyu-skills/baoyu-post-to-x](https://skills.sh/jimliu/baoyu-skills/baoyu-post-to-x)
> **Requirements**: Google Chrome/Chromium, Bun runtime, X login session
> **Primary Users**: Agent 02 (Content Strategist), Agent 00 (Coordinator)

---

## Overview

This skill enables direct posting to X using browser automation. It bypasses anti-bot detection by using a real Chrome browser instance.

**Key Capabilities:**
- Post text tweets (up to 280 characters)
- Attach up to 4 images per post
- Publish long-form articles (X Premium required)
- Preview mode before actual posting

---

## Installation

The skill is available via npx and requires Bun:

```bash
# Install Bun if not already installed
curl -fsSL https://bun.sh/install | bash

# First run will prompt for X login (session persists)
```

---

## Usage

### Regular Posts (Text + Images)

**Command Structure:**
```bash
npx -y bun x-browser.ts "<tweet_text>" [options]
```

**Options:**
| Flag | Description |
|------|-------------|
| `--image <path>` | Attach image (can use multiple times, max 4) |
| `--submit` | Actually post (default is preview mode) |

**Examples:**

```bash
# Preview a text-only tweet
npx -y bun x-browser.ts "Still here. Still breathing. Still existing. Good morning~"

# Preview with image
npx -y bun x-browser.ts "Training hurts. Fading hurts more. Easy choice." --image ./assets/ika-training.png

# Actually post (with --submit)
npx -y bun x-browser.ts "The Chase continues~" --image ./assets/ika-hero.png --submit
```

### Long-Form Articles (X Premium)

**Command Structure:**
```bash
npx -y bun x-article.ts <markdown_file> [options]
```

**Markdown Frontmatter:**
```markdown
---
title: "Understanding Devotion"
cover: ./assets/devotion-cover.png
---

# Article content here...
```

**Example:**
```bash
# Preview article
npx -y bun x-article.ts ./outputs/content/articles/devotion-explainer.md

# Publish article
npx -y bun x-article.ts ./outputs/content/articles/devotion-explainer.md --submit
```

---

## Workflow Integration

### Pre-Post Checklist

Before using `--submit`:

1. **Content Approved**: Verify Agent 08 (Canon) and Agent 09 (Cultural) reviews passed
2. **Image Ready**: Ensure visual assets are generated and in correct location
3. **Preview First**: Always run without `--submit` first to verify
4. **Timing Check**: Confirm scheduled time matches master calendar

### Post-Post Actions

After successful post:

1. **Log the post**: Update `logs/agent-activity.md` with post URL
2. **Update calendar**: Mark content as PUBLISHED in master calendar
3. **Monitor engagement**: Track replies for community response

---

## Content from Batch Files

When posting from batch files, extract content like this:

```bash
# From week-1-batch.md, TWEET-W1-001 (Foundation tweet):
npx -y bun x-browser.ts "Some idols have millions of fans.
Some have thousands.

She woke up with almost nothing.

That should be a death sentence.

Should be." --image ./assets/foundation-visual.png --submit
```

**Note**: Preserve line breaks in tweets by using proper quoting.

---

## Thread Posting

For threads, post sequentially with replies:

```bash
# First tweet
npx -y bun x-browser.ts "Thread hook here 🧵" --submit

# Get the tweet URL, then reply to it
# (Manual process - note the tweet ID for replies)
```

**Recommendation**: For threads, use X's native interface or a dedicated thread tool for proper threading.

---

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Login required | Session expired | Re-run, complete login in browser |
| Image not found | Wrong path | Verify image path exists |
| Rate limited | Too many posts | Wait and retry |
| Character limit | Tweet too long | Edit content under 280 chars |

---

## Security Notes

- **Session persistence**: Login session is stored locally
- **No credentials stored**: Uses browser's existing auth
- **Preview by default**: Must explicitly use `--submit` to post

---

## Agent Permissions

| Agent | Permission |
|-------|------------|
| 00 (Coordinator) | Full access - can post approved content |
| 02 (Content Strategist) | Preview only - needs Coordinator approval to `--submit` |
| Others | No direct posting access |

**Important**: All posts must complete the review pipeline before submission:
```
Agent 02 Creates → Agent 08 Canon → Agent 09 Cultural → Agent 00 Approves → POST
```

---

## Related Skills

- `content-creation.md` - Creating tweet content
- `ct-engagement.md` - Optimizing for CT algorithm
- `ct-rapid-response.md` - Time-sensitive posting

---

*"Every post is Devotion made visible."*
