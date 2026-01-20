# Skill: Inter-Agent Handoff

> **Purpose**: Define explicit handoff protocols between agents
> **All Agents**: Reference when passing work to another agent
> **Principle**: Coordination > computation

---

## Why Handoffs Matter

Research confirms: "Architecture defines success more than raw model performance." Clear handoffs reduce errors, prevent duplication, and ensure nothing falls through cracks.

---

## Handoff Format

When passing work to another agent, include:

```markdown
## Handoff: [Brief Title]

**From**: Agent [XX] ([Name])
**To**: Agent [XX] ([Name])
**Priority**: P[0/1/2]
**Date**: [Date]

### What's Being Handed Off
[Clear description of the work/output]

### Context
[Why this exists, what triggered it]

### What's Already Done
- [Completed step 1]
- [Completed step 2]

### What's Needed Next
- [Expected action from receiving agent]

### Dependencies
- [What this blocks or is blocked by]

### Deadline (if any)
[When this needs to be done]

### Files/References
- [Relevant file paths]
```

---

## Common Handoff Pipelines

### Content Creation Pipeline

```
Agent 02 (Content) → Agent 08 (Lore) → Agent 09 (Degen) → Agent 00 (Coordinator)
     Creates           Canon Check        Cultural Check       Scheduling
```

### Light Novel Pipeline

```
Agent 07 (Writer) ↔ Agent 08 (Lore) → Agent 09 (Degen) → Human Review
    Drafts            Validates          Culture Check       Approval
```
Note: Agent 07 and 08 work bidirectionally during drafting.

### Crisis Response Pipeline

```
Human Detection → Agent 00 (Coordinator) → Agent 09 + Agent 08 → Human Decision
    Detects           Escalates              Assess                Decides
```

### Influencer/Community Pipelines

These require human execution. Agents provide:
- Agent 02: Content for campaigns
- Agent 09: Cultural vetting
- Agent 00: Coordination and approval

---

## Cross-Validation Checkpoints

For critical content, require sign-off from multiple agents:

| Content Type | Required Sign-offs |
|--------------|-------------------|
| **Lore content** | Agent 08 (Lore Guardian) |
| **Public content** | Agent 08 (Canon) + Agent 09 (Cultural) |
| **Fan service** | Agent 09 (Degen) - final authority |
| **Narrative content** | Agent 07 (Writer) + Agent 08 (Lore) |
| **Crisis response** | Agent 00 + Human |
| **Partnerships** | Human only (requires external contact) |

---

## Parallel Execution

When tasks are independent, work can proceed in parallel:

```
Agent 07 writes narrative ──┐
                            ├──► Agent 09 reviews culturally
Agent 02 writes tweets ─────┘
```

**Rule**: Only parallelize when there are no dependencies between tasks.

**Note**: Since this is a single-agent system, "parallel" means tasks in the queue can be processed independently across sessions.

---

## Handoff Anti-Patterns

### DON'T

- Pass work without context ("here's a file")
- Assume receiving agent knows the history
- Skip validation steps to save time
- Hand off incomplete work as complete
- Create circular handoffs (A → B → C → A)

### DO

- Include all relevant context
- Clearly state what's done and what's needed
- Respect the validation pipeline
- Confirm receipt for P0/P1 items
- Document decisions made during handoff

---

## Escalation During Handoff

If receiving agent can't proceed:

1. **Blocked by missing info**: Request from sending agent
2. **Blocked by policy**: Escalate to Coordinator (Agent 00)
3. **Blocked by human decision**: Add to `reviews/pending-human-review.md`
4. **Blocked by crisis**: Escalate to Agent 00 + Human immediately

---

*"A handoff without context is a handoff that fails."*
