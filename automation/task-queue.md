# Agent Task Queue

> **Purpose**: Central task queue for automated agent coordination
> **Last Updated**: 2026-01-09
> **Auto-processed by**: GitHub Actions + Claude Code

---

## How This Works

1. **Add tasks** to the appropriate agent's queue below
2. **Automated runs** pick up tasks based on priority and schedule
3. **Agents update** task status as they work
4. **Completed tasks** are archived at the bottom

### Task Status Legend

| Status | Meaning |
|--------|---------|
| `PENDING` | Waiting to be picked up |
| `IN_PROGRESS` | Agent is actively working on this |
| `BLOCKED` | Waiting on dependency |
| `REVIEW` | Needs review by another agent |
| `COMPLETE` | Done - will be archived |
| `ESCALATED` | Sent to human review |

### Priority Levels

| Priority | Processing Time |
|----------|-----------------|
| `P0` | Immediate (next run) |
| `P1` | Within 24 hours |
| `P2` | Within 48 hours |
| `P3` | This week |

---

## Coordinator Queue (Agent 00)

Tasks for orchestration, scheduling, and oversight.

| ID | Priority | Task | Status | Created | Due | Notes |
|----|----------|------|--------|---------|-----|-------|
| COORD-001 | P1 | Morning coordination check | PENDING | 2026-01-09 | Daily | Process all agent queues |
| COORD-002 | P1 | Review pending content for scheduling | PENDING | 2026-01-09 | Daily | Final approval before publish |
| COORD-003 | P2 | Weekly performance review | PENDING | 2026-01-09 | Fri | Compile metrics from Agent 05 |

---

## Lore Architect Queue (Agent 01)

Tasks for worldbuilding, canon, and story consistency.

| ID | Priority | Task | Status | Created | Due | Notes |
|----|----------|------|--------|---------|-----|-------|
| LORE-001 | P1 | Draft Devotion System explainer thread | COMPLETE | 2026-01-09 | 2026-01-14 | ✅ Drafted, canon approved, culturally approved |
| LORE-002 | P2 | Review Ika voice tweets for canon | IN_PROGRESS | 2026-01-09 | Ongoing | Batch-001 drafted, needs review |
| LORE-003 | P2 | Prepare Senpai mystery teaser | PENDING | 2026-01-09 | 2026-01-16 | Thu content |

---

## Content Strategist Queue (Agent 02)

Tasks for social media content and marketing materials.

| ID | Priority | Task | Status | Created | Due | Notes |
|----|----------|------|--------|---------|-----|-------|
| CONTENT-001 | P0 | Draft "47 fans" Ika introduction tweet | COMPLETE | 2026-01-09 | 2026-01-12 | ✅ Drafted, canon approved, culturally approved, coordinator approved |
| CONTENT-002 | P1 | Create Ika personality tweet batch (3-5 tweets) | COMPLETE | 2026-01-09 | 2026-01-14 | ✅ Batch-001 created (5 tweets), awaiting review |
| CONTENT-003 | P1 | Format Devotion thread with Agent 01 | REVIEW | 2026-01-09 | 2026-01-15 | LORE-001 complete, thread ready for final format |

---

## Community Manager Queue (Agent 03)

Tasks for Discord, engagement, and community building.

| ID | Priority | Task | Status | Created | Due | Notes |
|----|----------|------|--------|---------|-----|-------|
| COMM-001 | P2 | Draft Discord server channel structure | PENDING | 2026-01-09 | 2026-01-17 | Pre-launch prep |
| COMM-002 | P2 | Seven Gates system implementation plan | PENDING | 2026-01-09 | 2026-01-17 | Engagement mechanics |
| COMM-003 | P3 | First week community engagement strategy | PENDING | 2026-01-09 | 2026-01-19 | Launch support |

---

## Gacha Designer Queue (Agent 04)

Tasks for banners, seasonal content, and monetization.

| ID | Priority | Task | Status | Created | Due | Notes |
|----|----------|------|--------|---------|-----|-------|
| GACHA-001 | P2 | First banner concept development | PENDING | 2026-01-09 | 2026-01-17 | Internal planning |
| GACHA-002 | P3 | Whale psychology notes for content | PENDING | 2026-01-09 | 2026-01-19 | Support marketing |

---

## Analytics Observer Queue (Agent 05)

Tasks for metrics, analysis, and optimization.

| ID | Priority | Task | Status | Created | Due | Notes |
|----|----------|------|--------|---------|-----|-------|
| ANALYTICS-001 | P2 | Baseline metrics setup | PENDING | 2026-01-09 | 2026-01-17 | Pre-launch tracking |
| ANALYTICS-002 | P2 | Competitor analysis update | PENDING | 2026-01-09 | 2026-01-17 | Market positioning |
| ANALYTICS-003 | P3 | Week 1 metrics report template | PENDING | 2026-01-09 | 2026-01-19 | Reporting framework |

