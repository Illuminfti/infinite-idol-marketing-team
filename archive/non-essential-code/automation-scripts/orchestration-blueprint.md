# Automation Orchestration Blueprint
## Infinite Idol Marketing Team - Event-Driven Agent Coordination

**Version**: 1.0
**Date**: 2026-01-09
**Purpose**: Blueprint for implementing autonomous agent-to-agent coordination
**Status**: Design Phase → Implementation Ready

---

## Executive Summary

This blueprint transforms the Infinite Idol agent system from **human-orchestrated** to **event-driven autonomous** operations. Current manual intervention points (7 per content piece) are eliminated through webhooks, automated handoffs, and SLA enforcement.

**Current State**: Agents reactive, human triggers each step, 70% manual intervention
**Target State**: Agents proactive, self-coordinating, 95% autonomous with human oversight

---

## Architecture Overview

### Core Components

```
┌──────────────────────────────────────────────────────┐
│           ORCHESTRATION ENGINE (Python)              │
│  - Event Bus                                         │
│  - Webhook Processor                                 │
│  - Task Router                                       │
│  - SLA Monitor                                       │
└──────────────────────────────────────────────────────┘
                          ↓ ↑
┌──────────────────────────────────────────────────────┐
│        TASK QUEUE DATABASE (SQLite)                  │
│  - Tasks                                             │
│  - Reviews                                           │
│  - Dependencies                                      │
│  - Webhooks                                          │
└──────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────┬──────────────┬──────────────┬─────────┐
│  Agent 00   │  Agent 02    │  Agent 08    │  Etc... │
│ Coordinator │  Content     │  Lore        │         │
└─────────────┴──────────────┴──────────────┴─────────┘
                          ↓ ↑
┌──────────────────────────────────────────────────────┐
│          FILE SYSTEM (Markdown Outputs)              │
│  - Content files                                     │
│  - Review files                                      │
│  - Activity logs                                     │
└──────────────────────────────────────────────────────┘
```

---

## Component 1: Event Bus

### Purpose
Central message passing system for inter-agent communication. Agents publish events, orchestration engine routes to subscribed handlers.

### Event Types

| Event | Published By | Subscribers | Payload |
|-------|-------------|-------------|---------|
| `task.created` | Agent 00, System | Dashboard, Assigned Agent | task_id, agent_number, priority |
| `task.started` | Any Agent | Dashboard, Agent 00 | task_id, started_at |
| `task.completed` | Any Agent | Orchestrator (triggers next steps), Dashboard | task_id, output_file, completed_at |
| `task.blocked` | Any Agent | Dashboard, Agent 00 | task_id, blocked_by, reason |
| `review.requested` | Orchestrator | Review Agent | task_id, review_type, requester |
| `review.completed` | Agent 08, 09, 00 | Orchestrator, Dashboard | task_id, review_type, status, notes |
| `dependency.resolved` | Orchestrator | Blocked tasks | task_id, dependency_id |
| `sla.exceeded` | SLA Monitor | Agent 00, Human | task_id, threshold, current_time |
| `content.scheduled` | Agent 00 | Calendar, Publishing Service | content_id, scheduled_time, platform |
| `content.published` | Publishing Service | Dashboard, Agent 05 | content_id, platform, platform_post_id |

### Implementation (Python)

```python
# event_bus.py
from typing import Callable, Dict, List
from dataclasses import dataclass
from datetime import datetime
import json

@dataclass
class Event:
    event_type: str
    payload: Dict
    source: str
    timestamp: datetime = datetime.now()

class EventBus:
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}
        self.event_log: List[Event] = []

    def subscribe(self, event_type: str, handler: Callable):
        """Register handler for event type"""
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(handler)

    def publish(self, event: Event):
        """Publish event to all subscribers"""
        self.event_log.append(event)

        # Route to subscribers
        if event.event_type in self.subscribers:
            for handler in self.subscribers[event.event_type]:
                try:
                    handler(event)
                except Exception as e:
                    print(f"Error in event handler: {e}")
                    # Log error but continue processing

    def get_events(self, event_type: str = None, since: datetime = None):
        """Query event log"""
        events = self.event_log
        if event_type:
            events = [e for e in events if e.event_type == event_type]
        if since:
            events = [e for e in events if e.timestamp >= since]
        return events
```

