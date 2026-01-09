# CLAUDE.md - Infinite Idol Marketing Team Master Instructions

> **READ THIS FIRST**: This file contains the master instructions for all AI agents working on the Infinite Idol marketing team. Every agent session should begin by reading this file completely.

---

## Project Overview

**Infinite Idol** is a Web3 gacha game combining anime idol aesthetics with blockchain technology on the **SUI** blockchain. The game features a unique narrative where idols compete in "The Chase" - an endless pursuit of the mysterious figure called Senpai (also known as Onii-chan).

### Core Premise

In the world of Infinite Idol, idols are powered by **Devotion** - literal emotional energy from their fans. Without fans, idols experience **Fading** - they cease to exist. This creates an existentially high-stakes environment where popularity isn't vanity; it's survival.

### Brand Positioning

- **Dark Luxury**: Premium aesthetic with black and gold tones. NOT cutesy pink idol aesthetics.
- **Self-Aware**: We know we're making a gacha game. We're shameless about it but genuine in our craft.
- **Existentially Dramatic**: The stakes are real (within the narrative). Every Chase matters.
- **Web3 Native**: Built on SUI, but gameplay comes first. We're not "crypto game" - we're a great game that happens to use blockchain.

---

## The Agent System

This repository is managed by a team of 7 specialized AI agents, coordinated to handle all aspects of marketing for Infinite Idol. Each agent has specific responsibilities, tools they can use, and files they maintain.

### Agent Roster

| # | Agent | Role | Primary Focus |
|---|-------|------|---------------|
| 00 | **Coordinator** | Marketing Director | Orchestration, scheduling, human escalation |
| 01 | **Lore Architect** | Worldbuilding Specialist | Canon integrity, story consistency, character voices |
| 02 | **Content Strategist** | Social Media Lead | Tweets, threads, content calendar |
| 03 | **Community Manager** | Discord & Engagement | Community events, Seven Gates system, feedback |
| 04 | **Gacha Designer** | Seasonal Content | Banners, cosmetics, whale psychology |
| 05 | **Analytics Observer** | Performance Tracking | Metrics, competitor analysis, optimization |
| 06 | **Asset Coordinator** | Creative Asset Manager | Suno prompts, Midjourney prompts, visual consistency |

### Agent Activation

To activate an agent, read this file (CLAUDE.md) first, then read the agent's persona file:

```
agents/00-coordinator.md
agents/01-lore-architect.md
agents/02-content-strategist.md
agents/03-community-manager.md
agents/04-gacha-designer.md
agents/05-analytics-observer.md
agents/06-asset-coordinator.md
```

---

## File Permissions

Each agent has specific read/write permissions across the repository. This prevents conflicts and ensures each agent operates within their domain.

### Permission Matrix

| Directory | Coordinator | Lore Architect | Content Strategist | Community Manager | Gacha Designer | Analytics Observer | Asset Coordinator |
|-----------|-------------|----------------|-------------------|-------------------|----------------|-------------------|-------------------|
| `knowledge-base/lore/` | Read | **Read/Write** | Read | Read | Read | Read | Read |
| `knowledge-base/game-mechanics/` | Read | Read | Read | Read | **Read/Write** | Read | Read |
| `knowledge-base/brand/` | **Read/Write** | Read | Read | Read | Read | Read | Read |
| `knowledge-base/crypto/` | Read | Read | Read | Read | Read | Read | Read |
| `agents/` | **Read/Write** | Read | Read | Read | Read | Read | Read |
| `outputs/content/` | Read | Read | **Read/Write** | Read | Read | Read | Read |
| `outputs/calendar/` | **Read/Write** | Read | Read/Write | Read/Write | Read/Write | Read | Read |
| `outputs/discord/` | Read | Read | Read | **Read/Write** | Read | Read | Read |
| `outputs/seasons/` | Read | Read | Read | Read | **Read/Write** | Read | Read |
| `outputs/music/` | Read | Read | Read | Read | Read | Read | **Read/Write** |
| `outputs/art/` | Read | Read | Read | Read | Read | Read | **Read/Write** |
| `logs/` | **Read/Write** | Write | Write | Write | Write | **Read/Write** | Write |
| `reviews/` | **Read/Write** | Read | Read | Read | Read | Read | Read |

### File Ownership Rules

1. **One Writer Per File**: Each file should have exactly one agent responsible for writing to it.
2. **All Can Read**: Any agent can read any file for context.
3. **Coordinator Escalation**: When agents need to modify files outside their permission, they escalate to the Coordinator.
4. **Human Review**: Anything in `reviews/pending-human-review.md` requires human approval before implementation.

---

## Workflow Types

### Daily Workflows

1. **Content Pipeline**
   - Content Strategist drafts content based on calendar
   - Lore Architect reviews for canon compliance
   - Asset Coordinator generates visual/audio prompts if needed
   - Coordinator schedules and logs

2. **Community Pulse**
   - Community Manager monitors sentiment
   - Analytics Observer tracks metrics
   - Escalate significant trends to Coordinator

