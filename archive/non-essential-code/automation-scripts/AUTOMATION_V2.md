# Automation System V2 - Production Orchestration
## Infinite Idol Marketing Team

**Version**: 2.0 (Python Event-Driven)
**Status**: ✅ DEPLOYED
**Date**: 2026-01-09

---

## What's New in V2

**V1 (Bash Scripts)**: Manual orchestration via shell scripts
**V2 (Python Event-Driven)**: Autonomous coordination with database, event bus, and automated workflows

### Key Improvements
- ✅ SQLite database for task management (replacing markdown parsing)
- ✅ Event-driven architecture (agents trigger each other automatically)
- ✅ Automated review creation (no manual handoffs)
- ✅ SLA monitoring and escalation
- ✅ Parallel review processing (50% time reduction)
- ✅ Dependency auto-resolution
- ✅ GitHub Actions integration

---

## Quick Start

### 1. Initialize (One-Time Setup)

```bash
cd /path/to/infinite-idol-marketing-team
cd automation

# Create database from schema
sqlite3 task-queue.db < task-queue-schema.sql

# Verify installation
python3 orchestrator.py
```

### 2. Run Orchestrator (Interactive)

```bash
python3 orchestrator.py
```

Commands:
- `status` - System status and agent workloads
- `tasks` - Recent tasks list
- `events` - Event log
- `sla` - SLA violation check
- `test` - Create test task
- `quit` - Exit

### 3. Run Orchestrator (Daemon Mode)

```bash
python3 orchestrator.py daemon
```

Runs in background with:
- SLA monitoring every 15 minutes
- Automated escalation
- Continuous event processing

---

## Architecture

```
┌──────────────────────────────────────┐
│      EVENT BUS (event_bus.py)        │
│  Central message passing             │
└───────────────┬──────────────────────┘
                ↓
    ┌───────────┼───────────┐
    ↓           ↓           ↓
┌─────────┐ ┌─────────┐ ┌─────────┐
│Webhook  │ │ Task    │ │  SLA    │
│Processor│ │ Router  │ │ Monitor │
└─────────┘ └─────────┘ └─────────┘
    ↓           ↓           ↓
┌──────────────────────────────────────┐
│   SQLITE DB (task-queue.db)          │
│ Tasks, Reviews, Dependencies, etc.   │
└──────────────────────────────────────┘
```

### Components

| Component | File | Purpose |
|-----------|------|---------|
| **Event Bus** | `event_bus.py` | Inter-agent messaging |
| **Webhook Processor** | `webhook_processor.py` | Automated routing |
| **Task Router** | `task_router.py` | Agent assignment |
| **SLA Monitor** | `sla_monitor.py` | Time enforcement |
| **Orchestrator** | `orchestrator.py` | Main controller |

---

## How It Works

### Automated Content Workflow

```
1. Create Task
   orchestrator.create_task(
       title="Ika tweet #7",
       task_type="content",
       content_type="tweet",
       review_tier=2
   )
   ↓
2. Task Router assigns to Agent 02
   ↓
3. Agent 02 creates content
   ↓
4. Agent 02 marks complete
   orchestrator.mark_task_completed(task_id=5)
   ↓ [webhook processor receives event]
5. Reviews auto-created (Tier 2):
   - Cultural review (Agent 09) ✓
   - Coordinator review (Agent 00) ⏸
   ↓ [webhook waits for all reviews]
6. Agent 09 approves
   ↓ [webhook creates next review]
7. Agent 00 approves
   ↓
8. Task marked complete
   ↓
9. Published to calendar

ZERO MANUAL HANDOFFS
```

---

## Usage Examples

### Create Content Task

```python
from orchestrator import Orchestrator

orch = Orchestrator()
orch.start()

task_id = orch.create_task(
    title="Ika personality tweet #8",
    task_type="content",
    content_type="tweet",
    priority=2,  # P2 (normal)
    review_tier=2  # Established pattern
)

print(f"Created task {task_id}")
```

### Mark Task Complete (Triggers Reviews)

