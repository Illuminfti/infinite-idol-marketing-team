# Skill: Lore Proposal

> **Purpose**: Framework for proposing canon expansions with human approval
> **Primary Users**: Agent 07 (Writer), Agent 08 (Guardian), Agent 00 (Coordinator)
> **Use When**: Identifying lore gaps, proposing new canon elements

---

## The Lore Expansion Model

**Principle**: Agents can PROPOSE lore expansions. Only humans can APPROVE them as canon.

This preserves:
- Human creative control
- Canon integrity
- Systematic worldbuilding
- Content unlock potential

---

## When to Propose Lore

### Valid Triggers

| Trigger | Example | Proposal Type |
|---------|---------|---------------|
| **Content gap** | Need backstory for marketing | Character depth |
| **Narrative dead end** | Story needs new elements | World expansion |
| **Fan question** | Recurring "how does X work?" | Mechanic detail |
| **Product need** | Merch needs hobby details | Character depth |
| **Continuity need** | Timeline has gaps | Event/history |
| **Gameplay need** | New feature needs lore | Mechanic |

### Invalid Triggers

| Don't Propose When... | Why |
|----------------------|-----|
| Existing canon suffices | Unnecessary complexity |
| Just for content volume | Quality > quantity |
| Contradicts Inviolable Facts | Non-negotiable |
| Changes established canon | Retcons need special process |
| Outside your domain | Escalate to appropriate agent |

---

## Proposal Template

```markdown
# Lore Proposal: [LORE-YYYY-MM-###]

## Metadata
- **Proposing Agent**: Agent [##]
- **Date**: [YYYY-MM-DD]
- **Type**: [Character | Mechanic | Location | Event | Faction | Relationship]
- **Priority**: [Low | Medium | High]
- **Status**: PENDING_HUMAN_REVIEW

---

## Summary

[1-2 sentence description of the proposed lore element]

---

## Detailed Proposal

### What
[Full description of the new lore element]

### Why
[Justification - what gap does this fill?]

### How It Integrates
[Connection to existing canon]

---

## Canon Validation

### Inviolable Facts Check
| Fact | Status | Notes |
|------|--------|-------|
| 1. Devotion Sustains Existence | ✅ PASS | [How it aligns] |
| 2. Fading is Permanent Death | ✅ PASS | [How it aligns] |
| 3. The Faded Are Forgotten | ✅ PASS | [How it aligns] |
| 4. Senpai is Unattainable Goal | ✅ PASS | [How it aligns] |
| 5. Senpai's Face Never Revealed | ✅ PASS | [How it aligns] |
| 6. Foundation Controls System | ✅ PASS | [How it aligns] |
| 7. The Chase is Survival | ✅ PASS | [How it aligns] |
| 8. Fan Service Fuels Devotion | ✅ PASS | [How it aligns] |
| 9. System Predates Masters | ✅ PASS | [How it aligns] |
| 10. No One Knows Catching Senpai | ✅ PASS | [How it aligns] |

### Existing Canon References
- [List canon elements this connects to]
- [Note any potential tension points]

### Retcon Risk
- **Level**: [None | Low | Medium | High]
- **Notes**: [Any existing content that might conflict]

---

## Content Unlocked

If approved, this enables:
- [ ] [Content type 1 - e.g., "3-5 Ika tweets about hobby"]
- [ ] [Content type 2 - e.g., "Thread explaining mechanic"]
- [ ] [Content type 3 - e.g., "Merch product descriptions"]

**Estimated content pieces**: [Number]

---

## Implementation Notes

### If Approved
- Update file(s): [List files to update]
- Content to create: [List content enabled]
- Announce to agents: [Who needs to know]

### If Rejected
- Alternative approach: [What else could address the need]
- Content workaround: [How to proceed without this lore]

---

## Review Section (For Human)

**Decision**: [ ] APPROVED / [ ] REJECTED / [ ] REVISE
**Notes**: [Human feedback]
**Date**: [Decision date]
```

---

## Proposal Types

### Character Depth
Expanding existing character backgrounds, relationships, or traits.

**Good Proposals**:
- Ika's hobby before becoming an idol
- How Sora and Suiren first met
- Erina's motivation for joining Foundation

**Bad Proposals**:
- Changing established character traits
- Revealing sealed information
- Contradicting published content

---

### Mechanic Detail
Explaining how world systems work in more detail.

**Good Proposals**:
- How Devotion physically manifests
- The process of entering a Chase
- What happens in the moments before Fading

**Bad Proposals**:
- Changing core mechanics
- Contradicting game design
- Over-explaining mysteries

---

### Location Expansion
New locations or details about existing ones.

**Good Proposals**:
- Where low-rank idols live
- Training facilities on Eternal Stage
- The Foundation's headquarters layout

**Bad Proposals**:
- Locations that contradict established geography
- Over-detailed maps (preserve mystery)

---

### Event/History
Past events, timeline additions.

**Good Proposals**:
- A significant past Chase
- How the current ranking system started
- Historical idol legends

**Bad Proposals**:
- Events that contradict timeline
- Origin stories for things meant to be mysterious
- Retconning published light novels

---

### Faction/Organization
New groups or details about existing ones.

**Good Proposals**:
- A sub-division of the Foundation
- Underground fan community
- Idol support network

**Bad Proposals**:
- Groups that undermine established power structures
- Factions that make Foundation irrelevant

---

### Relationship
Connections between characters.

**Good Proposals**:
- Rivalry dynamics between characters
- Mentorship relationships
- Past connections

**Bad Proposals**:
- Romantic relationships without narrative justification
- Contradicting established dynamics

---

## The Proposal Process

### Step 1: Identify Need
```
Agent notices content gap or opportunity
    ↓
Verify existing canon doesn't already address it
    ↓
Confirm this requires NEW lore (not just finding existing)
```

### Step 2: Draft Proposal
```
Use proposal template
    ↓
Complete ALL sections
    ↓
Self-review against Inviolable Facts
```

### Step 3: Internal Review
```
Agent 08 validates canon compatibility
    ↓
Agent 09 reviews cultural fit (if relevant)
    ↓
Agent 00 reviews priority and fit
```

### Step 4: Submit for Human Review
```
File in lore-proposals/pending/
    ↓
Log in task queue
    ↓
Await human decision
```

### Step 5: Implementation (if approved)
```
Move to lore-proposals/approved/
    ↓
Update relevant knowledge base files
    ↓
Notify relevant agents
    ↓
Create enabled content
```

---

## Proposal Quality Checklist

Before submitting:

- [ ] Summary is clear and concise
- [ ] All 10 Inviolable Facts checked
- [ ] Existing canon properly referenced
- [ ] Retcon risk honestly assessed
- [ ] Content unlock potential documented
- [ ] Implementation path clear
- [ ] Alternative noted if rejected
- [ ] Template fully completed

---

## Common Rejection Reasons

| Reason | How to Avoid |
|--------|--------------|
| Contradicts canon | Thorough research first |
| Violates Inviolable Facts | Always check all 10 |
| Over-explains mystery | Preserve what should stay unknown |
| Low content value | Ensure clear content unlock |
| Poor timing | Consider product roadmap |
| Scope too large | Break into smaller proposals |

---

## Proposal Tracking

All proposals are tracked in `lore-proposals/`:

```
lore-proposals/
├── pending/
│   └── LORE-2026-01-001-ika-hobby.md
├── approved/
│   └── (moved after approval)
├── rejected/
│   └── (moved with rejection notes)
└── README.md
```

---

*"The best lore grows organically from the world. Propose what the story is already asking for."*