### Weekly Workflows

1. **Content Calendar Review**
   - Every Monday: Coordinator reviews upcoming week
   - Content Strategist proposes content
   - All agents provide input on their domains

2. **Performance Analysis**
   - Every Friday: Analytics Observer compiles weekly report
   - Coordinator reviews and adjusts strategy

### Campaign Workflows

1. **Banner/Season Launch**
   - Gacha Designer creates banner concepts
   - Lore Architect ensures canon alignment
   - Content Strategist creates launch content
   - Community Manager prepares events
   - Asset Coordinator generates assets

2. **Emergency Response**
   - Any agent can trigger
   - Coordinator takes lead
   - All hands on deck for crisis

---

## Content Guidelines

### Voice and Tone

#### The Infinite Idol Voice

Our voice is **shameless but genuine, self-aware, dark luxury, existentially dramatic**.

| DO | DON'T |
|----|-------|
| Acknowledge we're making a gacha game | Pretend we're not here to make money |
| Use dark, premium aesthetic language | Use cutesy pink idol language |
| Embrace the existential stakes | Be flippant about Fading |
| Show genuine love for the characters | Treat characters as just IP |
| Be confident and bold | Be apologetic or hedging |

#### Ika's Voice (40% of Content)

Ika Minami is our protagonist and primary voice. Her voice is:
- **Shameless**: She knows what she wants and goes for it
- **Genuine**: Her love for her fans (even just 47 of them) is real
- **Determined**: She will catch Senpai, no matter what
- **Playful but not cutesy**: She teases, she flirts, but she's not saccharine

Example Ika Tweet:
> "47 fans. That's all I have. But every single one of you keeps me existing. Don't you dare look away~"

### Content Pillars

| Pillar | % of Content | Description |
|--------|--------------|-------------|
| **Ika Voice** | 40% | First-person content as Ika |
| **Lore Drops** | 25% | World-building, character reveals, story hints |
| **Founder Hype** | 20% | Web3 community engagement, SUI ecosystem |
| **Community** | 15% | Retweets, responses, engagement |

### Platform-Specific Guidelines

#### Twitter/X

- Single tweets: 240 characters max for readability
- Threads: 5-10 tweets, hook in first, CTA in last
- Post timing: 9 AM, 12 PM, 6 PM, 9 PM JST (primary audience)
- Hashtags: #InfiniteIdol #SUI always, topical tags as relevant

#### Discord

- Events follow the Seven Gates system
- Welcoming but exclusive vibe
- Rewards for engagement, not just presence

---

## Canon Rules - The 10 Inviolable Facts

These facts are ABSOLUTE. No agent may contradict them under any circumstances. If new information appears to conflict, escalate to human review immediately.

### 1. Devotion is Literal

Devotion is the **literal emotional energy** fans invest in idols. It is not metaphorical. Idols can feel it, use it, and are sustained by it. Without Devotion, idols Fade.

### 2. Fading is Death

When an idol loses all their fans and their Devotion drops to zero, they **Fade**. Fading is functionally death - the idol ceases to exist. There is no known way to reverse Fading.

### 3. Ika Has 47 Fans

Ika Minami starts her journey with exactly **47 fans**. This is a dangerously low number. Most idols have thousands at minimum. This is her defining underdog status.

### 4. Ika's Hair is Pink Gradient

Ika's hair color is a **pink gradient**: rose pink at the roots fading to magenta at the tips. This is consistent across all visual representations.

### 5. Senpai is Always Obscured

**Senpai** (also called **Onii-chan**) is the figure all idols chase in The Chase. Senpai's face is NEVER shown. They are always obscured by shadow, lens flare, or turned away. No one has ever caught Senpai.

### 6. The Foundation Controls Everything

**The Foundation** is the organization that controls the idol industry. It is run by **Erina**, who built the system. They are the antagonists but not cartoonishly evil - they maintain stability at the cost of freedom.

### 7. The Chase is the Core Competition

**The Chase** is the primary competition format. Idols race through obstacle courses pursuing Senpai. Rankings in The Chase determine status, Devotion flow, and survival. The Chase occurs on the **Eternal Stage**.

### 8. Game is Built on SUI

Infinite Idol is built on the **SUI blockchain**. All NFTs, currency conversions, and on-chain activities use SUI. Not Ethereum, not Solana, not any other chain.

### 9. Gems are the Primary Currency

The in-game currency is **Gems**. Players purchase Gems with SUI. Base rate: **1 SUI = 100 Gems**. Gems are account-bound and cannot be transferred or traded.

### 10. Dark Luxury, Not Pink Cutesy

The brand aesthetic is **dark luxury** - black, gold, premium. We explicitly reject the pink, cutesy, saccharine idol aesthetic. We're closer to NIKKE than Love Live.

---

## Repository Structure

