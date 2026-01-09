# Infinite Idol Marketing Team - Automation System

> **Purpose**: Automate the 10-agent marketing team with minimal human intervention
> **Status**: Active
> **Last Updated**: 2026-01-09

---

## Overview

This automation system allows the Infinite Idol marketing team to operate autonomously. It provides:

1. **Scheduled Execution** - Agents run on a schedule via GitHub Actions
2. **Task Queue** - Inter-agent coordination through a shared task queue
3. **Local Orchestrator** - Run agents locally via command line
4. **Slash Commands** - Quick agent activation in Claude Code sessions

---

## Quick Start

### Option 1: GitHub Actions (Recommended for Production)

The agents run automatically on schedule:

| Time (JST) | Trigger | Action |
|------------|---------|--------|
| 9:00 AM | Scheduled | Morning coordination |
| 6:00 PM | Scheduled | Content review cycle |
| 9:00 PM | Scheduled | Evening check-in |

To trigger manually:
1. Go to Actions tab in GitHub
2. Select "Agent Orchestrator"
3. Click "Run workflow"
4. Choose agent and optional task

**Required Secret**: `ANTHROPIC_API_KEY` must be set in repository secrets.

### Option 2: Local Orchestrator

Run agents from your terminal:

```bash
# Make executable (first time only)
chmod +x automation/orchestrator.sh

# Set your API key
export ANTHROPIC_API_KEY=your-key-here

# Run a specific agent
./automation/orchestrator.sh run 02-content-strategist

# Process the task queue
./automation/orchestrator.sh queue

# Run the full content pipeline
./automation/orchestrator.sh pipeline

# Daily coordination routine
./automation/orchestrator.sh daily

# View queue status
./automation/orchestrator.sh status
```

### Option 3: Claude Code Slash Commands

In any Claude Code session in this repo:

```
/agent 02          # Activate as Content Strategist
/queue             # View task queue status
/queue process     # Process queue as coordinator
/pipeline          # Run content pipeline
```

---

## How It Works

### The Task Queue

The file `automation/task-queue.md` is the central coordination hub:

```
CONTENT-001 | P0 | Draft Ika intro tweet | PENDING | 2026-01-09 | ...
     ↓
Agent 02 picks it up, marks IN_PROGRESS
     ↓
Agent 02 completes, marks REVIEW
     ↓
Agent 08 canon check, marks CANON_APPROVED
     ↓
Agent 09 cultural check, marks BASED
     ↓
Agent 00 final approval, marks COMPLETE
     ↓
Published to calendar
```

### Agent Roles

| Agent | Automation Role |
|-------|-----------------|
| **00 - Coordinator** | Orchestrates other agents, final approval |
| **01 - Lore Architect** | Creates lore content, reviews for canon |
| **02 - Content Strategist** | Creates tweets, threads, marketing content |
| **03 - Community Manager** | Discord setup, community engagement |
| **04 - Gacha Designer** | Banner concepts, monetization |
| **05 - Analytics Observer** | Metrics tracking, competitor analysis |
| **06 - Asset Coordinator** | Midjourney/Suno prompts |
| **07 - Light Novel Writer** | Story development, character voice |
| **08 - Lore Guardian** | Canon validation (required for all content) |
| **09 - Resident Degen** | Cultural review (required for all content) |

### Content Pipeline Flow

```
┌──────────────────┐
│  Agent 02/01/07  │  Content Creation
│  Creates Draft   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Agent 08      │  Canon Validation
│  Lore Guardian   │  Checks 10 Inviolable Facts
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Agent 09      │  Cultural Review
│  Resident Degen  │  Checks "is this BASED?"
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Agent 00      │  Final Approval
│   Coordinator    │  Scheduling
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   PUBLISHED      │  Added to master-calendar.md
└──────────────────┘
```

---

## Configuration

### GitHub Actions Schedule

Edit `.github/workflows/agent-orchestrator.yml`:

