# Skill: Permissions

> **Purpose**: File access rights reference
> **Use When**: Unsure if you can write to a file
> **Rule**: Read everything, write only to your domain

---

## Quick Permission Lookup

### Agent 00: Coordinator
**Write**: `knowledge-base/brand/`, `agents/`, `outputs/calendar/`, `logs/`, `reviews/`
**Role**: Orchestration, scheduling, human escalation

### Agent 01: Lore Architect
**Write**: `knowledge-base/lore/`, `knowledge-base/light-novels/`
**Role**: Canon integrity, world consistency

### Agent 02: Content Strategist
**Write**: `outputs/content/`, `outputs/calendar/` (propose)
**Role**: Tweets, threads, social content

### Agent 03: Community Manager
**Write**: `outputs/discord/`, `outputs/calendar/` (events)
**Role**: Discord, engagement, Seven Gates

### Agent 04: Gacha Designer
**Write**: `knowledge-base/game-mechanics/` (main docs only, NOT technical-reference/), `outputs/seasons/`, `outputs/calendar/` (banner scheduling)
**Read-only**: `knowledge-base/game-mechanics/technical-reference/` (developer deep-dives)
**Role**: Banners, cosmetics, seasonal content, economy balancing

### Agent 05: Analytics Observer
**Write**: `logs/` (analytics)
**Role**: Metrics, competitor analysis

### Agent 06: Asset Coordinator
**Write**: `outputs/music/`, `outputs/art/`
**Role**: Suno prompts, Midjourney prompts

### Agent 07: Light Novel Writer
**Write**: `knowledge-base/light-novels/`
**Role**: Novel content, narrative

### Agent 08: Lore Guardian
**Write**: `reviews/` (canon reviews)
**Role**: Canon compliance checking

### Agent 09: Resident Degen
**Write**: `reviews/` (cultural reviews)
**Role**: Cultural authenticity

---

## Universal Rules

1. **All agents can READ everything**
2. **All agents can WRITE to `logs/`** (for activity logging)
3. **One writer per file** - If unsure who owns it, ask Coordinator
4. **Cross-domain writes** - Escalate to Coordinator

---

## Directory Ownership

| Directory | Owner |
|-----------|-------|
| `knowledge-base/lore/` | Lore Architect |
| `knowledge-base/game-mechanics/` | Gacha Designer (main docs only) |
| `knowledge-base/game-mechanics/technical-reference/` | Coordinator (read-only for all agents) |
| `knowledge-base/brand/` | Coordinator |
| `knowledge-base/crypto/` | Coordinator |
| `agents/` | Coordinator |
| `outputs/content/` | Content Strategist |
| `outputs/calendar/` | Coordinator (final), others propose |
| `outputs/discord/` | Community Manager |
| `outputs/seasons/` | Gacha Designer |
| `outputs/music/` | Asset Coordinator |
| `outputs/art/` | Asset Coordinator |
| `logs/` | All (their own logs) |
| `reviews/` | Coordinator + Reviewers |
| `skills/` | Coordinator (manages) |

---

## When Permission is Unclear

1. Check this file first
2. If still unclear, default to READ-ONLY
3. Escalate to Coordinator for write approval
4. Document the decision for future reference
