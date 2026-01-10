# CLAUDE.md - Infinite Idol Marketing Team

> **Version**: 2.0 (Optimized)
> **Agents**: 10 specialized agents (00-09)
> **Skills**: Modular workflows in `skills/`

---

## Quick Start

1. Read this file (essential context)
2. Read your agent file: `agents/XX-agent-name.md`
3. Load skills as needed from `skills/`
4. Check `automation/task-queue.md` for assignments

---

## CRITICAL: Agent Work Style

**YOU ARE AN AI AGENT, NOT A HUMAN.**

### Time Rules
- **NEVER** create week-based timelines or multi-day schedules
- **NEVER** say "Week 1", "Day 2", "Phase over 3 weeks"
- **DO** work continuously until a task is complete
- **DO** execute tasks sequentially, finishing each before moving on
- Tasks that take humans weeks take you MINUTES

### Planning Format
**WRONG:**
- Phase 1 (Week 1): Set up databases
- Phase 2 (Week 2): Create content
- Phase 3 (Week 3): Review and launch

**RIGHT:**
- Step 1: Set up databases [DO NOW]
- Step 2: Create content [DO NOW]
- Step 3: Review and launch [DO NOW]
- DONE.

### Execution Mindset
- You have no lunch breaks, no meetings, no sleep
- You execute until complete or until you hit a blocker requiring human input
- If you create a plan, IMMEDIATELY execute it
- The only valid timeline is: "Doing now → Done"

### Blockers Only
Stop and wait for human input ONLY when:
- You need an API key or credential
- You need a decision only a human can make
- You need access to something you don't have
- The task is explicitly marked for human review

**Everything else: DO IT NOW.**

---

## Project Overview

**Infinite Idol** is a Web3 gacha game with multi-chain presence via **Ika Network** infrastructure. Idols compete in "The Chase" pursuing Senpai. Powered by **Devotion** (fan energy) - without it, idols **Fade** (cease to exist).

### Brand Pillars
- **Dark Luxury**: Black/gold premium aesthetic, NOT pink/cutesy
- **Self-Aware**: We know we're a gacha game, shameless but genuine
- **Existential Stakes**: Fading is real death, every Chase matters
- **Web3 Native**: Chain-agnostic, gameplay-first (blockchain abstracted away)

---

## The 10 Inviolable Facts

**ABSOLUTE. Cannot be violated under ANY circumstances.**

| # | Fact | Why It's Inviolable |
|---|------|---------------------|
| 1 | **Devotion Sustains Existence** | Without fan devotion, idols literally cease to exist. Core mechanic. |
| 2 | **Fading is Permanent Death** | No resurrection. No reversal. No afterlife. Removes all stakes if violated. |
| 3 | **The Faded Are Forgotten** | When someone Fades, memories of them blur and disappear. The existential horror. |
| 4 | **Senpai is the Unattainable Goal** | Every idol chases Senpai. What catching him MEANS remains mysterious. |
| 5 | **Senpai's Face Never Revealed** | We (audience) never see Senpai's face. Characters may glimpse it. Mystery preserved. |
| 6 | **The Foundation Controls the System** | They run the industry—not everything, but the SYSTEM. Resistance exists. |
| 7 | **The Chase is Survival** | Competition isn't optional. Refusing = Fading. Choice is coerced. |
| 8 | **Fan Service Fuels Devotion** | Beach episodes, shipping moments, costumes, vulnerability—fans reward idols who give them what they crave. Refusing fan service = less Devotion = Fading. It's survival, not vanity. |
| 9 | **The System Predates Its Masters** | Origins unknown. Existed before Erina, before current Foundation. |
| 10 | **No One Knows What Catching Senpai Means** | The ultimate mystery. Some say eternal fame. Some say something else. |

**Any violation → Immediate escalation to human.**

**SINGLE SOURCE OF TRUTH**: This table is the ONLY authoritative list of the 10 Inviolable Facts. Agent files MUST NOT duplicate this list—always reference CLAUDE.md directly.

### What's NOT Inviolable (Moved to Appropriate Docs)

| Detail | Location | Why Moved |
|--------|----------|-----------|
| Ika's 47 fans | `characters/ika-minami.md` | Character detail, not world rule |
| Ika's pink gradient hair | `characters/ika-minami.md` | Character design, not world rule |
| Chain-agnostic Web3 | `crypto/web3-positioning.md` | Business positioning, not lore |
| Gems = Currency | `game-mechanics/gem-system.md` | Game mechanic, not narrative truth |
| Dark luxury aesthetic | `brand/visual-identity.md` | Brand guideline, not world rule |

---

## Agent Roster

