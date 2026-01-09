# Decision Log

> **Purpose**: Track major decisions and their rationale across the marketing team
> **Maintained By**: All agents (primarily Agent 00 - Coordinator)
> **Update Frequency**: Per significant decision or strategy change

---

## How to Log Decisions

When making a significant decision, add an entry using the template below. Place new entries at the **top** of the Decision Log section (newest first).

### Entry Template

```markdown
### [DATE] - [DECISION ID]: [BRIEF TITLE]

**Decided By**: [Agent ID] - [Agent Name]
**Decision Type**: [Strategy | Content | Canon | Technical | Escalation | Process]
**Priority**: [P0 | P1 | P2 | P3]
**Status**: [Approved | Pending Review | Rejected | Superseded]

**Context**:
[What situation led to this decision?]

**Decision**:
[What was decided?]

**Rationale**:
[Why was this the right choice?]

**Alternatives Considered**:
- [Option A] - [Why rejected]
- [Option B] - [Why rejected]

**Impact**:
- **Affected Files**: `path/to/file.md`
- **Affected Agents**: [List of agents impacted]
- **Timeline**: [When does this take effect?]

**Human Approval**: [Required | Not Required | Approved on DATE]

---
```

### Decision Types

| Type | Used For | Typical Decider |
|------|----------|-----------------|
| **Strategy** | Content pillars, campaign direction, brand positioning | Coordinator |
| **Content** | Tweet style, thread format, posting schedule | Content Strategist |
| **Canon** | Lore additions, character details, world rules | Lore Architect |
| **Technical** | Workflow changes, file structure, system updates | Coordinator |
| **Escalation** | Issues requiring human review, crisis response | Any Agent |
| **Process** | How agents collaborate, review workflows | Coordinator |

### Priority Levels

| Priority | Description | Response Time |
|----------|-------------|---------------|
| **P0** | Critical - Crisis or major strategic shift | Immediate |
| **P1** | High - Significant impact, needs prompt action | Within 24 hours |
| **P2** | Medium - Important but not urgent | Within 1 week |
| **P3** | Low - Minor adjustments, optimizations | As resources allow |

### Human Approval Guidelines

Decisions requiring human approval (see CLAUDE.md "Human Escalation Triggers"):

| Category | Always Requires Approval |
|----------|-------------------------|
| Canon Conflicts | Two sources contradict each other |
| New Canon | Proposing something not established in existing lore |
| Major Strategy Changes | Shifting content pillars, changing voice |
| Crisis Response | Negative community reaction, PR issues |
| Budget Decisions | Anything requiring real money spend |
| Legal Concerns | Copyright, trademark, compliance questions |
| Character Death | Any proposal involving permanent Fading |
| Partnerships | Collaborations with other projects |

---

## Decision Log

<!-- Add new entries below this line, newest first -->

### 2024-01-08 - DEC-001: Repository Structure Established

**Decided By**: 00 - Coordinator
**Decision Type**: Technical
**Priority**: P1
**Status**: Approved

**Context**:
The Infinite Idol marketing team needed a structured repository to coordinate all AI agent activities, store knowledge, and produce content.

**Decision**:
Implement the folder structure as defined in FULL_AUTO_CLAUDE_PROMPT.md with 7 specialized agents, comprehensive knowledge base, and output/review systems.

**Rationale**:
This structure provides clear separation of concerns, prevents file conflicts through permission matrix, and enables scalable content production.

**Alternatives Considered**:
- Flat file structure - Rejected: Would become unmanageable at scale
- Single agent approach - Rejected: Lacks specialization for different marketing tasks

**Impact**:
- **Affected Files**: All repository files
- **Affected Agents**: All agents (00-06)
- **Timeline**: Immediate - repository is now operational

**Human Approval**: Not Required (infrastructure setup)

---

## Quick Reference

### Decision Numbering

Decisions are numbered sequentially: `DEC-001`, `DEC-002`, etc.

For domain-specific decisions, use prefixes:
- `DEC-LORE-001` - Lore/canon decisions
- `DEC-CONTENT-001` - Content strategy decisions
- `DEC-TECH-001` - Technical/process decisions
- `DEC-CRISIS-001` - Crisis/escalation decisions

### Decision Review Process

1. **Agent identifies** decision point
2. **Agent logs** decision using template
3. **Check if human approval needed** (see guidelines above)
4. If yes: Add to `reviews/pending-human-review.md`
5. If no: Mark as Approved, proceed with implementation
6. **Notify affected agents** via logs or coordination

### Superseding Decisions

When a new decision replaces an old one:
1. Update old decision status to `Superseded`
2. Add note: "Superseded by DEC-XXX on [DATE]"
3. Log new decision referencing the old one

---

*"Every decision shapes the Eternal Stage. Every rationale lights the path."*
