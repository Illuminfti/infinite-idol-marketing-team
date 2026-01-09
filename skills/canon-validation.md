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

1. **Devotion is Literal** - Emotional energy from fans, not metaphorical
2. **Fading is Death** - Permanent, no reversal, no exceptions
3. **Ika Has 47 Fans** - Exactly 47 at story start
4. **Ika's Hair is Pink Gradient** - Rose roots → magenta tips
5. **Senpai is Never Shown** - Always obscured, never revealed
6. **Foundation Controls Everything** - Run by Erina, controls industry
7. **The Chase is Core** - Primary competition format
8. **Built on SUI** - SUI blockchain, not any other
9. **Gems are Currency** - 1 SUI = 100 Gems, account-bound
10. **Dark Luxury Aesthetic** - Black/gold, NOT pink/cutesy

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