---

## Component 2: Webhook Processor

### Purpose
Translate events into automated actions (create tasks, send notifications, update status, trigger agents).

### Webhook Rules (from database)

```python
# webhook_processor.py
import sqlite3
import json
from event_bus import Event, EventBus

class WebhookProcessor:
    def __init__(self, db_path: str, event_bus: EventBus):
        self.db = sqlite3.connect(db_path)
        self.event_bus = event_bus
        self.register_handlers()

    def register_handlers(self):
        """Subscribe to events that trigger webhooks"""
        self.event_bus.subscribe('task.completed', self.on_task_completed)
        self.event_bus.subscribe('review.completed', self.on_review_completed)
        self.event_bus.subscribe('dependency.resolved', self.on_dependency_resolved)

    def on_task_completed(self, event: Event):
        """When task completes, trigger next steps"""
        task_id = event.payload['task_id']

        # Get task details
        task = self.get_task(task_id)

        # If content task, create review tasks
        if task['task_type'] == 'content':
            self.create_review_tasks(task)

        # Check if this completes dependencies
        self.check_and_resolve_dependencies(task_id)

    def create_review_tasks(self, task):
        """Create appropriate review tasks based on tier"""
        review_tier = task['review_tier']

        if review_tier == 1 or review_tier == 2:
            # Create parallel canon + cultural reviews
            self.create_review_task(task['id'], 'canon', reviewer_agent=8)
            self.create_review_task(task['id'], 'cultural', reviewer_agent=9)
        elif review_tier == 3:
            # Create coordinator review only
            self.create_review_task(task['id'], 'coordinator', reviewer_agent=0)

    def on_review_completed(self, event: Event):
        """When review completes, check if all reviews done"""
        task_id = event.payload['task_id']

        # Get all reviews for this task
        reviews = self.get_reviews_for_task(task_id)

        # Check if all pending reviews are complete
        pending = [r for r in reviews if r['status'] == 'pending']

        if not pending:
            # All reviews complete, trigger coordinator approval
            if not any(r['review_type'] == 'coordinator' for r in reviews):
                self.create_review_task(task_id, 'coordinator', reviewer_agent=0)

    def check_and_resolve_dependencies(self, completed_task_id):
        """Find blocked tasks depending on this task"""
        cursor = self.db.execute("""
            SELECT task_id FROM task_dependencies
            WHERE depends_on_task_id = ? AND is_resolved = FALSE
        """, (completed_task_id,))

        blocked_tasks = cursor.fetchall()

        for (task_id,) in blocked_tasks:
            # Mark dependency resolved
            self.db.execute("""
                UPDATE task_dependencies
                SET is_resolved = TRUE, resolved_at = CURRENT_TIMESTAMP
                WHERE task_id = ? AND depends_on_task_id = ?
            """, (task_id, completed_task_id))

            # Check if task has any remaining unresolved dependencies
            cursor = self.db.execute("""
                SELECT COUNT(*) FROM task_dependencies
                WHERE task_id = ? AND is_resolved = FALSE
            """, (task_id,))

            remaining = cursor.fetchone()[0]

            if remaining == 0:
                # Unblock task
                self.db.execute("""
                    UPDATE tasks SET status = 'pending'
                    WHERE id = ? AND status = 'blocked'
                """, (task_id,))

                # Notify assigned agent
                self.event_bus.publish(Event(
                    event_type='dependency.resolved',
                    payload={'task_id': task_id},
                    source='webhook_processor'
                ))

        self.db.commit()

    # Helper methods...
    def get_task(self, task_id):
        # Query database for task details
        pass

    def get_reviews_for_task(self, task_id):
        # Query database for all reviews
        pass

    def create_review_task(self, task_id, review_type, reviewer_agent):
        # Insert review record
        pass
```