---

## Asset Coordinator Queue (Agent 06)

Tasks for visual and audio asset generation.

| ID | Priority | Task | Status | Created | Due | Notes |
|----|----------|------|--------|---------|-----|-------|
| ASSET-001 | P1 | Ika character Midjourney prompt | PENDING | 2026-01-09 | 2026-01-13 | Visual identity |
| ASSET-002 | P2 | Suno theme music prompt framework | PENDING | 2026-01-09 | 2026-01-17 | Audio identity |
| ASSET-003 | P2 | Background/atmospheric visual prompts | PENDING | 2026-01-09 | 2026-01-15 | Support content |

---

## Light Novel Writer Queue (Agent 07)

Tasks for narrative development and story content.

| ID | Priority | Task | Status | Created | Due | Notes |
|----|----------|------|--------|---------|-----|-------|
| NOVEL-001 | P2 | Volume 3 outline development | PENDING | 2026-01-09 | 2026-01-19 | Story planning |
| NOVEL-002 | P3 | Character voice consultation | PENDING | 2026-01-09 | Ongoing | Support content team |

---

## Lore Guardian Queue (Agent 08)

Tasks for canon validation and lore verification.

| ID | Priority | Task | Status | Created | Due | Notes |
|----|----------|------|--------|---------|-----|-------|
| GUARDIAN-001 | P0 | Canon check: CONTENT-001 (47 fans tweet) | COMPLETE | 2026-01-09 | ASAP | ✅ Approved - canon compliant |
| GUARDIAN-002 | P1 | Canon check: LORE-001 (Devotion thread) | COMPLETE | 2026-01-09 | After draft | ✅ Approved - 100% accurate |
| GUARDIAN-003 | P1 | Review all Week 1 content for Inviolable Facts | IN_PROGRESS | 2026-01-09 | Ongoing | 2 of 3 items reviewed |

---

## Resident Degen Queue (Agent 09)

Tasks for cultural review and trend monitoring.

| ID | Priority | Task | Status | Created | Due | Notes |
|----|----------|------|--------|---------|-----|-------|
| DEGEN-001 | P0 | Cultural review: CONTENT-001 | COMPLETE | 2026-01-09 | ASAP | ✅ BASED - DS-3.0 perfect calibration |
| DEGEN-002 | P1 | Cultural review: Week 1 content batch | IN_PROGRESS | 2026-01-09 | Ongoing | LORE-001 approved (DS-2.5), batch-001 pending |
| DEGEN-003 | P2 | CT trend monitoring | PENDING | 2026-01-09 | Ongoing | Identify opportunities |

---

## Inter-Agent Dependencies

```
CONTENT-001 (Draft)
    → GUARDIAN-001 (Canon Check)
    → DEGEN-001 (Cultural Review)
    → COORD-002 (Final Approval)
    → PUBLISH

LORE-001 (Draft Thread)
    → GUARDIAN-002 (Canon Check)
    → CONTENT-003 (Format)
    → DEGEN-002 (Cultural Review)
    → COORD-002 (Final Approval)
    → PUBLISH
```

---

## Automation Schedule

| Time (JST) | Time (UTC) | Action | Agent |
|------------|------------|--------|-------|
| 9:00 AM | 0:00 AM | Morning coordination | 00 - Coordinator |
| 6:00 PM | 9:00 AM | Content review cycle | 08 + 09 + 00 |
| 9:00 PM | 12:00 PM | Evening check | 00 - Coordinator |

---

## Completed Tasks Archive

*Completed tasks are moved here for reference*

| ID | Task | Completed | By | Notes |
|----|------|-----------|----|----|
| *None yet* | | | | |

---

## Queue Management Rules

1. **Adding Tasks**:
   - Any agent can add tasks to their own queue
   - Coordinator can add tasks to any queue
   - Include: ID, Priority, Task, Status, Created, Due, Notes

2. **Processing Tasks**:
   - Agents process their queue in priority order (P0 first)
   - Update status as work progresses
   - Mark dependencies with BLOCKED status

3. **Completing Tasks**:
   - Change status to COMPLETE
   - Add completion notes
   - Move to archive section at next cleanup

4. **Escalating Tasks**:
   - Change status to ESCALATED
   - Add entry to reviews/pending-human-review.md
   - Include context and reason for escalation

---

*"The queue never sleeps. The agents never stop. The Devotion must flow."*
