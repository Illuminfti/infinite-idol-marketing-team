# Skill: Skill Creator

> **Purpose**: Meta-skill for creating new internal skills
> **Primary Users**: Coordinator (Agent 00), any agent identifying workflow gaps
> **Use When**: A repeated workflow needs standardization

---

## When to Create a New Skill

Create a new skill when:

- [ ] A workflow is repeated 3+ times
- [ ] Multiple agents need the same knowledge
- [ ] Decision-making patterns emerge that should be documented
- [ ] Templates would save time and ensure consistency
- [ ] A gap exists in the current skill set

**Don't create a skill** for:
- One-off tasks
- Agent-specific procedures (put in agent file instead)
- Trivial workflows
- Content that belongs in a different doc type

---

## Skill File Structure

Every skill should follow this template:

```markdown
# Skill: [Name]

> **Purpose**: [One-line description]
> **Primary Users**: [Which agents use this most]
> **Use When**: [Trigger conditions for loading this skill]

---

## [Core Section 1]

[Content organized logically]

---

## [Core Section 2]

[Tables, checklists, frameworks as appropriate]

---

## [Templates/Quick Reference] (optional)

[Ready-to-use formats]

---

*"[Memorable closing quote]"*
```

---

## Content Guidelines

### Be Actionable

Every section should answer: "What do I DO with this?"

**Bad**: "Content should be good"
**Good**: "Rate content 1-10 on each axis. Score 24+ = ship, 16-23 = revise, <16 = reject"

### Use Tables for Decisions

| Condition | Action |
|-----------|--------|
| X happens | Do Y |
| Z happens | Do W |

### Include Checklists

- [ ] Step 1
- [ ] Step 2
- [ ] Verification step

### Provide Templates

```markdown
## [Template Name]

**Field 1**: [description]
**Field 2**: [description]
```

---

## Naming Conventions

- Filename: `kebab-case.md` (e.g., `crisis-management.md`)
- Title: Title Case (e.g., "Crisis Management")
- Keep names descriptive but concise
- Avoid abbreviations unless universal

---

## Integration Steps

After creating a new skill:

1. **Add to skills/README.md** - Update the skill table
2. **Update CLAUDE.md** - Add to Skills System table if frequently used
3. **Notify relevant agents** - They should know the skill exists
4. **Log the creation** - Document in `logs/agent-activity.md`

---

## Quality Checklist

Before finalizing a new skill:

- [ ] Purpose is clear and specific
- [ ] Primary users are identified
- [ ] Trigger conditions are explicit
- [ ] Content is actionable, not just informational
- [ ] Tables/checklists used where appropriate
- [ ] Templates provided for outputs
- [ ] Follows the standard structure
- [ ] No duplication with existing skills
- [ ] Closing quote is on-brand

---

## Example: Creating a Skill

### Scenario

You notice Agent 02 keeps writing social media bios in different formats. Three different sessions, three different approaches.

### Action

1. Identify the gap: "Bio writing has no standard"
2. Draft skill: `social-bios.md`
3. Include:
   - Character count limits per platform
   - Voice guidelines for bios
   - Template structure
   - Examples of good/bad bios
4. Add to README and notify Agent 02

---

## Skill Maintenance

### When to Update

- Workflow changes
- New best practices emerge
- Feedback indicates confusion
- Tools or platforms change

### Who Updates

- Any agent can propose updates
- Coordinator approves significant changes
- Minor corrections can be made directly

### Version Tracking

For significant skills, include at the bottom:

```markdown
---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-20 | Initial creation |
| 1.1 | 2026-02-15 | Added X section |
```

---

*"A good skill is invisible. It just makes work flow."*
