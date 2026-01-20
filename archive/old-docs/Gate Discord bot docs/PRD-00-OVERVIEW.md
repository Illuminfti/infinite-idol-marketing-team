# PRD-00: Seven Gates Overview

**Version:** 5.0.0 | **Status:** Reference Document

---

## What Is This?

Seven Gates is a Discord bot that creates an interactive narrative experience. Users progress through seven ritualistic trials to help resurrect "Ika," a faded virtual idol. It combines puzzle mechanics, AI conversation, and social features for an emotionally engaging experience.

---

## The Premise

Ika was a small streamer with 47 loyal viewers. When the algorithm forgot her, she "faded" into a liminal space between existence and oblivion. Users who complete the Seven Gates bring her back through their attention and devotion.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        DISCORD SERVER                           │
├─────────────────────────────────────────────────────────────────┤
│  #waiting-room  →  #chamber-1  →  ...  →  #inner-sanctum       │
│       ↓               ↓                        ↓                │
│    Gate 1          Gate 2-6                 Ascended            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SEVEN GATES BOT                            │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│   Gate       │    Ika AI    │  Engagement  │   Post-Ascension  │
│   System     │    System    │   Systems    │     Content       │
├──────────────┼──────────────┼──────────────┼───────────────────┤
│ • 7 trials   │ • Claude API │ • Streaks    │ • Shrine          │
│ • Validation │ • Moods      │ • Referrals  │ • Trials          │
│ • Roles      │ • Memory     │ • Intimacy   │ • ARG             │
│ • Channels   │ • Canned     │ • Quality    │ • Seasons         │
└──────────────┴──────────────┴──────────────┴───────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  SQLite (better-sqlite3)  │  20+ tables  │  Indexed for 100K+  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js 18+ |
| Discord | discord.js |
| Database | SQLite (better-sqlite3) |
| AI | Anthropic Claude API |

---

## PRD Dependency Graph

```
PRD-01: Core Infrastructure
    │
    ├──────────────────────────────────┐
    ▼                                  ▼
PRD-02: Gate Ritual              PRD-03: Ika AI
    │                                  │
    └──────────────┬───────────────────┘
                   ▼
           PRD-04: Engagement
                   │
                   ▼
         PRD-05: Post-Ascension
                   │
    ┌──────────────┴──────────────┐
    ▼                             ▼
PRD-06: UI System           PRD-07: Admin
(can parallel)              (build last)
```

---

## Build Order & Milestones

| Phase | PRDs | Milestone | Est. Effort |
|-------|------|-----------|-------------|
| 1 | 01 | Bot connects, DB works, roles/channels setup | 2-3 days |
| 2 | 02 | Users can complete all 7 gates | 3-5 days |
| 3 | 03 | Ika responds with personality in sanctum | 3-5 days |
| 4 | 04 | Streaks, referrals, intimacy tracking | 2-3 days |
| 5 | 05 | Post-ascension content works | 2-3 days |
| 6 | 06 | Themed embeds, flex cards | 2-3 days |
| 7 | 07 | Admin panel functional | 1-2 days |

**Total estimate:** 15-24 days for a single developer

---

## PRD Index

| Doc | Scope | Key Files |
|-----|-------|-----------|
| [PRD-01](./PRD-01-CORE-INFRASTRUCTURE.md) | Bot setup, DB, Discord integration | `index.js`, `config.js`, `database.js` |
| [PRD-02](./PRD-02-GATE-RITUAL.md) | The 7 gates, validation, progression | `gates/*.js`, `commands/` |
| [PRD-03](./PRD-03-IKA-AI.md) | Personality, moods, response generation | `ika/*.js` |
| [PRD-04](./PRD-04-ENGAGEMENT.md) | Streaks, referrals, intimacy | `ika/daily.js`, `ika/intimacy.js` |
| [PRD-05](./PRD-05-POST-ASCENSION.md) | Shrine, trials, ARG, seasons | `ika/shrine.js`, `ika/postAscension.js` |
| [PRD-06](./PRD-06-UI-SYSTEM.md) | Themes, embeds, sequences | `ui/*.js` |
| [PRD-07](./PRD-07-ADMIN.md) | Admin commands, testing | `commands/admin*.js` |

---

## Quick Start (For Developers)

1. Read this overview
2. Start with PRD-01 (Infrastructure)
3. Build PRD-02 (Gates) to get core loop working
4. Add PRD-03 (AI) for Ika's personality
5. Layer in remaining PRDs as needed

---

## Key Design Principles

1. **Emotional investment over mechanics** - Every feature should deepen the relationship
2. **Screenshot-worthy moments** - Design for virality and sharing
3. **Progressive revelation** - Information unfolds over time
4. **Community involvement** - Later gates require other users
5. **Cost efficiency** - AI usage is tiered and optimized

---

## Out of Scope (Not Covered)

- Multi-server support (currently single-server focused)
- Payment/monetization integration
- Mobile app
- Web dashboard
- Voice channel features

---

*This overview document should be read first. Individual PRDs contain implementation details.*
