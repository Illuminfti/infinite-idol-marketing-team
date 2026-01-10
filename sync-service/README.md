# Notion Sync Service

Two-way synchronization between GitHub repository and Notion workspace for the Infinite Idol Marketing Team.

## Overview

This service provides real-time bidirectional sync between:
- **GitHub** (markdown files) ↔ **Notion** (databases and pages)
- Agents continue working in markdown (transparent to them)
- Human gains powerful Notion UI for reviews, bulk operations, mobile access

## Features

- ✅ Real-time GitHub → Notion sync (via webhooks)
- ✅ 5-minute Notion → GitHub sync (scheduled)
- ✅ 7 specialized Notion databases (Activity Log, Task Queue, etc.)
- ✅ Smart conflict detection with human resolution
- ✅ Complete historical data migration
- ✅ Markdown ↔ Notion blocks conversion
- ✅ Incremental parsing for large files

## Prerequisites

1. **Node.js 20+** installed
2. **Notion API Key** (Integration token)
3. **Notion Parent Page** created and shared with integration
4. **GitHub Token** (for GitHub API access)

## Quick Start

### 1. Initial Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### 2. Configure Environment Variables

Edit `.env`:

```bash
NOTION_API_KEY=ntn_your_key_here
REPO_PATH=/path/to/infinite-idol-marketing-team
SYNC_DIRECTION=both
LOG_LEVEL=info
```

### 3. Create Notion Parent Page

**Important:** Before running migrations, create a page in Notion:

1. Open Notion
2. Create a new page titled **"Infinite Idol Marketing Team"**
3. Share the page with your integration:
   - Click "Share" → "Invite"
   - Select your integration (search for its name)
   - Grant full access

### 4. Run Database Migration

Create all 7 Notion databases:

```bash
npm run migrate
```

This will create:
- ✅ Agent Registry (19 agents)
- ✅ Activity Log
- ✅ Decision Log
- ✅ Task Queue
- ✅ Content Calendar
- ✅ Knowledge Base
- ✅ Reviews Pipeline

Database IDs will be saved to `config/notion-databases.json`.

### 5. Test Data Migration (Optional)

Import all existing historical data:

```bash
# Coming in Phase 3
```

### 6. Start Sync Service

For local development/testing:

```bash
# One-time sync: GitHub → Notion
npm run sync:to-notion

# One-time sync: Notion → GitHub
npm run sync:from-notion
```

For production (GitHub Actions will handle this automatically).

## Architecture

### Directory Structure

```
sync-service/
├── src/
│   ├── sync-github-to-notion.js       # Main: GitHub → Notion
│   ├── sync-notion-to-github.js       # Main: Notion → GitHub
│   ├── parsers/                       # Markdown parsers
│   │   ├── activity-log-parser.js
│   │   ├── task-queue-parser.js
│   │   ├── decision-log-parser.js
│   │   └── ...
│   ├── converters/                    # Format converters
│   │   ├── markdown-to-notion.js
│   │   └── notion-to-markdown.js
│   ├── notion/                        # Notion CRUD operations
│   └── utils/                         # Utilities
├── migrations/                        # Database setup scripts
├── state/                             # Sync state tracking
└── config/                            # Database IDs
```

### Sync Flow

**GitHub → Notion:**
1. GitHub webhook triggers on push to `main`
2. Detect changed files via git diff
3. Parse changed entries from markdown
4. Create/update Notion pages
5. Check for conflicts (human edits)
6. Update sync state

**Notion → GitHub:**
1. Cron job runs every 5 minutes
2. Query Notion for pages changed since last sync
3. Convert Notion blocks back to markdown
4. Update GitHub files
5. Commit changes with attribution
6. Update sync state

## Database Schemas

### Activity Log
Tracks all agent activities with timestamps, summaries, files touched, and Resident Degen reviews (DS ratings).

**Key Properties:** Entry ID, Timestamp, Agent Number, Activity Type, Status, DS Rating, Review Verdict

### Task Queue
Comprehensive task tracking with dependencies, priorities, and review chains.

**Key Properties:** Task Code, Status, Priority, Assigned Agent, Deadline, Blocked By

### Content Calendar
Content scheduling and performance tracking.

**Key Properties:** Content ID, Scheduled Date, Platform, Pillar, Review Status, Engagement Metrics

### Decision Log
Strategic decisions with full context and rationale.

**Key Properties:** Decision ID, Date, Decision Type, Status, Human Approval

### Knowledge Base
Centralized lore and documentation index.

**Key Properties:** File Path, Category, Canon Tier, Last Modified

### Reviews Pipeline
Human review queue for escalations.

**Key Properties:** Item ID, Priority, Category, Status, Human Decision

### Agent Registry
Metadata for all 19 agents.

**Key Properties:** Agent Number, Name, Role, Status, Authority Level

## Conflict Resolution

When simultaneous edits occur in GitHub and Notion:

1. **Detection:** Compare `last_edited_by` in Notion
2. **If Bot:** Safe to overwrite from GitHub
3. **If Human:** **CONFLICT** - create entry in Conflicts Database
4. **Resolution:** Human reviews in Notion, selects winning version

**Rule:** Human edits ALWAYS take precedence over bot edits.

## Monitoring

### Logs

All logs written to:
- `logs/combined.log` - All events
- `logs/error.log` - Errors only
- Console - Real-time output

### Sync State

Current sync status tracked in:
- `state/sync-state.json` - Last sync times, file hashes
- `state/sync-state.backup.json` - Backup copy

### Health Checks

Weekly sync health report tracks:
- Sync success rate (target: >99%)
- Average sync duration
- Conflicts detected (target: <1%)
- Data integrity (entry counts match)

## Troubleshooting

### "Parent page not found" Error

**Solution:** Create "Infinite Idol Marketing Team" page in Notion and share it with your integration.

### Sync Not Running

Check:
1. `.env` file has correct `NOTION_API_KEY`
2. Parent page shared with integration
3. `config/notion-databases.json` exists (run migration first)

### Conflicts Not Resolving

1. Open Notion workspace
2. Find Conflicts Database
3. Review conflict details (GitHub vs Notion versions)
4. Select winning version or merge manually
5. Mark as resolved

### Large File Parsing Slow

The service uses incremental parsing for files >50KB. If still slow:
1. Check git diff detection working
2. Verify line range parsing
3. Consider splitting very large files

## Development

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Debug Mode

Set `LOG_LEVEL=debug` in `.env` for verbose logging.

## GitHub Actions Integration

✅ **Workflows Created:**
- `.github/workflows/sync-github-to-notion.yml` - Triggers on push to main
- `.github/workflows/sync-notion-to-github.yml` - Runs every 5 minutes

**Setup Required:**
1. Add `NOTION_API_KEY` secret to GitHub repository
2. Enable workflows in Actions tab
3. Test with manual trigger

## Roadmap

- [x] Phase 1: Foundation (parsers, converters)
- [x] Phase 1: Database creation
- [x] Phase 2: One-way sync (GitHub → Notion)
- [x] Phase 3: Historical data migration (17 activity + 37 tasks + 2 decisions)
- [x] Phase 4: Two-way sync + conflicts
- [x] Phase 5: GitHub Actions workflows
- [ ] Phase 6: Production testing and validation

## Support

For issues or questions:
- Check logs in `logs/` directory
- Review `state/sync-state.json` for sync status
- See `CLAUDE.md` in main repo for escalation guidelines

---

**Built for Infinite Idol Marketing Team**
*"Every idol runs. Every fan watches. The agents never sleep."*
