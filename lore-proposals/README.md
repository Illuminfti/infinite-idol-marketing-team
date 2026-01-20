# Lore Proposals

> **Purpose**: Repository for lore expansion proposals requiring human approval
> **Owner**: Human (final authority), Agent 08 (validation), Agent 07 (proposals)

---

## How It Works

Agents can **PROPOSE** new lore. Only humans can **APPROVE** it as canon.

```
Agent identifies lore gap
    ↓
Agent drafts proposal using template (skills/lore-proposal.md)
    ↓
Agent 08 validates canon compatibility
    ↓
Proposal filed in pending/
    ↓
Human reviews and decides
    ↓
Moved to approved/ or rejected/
    ↓
If approved → Update knowledge base → Enable content
```

---

## Directory Structure

```
lore-proposals/
├── pending/        ← Awaiting human decision
├── approved/       ← Human-approved, ready for implementation
├── rejected/       ← Not approved (with rejection notes)
└── README.md       ← This file
```

---

## Proposal Naming Convention

```
LORE-YYYY-MM-###-brief-description.md
```

**Examples**:
- `LORE-2026-01-001-ika-hobby.md`
- `LORE-2026-01-002-devotion-visualization.md`
- `LORE-2026-02-001-foundation-sub-division.md`

---

## Proposal Types

| Type | Description | Example |
|------|-------------|---------|
| **Character** | Backstory, traits, relationships | Ika's hobby before becoming idol |
| **Mechanic** | How world systems work | How Devotion physically manifests |
| **Location** | New places or location details | Where low-rank idols live |
| **Event** | Past events, timeline additions | A significant past Chase |
| **Faction** | Organizations, groups | A Foundation sub-division |
| **Relationship** | Character connections | How Sora and Suiren met |

---

## Who Can Propose

| Agent | Proposal Authority |
|-------|-------------------|
| **Agent 07** | Primary proposer (narrative needs) |
| **Agent 02** | Can identify gaps (marketing needs) |
| **Agent 08** | Validates, rarely proposes |
| **Agent 09** | Can flag cultural needs |
| **Agent 00** | Routes proposals, doesn't propose |

---

## Review Process

### Step 1: Draft
- Use template from `skills/lore-proposal.md`
- Complete ALL sections
- Self-check against 10 Inviolable Facts

### Step 2: Internal Validation
- Agent 08 reviews for canon compatibility
- Agent 09 reviews for cultural fit (if relevant)
- Revise if issues found

### Step 3: Submit
- File in `pending/` with proper naming
- Add entry to `automation/task-queue.md` for human
- Status: `PENDING_HUMAN_REVIEW`

### Step 4: Human Decision
**APPROVE**:
- Move to `approved/`
- Agent updates knowledge base files
- Notify relevant agents
- Status: `APPROVED`

**REJECT**:
- Move to `rejected/`
- Human adds rejection notes
- Status: `REJECTED`
- Agent documents alternative approach

**REVISE**:
- Stays in `pending/`
- Human adds revision notes
- Agent revises and resubmits
- Status: `REVISION_REQUESTED`

---

## After Approval

1. **Update Knowledge Base**
   - Add to relevant character/world/mechanic files
   - Cross-reference in related documents

2. **Enable Content**
   - New content now possible based on approved lore
   - Document what this unlocks

3. **Notify Agents**
   - Log in `logs/agent-activity.md`
   - Update any affected agent files

---

## Inviolable Facts Check

Every proposal MUST pass validation against all 10 Inviolable Facts.

| # | Fact | Check |
|---|------|-------|
| 1 | Devotion Sustains Existence | Does proposal align? |
| 2 | Fading is Permanent Death | No resurrection loopholes? |
| 3 | The Faded Are Forgotten | Memory mechanics preserved? |
| 4 | Senpai is Unattainable Goal | Chase dynamic intact? |
| 5 | Senpai's Face Never Revealed | Visual obscuration maintained? |
| 6 | Foundation Controls System | Power structure respected? |
| 7 | The Chase is Survival | Competition stakes preserved? |
| 8 | Fan Service Fuels Devotion | Strategy framework intact? |
| 9 | System Predates Masters | Origin mystery preserved? |
| 10 | No One Knows What Catching Means | Ultimate mystery intact? |

**ANY violation = Automatic rejection**

---

## Common Rejection Reasons

| Reason | Prevention |
|--------|------------|
| Contradicts existing canon | Research thoroughly first |
| Violates Inviolable Fact | Always check all 10 |
| Over-explains mystery | Preserve unknowns |
| Low content value | Show clear content unlock |
| Scope too large | Break into smaller proposals |
| Poor timing | Consider product roadmap |

---

## Metrics

Track in `logs/lore-proposals-metrics.md`:
- Proposals submitted per month
- Approval rate
- Common rejection reasons
- Time to decision
- Content enabled by approvals

---

*"The best lore grows from what the story is already asking for."*
