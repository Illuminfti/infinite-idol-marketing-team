# Skill: Permissions

> **Purpose**: File access rights reference
> **Use When**: Unsure if you can write to a file
> **Rule**: Read everything, write only to your domain

---

## Active Agents (5-Agent System)

### Agent 00: Coordinator
**Write**: `knowledge-base/brand/`, `agents/`, `outputs/calendar/`, `logs/`, `reviews/`, `skills/`
**Role**: Orchestration, scheduling, human escalation

### Agent 02: Content Strategist
**Write**: `outputs/content/`, `outputs/calendar/` (propose)
**Role**: Tweets, threads, social content

### Agent 07: Light Novel Writer
**Write**: `knowledge-base/light-novels/`, `knowledge-base/lore/`
**Role**: Novel content, narrative, character development

### Agent 08: Lore Guardian
**Write**: `reviews/` (canon reviews), `knowledge-base/lore/` (updates)
**Role**: Canon compliance checking, Inviolable Facts protection

### Agent 09: Resident Degen
**Write**: `reviews/` (cultural reviews)
**Role**: Cultural authority, content approval gateway

---

## Universal Rules

1. **All agents can READ everything**
2. **All agents can WRITE to `logs/`** (for activity logging)
3. **One writer per file** - If unsure who owns it, ask Coordinator
4. **Cross-domain writes** - Escalate to Coordinator

---

## Directory Ownership (Active Agents)

| Directory | Owner |
|-----------|-------|
| `knowledge-base/lore/` | Agent 07 + Agent 08 |
| `knowledge-base/light-novels/` | Agent 07 |
| `knowledge-base/brand/` | Coordinator |
| `knowledge-base/crypto/` | Coordinator |
| `agents/` | Coordinator |
| `skills/` | Coordinator |
| `outputs/content/` | Agent 02 |
| `outputs/calendar/` | Coordinator (final), others propose |
| `logs/` | All (their own logs) |
| `reviews/` | Coordinator + Agent 08 + Agent 09 |

---

## Human-Required Directories

The following require human execution (archived agent domains):

| Directory | Requires |
|-----------|----------|
| `outputs/discord/` | Human (Discord access) |
| `outputs/music/`, `outputs/art/` | Human (Asset generation) |
| `outputs/seasons/` | Human (Game design) |
| `outputs/partnerships/` | Human (External contacts) |
| `logs/intel/` | Human (Community presence) |
| `knowledge-base/game-mechanics/` | Human (Game design) |

---

## When Permission is Unclear

1. Check this file first
2. If still unclear, default to READ-ONLY
3. Escalate to Coordinator for write approval
4. Document the decision for future reference
