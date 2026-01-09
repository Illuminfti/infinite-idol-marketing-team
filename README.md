# Infinite Idol Marketing Team

> *"Every idol runs. Every fan watches. Every Devotion matters. Welcome to the Eternal Stage."*

A comprehensive AI-powered marketing infrastructure for **Infinite Idol** — a Web3 gacha game where idols fight for survival through fan devotion on the SUI blockchain.

---

## What is Infinite Idol?

Infinite Idol is a dark luxury gacha game where idols are sustained by **Devotion** — literal emotional energy from their fans. When fans stop caring, idols **Fade** — they cease to exist. This isn't cute idol content; it's existential survival dressed in black and gold.

**Core Features:**
- **The Chase** — Idols compete in obstacle courses pursuing the mysterious Senpai
- **Devotion System** — Fan energy that keeps idols alive
- **Fading** — The permanent death awaiting idols who lose their fans
- **SUI Blockchain** — Web3-native with NFT battle passes and gem currency

---

## What is This Repository?

This is the **Marketing HQ** — an AI agent-driven content production system. Nine specialized AI agents work together to handle all marketing operations:

| Agent | Role | Focus |
|-------|------|-------|
| **00 - Coordinator** | Workflow Orchestration | Task routing, agent coordination, project oversight |
| **01 - Lore Architect** | World Builder | Canon management, world-building foundations, lore consistency |
| **02 - Content Strategist** | Marketing Lead | Content planning, campaign strategy, audience engagement |
| **03 - Community Manager** | Engagement Specialist | Community interaction, feedback collection, sentiment analysis |
| **04 - Gacha Designer** | Seasonal Content | Banners & whale psychology |
| **05 - Analytics Observer** | Performance Tracking | Metrics & optimization |
| **06 - Asset Coordinator** | Creative Asset Manager | Suno & Midjourney prompts |
| **07 - Light Novel Writer** | Narrative Specialist | Light novel creation, character voice mastery, story development |
| **08 - Lore Guardian** | Collaborative Validation | Real-time lore validation, active lore expansion, bidirectional canon updates |

---

## Running the Agents

### Prerequisites

- Access to Claude (via API or Claude Code CLI)
- This repository cloned locally

### How to Run an Agent

Each agent is activated by loading the master instructions followed by their specific persona file. Here are the exact steps:

#### Method 1: Using Claude Code CLI

```bash
# Navigate to the repository
cd infinite-idol-marketing-team

# Start Claude Code
claude

# Then in the conversation, instruct Claude to load the agent:
# "Read CLAUDE.md and then read agents/00-coordinator.md. Act as Agent 00."
```

#### Method 2: Direct File Loading

When starting a conversation with Claude, provide these files in order:

1. **First**: Load `CLAUDE.md` (master instructions)
2. **Second**: Load the specific agent persona file

```bash
# Example for running the Coordinator (Agent 00):
cat CLAUDE.md agents/00-coordinator.md
```

#### Method 3: Using the Activation Prompt

Start a Claude session and use this prompt template:

```
I need you to act as Agent [NUMBER] from the Infinite Idol marketing team.

Please read and follow these files in order:
1. CLAUDE.md - Master instructions for all agents
2. agents/[NUMBER]-[agent-name].md - Your specific persona and responsibilities

After reading both files, confirm you understand your role and ask what task I'd like you to work on.
```

### Agent File Paths

| Agent | Persona File |
|-------|--------------|
| Coordinator | `agents/00-coordinator.md` |
| Lore Architect | `agents/01-lore-architect.md` |
| Content Strategist | `agents/02-content-strategist.md` |
| Community Manager | `agents/03-community-manager.md` |
| Gacha Designer | `agents/04-gacha-designer.md` |
| Analytics Observer | `agents/05-analytics-observer.md` |
| Asset Coordinator | `agents/06-asset-coordinator.md` |
| Light Novel Writer | `agents/07-light-novel-writer.md` |
| Lore Guardian | `agents/08-lore-guardian.md` |

### Running Multiple Agents

For complex tasks requiring multiple agents:

1. Start separate Claude sessions for each agent
2. Have each agent read their respective persona files
3. Use the `reviews/` and `logs/` directories for inter-agent communication
4. The Coordinator (Agent 00) should oversee multi-agent workflows

---

## Quick Start

### For Human Operators

1. **Check pending reviews:**
   ```bash
   cat reviews/pending-human-review.md
   ```

2. **See what agents have been doing:**
   ```bash
   cat logs/agent-activity.md
   ```

3. **Review the content calendar:**
   ```bash
   cat outputs/calendar/master-calendar.md
   ```

4. **Provide feedback:**
   Edit `reviews/feedback.md` with notes for agent improvement.

### For AI Agents

1. **Read master instructions first:**
   ```bash
   cat CLAUDE.md
   ```

2. **Load your agent persona:**
   ```bash
   cat agents/[your-agent-number]-[agent-name].md
   ```

3. **Check the knowledge base** for relevant context in `knowledge-base/`

4. **Log your actions** to `logs/agent-activity.md`

---

## Repository Structure

```
infinite-idol-marketing-team/
├── CLAUDE.md                  # Master instructions (agents read this first)
├── README.md                  # You are here
├── agents/                    # 9 AI agent persona definitions
├── knowledge-base/
│   ├── lore/                 # World, characters, factions, mechanics
│   ├── light-novels/         # Novel drafts and published volumes
│   ├── game-mechanics/       # Pre-reg spec, gacha, gems, battle pass
│   ├── brand/                # Voice, visuals, audience, competitors
│   └── crypto/               # SUI integration, tokenomics, Web3
├── outputs/
│   ├── calendar/             # Master content schedule
│   ├── content/              # Tweets, threads, articles
│   ├── discord/              # Events, Seven Gates content
│   ├── light-novels/         # Published novel outputs
│   ├── music/                # Suno AI prompts
│   └── art/                  # Midjourney prompts
├── logs/                     # Agent activity and decisions
├── reviews/                  # Human review queue
├── volume-1-awakening.md     # Published Volume 1
└── volume-2-the-fall.md      # Published Volume 2
```

---

## Key Concepts

### The 10 Inviolable Canon Rules

These facts are **ABSOLUTE** across all content:

1. **Devotion is quantifiable** — Love generates measurable energy that sustains idols
2. **Fading is permanent death** — Idols without Devotion cease to exist completely
3. **The Chase is voluntary** — Participation must be freely chosen, never coerced
4. **Memory anchors identity** — Ika's lost memories are central to her existence
5. **Senpai's face is NEVER shown** — Describe presence, reactions - never direct facial features
6. **Names have power** — True names carry weight in this world
7. **The system predates current management** — Someone designed the Devotion system
8. **Graduation is not what it seems** — There's more to "graduating" than the public knows
9. **Unity can defeat Fading** — Collective Devotion can save individuals
10. **Love transcends categories** — Devotion isn't limited by type or source

### Brand Voice

Our voice is **shameless but genuine, self-aware, dark luxury, existentially dramatic**.

We acknowledge we're making a gacha game. We embrace the whale psychology. But we do it with genuine love for the characters and world we've built.

---

## Content Pillars

| Pillar | Share | Description |
|--------|-------|-------------|
| **Ika Voice** | 40% | First-person content as our protagonist |
| **Lore Drops** | 25% | World-building and story reveals |
| **Founder Hype** | 20% | Web3 community engagement |
| **Community** | 15% | Engagement and responses |

---

## Human Escalation

Agents escalate to human review when encountering:

- Canon conflicts or new canon proposals
- Major strategy shifts
- Crisis situations
- Technical blockchain questions
- Budget decisions
- Legal concerns
- Character Fading proposals
- Partnership opportunities
- Any uncertainty

---

## Getting Help

- **Agent Instructions**: See `CLAUDE.md`
- **Character Details**: See `knowledge-base/lore/characters/`
- **Game Mechanics**: See `knowledge-base/game-mechanics/`
- **Brand Guidelines**: See `knowledge-base/brand/`

---

## Version

**v2.0.0** — Agent System Expansion (9 agents)

---

*Built for idols who refuse to Fade.*
