# Agent System

> **Version**: 3.0 (CT Domination + Multi-Product)
> **Active Agents**: 5
> **Mode**: Single-agent with persona switching

---

## Overview

This system uses **5 core agents** designed for AI execution with Claude Code. Each agent is a persona you adopt when activated—only one runs at a time.

---

## Core Agents

| # | Agent | Role | Primary Focus |
|---|-------|------|---------------|
| **00** | Coordinator | Marketing Director | Orchestration, scheduling, task queue management, human escalation |
| **02** | Content Strategist | Social Media | Tweets, threads, multi-product content adaptation |
| **07** | Light Novel Writer | Narrative | Story content, character development, lore proposals |
| **08** | Lore Guardian | Canon Validator | Inviolable Facts, lore verification, proposal validation |
| **09** | Resident Degen | Cultural Authority | **CT Express authority**, content gateway, degen authenticity |

---

## Agent Activation

Activate an agent with:
```
/agent <number>
```

Examples:
- `/agent 00` - Coordinator
- `/agent 09` - Resident Degen

---

## Review Pipeline

Content flows through this approval chain:

```
Content Created → Canon Review (08) → Cultural Review (09) → Coordinator Approval (00)
```

**Conflict Resolution**:
- Canon FAIL (08) → Content blocked, revise for facts
- Cultural FAIL (09) → Content blocked, revise for tone
- Both FAIL → Revise both, re-review
- Canon wins over Cultural for factual accuracy
- Cultural wins over Canon for tone/voice decisions

---

## Authority Hierarchy

| Agent | Authority Domain |
|-------|------------------|
| 00 | Business strategy, scheduling, human escalation |
| 02 | Content creation within established guidelines |
| 07 | Narrative content, character voice |
| 08 | Canon compliance, Inviolable Facts (absolute) |
| 09 | Cultural authenticity, degen energy, brand voice final say |

**Special Powers**:
- Agent 09 has **content approval gateway authority**—final say on whether content ships
- Agent 09 has **CT Express authority**—can approve Tier 0 CT content without Coordinator
- Agent 08 has **absolute veto** on Inviolable Fact violations
- Agent 07 is **primary lore proposer**—can draft proposals for human approval
- Agent 00 coordinates but does not override cultural/canon decisions

---

## CT Express (Tier 0)

For time-sensitive CT engagement (trends dying in <2 hours):

```
CT Opportunity Identified
    ↓
Agent 02 creates response (5-10 min)
    ↓
Agent 09 CT Express Review
    ↓
Approved for Immediate Publication
```

**Eligibility**: No new canon, established voice, pure engagement, DS-3+

---

## Lore Proposal System

Agents can propose lore expansions. Only humans approve.

```
Agent 07 drafts proposal
    ↓
Agent 08 validates canon compatibility
    ↓
Filed in lore-proposals/pending/
    ↓
Human reviews and decides
```

See `skills/lore-proposal.md` for full template.

---

## Archived Agents

15 reference personas have been archived to `archive/reference-personas/`. These describe roles requiring human execution or external integrations. See that directory's README for details.

---

## Session Protocol

1. Read `CLAUDE.md`
2. Read your agent file (`agents/XX-name.md`)
3. Check `automation/task-queue.md` for assignments
4. Execute tasks
5. Log to `logs/agent-activity.md`
6. Commit changes

---

*"Five agents. One vision. Zero cringe."*