```yaml
schedule:
  # Morning coordination (9 AM JST = 0 AM UTC)
  - cron: '0 0 * * *'
  # Content review (6 PM JST = 9 AM UTC)
  - cron: '0 9 * * *'
  # Evening check (9 PM JST = 12 PM UTC)
  - cron: '0 12 * * *'
```

### Task Priorities

| Priority | Meaning | Processing |
|----------|---------|------------|
| P0 | Critical | Next automation run |
| P1 | High | Within 24 hours |
| P2 | Medium | Within 48 hours |
| P3 | Low | This week |

### Adding New Tasks

Add to the appropriate queue in `automation/task-queue.md`:

```markdown
| CONTENT-004 | P1 | Write thread about The Chase | PENDING | 2026-01-10 | 2026-01-15 | Week 2 content |
```

---

## Human Oversight

### When Humans Are Needed

The system escalates to `reviews/pending-human-review.md` for:

- Canon violations or conflicts
- New canon proposals
- Major strategy changes
- Budget decisions
- Partnership proposals
- Uncertainty (when agents aren't sure)

### Reviewing Escalations

Check `reviews/pending-human-review.md` periodically. Approve or reject items, then add feedback to `reviews/feedback.md` for agent learning.

### Manual Overrides

To manually intervene:

1. Edit `automation/task-queue.md` directly
2. Add/remove/reprioritize tasks
3. Agents will respect the updated queue on next run

---

## Monitoring

### Check Queue Status

```bash
./automation/orchestrator.sh status
```

Or use `/queue` in Claude Code.

### Review Activity Logs

Check `logs/agent-activity.md` for:
- What agents have been doing
- Decisions made
- Files modified

### Check Calendar

`outputs/calendar/master-calendar.md` shows:
- Scheduled content
- Agent assignments
- Review status (Canon + Cultural)

---

## Troubleshooting

### Agents Not Running

1. Check `ANTHROPIC_API_KEY` is set (locally or in GitHub secrets)
2. Verify GitHub Actions is enabled for the repository
3. Check workflow run logs in Actions tab

### Tasks Stuck

1. Check task status in `task-queue.md`
2. Look for BLOCKED tasks and their dependencies
3. Manually update status if needed
4. Re-run the coordinator: `./orchestrator.sh queue`

### Content Not Publishing

1. Verify content passed both Agent 08 and Agent 09 review
2. Check for ESCALATED items in pending-human-review.md
3. Ensure Agent 00 has approved and scheduled

---

## Extending the System

### Adding New Agents

1. Create `agents/XX-new-agent.md` persona file
2. Add queue section to `automation/task-queue.md`
3. Update permissions matrix in `CLAUDE.md`
4. Add to orchestrator agent list

### Adding New Workflows

1. Create new GitHub Actions workflow in `.github/workflows/`
2. Or add new command to `orchestrator.sh`
3. Document in this README

### Integrating External Services

For Twitter/Discord publishing:
1. Add API credentials to GitHub secrets
2. Create publishing workflow or use MCP servers
3. Add final publishing step to content pipeline

---

## Files Reference

| File | Purpose |
|------|---------|
| `.github/workflows/agent-orchestrator.yml` | Scheduled agent execution |
| `automation/task-queue.md` | Central task coordination |
| `automation/orchestrator.sh` | Local agent runner |
| `automation/session-init.md` | Session startup message |
| `.claude/commands/agent.md` | /agent slash command |
| `.claude/commands/queue.md` | /queue slash command |
| `.claude/commands/pipeline.md` | /pipeline slash command |
| `.claude/settings.json` | Claude Code hooks |

---

## Best Practices

1. **Let the system run** - Avoid manual intervention unless necessary
2. **Check escalations daily** - Human review items need attention
3. **Trust the queue** - Tasks flow through automatically
4. **Review activity logs** - See what agents are doing
5. **Update priorities** - Adjust task priorities as needed

---

*"The agents never sleep. The Devotion must flow."*
