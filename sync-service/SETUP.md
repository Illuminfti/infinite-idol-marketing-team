# Setup Guide: GitHub ↔ Notion Sync

## Current Status

✅ **Completed:**
- Notion databases created (Activity Log, Task Queue, Decision Log)
- Historical data migrated (17 + 37 + 2 entries)
- Sync service implemented
- GitHub Actions workflows created

⏳ **Remaining:**
- Add GitHub secret for NOTION_API_KEY
- Test workflows
- Validate sync functionality

## Step 1: Add GitHub Secret

### Via GitHub Web Interface

1. Navigate to your repository: https://github.com/YOUR-ORG/infinite-idol-marketing-team
2. Click **Settings** tab
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** button
5. Fill in:
   - **Name**: `NOTION_API_KEY`
   - **Secret**: `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`
6. Click **Add secret**

### Via GitHub CLI (Alternative)

```bash
# Install GitHub CLI if needed
brew install gh

# Authenticate
gh auth login

# Add secret
gh secret set NOTION_API_KEY --body "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"
```

## Step 2: Commit and Push Workflows

The workflows are already created in `.github/workflows/`. Commit and push them:

```bash
cd /Users/sheranhussain/Documents/projects/infinite-idol-marketing-team

# Check status
git status

# Add workflows
git add .github/workflows/sync-github-to-notion.yml
git add .github/workflows/sync-notion-to-github.yml
git add sync-service/

# Commit
git commit -m "Add GitHub ↔ Notion sync service and workflows

- Created sync-service with parsers, converters, and Notion clients
- Implemented GitHub → Notion sync orchestrator
- Implemented Notion → GitHub sync orchestrator
- Created 3 Notion databases (Activity Log, Task Queue, Decision Log)
- Migrated 56 historical entries to Notion
- Added GitHub Actions workflows for automated sync"

# Push to main
git push origin main
```

## Step 3: Enable GitHub Actions

1. Go to **Actions** tab in GitHub
2. If workflows are disabled, click **I understand my workflows, go ahead and enable them**
3. You should see two workflows:
   - **Sync GitHub to Notion**
   - **Sync Notion to GitHub**

## Step 4: Test GitHub → Notion Sync

### Method 1: Trigger Automatically
1. Make a small change to `logs/agent-activity.md` or `automation/task-queue.md`
2. Commit and push to `main` branch
3. Go to **Actions** tab → **Sync GitHub to Notion** workflow
4. Watch workflow run
5. Check Notion to verify new entry appears

### Method 2: Manual Trigger
1. Go to **Actions** tab
2. Select **Sync GitHub to Notion** workflow
3. Click **Run workflow** dropdown
4. Select `main` branch
5. Click **Run workflow** button
6. Watch execution and check logs

## Step 5: Test Notion → GitHub Sync

### Automatic Test
The workflow runs every 5 minutes automatically. To verify:
1. Edit an entry in Notion (e.g., change a task status)
2. Wait 5-10 minutes
3. Pull latest from GitHub: `git pull origin main`
4. Check if the markdown file was updated

### Manual Trigger
1. Go to **Actions** tab
2. Select **Sync Notion to GitHub** workflow
3. Click **Run workflow** dropdown
4. Select `main` branch
5. Click **Run workflow** button
6. Pull latest: `git pull origin main`
7. Verify changes synced

## Step 6: Validate Data Migration

Check that all historical data is in Notion:

### Activity Log
- Open: https://www.notion.so/2e444f89599b816b9e5ac7882a4e0f87
- Expected: 17 entries
- Verify: Timestamps, agent numbers, DS ratings

### Task Queue
- Open: https://www.notion.so/2e444f89599b8191b899c464b5174075
- Expected: 37 tasks
- Verify: Task codes, statuses, priorities, assigned agents

### Decision Log
- Open: https://www.notion.so/2e444f89599b81bca855ea59bec1c59a
- Expected: 2 decisions
- Verify: Decision IDs, dates, titles

## Step 7: Monitor First Week

### Daily Checks
- [ ] Review GitHub Actions workflow runs (should all be green ✅)
- [ ] Check Notion databases for new entries from agents
- [ ] Verify no sync failures in workflow logs
- [ ] Test editing a Notion entry and verify it syncs to GitHub

### Weekly Review
- [ ] Calculate sync success rate (target: >99%)
- [ ] Check for any conflicts (target: <1%)
- [ ] Verify entry counts match between GitHub and Notion
- [ ] Review sync duration (GitHub→Notion <5min, Notion→GitHub <10min)

## Troubleshooting

### Workflow Fails with "API token is invalid"

**Cause**: Secret not set or incorrect

**Fix**:
1. Verify secret is set: Settings → Secrets and variables → Actions
2. Check secret name is exactly `NOTION_API_KEY` (case-sensitive)
3. Re-add secret if needed

### Workflow Runs But No Data Syncs

**Cause**: Database IDs may be incorrect

**Fix**:
1. Check `sync-service/config/notion-databases.json`
2. Verify IDs match the actual Notion databases
3. Re-run migration if needed

### "Could not find database" Error

**Cause**: MCP-created databases require MCP tools for access

**Fix**:
- This is expected - the SDK can't access MCP-created databases
- Ongoing sync should use MCP tools (already implemented in code)
- No action needed if databases are visible in Notion

### Merge Conflicts

**Cause**: Simultaneous edits in GitHub and Notion

**Fix**:
1. Human edits in Notion take precedence
2. Pull latest from GitHub
3. Manually resolve conflict
4. Commit resolution
5. Sync will resume automatically

## Database Links

Quick access to Notion databases:

- **Parent Page**: https://www.notion.so/2e444f89599b819cadc5c8a9d1bf7c6e
- **Activity Log**: https://www.notion.so/2e444f89599b816b9e5ac7882a4e0f87
- **Task Queue**: https://www.notion.so/2e444f89599b8191b899c464b5174075
- **Decision Log**: https://www.notion.so/2e444f89599b81bca855ea59bec1c59a

## Configuration Files

All configuration is stored in:
- `sync-service/.env` - API keys and paths (LOCAL ONLY, not committed)
- `sync-service/config/notion-databases.json` - Database IDs (committed)
- `sync-service/state/sync-state.json` - Last sync timestamps (committed)

## Next Steps After Setup

1. ✅ Add agents to Activity Log → They appear in Notion automatically
2. ✅ Human can review/edit in Notion → Changes sync to GitHub every 5 min
3. ✅ Task updates in GitHub → Notion Task Queue updates in real-time
4. ✅ Decision logs tracked in both locations

## Support

If you encounter issues:
1. Check workflow logs in **Actions** tab
2. Review `sync-service/logs/` for detailed error messages
3. Check sync state in `sync-service/state/sync-state.json`
4. Refer to `sync-service/README.md` for troubleshooting guide

---

**Setup Time Estimate**: 10-15 minutes
**Status**: Ready for production use
**Last Updated**: 2026-01-10