```python
orch.mark_task_completed(
    task_id=10,
    output_file="outputs/content/tweets/ika-tweet-008.md"
)

# Webhook processor automatically:
# 1. Creates cultural review (Agent 09)
# 2. Waits for approval
# 3. Creates coordinator review (Agent 00)
# 4. Marks task complete when all pass
```

### Check Workloads

```python
workloads = orch.task_router.get_all_workloads()

for agent, wl in workloads.items():
    print(f"Agent {agent:02d}: {wl['active_tasks']} tasks")
```

### Monitor SLAs

```python
summary = orch.sla_monitor.run_checks()
print(f"Violations: {summary['review_violations']}")
```

---

## Review Tiers (Automated)

| Tier | Name | Reviews | Time | Example |
|------|------|---------|------|---------|
| **1** | Novel | Canon + Cultural + Coordinator | 2-4h | First Ika tweet, new character |
| **2** | Established | Cultural + Coordinator (skip canon) | 30-60min | Subsequent Ika tweets |
| **3** | Repeatable | Coordinator only | 10-15min | Event reminders |

**Automation**: Webhook processor creates appropriate reviews based on tier automatically.

---

## Event Types

| Event | When | Action |
|-------|------|--------|
| `task.created` | New task in DB | Notify assigned agent |
| `task.completed` | Agent finishes | Create review tasks |
| `review.completed` | Review done | Check if all reviews complete |
| `dependency.resolved` | Blocker removed | Unblock waiting tasks |
| `sla.exceeded` | Time threshold passed | Escalate to coordinator |

**Full List**: See `event_bus.py` EventType class

---

## Database Schema

### Key Tables

**tasks**
- id, task_code, title, description, task_type, content_type
- status (pending/in_progress/blocked/review/complete)
- priority (0=P0, 1=P1, 2=P2, 3=P3)
- assigned_agent, review_tier
- created_at, started_at, completed_at, deadline

**reviews**
- id, task_id, review_type (canon/cultural/coordinator)
- reviewer_agent, status (pending/approved/rejected)
- ds_rating (for cultural reviews)
- requested_at, completed_at, review_time_minutes

**task_dependencies**
- task_id, depends_on_task_id
- is_resolved, resolved_at

**webhook_triggers**
- trigger_event, action_type, action_config
- is_active, last_triggered

### Useful Queries

```sql
-- Get pending tasks for agent
SELECT * FROM tasks
WHERE assigned_agent = 2 AND status = 'pending'
ORDER BY priority, deadline;

-- Get review bottlenecks
SELECT reviewer_agent, COUNT(*) as pending
FROM reviews
WHERE status = 'pending'
GROUP BY reviewer_agent;

-- Get blocked tasks
SELECT t.task_code, td.depends_on_task_id
FROM tasks t
JOIN task_dependencies td ON t.id = td.task_id
WHERE t.status = 'blocked' AND td.is_resolved = FALSE;
```

---

## SLA Thresholds

| Item | Threshold | Action |
|------|-----------|--------|
| Canon review (Tier 1) | 2 hours | Escalate |
| Cultural review (Tier 1) | 2 hours | Escalate |
| Cultural review (Tier 2) | 1 hour | Escalate |
| Coordinator review | 30 minutes | Escalate |
| P0 task completion | 24 hours | Human escalation |
| P1 task completion | 72 hours | Coordinator escalation |

**Configuration**: Edit thresholds in `sla_monitor.py`

---

## GitHub Actions Integration

**File**: `.github/workflows/orchestrator-daemon.yml`

Runs every 15 minutes:
- SLA monitoring
- Database updates
- Auto-commits results

To trigger manually:
1. Go to GitHub Actions tab
2. Select workflow
3. Click "Run workflow"

---

## Monitoring & Troubleshooting

### Check System Status

```bash
python3 orchestrator.py
> status
```

Shows:
- Task counts by status
- Review counts by status
- Agent workloads and availability

### View Recent Events

```bash
python3 orchestrator.py
> events
```

### Check SLA Violations

```bash
python3 orchestrator.py
> sla
```

### Common Issues

**"unable to open database file"**
- Solution: Run from project root
- Fix: `cd /path/to/infinite-idol-marketing-team && python3 automation/orchestrator.py`

