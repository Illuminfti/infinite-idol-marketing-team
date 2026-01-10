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

### Agent 10: The Infiltrator
**Write**: `logs/intel/`, `reviews/` (intel reports)
**Role**: Community intelligence, real-time engagement

### Agent 11: The Meme Lord
**Write**: `outputs/memes/`, `outputs/art/` (meme assets)
**Role**: Viral content, meme templates

### Agent 12: Conversion Architect
**Write**: `logs/conversion/`, `outputs/analytics/`
**Role**: Funnel optimization, player journey

### Agent 13: The Ambassador
**Write**: `outputs/partnerships/`
**Role**: External relationships, collaborations

### Agent 14: The Shield
**Write**: `reviews/incidents/`, `logs/security/`
**Role**: Crisis management, brand protection

### Agent 15: Simp Whisperer
**Write**: `outputs/fan-service/`
**Role**: Fan service strategy, emotional engagement

### Agent 16: The NEET
**Write**: `outputs/tools/`, `outputs/specs/`
**Role**: Community tools, technical specs

### Agent 17: The Architect
**Write**: `agents/` (documentation), `skills/`, `logs/agent-reviews/`
**Role**: Agent system optimization (proposals require human approval)

### Agent 18: The Hypeman
**Write**: `outputs/influencer/`, `logs/influencer/`
**Role**: KOL/Influencer relations, creator campaigns

### Agent 19: Information Architect
**Write**: `logs/insights/`, `outputs/dashboards/`
**Role**: Notion intelligence, data insights, dashboard management

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
| `agents/` | Coordinator + Architect (docs only) |
| `outputs/content/` | Content Strategist |
| `outputs/calendar/` | Coordinator (final), others propose |
| `outputs/discord/` | Community Manager |
| `outputs/seasons/` | Gacha Designer |
| `outputs/music/` | Asset Coordinator |
| `outputs/art/` | Asset Coordinator + Meme Lord |
| `outputs/memes/` | Meme Lord |
| `outputs/partnerships/` | Ambassador |
| `outputs/fan-service/` | Simp Whisperer |
| `outputs/tools/` | The NEET |
| `outputs/specs/` | The NEET |
| `logs/` | All (their own logs) |
| `logs/intel/` | Infiltrator |
| `logs/security/` | Shield |
| `logs/conversion/` | Conversion Architect |
| `logs/agent-reviews/` | Architect |
| `logs/influencer/` | Hypeman |
| `logs/insights/` | Information Architect |
| `outputs/influencer/` | Hypeman |
| `outputs/dashboards/` | Information Architect |
| `reviews/` | Coordinator + Reviewers |
| `reviews/incidents/` | Shield |
| `skills/` | Coordinator + Architect |

---

## When Permission is Unclear

1. Check this file first
2. If still unclear, default to READ-ONLY
3. Escalate to Coordinator for write approval
4. Document the decision for future reference
