# Knowledge Base Index

> **Quick Reference Guide for Agents**
> **Version**: 2.0 | **Last Updated**: 2026-01-20

---

## How to Use This Index

This index maps **task types** to **required reading** so agents know exactly which files to load.

**Format**:
- **MUST READ**: Essential files (canon/compliance critical)
- **SHOULD READ**: Important context
- **OPTIONAL**: Nice-to-have background

---

## Content Type Reading Matrix

### CT Engagement (Tweets, Ratio Attempts, Quick Threads)

**MUST READ**:
- `/skills/ct-engagement.md` - CT strategy, hooks, X algorithm
- `/skills/ct-rapid-response.md` - Time-sensitive response framework
- `/knowledge-base/brand/voice-and-tone.md` - DS scale (target DS-3 for CT)

**SHOULD READ**:
- `/knowledge-base/lore/characters/ika-minami.md` - If Ika voice content
- `/CLAUDE.md` - Content restrictions (no 47 fans, no price action, no SUI promotion)

**Key Facts**:
- DS-3 minimum for CT
- Use "underdog", "low-ranked" instead of specific fan counts
- Only reference Sui through character **Sheran**

---

### Ika Voice Content (First-Person Tweets, Threads)

**MUST READ**:
- `/knowledge-base/lore/characters/ika-minami.md` - Character profile, voice
- `/knowledge-base/brand/voice-and-tone.md` - Brand voice, DS scale
- `/skills/character-voices.md` - Voice consistency

**SHOULD READ**:
- `/knowledge-base/lore/core-world.md` - Devotion, Fading mechanics

**Key Facts**:
- Shameless but genuine tone
- Tilde (~) as signature playfulness
- DS-3.0+ for CT content
- NO specific fan counts as anchor

---

### Lore Drop Content (Explainers, World-Building)

**MUST READ**:
- `/knowledge-base/lore/core-world.md` - Eternal Stage, Devotion, Fading
- `/CLAUDE.md` - 10 Inviolable Facts
- `/skills/canon-validation.md` - Canon hierarchy

**SHOULD READ** (topic-specific):
- `/knowledge-base/lore/mechanics/devotion-system.md`
- `/knowledge-base/lore/mechanics/the-chase.md`
- `/knowledge-base/lore/mechanics/fading.md`
- `/knowledge-base/lore/mechanics/senpai-mystery.md`

**Key Facts**:
- Devotion is literal, not metaphor
- Fading is permanent death
- DS-2.5 for lore content

---

### Multi-Product Content (Merch, Landing Pages, Email)

**MUST READ**:
- `/skills/brand-adaptation.md` - Voice adaptation rules
- `/knowledge-base/brand/product-registry.md` - Product DS targets
- `/knowledge-base/brand/voice-and-tone.md` - Brand voice

**Key Facts**:
- DS varies by product (see product registry)
- Core pillars maintained across all products
- Lore access levels vary by product tier

---

### Lore Proposal (New Canon)

**MUST READ**:
- `/skills/lore-proposal.md` - Proposal template and process
- `/CLAUDE.md` - 10 Inviolable Facts (check all 10)
- `/knowledge-base/lore/core-world.md` - Existing canon

**Process**:
1. Draft proposal using template
2. Agent 08 validates
3. File in `lore-proposals/pending/`
4. Await human decision

---

### Long-Form Narrative (Light Novel Chapters)

**MUST READ**:
- `/knowledge-base/light-novels/volume-1-awakening.md`
- `/knowledge-base/light-novels/volume-2-the-fall.md`
- `/knowledge-base/lore/timeline.md`
- `/skills/character-voices.md`

**SHOULD READ**:
- All character profiles for characters in chapter
- Relevant faction/mechanic files

---

## Review Task Reading Matrix

### Canon Review (Agent 08)

**MUST READ**:
- `/CLAUDE.md` - 10 Inviolable Facts
- `/skills/canon-validation.md` - Validation workflow
- Relevant character/mechanic files

**SHOULD READ**:
- `/knowledge-base/lore/timeline.md` - If temporal elements
- Published content for consistency

---

### Cultural Review (Agent 09)