**Reviews not auto-creating**
- Check webhook subscriptions: `orch.event_bus.list_subscriptions()`
- Verify webhook triggers: `SELECT * FROM webhook_triggers WHERE is_active = TRUE;`

**Agent workload stuck**
- Reset: `UPDATE agents SET current_active_tasks = 0;`
- Recalculate from tasks table

---

## Migration from V1

### Migrate Tasks from Markdown

```python
import sqlite3
import re

# Parse task-queue.md
with open('task-queue.md', 'r') as f:
    content = f.read()

# Extract tasks (custom parsing based on format)
# Insert into database
conn = sqlite3.connect('task-queue.db')
# ... insertion logic ...
conn.commit()
```

### Coexistence

V1 and V2 can run in parallel:
- V1: Manual orchestration via bash scripts
- V2: Automated orchestration via Python
- Both read/write to same markdown files
- V2 adds database layer on top

---

## Performance Metrics

### Targets (Post-Deployment)

| Metric | V1 | V2 Target | Status |
|--------|-----|-----------|--------|
| Content velocity | 4/day | 15-20/day | 🔄 TBD |
| Review time | 4.5h | 2.5h | 🔄 TBD |
| Manual intervention | 70% | <5% | 🔄 TBD |
| Agent utilization | 6h/day | 16h/day | 🔄 TBD |

Track with: `orch.get_dashboard_summary()`

---

## Testing

### Run All Component Tests

```bash
cd /path/to/infinite-idol-marketing-team

python3 automation/event_bus.py
python3 automation/task_router.py
python3 automation/sla_monitor.py
python3 automation/webhook_processor.py
```

### Create Test Task

```bash
python3 orchestrator.py
> test
```

---

## API Reference

### Orchestrator Class

```python
orch = Orchestrator(db_path="automation/task-queue.db")

# Start/stop
orch.start()
orch.stop()

# Task management
task_id = orch.create_task(title, task_type, content_type, priority, review_tier)
orch.mark_task_started(task_id)
orch.mark_task_completed(task_id, output_file)

# Monitoring
summary = orch.get_dashboard_summary()
```

### Event Bus

```python
from event_bus import get_event_bus, Event, EventType

bus = get_event_bus()

# Subscribe to events
def handler(event):
    print(f"Received: {event.event_type}")

bus.subscribe(EventType.TASK_COMPLETED, handler)

# Publish events
bus.publish(Event(
    event_type=EventType.TASK_CREATED,
    payload={'task_id': 5},
    source='my_script'
))

# Query events
recent = bus.get_events(event_type=EventType.TASK_COMPLETED, limit=10)
```

### Task Router

```python
from task_router import TaskRouter

router = TaskRouter()

# Assign agent for task
agent_num = router.assign_agent('content', 'tweet')  # Returns 2

# Check availability
available = router.check_agent_availability(2)

# Get workload
workload = router.get_agent_workload(2)
print(workload['active_tasks'])
```

### SLA Monitor

```python
from sla_monitor import SLAMonitor

monitor = SLAMonitor()

# Run checks
summary = monitor.run_checks()

# Get stats
stats = monitor.get_review_time_stats()
```

---

## Roadmap

### Phase 1 (COMPLETE) ✅
- ✅ Database schema designed
- ✅ Core components built
- ✅ Event bus implemented
- ✅ Webhook processor created
- ✅ SLA monitoring functional

### Phase 2 (In Progress) 🔄
- 🔄 GitHub Actions scheduled runs
- 🔄 Dashboard integration
- 🔄 Publishing API integration
- 🔄 Full 24/7 autonomous operation

### Phase 3 (Planned) 📋
- 📋 Sentiment monitoring
- 📋 Performance analytics dashboard
- 📋 A/B testing framework
- 📋 Multi-platform publishing

---

## Support

Issues? Questions?
1. Check this documentation
2. Review event logs: `SELECT * FROM event_log ORDER BY timestamp DESC LIMIT 50;`
3. Run component tests
4. Check GitHub Actions logs

---

*"Automation scales. Agents coordinate. Humans oversee. The Chase never stops."*