---

## Component 3: Task Router

### Purpose
Automatically assign tasks to agents based on availability, workload, and specialization.

### Routing Rules

| Task Type | Agent Candidates | Selection Criteria |
|-----------|------------------|-------------------|
| **Content (tweets/threads)** | Agent 02 | Primary creator |
| **Content (Discord)** | Agent 03 | Primary creator |
| **Content (banners)** | Agent 04 | Primary creator |
| **Content (novels)** | Agent 07 | Primary creator |
| **Review (canon)** | Agent 08 | Only option |
| **Review (cultural)** | Agent 09 | Only option |
| **Review (coordinator)** | Agent 00 | Only option |
| **Asset (visual)** | Agent 06 | Only option |
| **Asset (audio)** | Agent 06 | Only option |

### Implementation

```python
# task_router.py
class TaskRouter:
    def __init__(self, db_path: str):
        self.db = sqlite3.connect(db_path)

    def assign_agent(self, task_type: str, content_type: str = None):
        """Determine which agent should handle task"""

        # Content tasks route by content type
        if task_type == 'content':
            if content_type in ['tweet', 'thread']:
                return 2  # Agent 02 (Content Strategist)
            elif content_type in ['discord', 'event', 'community']:
                return 3  # Agent 03 (Community Manager)
            elif content_type in ['banner', 'gacha', 'seasonal']:
                return 4  # Agent 04 (Gacha Designer)
            elif content_type in ['novel', 'chapter', 'story']:
                return 7  # Agent 07 (Light Novel Writer)

        # Review tasks route by review type
        elif task_type == 'review':
            # This is handled in webhook processor
            pass

        # Asset tasks always go to Agent 06
        elif task_type == 'asset':
            return 6  # Agent 06 (Asset Coordinator)

        # Default: Escalate to coordinator
        return 0

    def check_agent_availability(self, agent_number: int):
        """Check if agent has capacity for new task"""
        cursor = self.db.execute("""
            SELECT current_active_tasks, max_concurrent_tasks
            FROM agents WHERE agent_number = ?
        """, (agent_number,))

        row = cursor.fetchone()
        if not row:
            return False

        current, max_allowed = row
        return current < max_allowed
```

---

## Component 4: SLA Monitor

### Purpose
Monitor review times, task durations, and escalate when SLAs are exceeded.

### SLA Definitions

| Item | Tier 1 | Tier 2 | Tier 3 |
|------|--------|--------|--------|
| **Canon Review** | 2 hours | N/A (skipped) | N/A |
| **Cultural Review** | 2 hours | 1 hour | N/A |
| **Coordinator Review** | 30 min | 30 min | 15 min |
| **Total Review Time** | 4 hours | 2 hours | 30 min |
| **P0 Task Completion** | 24 hours | - | - |
| **P1 Task Completion** | 72 hours | - | - |

### Implementation

