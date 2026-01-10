# Sync System Setup Guide

Complete setup instructions for the GitHub ↔ Notion sync system.

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- A Notion account with admin access
- A GitHub account with repository access

## Step 1: Create Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New Integration"
3. Configure the integration:
   - **Name**: `Infinite Idol Sync`
   - **Associated Workspace**: Select your workspace
   - **Capabilities**:
     - Read content ✓
     - Update content ✓
     - Insert content ✓
4. Click "Submit"
5. Copy the "Internal Integration Token" (starts with `secret_`)

## Step 2: Create Notion Databases

Create the following databases in Notion with these properties:

### Knowledge Base Database

| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Document title |
| Category | Select | Content category |
| Status | Select | draft, published, archived |
| Tags | Multi-select | Content tags |
| GitHub Path | Text | Source file path |
| Last Synced | Date | Last sync timestamp |

### Agent Activity Database

| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Activity summary |
| Agent | Select | Agent name (00-19) |
| Action | Text | Action performed |
| Timestamp | Date | When it occurred |
| Status | Select | success, error, pending |
| Files Modified | Text | Comma-separated paths |
| Details | Text | Additional details |

### Review Queue Database

| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Review item title |
| Submitted By | Select | Agent who submitted |
| Category | Select | lore, content, event, gacha, other |
| Priority | Select | high, medium, low |
| Status | Select | pending, approved, rejected |
| GitHub Path | Text | Source file path |
| Human Notes | Text | Review notes |

### Content Calendar Database

| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Entry title |
| Date | Date | Scheduled date |
| Content Type | Select | tweet, thread, discord-event, article |
| Content | Text | Content body |
| Status | Select | draft, scheduled, posted |
| Platform | Select | Target platform |
| Performance | Text | Performance notes |

### Tweet Queue Database

| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Tweet preview |
| Tweet Text | Text | Full tweet text |
| Pillar | Select | ika-voice, lore, founder-hype, engagement |
| Created By | Select | Creating agent |
| Scheduled Date | Date | When to post |
| Status | Select | draft, approved, scheduled, posted |
| Metrics | Text | Engagement metrics |

## Step 3: Share Databases with Integration

For each database:

1. Open the database in Notion
2. Click "Share" in the top right
3. Search for your integration name
4. Click "Invite"

## Step 4: Get Database IDs

For each database:

1. Open the database in Notion
2. Copy the URL
3. Extract the database ID from the URL:
   ```
   https://notion.so/workspace/DATABASE_ID?v=...
   ```
   The DATABASE_ID is the 32-character string before the `?`

## Step 5: Configure GitHub Secrets

In your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `NOTION_TOKEN` | Your Notion integration token |
| `NOTION_KNOWLEDGE_BASE_DB` | Knowledge Base database ID |
| `NOTION_AGENT_ACTIVITY_DB` | Agent Activity database ID |
| `NOTION_REVIEW_QUEUE_DB` | Review Queue database ID |
| `NOTION_CONTENT_CALENDAR_DB` | Content Calendar database ID |
| `NOTION_TWEET_QUEUE_DB` | Tweet Queue database ID |

Note: `GITHUB_TOKEN` is automatically provided by GitHub Actions.

## Step 6: Local Development Setup

1. Navigate to the sync directory:
   ```bash
   cd scripts/notion-sync
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your credentials:
   ```bash
   NOTION_TOKEN=secret_your_token_here
   NOTION_KNOWLEDGE_BASE_DB=your_db_id_here
   # ... add other database IDs
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_OWNER=your-username
   GITHUB_REPO=infinite-idol-hq
   ```

5. Run tests to verify setup:
   ```bash
   npm test
   ```

6. Try a dry-run sync:
   ```bash
   npm run sync:to-notion -- --dry-run
   ```

## Step 7: Enable GitHub Actions

The workflows are located in `.github/workflows/`:

- `sync-to-notion.yml` - Triggers on push to main
- `sync-from-notion.yml` - Runs hourly + manual trigger
- `test-sync.yml` - Runs tests on PR/push

These are enabled automatically once secrets are configured.

## Verification Checklist

- [ ] Notion integration created and token saved
- [ ] All 5 databases created with correct properties
- [ ] All databases shared with integration
- [ ] All database IDs collected
- [ ] GitHub secrets configured
- [ ] Local `.env` file created
- [ ] Tests pass locally
- [ ] Dry-run sync completes without errors

## Next Steps

1. Review the [README](./README.md) for usage instructions
2. Check [TROUBLESHOOTING](./TROUBLESHOOTING.md) if you encounter issues
3. Consider setting up notifications for sync failures

## Security Notes

- Never commit `.env` files to the repository
- Rotate tokens periodically
- Use minimum required permissions for integrations
- The sync state file (`.sync-state.json`) is safe to commit but contains file hashes
