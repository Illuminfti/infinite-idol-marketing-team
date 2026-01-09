# Skill: Canon Validation

> **Purpose**: Validate content against Infinite Idol canon
> **Primary Users**: Lore Architect, Lore Guardian, Content Strategist
> **Authority**: Lore Architect has final say on canon decisions

---

## Canon Hierarchy

When sources conflict, this hierarchy determines truth:

| Tier | Source | Priority | Override Authority |
|------|--------|----------|-------------------|
| **1** | 10 Inviolable Facts | SUPREME | Nothing can override |
| **2** | Published Light Novels | HIGH | Only Tier 1 |
| **3** | Character Profiles | HIGH | Tiers 1-2 |
| **4** | World Documents | MEDIUM-HIGH | Tiers 1-3 |
| **5** | Published Content | MEDIUM | Tiers 1-4 |
| **6** | Agent Proposals | LOW | All higher tiers |

---

## The 10 Inviolable Facts

These are **ABSOLUTE**. Immediate rejection if violated:

| # | Fact | What to Check |
|---|------|---------------|
| 1 | **Devotion Sustains Existence** | Does content treat Devotion as real, not metaphorical? |
| 2 | **Fading is Permanent Death** | Is death treated as final? No resurrection plots? |
| 3 | **The Faded Are Forgotten** | Do characters forget the Faded over time? |
| 4 | **Senpai is the Unattainable Goal** | Is Senpai the pursuit, not the catch? |
| 5 | **Senpai's Face Never Revealed** | Is his face hidden from audience? (Characters may glimpse) |
| 6 | **The Foundation Controls the System** | Are they dominant but not omnipotent? |
| 7 | **The Chase is Survival** | Is competition framed as coerced, not optional? |
| 8 | **Fan Service Fuels Devotion** | Does content show fan service as survival mechanism, not vanity? |
| 9 | **The System Predates Its Masters** | Are origins mysterious, pre-Erina? |
| 10 | **No One Knows What Catching Senpai Means** | Is this mystery preserved? |

### What's NOT Inviolable (Check for consistency, not rejection)

| Detail | Concern Level | Source |
|--------|---------------|--------|
| Ika's 47 fans | Minor continuity | `characters/ika-minami.md` |
| Character designs | Visual consistency | Character files |
| Currency names | Game consistency | `game-mechanics/gem-system.md` |
| Aesthetic choices | Brand consistency | `brand/visual-identity.md` |

---

## Validation Workflow

### Step 1: Inviolable Scan
Check content against all 10 facts. If ANY violation:
- **Action**: Immediate REJECT
- **Response**: Cite specific fact violated

### Step 2: Lore Element Identification
List all lore elements in content:
- Characters mentioned
- World mechanics referenced
- Timeline implications
- Faction dynamics

### Step 3: Source Verification
For each lore element:
- Identify highest-tier source
- Verify content matches source
- Note any gaps (new information)

### Step 4: Character Voice Check (if applicable)
If content includes character dialogue:
- Load `character-voices.md` skill
- Verify voice authenticity

### Step 5: Verdict

**APPROVED**:
```
✓ Canon consistency verified
✓ Character voices authentic (if applicable)
✓ No Inviolable Fact conflicts
→ Content cleared for publication
```

**REVISION REQUIRED**:
```
Issues Found:
1. [Issue] - Location: [where], Problem: [what], Fix: [how]

Required Changes: [list]
Recommendations: [optional improvements]
→ Return after revisions
```

**REJECTED**:
```
FATAL: Inviolable Fact [#] violated
Violation: [description]
→ Cannot be fixed through revision
→ Concept must be reworked
```

---

## Conflict Resolution

When sources conflict:
1. Apply hierarchy (higher tier wins)
2. If same tier: prefer older established content
3. Document decision in `logs/decisions.md`
4. If Tier 1 involved: escalate to human immediately

---

## Quick Reference Files

| Content Type | Primary Source |
|--------------|----------------|
| Character traits | `knowledge-base/lore/characters/*.md` |
| World mechanics | `knowledge-base/lore/mechanics/*.md` |
| Timeline events | `knowledge-base/lore/timeline.md` |
| Faction info | `knowledge-base/lore/factions/*.md` |
| Novel events | `knowledge-base/light-novels/*.md` |