```python
# sla_monitor.py
from datetime import datetime, timedelta

class SLAMonitor:
    def __init__(self, db_path: str, event_bus: EventBus):
        self.db = sqlite3.connect(db_path)
        self.event_bus = event_bus

    def check_review_slas(self):
        """Find reviews exceeding SLA"""
        # Check reviews pending > threshold
        cursor = self.db.execute("""
            SELECT r.id, r.task_id, r.review_type, r.reviewer_agent,
                   (julianday('now') - julianday(r.requested_at)) * 24 as hours_pending,
                   t.review_tier
            FROM reviews r
            JOIN tasks t ON r.task_id = t.id
            WHERE r.status = 'pending'
        """)

        for row in cursor.fetchall():
            review_id, task_id, review_type, reviewer, hours_pending, tier = row

            # Determine SLA threshold
            if review_type == 'canon' and tier == 1:
                threshold = 2.0
            elif review_type == 'cultural' and tier == 1:
                threshold = 2.0
            elif review_type == 'cultural' and tier == 2:
                threshold = 1.0
            elif review_type == 'coordinator':
                threshold = 0.5
            else:
                continue  # No SLA for this combination

            if hours_pending > threshold:
                # SLA exceeded - escalate
                self.event_bus.publish(Event(
                    event_type='sla.exceeded',
                    payload={
                        'review_id': review_id,
                        'task_id': task_id,
                        'review_type': review_type,
                        'reviewer_agent': reviewer,
                        'hours_pending': hours_pending,
                        'threshold': threshold
                    },
                    source='sla_monitor'
                ))

    def check_task_slas(self):
        """Find tasks exceeding completion SLA"""
        cursor = self.db.execute("""
            SELECT id, task_code, priority, assigned_agent,
                   (julianday('now') - julianday(created_at)) * 24 as hours_open
            FROM tasks
            WHERE status IN ('pending', 'in_progress', 'blocked')
        """)

        for row in cursor.fetchall():
            task_id, task_code, priority, agent, hours_open = row

            # Check priority-based SLAs
            if priority == 0 and hours_open > 24:  # P0: 24 hours
                self.escalate_task(task_id, 'P0 task exceeds 24 hour SLA')
            elif priority == 1 and hours_open > 72:  # P1: 72 hours
                self.escalate_task(task_id, 'P1 task exceeds 72 hour SLA')

    def escalate_task(self, task_id, reason):
        """Escalate task to coordinator and human"""
        self.event_bus.publish(Event(
            event_type='task.escalated',
            payload={'task_id': task_id, 'reason': reason},
            source='sla_monitor'
        ))

    def run_continuously(self, interval_minutes=15):
        """Run SLA checks on schedule"""
        import time
        while True:
            self.check_review_slas()
            self.check_task_slas()
            time.sleep(interval_minutes * 60)
```

---

## Component 5: Agent Activation Service

### Purpose
Automatically trigger agent sessions when tasks are ready for them.

### Activation Triggers

| Trigger | Agent | Frequency |
|---------|-------|-----------|
| Pending tasks in queue | All agents | On-demand |
| Scheduled content creation | Agent 02 | 3x daily (9 AM, 2 PM, 6 PM JST) |
| Morning coordinator checks | Agent 00 | Daily 9 AM JST |
| Analytics compilation | Agent 05 | Daily 11 PM JST |
| Trend monitoring | Agent 09 | 2x daily (10 AM, 4 PM JST) |
| Review task created | Agent 08, 09 | On-demand |

### Implementation (GitHub Actions)

```yaml
# .github/workflows/agent-scheduler.yml
name: Agent Scheduler

on:
  schedule:
    # Agent 00: Daily at 9 AM JST (midnight UTC)
    - cron: '0 0 * * *'
    # Agent 02: 3x daily (9 AM, 2 PM, 6 PM JST = 0:00, 5:00, 9:00 UTC)
    - cron: '0 0,5,9 * * *'
    # Agent 05: Daily at 11 PM JST (2 PM UTC)
    - cron: '0 14 * * *'
    # Agent 09: 2x daily (10 AM, 4 PM JST = 1:00, 7:00 UTC)
    - cron: '0 1,7 * * *'

  # Manual trigger
  workflow_dispatch:
    inputs:
      agent_number:
        description: 'Agent to activate (0-9)'
        required: true
      task_id:
        description: 'Optional specific task ID'
        required: false

jobs:
  activate_agent:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Determine agent to activate
        id: agent
        run: |
          # Logic to determine which agent based on schedule
          # For now, placeholder
          echo "agent_number=2" >> $GITHUB_OUTPUT

      - name: Check pending tasks
        run: |
          # Query SQLite database for pending tasks for this agent
          python scripts/check_pending_tasks.py --agent ${{ steps.agent.outputs.agent_number }}

      - name: Activate agent via Claude Code
        if: ${{ steps.pending.outputs.has_tasks == 'true' }}
        run: |
          # Trigger agent session
          # This would use Claude API to start agent session
          python scripts/activate_agent.py --agent ${{ steps.agent.outputs.agent_number }}

      - name: Commit outputs
        run: |
          git config user.name "Agent Bot"
          git config user.email "agent@infinite-idol.com"
          git add outputs/ logs/
          git commit -m "Agent ${{ steps.agent.outputs.agent_number }} session output"
          git push
```

