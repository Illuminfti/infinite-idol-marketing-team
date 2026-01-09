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

### 2026-01-09 - DEC-002: Content Production Launch - Strategic Planning Approach

**Decided By**: 00 - Coordinator
**Decision Type**: Strategy
**Priority**: P1
**Status**: Approved (Human-selected Option 2)

**Context**:
Repository has been dormant since initialization (Jan 8, 2024). The operator activated Coordinator with directive to "get everything going." Coordinator presented three launch approaches: (1) Immediate content production, (2) Strategic planning first, (3) Specific agent activation. The operator selected Option 2.

**Decision**:
Execute strategic planning phase before content production launch:
1. Assess knowledge base completeness (COMPLETE - comprehensive and ready)
2. Create detailed agent coordination plan with task assignments
3. Document workflows and review processes
4. Update master calendar with immediate priorities
5. Then activate specialist agents with clear directives

**Rationale**:
- Knowledge base is comprehensive - no gaps blocking production
- Agents need clear task assignments to avoid overlap/conflicts
- Establishing workflow standards now prevents quality issues later
- Better to spend 24 hours planning than weeks fixing misaligned content
- Sets foundation for sustainable content cadence

**Alternatives Considered**:
- **Option 1: Launch Content Production Immediately** - Rejected: Risk of misaligned content, workflow confusion
- **Option 3: Specific Agent Activation** - Rejected: Doesn't establish systemic coordination

**Impact**:
- **Affected Files**:
  - `outputs/coordination-plan-2026-01-09.md` - Created
  - `logs/decisions.md` - This entry
  - `logs/agent-activity.md` - Updated with Coordinator session
  - `outputs/calendar/master-calendar.md` - To be updated next

- **Affected Agents**: All agents (00-07) - clear task assignments created

- **Timeline**:
  - Phase 1 (24 hours): Agent 01, 02, 03, 06 execute P1 and P2 tasks
  - Phase 2 (24-48 hours): Content review and scheduling
  - Phase 3 (Week 1): Establish weekly cadence

**Human Approval**: Approved by operator (Option 2 selection)

**Next Actions**:
- [ ] Update master calendar with Week 1 content schedule
- [ ] Activate Agent 01 (Lore Architect) for Devotion thread foundation
- [ ] Activate Agent 02 (Content Strategist) for Ika voice content
- [ ] Activate Agent 03 (Community Manager) for Discord planning
- [ ] Activate Agent 06 (Asset Coordinator) for Ika visual prompts

---

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
