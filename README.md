# Infinite Idol Marketing Team

> *"Every idol runs. Every fan watches. Every Devotion matters. Welcome to the Eternal Stage."*

A comprehensive AI-powered marketing infrastructure for **Infinite Idol** — a Web3 gacha game where idols fight for survival through fan devotion on the SUI blockchain.

---

## What is Infinite Idol?

Infinite Idol is a dark luxury gacha game where idols are sustained by **Devotion** — literal emotional energy from their fans. When fans stop caring, idols **Fade** — they cease to exist. This isn't cute idol content; it's existential survival dressed in black and gold.

**Core Features:**
- 🎭 **The Chase** — Idols compete in obstacle courses pursuing the mysterious Senpai
- ⚡ **Devotion System** — Fan energy that keeps idols alive
- 💀 **Fading** — The permanent death awaiting idols who lose their fans
- 🔗 **SUI Blockchain** — Web3-native with NFT battle passes and gem currency

---

## What is This Repository?

This is the **Marketing HQ** — an AI agent-driven content production system. Seven specialized AI agents work together to handle all marketing operations:

| Agent | Role | Focus |
|-------|------|-------|
| **00 - Coordinator** | Marketing Director | Orchestration & scheduling |
| **01 - Lore Architect** | Worldbuilding Specialist | Canon integrity & story |
| **02 - Content Strategist** | Social Media Lead | Tweets, threads, calendar |
| **03 - Community Manager** | Discord & Engagement | Events & Seven Gates |
| **04 - Gacha Designer** | Seasonal Content | Banners & whale psychology |
| **05 - Analytics Observer** | Performance Tracking | Metrics & optimization |
| **06 - Asset Coordinator** | Creative Asset Manager | Suno & Midjourney prompts |

---

## Quick Start

### For Humans (Sheran)

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
   cat agents/[your-agent-number].md
   ```

3. **Check the knowledge base** for relevant context in `knowledge-base/`

4. **Log your actions** to `logs/agent-activity.md`

---

## Repository Structure

```
infinite-idol-marketing-team/
├── CLAUDE.md                  # Master instructions (agents read this first)
├── README.md                  # You are here
├── agents/                    # 7 AI agent persona definitions
├── knowledge-base/
│   ├── lore/                 # World, characters, factions, mechanics
│   ├── game-mechanics/       # Pre-reg spec, gacha, gems, battle pass
│   ├── brand/                # Voice, visuals, audience, competitors
│   └── crypto/               # SUI integration, tokenomics, Web3
├── outputs/
│   ├── calendar/             # Master content schedule
│   ├── content/              # Tweets, threads, articles
│   ├── discord/              # Events, Seven Gates content
│   ├── seasons/              # Banner and seasonal content
│   ├── music/                # Suno AI prompts
│   └── art/                  # Midjourney prompts
├── logs/                     # Agent activity and decisions
└── reviews/                  # Human review queue
```

---

## Key Concepts

### The 10 Inviolable Canon Rules

These facts are **ABSOLUTE** across all content:

1. **Devotion is literal** — Real emotional energy, not metaphor
2. **Fading is death** — Zero fans = idol ceases to exist
3. **Ika has 47 fans** — Dangerously low, her underdog status
4. **Ika's hair is pink gradient** — Rose roots to magenta tips
5. **Senpai is always obscured** — Face never shown
6. **The Foundation controls everything** — Erina's organization
7. **The Chase is core competition** — Racing on the Eternal Stage
8. **Built on SUI blockchain** — Not ETH, not SOL
9. **Gems are primary currency** — 1 SUI = 100 Gems
10. **Dark luxury aesthetic** — Black and gold, not pink cutesy

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

Agents escalate to Sheran when encountering:

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

**v1.0.0** — Initial infrastructure setup

---

*Built for idols who refuse to Fade.*
