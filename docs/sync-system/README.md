# GitHub ↔ Notion Sync System

Two-way synchronization between GitHub markdown files and Notion databases for the Infinite Idol Marketing Team.

## Overview

This sync system enables:

- **GitHub → Notion**: Automatically sync markdown files to Notion databases when pushed to main
- **Notion → GitHub**: Sync approved content from Notion back to the repository
- **Conflict Resolution**: Intelligent handling of concurrent edits

## Quick Start

### Sync GitHub to Notion

```bash
cd scripts/notion-sync
npm install
npm run sync:to-notion
```

### Sync Notion to GitHub

```bash
npm run sync:from-notion
```

### Run Both Directions

```bash
npm run sync:both
```

## How It Works

### GitHub → Notion Flow

1. Detect changed markdown files (via git diff or file hashing)
2. Parse markdown with frontmatter extraction
3. Convert markdown to Notion blocks
4. Create or update pages in appropriate Notion databases

### Notion → GitHub Flow

1. Query Notion databases for modified pages
2. Convert Notion blocks back to markdown
3. Add/update frontmatter with sync metadata
4. Commit changes to GitHub

### Conflict Resolution

When both GitHub and Notion have been modified since the last sync:

| Strategy | Behavior |
|----------|----------|
| `github-wins` | GitHub content takes precedence |
| `notion-wins` | Notion content takes precedence |
| `newer-wins` | Most recently modified wins (default) |
| `manual` | Flag for manual resolution |

## File Mapping

| GitHub Path | Notion Database |
|-------------|-----------------|
| `knowledge-base/**` | Knowledge Base |
| `agents/**` | Knowledge Base |
| `logs/agent-activity.md` | Agent Activity |
| `reviews/**` | Review Queue |
| `outputs/calendar/**` | Content Calendar |
| `outputs/tweets/**` | Tweet Queue |

## Frontmatter

The sync system uses YAML frontmatter to track sync state:

```yaml
---
title: Document Title
notionId: abc123def456       # Notion page ID
lastSynced: 2024-01-15T10:30:00Z
status: published
tags:
  - lore
  - character
---
```

## Command Line Options

```bash
# Dry run (preview changes)
npm run sync:to-notion -- --dry-run

# Force sync all files
npm run sync:to-notion -- --force

# Sync specific files
npm run sync:to-notion -- --files agents/00-coordinator.md,CLAUDE.md

# Sync specific databases
npm run sync:from-notion -- --databases reviewQueue,tweetQueue

# Set conflict strategy
npm run sync:from-notion -- --conflict-strategy notion-wins
```

## GitHub Actions

The system runs automatically via GitHub Actions:

- **On Push to Main**: Syncs changed files to Notion
- **Hourly**: Syncs approved content from Notion to GitHub
- **On PR**: Runs tests for sync system changes

## Environment Variables

See [SETUP.md](./SETUP.md) for required environment variables.

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## Architecture

```
scripts/notion-sync/
├── src/
│   ├── github-to-notion/    # GitHub → Notion sync
│   ├── notion-to-github/    # Notion → GitHub sync
│   ├── shared/              # Common utilities
│   └── databases/           # Database-specific logic
└── tests/                   # Unit and integration tests
```

For more details, see the source code documentation.