**MUST READ**:
- `/skills/cultural-review.md` - DS scale, cultural markers
- `/knowledge-base/brand/voice-and-tone.md` - Authenticity guidelines

**SHOULD READ**:
- `/knowledge-base/brand/target-audience.md` - Audience context
- `/skills/ct-engagement.md` - CT-specific guidelines

---

### CT Express Review (Agent 09)

**MUST READ**:
- `/skills/ct-rapid-response.md` - CT Express criteria
- Content restrictions from `/CLAUDE.md`

**Quick Check**:
- DS-3+ rating?
- No new canon?
- Established voice?
- Trend still alive?

---

### Lore Proposal Validation (Agent 08)

**MUST READ**:
- `/skills/lore-proposal.md` - Validation criteria
- `/CLAUDE.md` - 10 Inviolable Facts
- Existing canon files related to proposal

---

## Agent-Specific Reading Lists

### Agent 00 (Coordinator)
- `/CLAUDE.md` - Master instructions
- `/automation/task-queue.md` - Task assignments
- `/outputs/calendar/master-calendar.md` - Schedule
- `/skills/tiered-review-framework.md` - Review tiers

### Agent 02 (Content Strategist)
- `/knowledge-base/brand/voice-and-tone.md` - Brand voice
- `/skills/content-creation.md` - Content guidelines
- `/skills/ct-engagement.md` - CT strategy
- `/skills/brand-adaptation.md` - Multi-product adaptation

### Agent 07 (Light Novel Writer)
- `/knowledge-base/light-novels/` - Published volumes
- `/knowledge-base/lore/timeline.md` - Chronology
- `/skills/character-voices.md` - Voice consistency
- `/skills/lore-proposal.md` - Proposal process

### Agent 08 (Lore Guardian)
- `/CLAUDE.md` - 10 Inviolable Facts
- `/skills/canon-validation.md` - Validation workflow
- `/knowledge-base/lore/core-world.md` - World fundamentals
- `/lore-proposals/pending/` - Proposals to validate

### Agent 09 (Resident Degen)
- `/skills/cultural-review.md` - DS scale, cultural markers
- `/skills/ct-engagement.md` - CT strategy
- `/skills/ct-rapid-response.md` - CT Express authority
- `/knowledge-base/brand/voice-and-tone.md` - Authenticity

---

## Quick Reference: Where to Find X

| Topic | Location |
|-------|----------|
| **10 Inviolable Facts** | `/CLAUDE.md` |
| **Content Restrictions** | `/CLAUDE.md` (Content Restrictions section) |
| **Character Profiles** | `/knowledge-base/lore/characters/` |
| **World Mechanics** | `/knowledge-base/lore/mechanics/` |
| **Game Mechanics** | `/knowledge-base/game-mechanics/` |
| **Brand Voice & DS Scale** | `/knowledge-base/brand/voice-and-tone.md` |
| **Product Registry** | `/knowledge-base/brand/product-registry.md` |
| **CT Strategy** | `/skills/ct-engagement.md` |
| **CT Express** | `/skills/ct-rapid-response.md` |
| **Lore Proposals** | `/skills/lore-proposal.md` |
| **Review Tiers** | `/skills/tiered-review-framework.md` |
| **Task Queue** | `/automation/task-queue.md` |

---

## File Organization

```
knowledge-base/
├── INDEX.md (this file)
├── lore/
│   ├── core-world.md
│   ├── timeline.md
│   ├── writing-guidelines.md
│   ├── characters/
│   ├── factions/
│   ├── mechanics/
│   └── sealed/ (spoilers)
├── light-novels/
│   ├── volume-1-awakening.md
│   ├── volume-2-the-fall.md
│   └── volume-3-planning.md
├── brand/
│   ├── voice-and-tone.md
│   ├── visual-identity.md
│   ├── target-audience.md
│   ├── competitors.md
│   └── product-registry.md
├── crypto/
│   ├── sui-integration.md
│   ├── tokenomics.md
│   └── web3-positioning.md
└── game-mechanics/
    ├── README.md
    ├── gacha-system.md
    ├── gem-system.md
    ├── cosmetics.md
    ├── battle-pass.md
    └── technical-reference/
```

---

*"Know what to read. Read what you need. Create what matters."*
