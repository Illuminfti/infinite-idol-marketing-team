# Infinite Idol Marketing Team - Automation System

> **Purpose**: Run the 10-agent marketing team automatically using your Claude Code subscription
> **No API key needed** - Uses your existing Claude Code authentication

---

## Quick Start

```bash
# Run a specific agent
./automation/orchestrator.sh run 02

# Process the task queue
./automation/orchestrator.sh queue

# Run full content pipeline
./automation/orchestrator.sh pipeline

# Start background daemon (runs 3x daily)
./automation/orchestrator.sh daemon start
```

---

## Running Modes

### 1. Manual Commands

Run agents on-demand:

```bash
./automation/orchestrator.sh run <agent>    # Run specific agent
./automation/orchestrator.sh queue          # Process all queues
./automation/orchestrator.sh pipeline       # Full content pipeline
./automation/orchestrator.sh review         # Canon + cultural review
./automation/orchestrator.sh daily          # Daily coordination
./automation/orchestrator.sh status         # View queue status
```

### 2. Daemon Mode (Recommended)

Run agents automatically on a schedule:

```bash
# Start the daemon
./automation/orchestrator.sh daemon start

# Check status
./automation/orchestrator.sh daemon status

# Stop the daemon
./automation/orchestrator.sh daemon stop
```

**Daemon Schedule:**
| Time | Action |
|------|--------|
| 9 AM | Daily coordination (Agent 00) |
| 6 PM | Review pipeline (Agents 08 + 09) |
| 9 PM | Queue processing (Agent 00) |

### 3. Slash Commands

In any Claude Code session:

```
/agent 02       # Activate as Content Strategist
/queue          # View task queue
/pipeline       # Run content pipeline
```

---

## Agent Reference

| # | Alias | Role |
|---|-------|------|
| 00 | coordinator | Marketing Director - Orchestration |
| 01 | lore | Lore Architect - Canon management |
| 02 | content | Content Strategist - Tweets, content |
| 03 | community | Community Manager - Discord |
| 04 | gacha | Gacha Designer - Banners |
| 05 | analytics | Analytics Observer - Metrics |
| 06 | asset | Asset Coordinator - Prompts |
| 07 | novel | Light Novel Writer - Story |
| 08 | guardian | Lore Guardian - Canon validation |
| 09 | degen | Resident Degen - Cultural review |

**Examples:**
```bash
./automation/orchestrator.sh run 02
./automation/orchestrator.sh run content
./automation/orchestrator.sh run degen
```

---

## Content Pipeline

The pipeline runs content through validation:

```
Content Created (Agent 02)
         ↓
Canon Check (Agent 08)
         ↓
Cultural Review (Agent 09)
         ↓
Final Approval (Agent 00)
         ↓
Scheduled → master-calendar.md
```

Run it with:
```bash
./automation/orchestrator.sh pipeline
```

---

## Task Queue

Tasks are coordinated through `automation/task-queue.md`:

| Priority | Meaning |
|----------|---------|
| P0 | Critical - next run |
| P1 | High - within 24h |
| P2 | Medium - within 48h |
| P3 | Low - this week |

| Status | Meaning |
|--------|---------|
| PENDING | Waiting to be picked up |
| IN_PROGRESS | Agent working on it |
| BLOCKED | Waiting on dependency |
| REVIEW | Needs validation |
| COMPLETE | Done |
| ESCALATED | Needs human decision |

---

## Logs & Monitoring

**Orchestrator log:**
```bash
tail -f logs/orchestrator.log
```

**Agent activity:**
```bash
cat logs/agent-activity.md
```

**Queue status:**
```bash
./automation/orchestrator.sh status
```

---

## Human Oversight

The system escalates to `reviews/pending-human-review.md` for:
- Canon violations
- New canon proposals
- Strategy changes
- Budget decisions
- Uncertainty

Check this file periodically and add feedback to `reviews/feedback.md`.

---

## Files

| File | Purpose |
|------|---------|
| `automation/orchestrator.sh` | Main runner script |
| `automation/task-queue.md` | Task coordination |
| `.claude/commands/agent.md` | /agent command |
| `.claude/commands/queue.md` | /queue command |
| `.claude/commands/pipeline.md` | /pipeline command |
| `logs/orchestrator.log` | Automation logs |

---

*Uses your Claude Code subscription - no API key needed!*
