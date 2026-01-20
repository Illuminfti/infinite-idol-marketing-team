# Infinite Idol Marketing Team

> **AI Agent System for Marketing Content Production**

An autonomous marketing team powered by Claude Code. 5 specialized AI agents create, review, and approve content for **Infinite Idol** — a dark luxury gacha game where idols fight for survival through fan devotion.

---

## Quick Start

```bash
# Clone and enter
git clone https://github.com/Illuminfti/infinite-idol-marketing-team.git
cd infinite-idol-marketing-team

# Start Claude Code
claude

# Activate an agent
/agent 00  # Coordinator
/agent 02  # Content Strategist
/agent 09  # Resident Degen (CT/Cultural Authority)
```

---

## The 5 Agents

| # | Agent | Role | Authority |
|---|-------|------|-----------|
| **00** | Coordinator | Marketing Director | Task routing, scheduling, human escalation |
| **02** | Content Strategist | Social Media | Tweets, threads, multi-product content |
| **07** | Light Novel Writer | Narrative | Story content, Ika voice, lore proposals |
| **08** | Lore Guardian | Canon Validator | Inviolable Facts protection, proposal validation |
| **09** | Resident Degen | Cultural Authority | **Final approval authority**, CT trends, degen authenticity |

**Agent 09** has final say on whether content ships.

---

## Content Pipeline

```
Content Created (Agent 02/07)
    ↓
Canon Review (Agent 08)
    ↓
Cultural Review (Agent 09)
    ↓
Approved for Publication
```

**CT Express (Tier 0)**: Time-sensitive CT content skips to Agent 09 only. 15-minute SLA.

---

## Repository Structure

```
infinite-idol-marketing-team/
│
├── CLAUDE.md                    # Master instructions (START HERE)
│
├── agents/                      # 5 AI agent personas
│   ├── 00-coordinator.md
│   ├── 02-content-strategist.md
│   ├── 07-light-novel-writer.md
│   ├── 08-lore-guardian.md
│   └── 09-resident-degen.md
│
├── skills/                      # Modular workflows (19 skills)
│   ├── ct-engagement.md         # CT strategy, hooks, X algorithm
│   ├── ct-rapid-response.md     # Time-sensitive CT (Tier 0)
│   ├── brand-adaptation.md      # Multi-product voice adaptation
│   ├── lore-proposal.md         # Human-approved lore expansion
│   ├── canon-validation.md      # Lore compliance
│   ├── cultural-review.md       # Degen authenticity
│   ├── character-voices.md      # Character dialogue
│   └── ...more
│
├── knowledge-base/              # World, brand, game documentation
│   ├── lore/                    # Characters, mechanics, world
│   ├── brand/                   # Voice, visuals, product registry
│   ├── light-novels/            # Volume 1, 2, 3 planning
│   ├── crypto/                  # Web3 positioning
│   └── game-mechanics/          # Gacha, gems, cosmetics
│
├── lore-proposals/              # Lore expansion system
│   ├── pending/                 # Awaiting human approval
│   ├── approved/                # Approved, ready to implement
│   └── rejected/                # With rejection notes
│
├── automation/                  # Task management
│   └── task-queue.md            # Centralized task tracking
│
├── logs/                        # Activity tracking
│   ├── agent-activity.md
│   └── decisions.md
│
└── archive/                     # Archived content
    └── reference-personas/      # 15 archived agent personas
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/agent <n>` | Activate as specific agent |
| `/queue` | View task queue |
| `/queue process` | Process queue as coordinator |
| `/pipeline` | Run content pipeline |

---

## The 10 Inviolable Facts

**Absolute rules that can NEVER be violated:**

1. **Devotion Sustains Existence** — Without fans, idols cease to exist
2. **Fading is Permanent Death** — No resurrection, no reversal
3. **The Faded Are Forgotten** — Memories blur and disappear
4. **Senpai is the Unattainable Goal** — Every idol chases Senpai
5. **Senpai's Face Never Revealed** — Audience never sees Senpai's face
6. **The Foundation Controls the System** — They run the industry
7. **The Chase is Survival** — Competition isn't optional
8. **Fan Service Fuels Devotion** — A strategy for survival
9. **The System Predates Its Masters** — Origins unknown
10. **No One Knows What Catching Senpai Means** — Ultimate mystery

---

## Content Restrictions

**DO NOT include in any content:**

| Restricted | Alternative |
|------------|-------------|
| "47 fans" as anchor | Use "low-ranked", "underdog", "struggling idol" |
| Price action/token price | Focus on game, lore, community |
| SUI blockchain promotion | Only reference Sui through character **Sheran** |
| Specific fan counts | Devotion system matters, not numbers |

---

## Brand Pillars

- **Dark Luxury**: Black/gold aesthetic, NOT pink/cutesy
- **Self-Aware**: We know we're a gacha game, shameless but genuine
- **Existential Stakes**: Fading is real death, every Chase matters
- **Web3 Native**: Chain-agnostic, gameplay-first (blockchain invisible)

---

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Master instructions — read this first |
| `automation/task-queue.md` | Current tasks and assignments |
| `logs/agent-activity.md` | Agent session logs |
| `lore-proposals/pending/` | Lore awaiting human approval |
| `knowledge-base/brand/product-registry.md` | Multi-product brand guide |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Agent Runtime** | Claude Code CLI (Claude Opus 4.5) |
| **Task Queue** | Markdown-based |
| **Version Control** | Git |
| **Documentation** | Markdown |

No npm, no build step, no external dependencies.

---

## Lore Expansion System

Agents can **propose** new lore. Only humans can **approve** it.

```
Agent identifies lore gap
    ↓
Agent drafts proposal (skills/lore-proposal.md)
    ↓
Agent 08 validates canon compatibility
    ↓
Filed in lore-proposals/pending/
    ↓
Human reviews and decides
    ↓
If approved → Update knowledge base
```

---

## Review Tiers

| Tier | Name | Review Process | SLA |
|------|------|---------------|-----|
| **0** | CT Express | Agent 09 only | 10-15 min |
| **1** | Novel Content | Full review (08→09→00) | 2-4 hours |
| **2** | Established | Canon + Cultural | 30-60 min |
| **3** | Repeatable | Cultural spot-check | 10-15 min |

---

## Getting Started

1. **Read `CLAUDE.md`** — Master instructions
2. **Activate an agent**: `/agent 00` (Coordinator)
3. **Check task queue**: `/queue`
4. **Execute tasks** and log activity
5. **Commit changes** with proper attribution

---

## License

Proprietary. All rights reserved.

---

*"Every idol runs. Every fan watches. The agents never sleep."*