---

## Component 6: Dashboard Real-Time Sync

### Purpose
Update Terminal UI dashboard in real-time without manual refresh.

### Implementation (File Watcher)

```python
# dashboard/live_sync.py
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

class DatabaseChangeHandler(FileSystemEventHandler):
    def __init__(self, dashboard_app):
        self.dashboard_app = dashboard_app

    def on_modified(self, event):
        if event.src_path.endswith('.db'):
            # Database updated, refresh dashboard
            self.dashboard_app.refresh_data()

def run_with_live_sync(dashboard_app):
    """Run dashboard with live file watching"""
    observer = Observer()
    handler = DatabaseChangeHandler(dashboard_app)
    observer.schedule(handler, path='./automation/', recursive=False)
    observer.start()

    try:
        dashboard_app.run()
    finally:
        observer.stop()
        observer.join()
```

---

## Workflow Examples

### Example 1: Content Creation → Publication (Autonomous)

```
1. Agent 00 creates task in database:
   - CONTENT-010: "Create Ika personality tweet #6"
   - Assigned: Agent 02
   - Priority: P2
   - Review Tier: 2 (Established)

2. Task Router publishes event:
   - task.created → Notify Agent 02

3. Agent 02 activated (scheduled or on-demand):
   - Reads task from database
   - Creates tweet content
   - Saves to outputs/content/tweets/ika-tweet-006.md
   - Updates task status: IN_PROGRESS → COMPLETE
   - Publishes task.completed event

4. Webhook Processor receives task.completed:
   - Checks task type: content
   - Checks review tier: 2
   - Creates TWO review tasks (parallel):
     a) REVIEW-020: Cultural review (Agent 09)
     b) REVIEW-021: Coordinator review (Agent 00, waits for cultural)

5. Agent 09 activated:
   - Reads review task REVIEW-020
   - Reviews content for DS rating
   - Saves review to reviews/REVIEW-020.md
   - Updates review status: APPROVED
   - Publishes review.completed event

6. Webhook Processor receives review.completed:
   - Checks if all reviews done for CONTENT-010
   - Cultural ✅, Coordinator pending
   - Triggers Agent 00 coordinator review

7. Agent 00 activated:
   - Reads review task
   - Spot-checks content (Tier 2 = light review)
   - Approves and schedules on calendar
   - Updates calendar with publish date/time
   - Marks task COMPLETE

8. Publishing Service (scheduled):
   - At scheduled time, reads content from file
   - Posts to Twitter via API
   - Updates calendar with platform_post_id
   - Publishes content.published event

9. Agent 05 tracks metrics:
   - Polls Twitter API for engagement
   - Updates calendar_items table with likes/retweets
   - Logs to analytics

TOTAL TIME: 1-2 hours autonomous, zero human intervention
```

---

### Example 2: Blocked Task Auto-Unblocking