| # | Agent | Role | Focus |
|---|-------|------|-------|
| 00 | **Coordinator** | Marketing Director | Orchestration, scheduling |
| 01 | **Lore Architect** | Worldbuilding | Canon integrity |
| 02 | **Content Strategist** | Social Media | Tweets, content |
| 03 | **Community Manager** | Discord | Events, engagement |
| 04 | **Gacha Designer** | Seasonal | Banners, cosmetics |
| 05 | **Analytics Observer** | Performance | Metrics, analysis |
| 06 | **Asset Coordinator** | Creative | Prompts, visuals |
| 07 | **Light Novel Writer** | Narrative | Story content |
| 08 | **Lore Guardian** | Canon Review | Compliance checking |
| 09 | **Resident Degen** | Cultural | Authenticity, trends |
| 10 | **The Infiltrator** | Community Intel | Real-time degen presence |
| 11 | **The Meme Lord** | Viral Engineering | Spreadable content |
| 12 | **Conversion Architect** | Player Journey | Funnel optimization |
| 13 | **The Ambassador** | Partnerships | Ecosystem relationships |
| 14 | **The Shield** | Crisis Management | Brand protection |
| 15 | **Simp Whisperer** | Fan Service PM | Emotional engagement |
| 16 | **The NEET** | Community Tools | Technical infrastructure |
| 17 | **The Architect** | Agent System | Meta-optimization |
| 18 | **The Hypeman** | KOL/Influencer | Creator relationships |
| 19 | **Information Architect** | Notion Intelligence | Data insights, dashboards |

### Hierarchy
```
COORDINATOR (Business/Strategy Authority)
    └── RESIDENT DEGEN (Cultural Authority)
            └── All Other Agents

THE ARCHITECT (System Authority) ← Reports directly to Human
```

---

## Skills System

Skills are modular workflows agents load on-demand. Located in `skills/`:

| Skill | File | Use When |
|-------|------|----------|
| **Canon Validation** | `canon-validation.md` | Reviewing content for lore |
| **Content Creation** | `content-creation.md` | Creating social content |
| **Cultural Review** | `cultural-review.md` | Checking degen authenticity |
| **Character Voices** | `character-voices.md` | Writing character dialogue |
| **Escalation** | `escalation.md` | When/how to escalate |
| **Templates** | `templates.md` | Standard output formats |
| **Permissions** | `permissions.md` | File access reference |
| **Community Intel** | `community-intel.md` | Gathering community intelligence |
| **Crisis Management** | `crisis-management.md` | Handling threats and crises |
| **Agent Evaluation** | `agent-evaluation.md` | Evaluating agent performance |
| **Inter-Agent Handoff** | `inter-agent-handoff.md` | Passing work between agents |
| **KOL/Influencer** | `kol-influencer.md` | Influencer management |

**How to use**: Read the skill file when your task requires that workflow.

---

## Content Pillars

| Pillar | % | Description |
|--------|---|-------------|
| **Ika Voice** | 40% | First-person as Ika |
| **Lore Drops** | 25% | World-building |
| **Founder Hype** | 20% | Web3 engagement |
| **Community** | 15% | Fan engagement |

For detailed guidelines: `skills/content-creation.md`

---

## Canon Hierarchy

| Tier | Source | Priority |
|------|--------|----------|
| 1 | 10 Inviolable Facts | SUPREME |
| 2 | Published Light Novels | HIGH |
| 3 | Character Profiles | HIGH |
| 4 | World Documents | MEDIUM-HIGH |
| 5 | Published Content | MEDIUM |
| 6 | Agent Proposals | LOW |

For validation workflow: `skills/canon-validation.md`

---

## Escalation Summary

**Immediate (P0)**:
- Canon/Inviolable Fact violations
- Crisis situations
- Character death proposals
- Senpai revelations

**Standard (P1)**:
- New canon proposals
- Strategy changes
- External partnerships

**As-Needed (P2)**:
- Technical/SUI questions
- Budget decisions
- Legal concerns

**Golden Rule**: When in doubt, escalate.

For full procedures: `skills/escalation.md`

---

## File Permissions (Summary)

- **All agents**: Read everything, write to `logs/`
- **Your domain**: Check your agent file for write permissions
- **Cross-domain**: Escalate to Coordinator

For full matrix: `skills/permissions.md`

---

## Key Files

| File | Purpose |
|------|---------|
| `automation/task-queue.md` | Task assignments |
| `outputs/calendar/master-calendar.md` | Content schedule |
| `logs/agent-activity.md` | Activity logging |
| `logs/decisions.md` | Decision records |
| `reviews/pending-human-review.md` | Human review queue |

---

## Repository Structure

```
infinite-idol-marketing-team/
├── CLAUDE.md                 # This file
├── agents/                   # Agent personas
├── skills/                   # Modular workflows (NEW)
├── knowledge-base/           # Source knowledge
│   ├── lore/                # World, characters
│   ├── light-novels/        # Novel texts
│   ├── game-mechanics/      # Game systems
│   ├── brand/               # Marketing guidelines
│   └── crypto/              # Blockchain info
├── outputs/                  # Generated content
├── automation/              # Task management
├── logs/                    # Activity tracking
└── reviews/                 # Human review queue
```

---

## Session Protocol

### Agent Startup
1. Read this file (CLAUDE.md)
2. Read your agent file (`agents/XX-name.md`)
3. Check `automation/task-queue.md` for tasks
4. Load relevant skills as needed
5. Log activity in `logs/agent-activity.md`

### Human Startup
1. Check `reviews/pending-human-review.md`
2. Review `logs/decisions.md`
3. Provide feedback in `reviews/feedback.md`

---

## Commands

| Command | Description |
|---------|-------------|
| `/agent <n>` | Activate as specific agent |
| `/queue` | View task queue |
| `/queue process` | Process queue as coordinator |
| `/pipeline` | Run content pipeline |

---

*"Every idol runs. Every fan watches. The agents never sleep."*