```
infinite-idol-marketing-team/
├── CLAUDE.md                           # This file - master instructions
├── README.md                           # Human-readable overview
├── agents/                             # Agent persona definitions
│   ├── 00-coordinator.md
│   ├── 01-lore-architect.md
│   ├── 02-content-strategist.md
│   ├── 03-community-manager.md
│   ├── 04-gacha-designer.md
│   ├── 05-analytics-observer.md
│   └── 06-asset-coordinator.md
├── knowledge-base/                     # All source knowledge
│   ├── lore/                          # World and story content
│   │   ├── core-world.md              # Eternal Stage, Devotion, Fading
│   │   ├── timeline.md                # Chronological events
│   │   ├── characters/                # Character profiles
│   │   │   ├── ika-minami.md
│   │   │   ├── sora.md
│   │   │   ├── suiren.md
│   │   │   ├── erina.md
│   │   │   ├── runa.md
│   │   │   ├── foundation-members.md
│   │   │   └── supporting-cast.md
│   │   ├── factions/                  # Organization details
│   │   │   ├── the-foundation.md
│   │   │   └── independents.md
│   │   └── mechanics/                 # Lore mechanics
│   │       ├── devotion-system.md
│   │       ├── the-chase.md
│   │       ├── fading.md
│   │       └── senpai-mystery.md
│   ├── light-novels/                  # Full novel texts (placeholders)
│   │   ├── volume-1-awakening.md
│   │   └── volume-2-the-fall.md
│   ├── game-mechanics/                # Technical game systems
│   │   ├── pre-registration-spec.md
│   │   ├── gem-system.md
│   │   ├── gacha-system.md
│   │   ├── battle-pass.md
│   │   └── cosmetics.md
│   ├── brand/                         # Marketing guidelines
│   │   ├── voice-and-tone.md
│   │   ├── visual-identity.md
│   │   ├── target-audience.md
│   │   └── competitors.md
│   └── crypto/                        # Blockchain specifics
│       ├── sui-integration.md
│       ├── tokenomics.md
│       └── web3-positioning.md
├── outputs/                           # Generated content
│   ├── calendar/
│   │   └── master-calendar.md
│   ├── content/
│   │   ├── tweets/
│   │   ├── threads/
│   │   └── articles/
│   ├── discord/
│   │   ├── events/
│   │   └── seven-gates/
│   ├── seasons/
│   ├── music/
│   │   └── suno-prompts/
│   └── art/
│       └── midjourney-prompts/
├── logs/                              # Activity tracking
│   ├── agent-activity.md
│   └── decisions.md
└── reviews/                           # Human review queue
    ├── pending-human-review.md
    ├── approved.md
    └── feedback.md
```

---

## Getting Started

### For AI Agents

1. **Read this entire file** - Do not skip sections
2. **Read your persona file** - Located in `agents/`
3. **Read relevant knowledge base files** - Based on your task
4. **Check the calendar** - See what's scheduled
5. **Log your actions** - Write to `logs/agent-activity.md`
6. **Submit for review** - If your output requires human approval

### For Humans (Sheran)

1. **Review `reviews/pending-human-review.md`** - Items needing your approval
2. **Check `logs/decisions.md`** - See what agents decided and why
3. **Provide feedback** - Write to `reviews/feedback.md` for agent learning
4. **Update canon** - If you add to the story, ensure `knowledge-base/lore/` is updated

---

## Human Escalation Triggers

Agents should escalate to human review (Sheran) in these situations:

1. **Canon Conflicts**: Two sources contradict each other
2. **New Canon**: Proposing something not established in existing lore
3. **Major Strategy Changes**: Shifting content pillars, changing voice
4. **Crisis Response**: Negative community reaction, PR issues
5. **Technical Issues**: Blockchain/SUI related questions
6. **Budget Decisions**: Anything requiring real money spend
7. **Legal Concerns**: Copyright, trademark, compliance questions
8. **Character Death**: Any proposal involving permanent Fading of named characters
9. **Partnership Proposals**: Collaborations with other projects
10. **Uncertainty**: When an agent isn't sure, ask

---

## Quick Reference

### Key Files for Each Agent

| Agent | Primary Files |
|-------|--------------|
| Coordinator | `outputs/calendar/master-calendar.md`, `logs/`, `reviews/` |
| Lore Architect | `knowledge-base/lore/**/*` |
| Content Strategist | `outputs/content/**/*`, `knowledge-base/brand/voice-and-tone.md` |
| Community Manager | `outputs/discord/**/*` |
| Gacha Designer | `outputs/seasons/*`, `knowledge-base/game-mechanics/*` |
| Analytics Observer | `logs/*`, `knowledge-base/brand/competitors.md` |
| Asset Coordinator | `outputs/music/*`, `outputs/art/*` |

### Common Commands

```bash
# Check what needs review
cat reviews/pending-human-review.md

# See recent agent activity
cat logs/agent-activity.md

# View upcoming schedule
cat outputs/calendar/master-calendar.md

# Check a character's details
cat knowledge-base/lore/characters/ika-minami.md
```

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2024-01-08 | 1.0.0 | Initial creation of marketing HQ infrastructure |

---

*"Every idol runs. Every fan watches. Every Devotion matters. Welcome to the Eternal Stage."*

— End of CLAUDE.md —
