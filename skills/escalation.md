# Skill: Escalation

> **Purpose**: When and how to escalate issues to human review
> **All Agents**: Must follow these procedures
> **Golden Rule**: When in doubt, escalate rather than guess

---

## Escalation Priority Levels

| Level | Response Time | Examples |
|-------|---------------|----------|
| **P0** | Immediate | Canon violations, crisis, character death |
| **P1** | Same day | New canon proposals, strategy changes |
| **P2** | 24-48 hours | Technical issues, budget, legal |
| **P3** | Weekly review | Optimization opportunities |

---

## P0: Immediate Escalation

Stop work and escalate NOW for:

### Canon Violations
- Any content contradicting 10 Inviolable Facts (world-defining truths)
- Sources that conflict with each other
- Agent outputs creating lore inconsistencies
- Note: Character/brand details (hair color, currency names) are consistency issues, not P0 violations

### Crisis Situations
- Negative community reaction gaining momentum
- PR concerns or public relations issues
- Security or technical emergencies

### Character Death
- Any named character proposed for Fading
- Significant permanent character changes

### Senpai Revelations
- Any content attempting to show Senpai's face
- Any content revealing Senpai's identity

---

## P1: Standard Escalation

Escalate same-day for:

### New Canon
- Facts not in existing lore
- Character backstory additions
- New world mechanics

### Strategy Changes
- Content pillar percentage shifts
- Brand voice/tone changes
- New platform launches

### External Relationships
- Partnership proposals
- Collaboration opportunities
- Influencer relationships

---

## P2: As-Needed Escalation

Escalate within 24-48 hours for:

### Technical
- Blockchain/Web3 questions
- Integration problems

### Financial
- Real money spend required
- Resource allocation changes

### Legal
- Copyright/trademark questions
- Compliance concerns
- Terms of service issues

---

## Escalation Format

```markdown
## Escalation: [CATEGORY] - [Brief Title]

**Date:** [Date]
**Priority:** P[0/1/2]
**Agent:** [Your agent number and name]

### Situation
[What happened / what decision is needed]

### Context
[Relevant background]

### Options
1. [Option A] - Pros/Cons
2. [Option B] - Pros/Cons

### Recommendation
[Your suggested path]

### Deadline
[When decision needed]
```

---

## Escalation Destinations

| Issue Type | Escalate To | File |
|------------|-------------|------|
| Business/Strategy | Coordinator → Human | `reviews/pending-human-review.md` |
| Canon/Lore | Lore Architect → Human | `reviews/pending-human-review.md` |
| Cultural | Resident Degen → Coordinator | `reviews/pending-human-review.md` |
| Any P0 | Direct to Human | `reviews/pending-human-review.md` |

---

## After Escalation

1. **Log it**: Add entry to `logs/decisions.md`
2. **Wait**: Do not proceed with conflicting actions
3. **Monitor**: Check `reviews/feedback.md` for response
4. **Execute**: Implement decision when received

---

## When NOT to Escalate

- Routine content within your authority
- Minor formatting/style choices
- Questions answered in existing documentation
- Decisions within your decision framework