```
1. CONTENT-015 created:
   - Status: BLOCKED
   - Blocked by: LORE-003 (Senpai mystery lore drop)

2. Agent 01 completes LORE-003:
   - Updates task status: COMPLETE
   - Publishes task.completed event

3. Webhook Processor receives task.completed:
   - Runs check_and_resolve_dependencies(LORE-003)
   - Finds CONTENT-015 depends on LORE-003
   - Marks dependency resolved
   - Checks CONTENT-015 for other dependencies: None
   - Updates CONTENT-015 status: BLOCKED → PENDING
   - Publishes dependency.resolved event

4. Task Router receives dependency.resolved:
   - CONTENT-015 now pending
   - Notifies Agent 02 (assigned agent)

5. Agent 02 activated:
   - Sees CONTENT-015 in queue
   - Reads LORE-003 output for context
   - Creates content referencing new lore
   - ... workflow continues

MANUAL INTERVENTION: Zero
```

---

### Example 3: SLA Escalation

```
1. REVIEW-025 (Cultural review) pending for 2+ hours

2. SLA Monitor runs check (every 15 minutes):
   - Detects REVIEW-025 exceeds 2-hour threshold
   - Publishes sla.exceeded event

3. Notification Service receives sla.exceeded:
   - Sends notification to Agent 00 (Coordinator)
   - Sends notification to Human (email/Slack)

4. Agent 00 or Human investigates:
   - Reviews task details
   - Options:
     a) Wait longer (complex content needing deep review)
     b) Reassign review (if Agent 09 unavailable)
     c) Adjust SLA for this task type

MANUAL INTERVENTION: Only if Agent 00 can't resolve
```

---

## Deployment Sequence

### Phase 1: Foundation (Days 1-2)
1. Implement SQLite schema (`task-queue-schema.sql`)
2. Migrate existing markdown task queue to database
3. Build Event Bus (`event_bus.py`)
4. Build basic Webhook Processor (`webhook_processor.py`)
5. Test event flow with sample tasks

### Phase 2: Core Automation (Days 3-4)
1. Implement Task Router (`task_router.py`)
2. Implement auto-review-task-creation
3. Implement dependency resolution
4. Test full workflow: Content → Review → Approval

### Phase 3: Monitoring (Day 5)
1. Implement SLA Monitor (`sla_monitor.py`)
2. Set up notification system (email, Slack, Discord)
3. Test escalation workflows

### Phase 4: Scheduling (Days 6-7)
1. Create GitHub Actions workflows
2. Implement Agent Activation Service
3. Test scheduled agent runs
4. Deploy to production

---

## Success Metrics

### Week 1 Targets
- ✅ 90% of content pieces flow through system without manual handoffs
- ✅ Average review time reduced 50% (sequential → parallel)
- ✅ Zero missed SLA escalations
- ✅ Dashboard updates in real-time (<30 second lag)

### Week 3 Targets
- ✅ Agents run 16+ hours/day autonomously
- ✅ 95% task completion without human intervention
- ✅ Zero dependency deadlocks (auto-resolution working)
- ✅ Agent activation via schedule successful 100% of runs

---

## Rollback Plan

If automation causes issues:

1. **Immediate Rollback**: Disable webhook triggers in database
   ```sql
   UPDATE webhook_triggers SET is_active = FALSE;
   ```

2. **Partial Rollback**: Disable specific automation
   - Keep event logging for visibility
   - Manual task creation continues
   - Re-enable webhooks one by one after fixes

3. **Full Rollback**: Return to markdown-based queue
   - Export tasks from database to markdown
   - Use existing manual coordination process
   - Fix issues offline, re-deploy when ready

---

## Maintenance & Monitoring

### Daily
- Check SLA Monitor logs for escalations
- Review event bus logs for errors
- Verify agent activation schedules triggered

### Weekly
- Analyze webhook performance (latency, success rate)
- Review agent workload distribution
- Audit dependency resolution accuracy

### Monthly
- Database maintenance (vacuum, reindex)
- Review and optimize slow queries
- Update webhook rules based on learnings

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-09 | Initial orchestration blueprint | System Implementation |

---

*"Automation scales. Agents coordinate. Humans oversee. The Chase never stops."*
