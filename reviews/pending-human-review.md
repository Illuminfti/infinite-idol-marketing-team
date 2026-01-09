# Pending Human Review

> **Owner**: Coordinator (Agent 00)
> **Purpose**: Items requiring human approval before implementation

---

## Review Process

### How This Queue Works

1. **Agents Submit**: When an agent encounters a situation requiring human approval, they add an item to this file using the template below.
2. **Human Reviews**: Human operators review items in this queue, typically during daily check-ins.
3. **Decision Made**: Approved items move to `approved.md`. Rejected items are noted with feedback.
4. **Feedback Loop**: All decisions and rationale are logged so agents can learn from patterns.

### Review Priority Levels

| Priority | Response Time | Description |
|----------|---------------|-------------|
| **CRITICAL** | Same day | Crisis situations, blocking issues |
| **HIGH** | 24-48 hours | Canon decisions, strategy changes |
| **MEDIUM** | Within 1 week | Content approvals, feature proposals |
| **LOW** | When convenient | Minor clarifications, nice-to-haves |

### Escalation Trigger Categories

Items should be submitted for review when they involve:

1. **Canon Conflicts** - Two sources contradict each other
2. **New Canon** - Proposing something not established in existing lore
3. **Major Strategy Changes** - Shifting content pillars, changing voice
4. **Crisis Response** - Negative community reaction, PR issues
5. **Technical Issues** - Blockchain/SUI related questions
6. **Budget Decisions** - Anything requiring real money spend
7. **Legal Concerns** - Copyright, trademark, compliance questions
8. **Character Death** - Any proposal involving permanent Fading of named characters
9. **Partnership Proposals** - Collaborations with other projects
10. **Uncertainty** - When an agent isn't sure, ask

---

## Item Template

```markdown
### [ITEM-XXXX] Brief Title

**Submitted**: YYYY-MM-DD HH:MM
**Agent**: [Agent Name] (Agent ##)
**Priority**: [CRITICAL/HIGH/MEDIUM/LOW]
**Category**: [Escalation Trigger Category]

#### Context
[What led to this item being submitted? What was the agent trying to do?]

#### Question/Decision Needed
[Clear statement of what the human needs to decide or approve]

#### Options (if applicable)
1. **Option A**: [Description] - [Pros/Cons]
2. **Option B**: [Description] - [Pros/Cons]
3. **Option C**: [Description] - [Pros/Cons]

#### Agent Recommendation
[Which option the agent recommends and why, if applicable]

#### Related Files
- `path/to/relevant/file.md`
- `path/to/another/file.md`

---
```

---

## Current Queue

*No items pending review.*

---

## Recently Resolved

*Items resolved in the last 7 days will appear here before being archived to `approved.md`.*

---

## Notes for Agents

### When to Submit
- Always submit if you're unsure - it's better to ask than to assume
- Canon-related decisions should ALWAYS come here first
- Budget and legal decisions are non-negotiable escalations
- Crisis situations should be marked CRITICAL

### How to Submit
1. Copy the Item Template above
2. Fill in all required fields
3. Add the item to the "Current Queue" section
4. Log the submission in `logs/agent-activity.md`
5. Continue with other tasks while awaiting review

### What NOT to Submit
- Routine content generation (unless it touches canon)
- Formatting questions (follow existing patterns)
- Technical implementation details (unless blockchain-related)
- Items already covered by existing guidelines

---

*"When in doubt, escalate. The Eternal Stage has no room for unauthorized canon."*
